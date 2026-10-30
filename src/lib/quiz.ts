import { WORDS, type Word } from "@/content/words";
import { normalize, checkAnswer, type CheckResult } from "./answer";
import type { Direction } from "./store";
import { shuffle } from "./util";

function meanings(w: Word): string[] {
  return [w.en, ...(w.alt ?? [])];
}

/**
 * Accepted answers for a word. EN→FA also accepts any other word that shares
 * the English meaning (mersi and mamnun both mean "thanks").
 */
export function acceptedAnswers(word: Word, direction: Direction): string[] {
  if (direction === "fa-en") return meanings(word);
  const keys = new Set(meanings(word).map((m) => normalize(m, "en")));
  const sameMeaning = WORDS.filter((w) => w.id === word.id || keys.has(normalize(w.en, "en")));
  return sameMeaning.flatMap((w) => [w.fa, w.tr, ...(w.altTr ?? [])]);
}

function otherAnswers(word: Word, direction: Direction): string[] {
  const own = new Set(acceptedAnswers(word, direction).map((a) => normalize(a)));
  return WORDS.filter((w) => w.id !== word.id)
    .flatMap((w) => (direction === "fa-en" ? meanings(w) : [w.fa, w.tr]))
    .filter((a) => !own.has(normalize(a)));
}

export function checkWord(word: Word, input: string, direction: Direction): CheckResult {
  return checkAnswer(input, acceptedAnswers(word, direction), {
    lang: direction === "fa-en" ? "en" : "fa",
    reject: otherAnswers(word, direction),
  });
}

/**
 * Four options: the answer plus distractors from the same lesson first, then
 * from the rest of the vocabulary. Never two options with the same meaning.
 */
export function choiceOptions(word: Word, pool: Word[]): Word[] {
  const seen = new Set([normalize(word.en, "en"), word.fa]);
  const picks: Word[] = [];
  for (const w of [...shuffle(pool), ...shuffle(WORDS)]) {
    if (picks.length === 3) break;
    const key = normalize(w.en, "en");
    if (seen.has(key) || seen.has(w.fa)) continue;
    seen.add(key);
    seen.add(w.fa);
    picks.push(w);
  }
  return shuffle([word, ...picks]);
}
