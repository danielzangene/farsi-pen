"use client";
import { useRef, useState } from "react";
import { EyeOff, Keyboard, RotateCcw, X } from "lucide-react";
import type { Word } from "@/content/words";
import type { CheckResult } from "@/lib/answer";
import { checkWord } from "@/lib/quiz";
import { toggleHidden, updateSettings, useProgress, type Outcome, type SessionSummary } from "@/lib/store";
import { cx } from "@/lib/util";
import { PersianKeyboard } from "./PersianKeyboard";
import { ReportButton } from "./ReportButton";
import { AudioButtons, BookmarkButton, Fa, FaWord, FeedbackSheet, FocusMode, ProgressBar, SessionHeader } from "./ui";

/**
 * Typed recall used by lesson round 2, Daily Practice and bookmark practice.
 * Missed words go to the back of the queue until answered correctly.
 */
export function RecallRound({
  words,
  label,
  onDone,
  exitHref = "/app/",
  onExit,
  progressSpan = [0, 1],
  toolbar,
}: {
  words: Word[];
  label: string;
  onDone: (r: SessionSummary) => void;
  exitHref?: string;
  /** Called by the X instead of navigating to exitHref (e.g. when exiting stays on the same route). */
  onExit?: () => void;
  /** Slice of the session-wide progress bar this round fills, e.g. [2/3, 1]. */
  progressSpan?: [number, number];
  /** Controls shown under the session header (e.g. CardControls). */
  toolbar?: React.ReactNode;
}) {
  const { settings } = useProgress();
  const [queue, setQueue] = useState(() => words.map((w) => w.id));
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const byId = Object.fromEntries(words.map((w) => [w.id, w]));
  const word = byId[queue[0]];
  const direction = settings.direction;
  const toFarsi = direction === "en-fa";
  const doneCount = words.length - new Set(queue).size;

  const submit = () => {
    if (!input.trim() || result) return;
    const r = checkWord(word, input, direction);
    setResult(r);
    if (!(word.id in outcomes)) {
      const o: Outcome = r.verdict === "correct" ? "good" : r.verdict === "almost" ? "hard" : "again";
      setOutcomes((prev) => ({ ...prev, [word.id]: o }));
      if (r.verdict !== "wrong") setFirstTryCorrect((n) => n + 1);
    }
  };

  const next = () => {
    const rest = queue.slice(1);
    const nextQueue = result?.verdict === "wrong" ? [...rest, word.id] : rest;
    setResult(null);
    setInput("");
    if (nextQueue.length === 0) {
      onDone({ correct: firstTryCorrect, total: words.length, outcomes });
      return;
    }
    setQueue(nextQueue);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const insert = (s: string) => {
    const el = inputRef.current;
    if (!el) return setInput((v) => v + s);
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const v = input.slice(0, start) + s + input.slice(end);
    setInput(v);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + s.length, start + s.length);
    });
  };

  const backspace = () => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? input.length;
    const end = el?.selectionEnd ?? input.length;
    if (start === end && start === 0) return;
    const from = start === end ? start - 1 : start;
    setInput(input.slice(0, from) + input.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(from, from);
    });
  };

  if (!word) return null;
  const retry = word.id in outcomes && !result;
  const verdict = result?.verdict;
  // The bar moves as soon as a word is answered right, not on Continue.
  const done = doneCount + (verdict && verdict !== "wrong" ? 1 : 0);
  const [spanFrom, spanTo] = progressSpan;
  const answer = toFarsi ? (
    <>
      {word.tr} · <Fa className="text-base">{word.fa}</Fa>
    </>
  ) : (
    word.en
  );

  return (
    <div>
      <RoundHeader
        exitHref={exitHref}
        onExit={onExit}
        progress={spanFrom + ((spanTo - spanFrom) * done) / words.length}
        right={
          <span className="text-sm font-extrabold tabular-nums text-muted">
            {done}/{words.length}
          </span>
        }
      />
      {toolbar && <div className="-mt-3 mb-5 flex justify-center">{toolbar}</div>}

      <p className="eyebrow text-firuze-ink">{label}</p>
      <h2 className="mt-1 text-2xl font-extrabold">{toFarsi ? "Write this in Farsi" : "Write this in English"}</h2>
      {toFarsi && <p className="mt-1 text-sm font-semibold text-muted">Persian script or Latin letters both work.</p>}

      <div className="card mt-5 flex flex-col items-center gap-3 p-6 text-center sm:p-8">
        {retry && (
          <span className="chip bg-saffron-soft text-saffron-ink">
            <RotateCcw className="size-3" /> Let&apos;s try this one again
          </span>
        )}
        {toFarsi ? (
          <p className="text-3xl font-extrabold">{word.en}</p>
        ) : (
          <>
            <FaWord word={word} settings={settings} size="xl" />
            {!settings.scriptOnly && <p className="font-semibold text-muted">sounds like “{word.soundsLike}”</p>}
            <AudioButtons text={word.fa} big />
          </>
        )}
      </div>

      <form
        className="mt-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (result) next();
          else submit();
        }}
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            className={cx(
              "input",
              verdict === "correct" && "!border-pista",
              verdict === "almost" && "!border-saffron",
              verdict === "wrong" && "animate-shake !border-anar",
            )}
            dir="auto"
            lang={toFarsi ? "fa" : "en"}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={toFarsi ? "e.g. salâm or سلام" : "Your answer"}
            value={input}
            readOnly={!!result}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            aria-label="Your answer"
          />
          {toFarsi && (
            <button
              type="button"
              className={cx(settings.showKeyboard ? "btn-sky" : "btn-secondary", "btn-icon !size-14 shrink-0")}
              onClick={() => updateSettings({ showKeyboard: !settings.showKeyboard })}
              aria-pressed={settings.showKeyboard}
              aria-label="Toggle Persian keyboard"
            >
              <Keyboard className="size-6" />
            </button>
          )}
        </div>
        {toFarsi && settings.showKeyboard && !result && <PersianKeyboard onKey={insert} onBackspace={backspace} />}

        {result && <Context word={word} />}

        <FeedbackSheet
          state={verdict ?? "idle"}
          title={verdict === "correct" ? "Correct!" : verdict === "almost" ? "Almost — watch the spelling" : "Not quite"}
          detail={
            verdict === "almost" ? (
              <>
                Accepted spelling: <strong className="font-extrabold">{result?.closest}</strong>
              </>
            ) : verdict === "wrong" ? (
              <>
                Answer: <strong className="font-extrabold">{answer}</strong>
                <span className="block">We&apos;ll come back to this one.</span>
              </>
            ) : undefined
          }
          onContinue={next}
          continueLabel={verdict === "wrong" ? "Got it" : "Continue"}
        >
          <p className="hidden text-sm font-semibold text-muted sm:block">Press Enter to check</p>
          <button key="check" type="submit" className="btn-primary btn-lg w-full sm:w-auto sm:min-w-40" disabled={!input.trim()}>
            Check
          </button>
        </FeedbackSheet>
      </form>
    </div>
  );
}

/** Example sentence, note and word actions, shown after an answer above the feedback sheet. */
function Context({ word }: { word: Word }) {
  const { settings } = useProgress();
  return (
    <div className="card animate-pop p-4">
      <Fa className="block text-lg">{word.example.fa}</Fa>
      {!settings.scriptOnly && <p className="text-sm font-semibold text-muted">{word.example.tr}</p>}
      <p className="font-semibold">{word.example.en}</p>
      {word.note && <p className="mt-2 text-sm text-muted">💡 {word.note}</p>}
      <div className="mt-2 flex items-center justify-between gap-1 border-t-2 border-line pt-2">
        <AudioButtons text={word.example.fa} />
        <div className="flex items-center gap-1">
          <BookmarkButton wordId={word.id} />
          <button type="button" className="btn-ghost btn-icon" onClick={() => toggleHidden(word.id)} title="Hide this word from practice" aria-label="Hide from practice">
            <EyeOff className="size-5" />
          </button>
          <ReportButton itemId={word.id} />
        </div>
      </div>
    </div>
  );
}

/**
 * SessionHeader, or the same layout with a button X when the caller needs a
 * callback (SessionHeader only takes a link).
 */
function RoundHeader({ exitHref, onExit, progress, right }: { exitHref: string; onExit?: () => void; progress: number; right?: React.ReactNode }) {
  if (!onExit) return <SessionHeader exitHref={exitHref} progress={progress} right={right} />;
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 bg-card/95 px-4 py-3 backdrop-blur">
      <FocusMode />
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <button type="button" onClick={onExit} className="btn-ghost btn-icon -ml-2" aria-label="Quit session">
          <X className="size-6" strokeWidth={3} />
        </button>
        <ProgressBar value={progress} className="flex-1" />
        {right}
      </div>
    </div>
  );
}
