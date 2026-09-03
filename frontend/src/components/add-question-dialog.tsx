"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ErrorResponse } from "@/generated";
import { toRequest, validateDraft, type DraftErrors, type QuestionDraft } from "@/lib/validation";

const emptyDraft: QuestionDraft = { question: "", alternatives: ["", "", "", ""], correctAlternativeIndex: null };

type Props = { open: boolean; onClose: () => void };

export function AddQuestionDialog({ open, onClose }: Props) {
  const [draft, setDraft] = useState<QuestionDraft>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [validationStarted, setValidationStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [serverError, setServerError] = useState("");
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    questionRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  function close() {
    setDraft(emptyDraft);
    setErrors({});
    setValidationStarted(false);
    setServerError("");
    setStatus("idle");
    onClose();
  }

  function updateDraft(nextDraft: QuestionDraft) {
    setDraft(nextDraft);
    if (validationStarted) setErrors(validateDraft(nextDraft));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setValidationStarted(true);
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) {
      questionRef.current?.focus();
      return;
    }
    setStatus("saving");
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toRequest(draft)),
      });
      if (!response.ok) {
        const body = await response.json() as ErrorResponse;
        setServerError(body.message || "Could not save the question.");
        setStatus("idle");
        return;
      }
      setStatus("saved");
    } catch {
      setServerError("The quiz service is unavailable. Try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid overflow-y-auto bg-[#10120f]/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section className="soft-shadow relative m-auto w-full max-w-2xl border-2 border-[#10120f] bg-[#f8f6ef] p-6 sm:p-9" role="dialog" aria-modal="true" aria-labelledby="add-title">
        <button type="button" className="absolute right-4 top-4 grid size-10 place-items-center border-2 border-[#10120f] bg-white text-xl hover:bg-[#d8ff62]" onMouseDown={(event) => event.preventDefault()} onClick={close} aria-label="Close add question">×</button>
        {status === "saved" ? (
          <div className="enter py-12 text-center" role="status">
            <div className="font-mono mx-auto mb-6 grid size-16 place-items-center rounded-full border-2 border-[#10120f] bg-[#d8ff62] text-2xl">✓</div>
            <h2 id="add-title" className="text-3xl font-black">Question committed.</h2>
            <p className="mt-3 text-[#54574f]">It is now part of the shared question bank.</p>
            <button className="mt-8 border-2 border-[#10120f] bg-[#10120f] px-6 py-3 font-bold text-white hover:bg-[#7657ff]" onClick={close}>Back to home</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#7657ff]">POST /questions</p>
            <h2 id="add-title" className="mt-2 text-3xl font-black tracking-tight">Add to the stack</h2>
            <p className="mt-2 text-sm text-[#5e6158]">Write one clear question, four unique alternatives, and mark the correct one.</p>

            <label className="mt-7 block font-bold" htmlFor="question">Question <span aria-hidden="true" className="font-mono float-right text-xs font-normal text-[#686b63]">{draft.question.length}/500</span></label>
            <textarea ref={questionRef} id="question" rows={3} maxLength={500} value={draft.question} aria-invalid={Boolean(errors.question)} aria-describedby={errors.question ? "question-error" : undefined} onChange={(event) => updateDraft({ ...draft, question: event.target.value })} className="mt-2 w-full resize-y border-2 border-[#10120f] bg-white p-3" placeholder="What does HTTP status 204 mean?" />
            {errors.question && <p id="question-error" className="mt-1 text-sm font-bold text-[#b22e1a]">{errors.question}</p>}

            <fieldset className="mt-6">
              <legend className="font-bold">Alternatives</legend>
              <p className="mt-1 text-xs text-[#686b63]">Select the radio beside the correct answer.</p>
              <div className="mt-3 space-y-3">
                {draft.alternatives.map((alternative, index) => {
                  const field = `alternative-${index}` as keyof DraftErrors;
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="correct" checked={draft.correctAlternativeIndex === index} onChange={() => updateDraft({ ...draft, correctAlternativeIndex: index })} aria-label={`Mark alternative ${index + 1} correct`} className="size-5 accent-[#7657ff]" />
                        <label className="sr-only" htmlFor={`alternative-${index}`}>Alternative {index + 1}</label>
                        <input id={`alternative-${index}`} maxLength={200} value={alternative} aria-invalid={Boolean(errors[field])} onChange={(event) => {
                          const alternatives = [...draft.alternatives] as [string, string, string, string];
                          alternatives[index] = event.target.value;
                          updateDraft({ ...draft, alternatives });
                        }} className="min-w-0 flex-1 border-2 border-[#10120f] bg-white px-3 py-2.5" placeholder={`Alternative ${index + 1}`} />
                      </div>
                      {errors[field] && <p className="ml-8 mt-1 text-sm font-bold text-[#b22e1a]">{errors[field]}</p>}
                    </div>
                  );
                })}
              </div>
              {errors.alternatives && <p className="mt-2 text-sm font-bold text-[#b22e1a]">{errors.alternatives}</p>}
              {errors.correctAlternativeIndex && <p className="mt-2 text-sm font-bold text-[#b22e1a]">{errors.correctAlternativeIndex}</p>}
            </fieldset>
            {serverError && <div className="mt-5 border-2 border-[#b22e1a] bg-[#ffd3cb] p-3 text-sm font-bold" role="alert">{serverError}</div>}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={close} className="border-2 border-[#10120f] bg-white px-5 py-3 font-bold hover:bg-[#e6e3da]">Cancel</button>
              <button type="submit" disabled={status === "saving"} className="border-2 border-[#10120f] bg-[#d8ff62] px-6 py-3 font-black hover:bg-white disabled:opacity-60">{status === "saving" ? "Committing…" : "Commit question →"}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
