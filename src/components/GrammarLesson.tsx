"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb, PartyPopper, RotateCcw, Star } from "lucide-react";
import type { Exercise, GrammarConcept } from "@/content/grammar";
import { checkAnswer, type Verdict } from "@/lib/answer";
import { completeGrammar } from "@/lib/store";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, FeedbackSheet, FocusMode, SessionHeader, StatCard } from "./ui";

const PASS = 80;

export function GrammarLesson({ concept }: { concept: GrammarConcept }) {
  const [mode, setMode] = useState<"learn" | "exercises" | "done">("learn");
  const [result, setResult] = useState<{ correct: number; total: number; xp: number } | null>(null);
  const [attempt, setAttempt] = useState(0);

  if (mode === "exercises")
    return (
      <Exercises
        key={attempt}
        exercises={concept.exercises}
        onDone={(correct, total) => {
          setResult({ correct, total, xp: completeGrammar(concept.id, correct, total) });
          setMode("done");
        }}
      />
    );

  if (mode === "done" && result) {
    const pct = Math.round((result.correct / result.total) * 100);
    const passed = pct >= PASS;
    return (
      <div className="mx-auto max-w-md py-8 text-center">
        <FocusMode />
        <span className={cx("mx-auto grid size-24 animate-pop place-items-center rounded-full", passed ? "bg-saffron-soft text-saffron-ink" : "bg-plum-soft text-plum-ink")}>
          {passed ? <PartyPopper className="size-12" /> : <RotateCcw className="size-11" strokeWidth={2.5} />}
        </span>
        <h1 className={cx("mt-5 text-3xl font-extrabold tracking-tight", passed ? "text-saffron-ink" : "text-ink")}>
          {passed ? "Concept learned!" : "Keep practising"}
        </h1>
        <p className="mt-2 font-semibold text-muted">
          {passed ? `${result.correct}/${result.total} right first time.` : `You need ${PASS}% to pass — you’re close. ${result.correct}/${result.total} right first time.`}
        </p>
        <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
          <StatCard label="Total XP" tone="saffron" value={result.xp} icon={<Star className="size-5 fill-current" />} />
          <StatCard label="Score" tone={passed ? "pista" : "anar"} value={`${pct}%`} />
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="btn-secondary btn-lg"
            onClick={() => {
              setAttempt((n) => n + 1);
              setMode("learn");
            }}
          >
            Review & try again
          </button>
          <Link href="/app/grammar/" className="btn-primary btn-lg">
            Back to grammar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/app/grammar/" className="btn-ghost btn-sm -ml-3 mb-4">
        <ArrowLeft className="size-4" strokeWidth={3} /> Grammar
      </Link>

      <p className="eyebrow text-plum-ink">Grammar · G{concept.order}</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
        {concept.title} <Fa className="ms-2 text-2xl font-bold text-muted">{concept.titleFa}</Fa>
      </h1>
      <p className="mt-3 text-lg font-medium">{concept.intro}</p>

      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line bg-paper">
                {concept.table.columns.map((c) => (
                  <th key={c} className="eyebrow px-4 py-2.5 text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {concept.table.rows.map((row, i) => (
                <tr key={i} className="border-b-2 border-line last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 font-semibold">
                      {/[؀-ۿ]/.test(cell) ? <Fa className="text-lg">{cell}</Fa> : j === 1 ? <strong className="font-extrabold text-plum-ink">{cell}</strong> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mt-8 text-xl font-extrabold">Key points</h2>
      <ul className="mt-3 space-y-2.5">
        {concept.keyPoints.map((p) => (
          <li key={p} className="flex gap-3 font-medium">
            <span className="mt-2 size-2 shrink-0 rounded-full bg-plum" />
            {p}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-xl font-extrabold">Examples</h2>
      <div className="mt-3 space-y-3">
        {concept.examples.map((e) => (
          <div key={e.tr} className="card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <Fa className="block text-xl">{e.fa}</Fa>
              <p className="text-sm font-semibold text-muted">{e.tr}</p>
              <p className="font-semibold">{e.en}</p>
            </div>
            <AudioButtons text={e.fa} compact />
          </div>
        ))}
      </div>

      <div className="sticky bottom-[calc(4rem_+_env(safe-area-inset-bottom))] z-20 -mx-4 mt-6 bg-linear-to-t from-card from-60% to-transparent px-4 pb-4 pt-8 md:bottom-0">
        <button type="button" className="btn-plum btn-lg w-full" onClick={() => setMode("exercises")}>
          Start exercises ({concept.exercises.length})
        </button>
      </div>
    </article>
  );
}

function answersOf(ex: Exercise): string[] {
  return ex.kind === "choice" ? [ex.answer] : ex.answers;
}

const LABELS: Record<Exercise["kind"], string> = {
  choice: "Pick the right answer",
  fill: "Fill in the blank",
  translate: "Translate into Farsi (Latin letters)",
};

const FEEDBACK: Record<Verdict, string> = {
  correct: "Nicely done!",
  almost: "Almost! Watch the spelling.",
  wrong: "Not quite — we’ll come back to it.",
};

const BADGE: Record<string, string> = {
  idle: "border-line text-muted",
  selected: "border-sky text-sky-ink",
  correct: "border-pista text-pista-ink",
  wrong: "border-anar text-anar-ink",
};

function Exercises({ exercises, onDone }: { exercises: Exercise[]; onDone: (correct: number, total: number) => void }) {
  const [queue, setQueue] = useState(() => exercises.map((_, i) => i));
  const [missed, setMissed] = useState<Set<number>>(new Set());
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [step, setStep] = useState(0);

  const idx = queue[0];
  const ex = exercises[idx];
  const done = exercises.length - new Set(queue).size;
  const answer = ex.kind === "choice" ? (selected ?? "") : input;

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
    setSelected(null);
    setShowHint(false);
    setStep((n) => n + 1);
    if (!nextQueue.length) onDone(exercises.length - missed.size, exercises.length);
    else setQueue(nextQueue);
  };

  // Keyboard: 1–4 pick an option; Enter checks, then continues.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      const option = t.closest<HTMLElement>("[data-option]")?.dataset.option;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || (t.tagName === "BUTTON" && option === undefined)) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (verdict) next();
        else if (option !== undefined) {
          setSelected(option);
          submit(option);
        } else submit(answer);
      } else if (ex.kind === "choice" && !verdict && /^[1-9]$/.test(e.key)) {
        const o = ex.options[Number(e.key) - 1];
        if (o) setSelected(o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const optionState = (o: string) => {
    if (!verdict) return o === selected ? "selected" : undefined;
    if (ex.kind === "choice" && o === ex.answer) return "correct";
    if (verdict === "wrong" && o === input) return "wrong";
    return undefined;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SessionHeader
        exitHref="/app/grammar/"
        progress={done / exercises.length}
        right={
          <span className="text-sm font-extrabold tabular-nums text-muted">
            {done}/{exercises.length}
          </span>
        }
      />

      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow text-plum-ink">{LABELS[ex.kind]}</p>
          {missed.has(idx) && !verdict && (
            <span className="chip bg-saffron-soft text-saffron-ink">
              <RotateCcw className="size-3" strokeWidth={3} /> Let&apos;s try this one again
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold">{ex.prompt}</h1>
        {ex.kind === "fill" && <p className="mt-1 font-semibold text-muted">{ex.translation}</p>}

        {ex.kind === "choice" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-label="Answer options">
            {ex.options.map((o, i) => {
              const state = optionState(o);
              return (
                <button
                  key={o}
                  type="button"
                  data-option={o}
                  data-state={state}
                  disabled={!!verdict}
                  aria-pressed={!verdict ? o === selected : undefined}
                  onClick={() => setSelected(o)}
                  className={cx("tile flex items-center gap-3 px-4 py-3.5 text-left font-bold", state === "wrong" && "animate-shake")}
                >
                  <span className={cx("grid size-7 shrink-0 place-items-center rounded-lg border-2 text-xs font-extrabold", BADGE[state ?? "idle"])}>{i + 1}</span>
                  {o}
                </button>
              );
            })}
          </div>
        ) : (
          <form
            key={step}
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (verdict) next();
              else submit(input);
            }}
          >
            <input
              className={cx(
                "input",
                (verdict === "correct" || verdict === "almost") && "!border-pista !bg-pista-soft text-pista-ink",
                verdict === "wrong" && "animate-shake !border-anar !bg-anar-soft text-anar-ink",
              )}
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
          </form>
        )}

        {ex.hint && !verdict && (
          <div className="mt-4">
            {showHint ? (
              <p className="flex animate-pop gap-2 rounded-2xl bg-saffron-soft p-3 text-sm font-semibold text-saffron-ink">
                <Lightbulb className="size-4 shrink-0 translate-y-0.5" strokeWidth={2.5} /> {ex.hint}
              </p>
            ) : (
              <button type="button" className="btn-ghost btn-sm -ml-3" onClick={() => setShowHint(true)}>
                <Lightbulb className="size-4" strokeWidth={2.5} /> Need a hint?
              </button>
            )}
          </div>
        )}
      </div>

      <FeedbackSheet
        state={verdict ?? "idle"}
        title={verdict ? FEEDBACK[verdict] : undefined}
        detail={
          verdict && verdict !== "correct" ? (
            <>
              Answer: <strong className="font-extrabold">{answersOf(ex)[0]}</strong>
            </>
          ) : undefined
        }
        onContinue={next}
      >
        <button type="button" className="btn-primary btn-lg w-full sm:ml-auto sm:w-auto sm:min-w-40" disabled={!answer.trim()} onClick={() => submit(answer)}>
          Check
        </button>
      </FeedbackSheet>
    </div>
  );
}
