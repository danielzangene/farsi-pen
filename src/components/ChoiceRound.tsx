"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Word } from "@/content/words";
import { choiceOptions } from "@/lib/quiz";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, FaWord, ProgressBar } from "./ui";

/** Round 1 — Recognition: 4-option multiple choice, one pass. */
export function ChoiceRound({ words, onDone }: { words: Word[]; onDone: (correctIds: string[]) => void }) {
  const { settings } = useProgress();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState<string[]>([]);
  const word = words[index];
  const options = useMemo(() => choiceOptions(word, words), [word, words]);
  const faToEn = settings.direction === "fa-en";

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === word.id) setCorrect((c) => [...c, word.id]);
  };

  const next = () => {
    if (index + 1 < words.length) {
      setIndex(index + 1);
      setPicked(null);
    } else onDone(correct);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Focused buttons handle Enter themselves; don't advance twice.
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
      if (picked && e.key === "Enter") next();
      const n = ["1", "2", "3", "4", "a", "b", "c", "d"].indexOf(e.key.toLowerCase()) % 4;
      if (!picked && n >= 0 && options[n]) pick(options[n].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
        <span className="whitespace-nowrap">Round 1 · Recognition</span>
        <ProgressBar value={index / words.length} className="flex-1" />
        <span>
          {index + 1}/{words.length}
        </span>
      </div>
      <div className="card flex flex-col items-center gap-2 p-6 text-center sm:p-8">
        <p className="text-sm text-muted">{faToEn ? "What does this mean?" : "How do you say this in Farsi?"}</p>
        {faToEn ? (
          <>
            <FaWord word={word} settings={settings} size="xl" />
            <AudioButtons text={word.fa} compact />
          </>
        ) : (
          <p className="font-display text-3xl font-semibold">{word.en}</p>
        )}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => {
          const isAnswer = o.id === word.id;
          const state = picked ? (isAnswer ? "right" : o.id === picked ? "wrong" : "idle") : "idle";
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => pick(o.id)}
              className={cx(
                "card flex min-h-14 items-center gap-3 px-4 py-3 text-left transition",
                !picked && "hover:border-firuze hover:bg-firuze-soft/40",
                state === "right" && "!border-firuze !bg-firuze-soft",
                state === "wrong" && "!border-anar !bg-anar-soft",
              )}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper text-xs font-bold text-muted">
                {state === "right" ? <Check className="size-4 text-firuze" /> : state === "wrong" ? <X className="size-4 text-anar" /> : "ABCD"[i]}
              </span>
              {faToEn ? (
                <span className="font-medium">{o.en}</span>
              ) : settings.scriptOnly || settings.script === "farsi" ? (
                <Fa className="text-xl">{o.fa}</Fa>
              ) : (
                <span className="font-medium">
                  {o.tr} <Fa className="ms-2 text-muted">{o.fa}</Fa>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-4 flex justify-end">
          <button type="button" className="btn-primary" onClick={next} autoFocus>
            Continue <kbd className="rounded bg-white/20 px-1.5 text-[10px]">Enter</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
