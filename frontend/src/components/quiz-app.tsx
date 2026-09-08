"use client";

import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import type { ErrorResponse, Question, QuizResponse } from "@/generated";
import { AddQuestionDialog } from "./add-question-dialog";

type Answer = { question: Question; selected: number };
type View = "home" | "loading" | "quiz" | "results" | "error";

export function QuizApp() {
  const [view, setView] = useState<View>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const current = questions[index];

  async function startQuiz() {
    setView("loading");
    setError("");
    try {
      const response = await fetch("/api/quiz", { cache: "no-store" });
      const body = await response.json() as QuizResponse | ErrorResponse;
      if (!response.ok || !("questions" in body)) {
        setError("message" in body ? body.message : "Could not load the quiz.");
        setView("error");
        return;
      }
      setQuestions(body.questions);
      setIndex(0);
      setSelected(null);
      setAnswers([]);
      setView("quiz");
    } catch {
      setError("The quiz service is unavailable. Check your connection and retry.");
      setView("error");
    }
  }

  function chooseAnswer(answerIndex: number) {
    if (!current || selected !== null) return;
    setSelected(answerIndex);
    setAnswers((existing) => [...existing, { question: current, selected: answerIndex }]);
    if (answerIndex === current.correctAlternativeIndex && !reducedMotion) {
      void confetti({ particleCount: 85, spread: 62, origin: { y: 0.72 }, colors: ["#d8ff62", "#7657ff", "#ff6d54"] });
    }
  }

  function advance() {
    if (selected === null) return;
    if (index === questions.length - 1) {
      setView("results");
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function goHome() {
    setView("home");
    setQuestions([]);
    setAnswers([]);
    setSelected(null);
  }

  const score = answers.filter(({ question, selected: answer }) => answer === question.correctAlternativeIndex).length;

  return (
    <main className="noise min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <button onClick={goHome} className="flex items-center gap-3" aria-label="StackCheck home">
          <span className="font-mono grid size-9 place-items-center border-2 border-[#10120f] bg-[#d8ff62] font-black">S/</span>
          <span className="text-lg font-black tracking-tight">StackCheck</span>
        </button>
        <button onClick={() => setAddOpen(true)} className="font-mono border-b-2 border-[#10120f] pb-1 text-xs font-bold uppercase tracking-wider hover:border-[#7657ff] hover:text-[#7657ff]">+ Add question</button>
      </header>

      {view === "home" && <Home onStart={() => void startQuiz()} onAdd={() => setAddOpen(true)} />}
      {view === "loading" && <Loading />}
      {view === "error" && <ErrorState message={error} onRetry={() => void startQuiz()} onHome={goHome} />}
      {view === "quiz" && current && (
        <QuizQuestion question={current} index={index} total={questions.length} selected={selected} onChoose={chooseAnswer} onNext={advance} onExit={goHome} />
      )}
      {view === "results" && <Results answers={answers} score={score} onAgain={() => void startQuiz()} onHome={goHome} />}
      <AddQuestionDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </main>
  );
}

function Home({ onStart, onAdd }: { onStart: () => void; onAdd: () => void }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.25fr_.75fr]">
      <section className="enter">
        <div className="font-mono mb-6 inline-flex items-center gap-2 border border-[#10120f] bg-white px-3 py-1.5 text-xs font-bold"><span className="size-2 rounded-full bg-[#32a852]" /> SYSTEM READY</div>
        <h1 aria-label="Test your dev stack" className="max-w-3xl text-[clamp(3.6rem,9vw,7.8rem)] font-black leading-[.84] tracking-[-.075em]">Test your<br /><span className="text-[#7657ff]">dev stack.</span></h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#4d5049]">Ten questions. One answer each. Find the gaps in your mental model and ship a sharper version of yourself.</p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <button onClick={onStart} className="hard-shadow border-2 border-[#10120f] bg-[#d8ff62] px-7 py-4 text-left font-black transition-transform hover:-translate-y-1">Start quiz <span className="ml-4">→</span></button>
          <button onClick={onAdd} className="border-2 border-[#10120f] bg-white px-7 py-4 font-bold hover:bg-[#10120f] hover:text-white">Add question</button>
        </div>
      </section>
      <aside className="relative mx-auto w-full max-w-sm lg:rotate-2">
        <div className="hard-shadow border-2 border-[#10120f] bg-[#10120f] p-3 text-white">
          <div className="font-mono flex items-center justify-between border-b border-white/20 px-2 pb-3 text-xs"><span>quiz.config.ts</span><span className="text-[#d8ff62]">● live</span></div>
          <pre className="font-mono overflow-hidden px-3 py-8 text-sm leading-8"><code><span className="text-[#9c8cff]">export default</span> {`{\n`}  questions: <span className="text-[#d8ff62]">10</span>,{`\n`}  mode: <span className="text-[#ff917e]">&quot;focused&quot;</span>,{`\n`}  curiosity: <span className="text-[#d8ff62]">true</span>{`\n}`}</code></pre>
        </div>
        <div className="font-mono absolute -bottom-5 -left-5 -rotate-6 border-2 border-[#10120f] bg-[#ff6d54] px-4 py-2 text-xs font-black">NO TUTORIALS.</div>
      </aside>
    </div>
  );
}

function Loading() {
  return <section className="grid min-h-[70vh] place-items-center px-5" aria-live="polite"><div className="text-center"><div className="font-mono mx-auto grid size-20 animate-pulse place-items-center border-2 border-[#10120f] bg-[#d8ff62] text-2xl font-black">...</div><h1 className="mt-7 text-2xl font-black">Compiling your quiz</h1><p className="font-mono mt-2 text-sm text-[#65685f]">Fetching 10 random questions</p></div></section>;
}

function ErrorState({ message, onRetry, onHome }: { message: string; onRetry: () => void; onHome: () => void }) {
  return <section className="grid min-h-[70vh] place-items-center px-5"><div className="hard-shadow max-w-lg border-2 border-[#10120f] bg-white p-8 text-center" role="alert"><span className="font-mono text-5xl">!_</span><h1 className="mt-5 text-3xl font-black">Request failed</h1><p className="mt-3 text-[#5e6158]">{message}</p><div className="mt-7 flex justify-center gap-3"><button onClick={onRetry} className="border-2 border-[#10120f] bg-[#d8ff62] px-5 py-3 font-black">Retry</button><button onClick={onHome} className="border-2 border-[#10120f] bg-white px-5 py-3 font-bold">Home</button></div></div></section>;
}

type QuizQuestionProps = { question: Question; index: number; total: number; selected: number | null; onChoose: (index: number) => void; onNext: () => void; onExit: () => void };

function QuizQuestion({ question, index, total, selected, onChoose, onNext, onExit }: QuizQuestionProps) {
  const isCorrect = selected === question.correctAlternativeIndex;
  return (
    <section className="enter mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:px-8">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div className="flex-1"><div className="font-mono mb-2 flex justify-between text-xs font-bold uppercase tracking-wider"><span>Question {index + 1} / {total}</span><span>{Math.round(((index + 1) / total) * 100)}%</span></div><div className="h-3 border-2 border-[#10120f] bg-white"><div className="h-full bg-[#7657ff] transition-[width]" style={{ width: `${((index + 1) / total) * 100}%` }} /></div></div>
        <button onClick={onExit} className="font-mono text-xs font-bold underline decoration-2 underline-offset-4">Exit</button>
      </div>
      <article className="soft-shadow border-2 border-[#10120f] bg-[#f8f6ef] p-6 sm:p-10">
        <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#7657ff]">{"// choose one"}</p>
        <h1 className="mt-4 text-2xl font-black leading-tight sm:text-4xl">{question.question}</h1>
        <div className="mt-8 grid gap-3" role="group" aria-label="Answer alternatives">
          {question.alternatives.map((alternative, answerIndex) => {
            const revealedCorrect = selected !== null && answerIndex === question.correctAlternativeIndex;
            const chosenWrong = selected === answerIndex && !revealedCorrect;
            const stateClass = revealedCorrect ? "answer-correct" : chosenWrong ? "answer-wrong" : "bg-white hover:-translate-y-0.5 hover:bg-[#eeebe2]";
            return <button key={answerIndex} disabled={selected !== null} onClick={() => onChoose(answerIndex)} aria-pressed={selected === answerIndex} className={`flex min-h-16 items-center gap-4 border-2 border-[#10120f] p-3 text-left font-bold transition-transform disabled:cursor-default disabled:opacity-100 ${stateClass}`}><span className="font-mono grid size-9 shrink-0 place-items-center border border-[#10120f] bg-[#f8f6ef] text-xs">{String.fromCharCode(65 + answerIndex)}</span><span>{alternative}</span>{revealedCorrect && <span className="ml-auto" aria-label="Correct">✓</span>}{chosenWrong && <span className="sad-face ml-auto text-xl" aria-label="Incorrect">:(</span>}</button>;
          })}
        </div>
        {selected !== null && <div className="mt-6 flex items-center justify-between gap-4" aria-live="polite"><p className={`font-black ${isCorrect ? "text-[#356700]" : "text-[#b22e1a]"}`}>{isCorrect ? "Correct. Nicely compiled." : "Not quite. The correct answer is highlighted."}</p><button onClick={onNext} className="shrink-0 border-2 border-[#10120f] bg-[#10120f] px-5 py-2.5 font-bold text-white">{index === total - 1 ? "Results" : "Next →"}</button></div>}
      </article>
    </section>
  );
}

function Results({ answers, score, onAgain, onHome }: { answers: Answer[]; score: number; onAgain: () => void; onHome: () => void }) {
  const percent = answers.length ? Math.round((score / answers.length) * 100) : 0;
  const incorrect = answers.length - score;
  return (
    <section className="enter mx-auto w-full max-w-4xl px-5 pb-20 pt-8 sm:px-8">
      <div className="hard-shadow border-2 border-[#10120f] bg-[#d8ff62] p-7 sm:p-10">
         <p className="font-mono text-xs font-bold uppercase tracking-[.2em]">Run complete</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-black sm:text-6xl">{score}/{answers.length}</h1><p className="mt-2 font-bold">{percent >= 80 ? "Production ready." : percent >= 50 ? "Solid branch. Keep iterating." : "Time for a refactor."}</p><p className="font-mono mt-3 text-sm"><strong>{score} correct</strong> · <strong>{incorrect} incorrect</strong></p></div><span className="font-mono text-5xl font-black">{percent}%</span></div>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-black">Review log</h2><div className="flex gap-3"><button onClick={onAgain} className="border-2 border-[#10120f] bg-[#7657ff] px-5 py-2.5 font-bold text-white">Run again</button><button onClick={onHome} className="border-2 border-[#10120f] bg-white px-5 py-2.5 font-bold">Home</button></div></div>
      <ol className="mt-5 space-y-4">
        {answers.map(({ question, selected }, answerIndex) => {
          const correct = selected === question.correctAlternativeIndex;
           return <li key={question.id} className={`border-2 border-[#10120f] p-5 ${correct ? "bg-white" : "bg-[#fff4f1]"}`}><div className="flex gap-4"><span className={`font-mono grid size-8 shrink-0 place-items-center border border-[#10120f] text-sm font-black ${correct ? "bg-[#d8ff62]" : "bg-[#ffd3cb]"}`}>{answerIndex + 1}</span><div><h3 className="font-black">{question.question}</h3><p className="mt-2 text-sm text-[#5e6158]">Your answer: <span className={correct ? "font-bold text-[#356700]" : "font-bold text-[#b22e1a]"}>{question.alternatives[selected]}</span></p><p className="mt-1 text-sm">Correct answer: <strong className="text-[#356700]">{question.alternatives[question.correctAlternativeIndex]}</strong></p></div></div></li>;
        })}
      </ol>
    </section>
  );
}
