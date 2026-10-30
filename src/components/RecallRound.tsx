"use client";
import { useRef, useState } from "react";
import { CheckCircle2, CircleAlert, EyeOff, Keyboard, RotateCcw } from "lucide-react";
import type { Word } from "@/content/words";
import type { CheckResult } from "@/lib/answer";
import { checkWord } from "@/lib/quiz";
import { toggleHidden, updateSettings, useProgress, type Outcome, type SessionSummary } from "@/lib/store";
import { cx } from "@/lib/util";
import { PersianKeyboard } from "./PersianKeyboard";
import { ReportButton } from "./ReportButton";
import { AudioButtons, BookmarkButton, Fa, FaWord, ProgressBar } from "./ui";

/**
 * Typed recall used by lesson round 2, Daily Practice and bookmark practice.
 * Missed words go to the back of the queue until answered correctly.
 */
export function RecallRound({ words, label, onDone }: { words: Word[]; label: string; onDone: (r: SessionSummary) => void }) {
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

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
        <span className="whitespace-nowrap">{label}</span>
        <ProgressBar value={doneCount / words.length} className="flex-1" />
        <span>
          {doneCount}/{words.length}
        </span>
      </div>

      <div className="card flex flex-col items-center gap-2 p-6 text-center sm:p-8">
        {retry && (
          <span className="chip bg-saffron-soft text-saffron">
            <RotateCcw className="size-3" /> Let&apos;s try this one again
          </span>
        )}
        <p className="text-sm text-muted">{toFarsi ? "Type it in Farsi (script or Latin letters)" : "Type the English meaning"}</p>
        {toFarsi ? (
          <p className="font-display text-3xl font-semibold">{word.en}</p>
        ) : (
          <>
            <FaWord word={word} settings={settings} size="xl" />
            {!settings.scriptOnly && <p className="text-sm text-muted">sounds like “{word.soundsLike}”</p>}
            <AudioButtons text={word.fa} />
          </>
        )}
      </div>

      <form
        className="mt-4 space-y-3"
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
              result?.verdict === "correct" && "!border-firuze",
              result?.verdict === "almost" && "!border-saffron",
              result?.verdict === "wrong" && "!border-anar",
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
              className={cx("btn-secondary !px-3", settings.showKeyboard && "!border-firuze !text-firuze")}
              onClick={() => updateSettings({ showKeyboard: !settings.showKeyboard })}
              aria-pressed={settings.showKeyboard}
              aria-label="Toggle Persian keyboard"
            >
              <Keyboard className="size-5" />
            </button>
          )}
        </div>
        {toFarsi && settings.showKeyboard && !result && <PersianKeyboard onKey={insert} onBackspace={backspace} />}

        {result && <Feedback word={word} result={result} toFarsi={toFarsi} />}

        <div className="flex justify-end">
          {result ? (
            <button key="continue" type="submit" className="btn-primary" autoFocus>
              {result.verdict === "wrong" ? "Got it, continue" : "Continue"}
            </button>
          ) : (
            <button key="check" type="submit" className="btn-primary" disabled={!input.trim()}>
              Check
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Feedback({ word, result, toFarsi }: { word: Word; result: CheckResult; toFarsi: boolean }) {
  const { verdict } = result;
  const answer = toFarsi ? `${word.tr} · ${word.fa}` : word.en;
  return (
    <div
      role="status"
      className={cx(
        "rounded-2xl border p-4",
        verdict === "correct" && "border-firuze/30 bg-firuze-soft",
        verdict === "almost" && "border-saffron/30 bg-saffron-soft",
        verdict === "wrong" && "border-anar/30 bg-anar-soft",
      )}
    >
      <p className="flex items-center gap-2 font-semibold">
        {verdict === "wrong" ? <CircleAlert className="size-5 text-anar" /> : <CheckCircle2 className={cx("size-5", verdict === "correct" ? "text-firuze" : "text-saffron")} />}
        {verdict === "correct" && "Correct!"}
        {verdict === "almost" && "Almost — check your spelling"}
        {verdict === "wrong" && "Not quite. We'll come back to this one."}
      </p>
      {verdict !== "correct" && (
        <p className="mt-1 text-sm">
          Answer: <strong>{verdict === "almost" ? result.closest : answer}</strong>
        </p>
      )}
      <div className="mt-3 border-t border-black/5 pt-3 text-sm">
        <Fa className="block text-lg">{word.example.fa}</Fa>
        <p className="text-muted">{word.example.tr}</p>
        <p>{word.example.en}</p>
        {word.note && <p className="mt-2 text-xs text-muted">💡 {word.note}</p>}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <AudioButtons text={word.example.fa} />
        <BookmarkButton wordId={word.id} />
        <button type="button" className="btn-ghost !p-2" onClick={() => toggleHidden(word.id)} title="Hide this word from practice" aria-label="Hide from practice">
          <EyeOff className="size-5" />
        </button>
        <ReportButton itemId={word.id} />
      </div>
    </div>
  );
}
