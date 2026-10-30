"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, Lightbulb, PartyPopper, RotateCcw } from "lucide-react";
import type { Exercise, GrammarConcept } from "@/content/grammar";
import { checkAnswer, type Verdict } from "@/lib/answer";
import { completeGrammar } from "@/lib/store";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, ProgressBar } from "./ui";

const PASS = 80;

export function GrammarLesson({ concept }: { concept: GrammarConcept }) {
  const [mode, setMode] = useState<"learn" | "exercises" | "done">("learn");
  const [result, setResult] = useState<{ correct: number; total: number; xp: number } | null>(null);
  const [attempt, setAttempt] = useState(0);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/app/grammar/" className="btn-ghost -ml-3 mb-4">
        <ArrowLeft className="size-4" /> Grammar
      </Link>

      {mode === "learn" && (
        <article>
          <p className="text-sm text-muted">Concept G{concept.order}</p>
          <h1 className="font-display text-3xl font-semibold">
            {concept.title} <Fa className="ms-2 text-2xl font-normal text-muted">{concept.titleFa}</Fa>
          </h1>
          <p className="mt-3 text-lg">{concept.intro}</p>

          <div className="card mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  {concept.table.columns.map((c) => (
                    <th key={c} className="px-4 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {concept.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2.5">
                        {/[\u0600-\u06ff]/.test(cell) ? <Fa className="text-lg">{cell}</Fa> : j === 1 ? <strong>{cell}</strong> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-6 font-semibold">Key points</h2>
          <ul className="mt-2 space-y-2">
            {concept.keyPoints.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-firuze" />
                {p}
              </li>
            ))}
          </ul>

          <h2 className="mt-6 font-semibold">Examples</h2>
          <div className="mt-2 space-y-2">
            {concept.examples.map((e) => (
              <div key={e.tr} className="card flex items-center justify-between gap-3 p-3">
                <div>
                  <Fa className="block text-lg">{e.fa}</Fa>
                  <p className="text-sm text-muted">{e.tr}</p>
                  <p className="text-sm">{e.en}</p>
                </div>
                <AudioButtons text={e.fa} compact />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button type="button" className="btn-primary" onClick={() => setMode("exercises")}>
              Start exercises ({concept.exercises.length}) <ArrowRight className="size-4" />
            </button>
          </div>
        </article>
      )}

      {mode === "exercises" && (
        <Exercises
          key={attempt}
          exercises={concept.exercises}
          onDone={(correct, total) => {
            setResult({ correct, total, xp: completeGrammar(concept.id, correct, total) });
            setMode("done");
          }}
        />
      )}

      {mode === "done" && result && (
        <div className="card p-8 text-center">
          {Math.round((result.correct / result.total) * 100) >= PASS ? (
            <>
              <PartyPopper className="mx-auto size-12 text-saffron" />
              <h2 className="mt-3 font-display text-3xl font-semibold">Concept learned!</h2>
            </>
          ) : (
            <>
              <RotateCcw className="mx-auto size-10 text-saffron" />
              <h2 className="mt-3 font-display text-3xl font-semibold">Keep practising</h2>
              <p className="mt-1 text-muted">You need {PASS}% to pass — you’re close.</p>
            </>
          )}
          <p className="mt-2 text-muted">
            {result.correct}/{result.total} right first time ({Math.round((result.correct / result.total) * 100)}%)
          </p>
          <p className="mt-4 inline-flex rounded-full bg-saffron-soft px-4 py-2 font-semibold text-saffron">+{result.xp} XP</p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setAttempt((n) => n + 1);
                setMode("learn");
              }}
            >
              Review & try again
            </button>
            <Link href="/app/grammar/" className="btn-primary">
              Back to grammar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function answersOf(ex: Exercise): string[] {
  return ex.kind === "choice" ? [ex.answer] : ex.answers;
}

function Exercises({ exercises, onDone }: { exercises: Exercise[]; onDone: (correct: number, total: number) => void }) {
  const [queue, setQueue] = useState(() => exercises.map((_, i) => i));
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [showHint, setShowHint] = useState(false);

  const idx = queue[0];
  const ex = exercises[idx];
  const done = exercises.length - new Set(queue).size;

  const submit = (value: string) => {
    if (verdict || !value.trim()) return;
    const v = ex.kind === "choice" ? (value === ex.answer ? "correct" : "wrong") : checkAnswer(value, ex.answers).verdict;
    setInput(value);
    setVerdict(v);
    if (v === "wrong") setMissed((m) => new Set(m).add(idx));
  };

  const next = () => {
    const rest = queue.slice(1);
    const nextQueue = verdict === "wrong" ? [...rest, idx] : rest;
    setVerdict(null);
    setInput("");
    setShowHint(false);
    if (!nextQueue.length) onDone(exercises.length - missed.size, exercises.length);
    else setQueue(nextQueue);
  };

  const label = ex.kind === "choice" ? "Multiple choice" : ex.kind === "fill" ? "Fill in the blank" : "Translate into Farsi (Latin letters)";

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
        <span className="whitespace-nowrap">Exercises</span>
        <ProgressBar value={done / exercises.length} className="flex-1" />
        <span>
          {done}/{exercises.length}
        </span>
      </div>
      <div className="card p-6">
        <p className="text-sm font-medium text-firuze">{label}</p>
        {missed.has(idx) && !verdict && (
          <span className="chip mt-2 bg-saffron-soft text-saffron">
            <RotateCcw className="size-3" /> Let&apos;s try this one again
          </span>
        )}
        <p className="mt-2 font-display text-2xl font-semibold">{ex.prompt}</p>
        {ex.kind === "fill" && <p className="mt-1 text-muted">{ex.translation}</p>}

        {ex.kind === "choice" ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {ex.options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => submit(o)}
                className={cx(
                  "card px-4 py-3 text-left font-medium transition",
                  !verdict && "hover:border-firuze",
                  verdict && o === ex.answer && "!border-firuze !bg-firuze-soft",
                  verdict === "wrong" && o === input && "!border-anar !bg-anar-soft",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        ) : (
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (verdict) next();
              else submit(input);
            }}
          >
            <input
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              readOnly={!!verdict}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Type your answer"
              aria-label="Your answer"
            />
            {!verdict && (
              <div className="mt-3 flex justify-between">
                {ex.hint ? (
                  <button type="button" className="btn-ghost -ml-3" onClick={() => setShowHint(true)} disabled={showHint}>
                    <Lightbulb className="size-4" /> Need a hint?
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className="btn-primary" disabled={!input.trim()}>
                  Check
                </button>
              </div>
            )}
          </form>
        )}
        {showHint && ex.hint && !verdict && <p className="mt-3 rounded-xl bg-saffron-soft p-3 text-sm">💡 {ex.hint}</p>}
      </div>

      {verdict && (
        <div
          role="status"
          className={cx(
            "mt-4 rounded-2xl border p-4",
            verdict === "correct" && "border-firuze/30 bg-firuze-soft",
            verdict === "almost" && "border-saffron/30 bg-saffron-soft",
            verdict === "wrong" && "border-anar/30 bg-anar-soft",
          )}
        >
          <p className="flex items-center gap-2 font-semibold">
            {verdict === "wrong" ? <CircleAlert className="size-5 text-anar" /> : <CheckCircle2 className="size-5 text-firuze" />}
            {verdict === "correct" ? "Correct!" : verdict === "almost" ? "Almost — check your spelling" : "Not quite. We'll come back to this one."}
          </p>
          {verdict !== "correct" && (
            <p className="mt-1 text-sm">
              Answer: <strong>{answersOf(ex)[0]}</strong>
            </p>
          )}
          <div className="mt-3 flex justify-end">
            <button type="button" className="btn-primary" onClick={next} autoFocus>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
