"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Word } from "@/content/words";
import { choiceOptions } from "@/lib/quiz";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, FaWord, FeedbackSheet, SessionHeader } from "./ui";

type OptionState = "idle" | "selected" | "correct" | "wrong";

const BADGE: Record<OptionState, string> = {
  idle: "border-line text-muted",
  selected: "border-sky text-sky-ink",
  correct: "border-pista bg-pista text-on-accent",
  wrong: "border-anar bg-anar text-on-accent",
};

/** Round 1 — Recognition: 4-option multiple choice, one pass. Select, then Check. */
export function ChoiceRound({
  words,
  onDone,
  exitHref = "/app/lessons/",
  progressSpan = [0, 1],
  toolbar,
}: {
  words: Word[];
  onDone: (correctIds: string[]) => void;
  exitHref?: string;
  /** Slice of the session-wide progress bar this round fills, e.g. [1/3, 2/3]. */
  progressSpan?: [number, number];
  /** Controls shown under the session header (e.g. CardControls). */
  toolbar?: React.ReactNode;
}) {
  const { settings } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<string[]>([]);
  const word = words[index];
  const options = useMemo(() => choiceOptions(word, words), [word, words]);
  const faToEn = settings.direction === "fa-en";
  const gotIt = checked && selected === word.id;

  const select = (id: string) => {
    if (!checked) setSelected(id);
  };

  const check = () => {
    if (!selected || checked) return;
    setChecked(true);
    if (selected === word.id) setCorrect((c) => [...c, word.id]);
  };

  const next = () => {
    if (index + 1 < words.length) {
      setIndex(index + 1);
      setSelected(null);
      setChecked(false);
    } else onDone(correct);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "Enter") {
        // Focused buttons/links (Check, Continue, the X) handle Enter
        // themselves; acting here too would advance twice. Option tiles are
        // the exception: Enter on a tile checks instead of re-selecting it.
        const control = el?.closest("a, button");
        if (control && !control.hasAttribute("data-option")) return;
        e.preventDefault();
        if (checked) next();
        else check();
        return;
      }
      const n = ["1", "2", "3", "4", "a", "b", "c", "d"].indexOf(e.key.toLowerCase()) % 4;
      if (n >= 0 && options[n]) select(options[n].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const [from, to] = progressSpan;
  const local = (index + (checked ? 1 : 0)) / words.length;
  const answerText = faToEn ? (
    word.en
  ) : settings.scriptOnly ? (
    <Fa className="text-base">{word.fa}</Fa>
  ) : (
    <>
      {word.tr} · <Fa className="text-base">{word.fa}</Fa>
    </>
  );

  return (
    <div>
      <SessionHeader
        exitHref={exitHref}
        progress={from + (to - from) * local}
        right={
          <span className="text-sm font-extrabold tabular-nums text-muted">
            {index + 1}/{words.length}
          </span>
        }
      />
      {toolbar && <div className="-mt-3 mb-5 flex justify-center">{toolbar}</div>}

      <h2 className="text-2xl font-extrabold">{faToEn ? "Select the correct meaning" : "How do you say this?"}</h2>

      <div className="my-8 flex items-center justify-center gap-4 text-center">
        {faToEn ? (
          <>
            <AudioButtons text={word.fa} big compact />
            <FaWord word={word} settings={settings} size="xl" />
          </>
        ) : (
          <p className="text-3xl font-extrabold">{word.en}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o, i) => {
          const isAnswer = o.id === word.id;
          const state: OptionState = checked
            ? isAnswer
              ? "correct"
              : o.id === selected
                ? "wrong"
                : "idle"
            : o.id === selected
              ? "selected"
              : "idle";
          return (
            <button
              key={o.id}
              type="button"
              data-option=""
              data-state={state === "idle" ? undefined : state}
              aria-pressed={o.id === selected}
              disabled={checked}
              onClick={() => select(o.id)}
              className={cx(
                "tile flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start",
                state === "wrong" && "animate-shake",
                checked && state === "idle" && "opacity-50",
              )}
            >
              <span className={cx("grid size-8 shrink-0 place-items-center rounded-lg border-2 text-sm font-extrabold", BADGE[state])}>
                {state === "correct" ? (
                  <Check className="size-4" strokeWidth={3} aria-label="Correct" />
                ) : state === "wrong" ? (
                  <X className="size-4" strokeWidth={3} aria-label="Wrong" />
                ) : (
                  i + 1
                )}
              </span>
              {faToEn ? (
                <span className="text-lg font-bold">{o.en}</span>
              ) : settings.scriptOnly || settings.script === "farsi" ? (
                <Fa className="text-xl font-bold">{o.fa}</Fa>
              ) : (
                <span className="text-lg font-bold">
                  {o.tr} <Fa className="ms-2 font-semibold opacity-70">{o.fa}</Fa>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <FeedbackSheet
        state={checked ? (gotIt ? "correct" : "wrong") : "idle"}
        title={gotIt ? "Nicely done!" : "Correct answer:"}
        detail={gotIt ? undefined : <span className="text-base font-bold">{answerText}</span>}
        onContinue={next}
      >
        <p className="hidden text-sm font-semibold text-muted sm:block">Press 1–4 to pick, Enter to check</p>
        <button type="button" className="btn-primary btn-lg w-full sm:w-auto sm:min-w-40" disabled={!selected} onClick={check}>
          Check
        </button>
      </FeedbackSheet>
    </div>
  );
}
