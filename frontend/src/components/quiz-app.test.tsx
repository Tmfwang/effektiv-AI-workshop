import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Question, QuizResponse } from "@/generated";
import { QuizApp } from "./quiz-app";

const { confetti } = vi.hoisted(() => ({ confetti: vi.fn() }));
vi.mock("canvas-confetti", () => ({ default: confetti }));

const questions: QuizResponse["questions"] = Array.from({ length: 10 }, (_, index): Question => ({
  id: index + 1,
  question: `Question ${index + 1}?`,
  alternatives: [`Wrong ${index + 1}`, `Correct ${index + 1}`, `Other ${index + 1}`, `Last ${index + 1}`],
  correctAlternativeIndex: 1,
})) as QuizResponse["questions"];

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

beforeEach(() => {
  setReducedMotion(false);
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("QuizApp", () => {
  it("shows the developer homepage and opens the add-question dialog", async () => {
    const user = userEvent.setup();
    render(<QuizApp />);

    expect(screen.getByRole("heading", { name: /test your dev stack/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^add question$/i }));
    expect(screen.getByRole("dialog", { name: /add to the stack/i })).toBeInTheDocument();
  });

  it("closes the add-question dialog without validating or submitting partial input", async () => {
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /^add question$/i }));
    await user.type(screen.getByRole("textbox", { name: /question/i }), "Partial question");

    await user.click(screen.getByRole("button", { name: /close add question/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /^add question$/i }));
    expect(screen.getByRole("textbox", { name: /question/i })).toHaveValue("");
    expect(screen.queryByText("Enter an alternative.")).not.toBeInTheDocument();
  });

  it("shows loading, reports API errors, and retries", async () => {
    let resolveFirst: ((value: Response) => void) | undefined;
    const pending = new Promise<Response>((resolve) => { resolveFirst = resolve; });
    const fetchMock = vi.mocked(fetch).mockReturnValueOnce(pending).mockResolvedValueOnce(response({ questions }));
    const user = userEvent.setup();
    render(<QuizApp />);

    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    expect(screen.getByText(/compiling your quiz/i)).toBeInTheDocument();
    await act(async () => resolveFirst?.(response({ code: "NO_QUIZ", message: "Need more questions." }, 409)));
    expect(await screen.findByRole("alert")).toHaveTextContent("Need more questions.");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByRole("heading", { name: "Question 1?" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("locks the first answer, celebrates correctness, and waits for Next", async () => {
    vi.mocked(fetch).mockResolvedValue(response({ questions }));
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await screen.findByRole("heading", { name: "Question 1?" });

    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: /correct 1/i }));
    expect(confetti).toHaveBeenCalledOnce();
    expect(screen.getByText(/nicely compiled/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /wrong 1/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /wrong 1/i }));
    expect(confetti).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(1250));
    expect(screen.getByRole("heading", { name: "Question 1?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("heading", { name: "Question 2?" })).toBeInTheDocument();
    expect(screen.getByText("Question 2 / 10")).toBeInTheDocument();
  });

  it("shows local incorrect feedback without confetti", async () => {
    vi.mocked(fetch).mockResolvedValue(response({ questions }));
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await user.click(await screen.findByRole("button", { name: /wrong 1/i }));

    expect(screen.getByLabelText("Incorrect")).toHaveTextContent(":(");
    expect(screen.getByText(/correct answer is highlighted/i)).toBeInTheDocument();
    expect(confetti).not.toHaveBeenCalled();
  });

  it("respects reduced motion by disabling confetti", async () => {
    setReducedMotion(true);
    vi.mocked(fetch).mockResolvedValue(response({ questions }));
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await screen.findByRole("button", { name: /correct 1/i });
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: /correct 1/i }));

    expect(screen.getByRole("heading", { name: "Question 1?" })).toBeInTheDocument();
    expect(confetti).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("heading", { name: "Question 1?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("heading", { name: "Question 2?" })).toBeInTheDocument();
  });

  it("completes all questions, shows a full review, and supports result controls", async () => {
    setReducedMotion(true);
    vi.mocked(fetch).mockImplementation(async () => response({ questions }));
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    for (let index = 1; index <= 10; index += 1) {
      await user.click(await screen.findByRole("button", { name: new RegExp(index === 1 ? "wrong 1" : `correct ${index}`, "i") }));
      await user.click(screen.getByRole("button", { name: index === 10 ? "Results" : /next/i }));
    }
    expect(screen.getByRole("heading", { name: "9/10" })).toBeInTheDocument();
    expect(screen.getByText("9 correct")).toBeInTheDocument();
    expect(screen.getByText("1 incorrect")).toBeInTheDocument();
    expect(screen.getAllByText(/your answer:/i)).toHaveLength(10);
    expect(screen.getAllByText(/correct answer:/i)).toHaveLength(10);
    await user.click(screen.getByRole("button", { name: "Run again" }));
    expect(await screen.findByRole("heading", { name: "Question 1?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Exit" }));
    expect(screen.getByRole("heading", { name: /test your dev stack/i })).toBeInTheDocument();
  });

  it("validates every add-question field and submits a normalized request", async () => {
    vi.mocked(fetch).mockResolvedValue(response({ id: 11, question: "HTTP?", alternatives: ["A", "B", "C", "D"], correctAlternativeIndex: 1 }, 201));
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /^add question$/i }));
    const dialog = screen.getByRole("dialog");
    const questionInput = screen.getByRole("textbox", { name: /question/i });
    const commitButton = within(dialog).getByRole("button", { name: /commit question/i });
    expect(commitButton).toBeEnabled();
    await user.type(questionInput, "  HTTP?  ");
    await user.click(screen.getByLabelText("Alternative 1"));
    expect(screen.queryByText("Enter an alternative.")).not.toBeInTheDocument();

    await user.click(commitButton);
    expect(screen.getAllByText("Enter an alternative.")).toHaveLength(4);
    expect(screen.getByText("Choose the correct answer.")).toBeInTheDocument();
    expect(screen.queryByText("Enter a question.")).not.toBeInTheDocument();

    await user.clear(questionInput);
    expect(screen.getByText("Enter a question.")).toBeInTheDocument();
    await user.type(questionInput, "  HTTP?  ");
    expect(screen.queryByText("Enter a question.")).not.toBeInTheDocument();

    const inputs = [1, 2, 3, 4].map((number) => screen.getByLabelText(`Alternative ${number}`));
    for (const input of inputs) await user.type(input, "Same");
    expect(screen.getByText("Alternatives must be unique.")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Mark alternative 2 correct"));
    expect(screen.queryByText("Choose the correct answer.")).not.toBeInTheDocument();

    for (let index = 0; index < inputs.length; index += 1) {
      await user.clear(inputs[index]!);
      await user.type(inputs[index]!, ` ${String.fromCharCode(65 + index)} `);
    }
    expect(screen.queryByText("Alternatives must be unique.")).not.toBeInTheDocument();
    await user.click(commitButton);
    expect(await screen.findByText("Question committed.")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/questions", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ question: "HTTP?", alternatives: ["A", "B", "C", "D"], correctAlternativeIndex: 1 }),
    }));
  });

  it("announces a backend validation error from question creation", async () => {
    vi.mocked(fetch).mockResolvedValue(response({ code: "VALIDATION_ERROR", message: "The backend rejected this question." }, 400));
    const user = userEvent.setup();
    render(<QuizApp />);
    await user.click(screen.getByRole("button", { name: /^add question$/i }));
    await user.type(screen.getByRole("textbox", { name: /question/i }), "Question?");
    for (let index = 1; index <= 4; index += 1) {
      await user.type(screen.getByLabelText(`Alternative ${index}`), `Answer ${index}`);
    }
    await user.click(screen.getByLabelText("Mark alternative 1 correct"));
    await user.click(screen.getByRole("button", { name: /commit question/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("The backend rejected this question.");
  });
});
