// Placement test: up to four short rounds (A1, A2, B1, B2) of five
// questions — word meanings, grammar from the course, and listening to a
// recorded sentence. Four right moves you up a round; fewer ends the test.
// The level found tells the Today plan which lessons and grammar to skip.

import { GRAMMAR } from "@/content/grammar";
import { LESSONS } from "@/content/lessons";
import { READINGS } from "@/content/readings";
import { WORD_BY_ID, type Word } from "@/content/words";
import { shuffle } from "./util";

export type PlacementLevel = "A0" | "A1" | "A2" | "B1" | "B2";
export const ROUNDS: Exclude<PlacementLevel, "A0">[] = ["A1", "A2", "B1", "B2"];
export const PASS = 4;
export const PER_ROUND = 5;

export interface PlacementItem {
  kind: "word" | "grammar" | "listen";
  prompt: string;
  /** Persian shown (word) or played (listen). */
  fa?: string;
  options: string[];
  answer: string;
}

const RANK: Record<PlacementLevel, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 };
export const levelRank = (l: PlacementLevel | string | undefined) => RANK[(l ?? "A0") as PlacementLevel] ?? 0;

function lessonWords(levels: number[]): Word[] {
  return LESSONS.filter((l) => levels.includes(l.level))
    .flatMap((l) => l.wordIds)
    .map((id) => WORD_BY_ID[id])
    .filter((w): w is Word => !!w && !/[\s‌]/.test(w.fa));
}

function wordItem(w: Word, pool: Word[], rand: () => number): PlacementItem {
  const others = shuffle(pool.filter((x) => x.en !== w.en), rand).slice(0, 3).map((x) => x.en);
  return { kind: "word", prompt: "What does this mean?", fa: w.fa, options: shuffle([w.en, ...others], rand), answer: w.en };
}

function listenItem(fa: string, en: string, pool: string[], rand: () => number): PlacementItem {
  const others = shuffle(pool.filter((x) => x !== en), rand).slice(0, 3);
  return { kind: "listen", prompt: "Listen. What did they say?", fa, options: shuffle([en, ...others], rand), answer: en };
}

function grammarItems(level: string, n: number, rand: () => number): PlacementItem[] {
  const ex = GRAMMAR.filter((g) => g.level === level).flatMap((g) => g.exercises.filter((e) => e.kind === "choice"));
  return shuffle(ex, rand)
    .slice(0, n)
    .map((e) => (e.kind === "choice" ? { kind: "grammar", prompt: e.prompt, options: shuffle(e.options, rand), answer: e.answer } : null))
    .filter((x): x is PlacementItem => !!x);
}

/** The questions for one round. */
export function buildRound(level: (typeof ROUNDS)[number], rand: () => number = Math.random): PlacementItem[] {
  if (level === "A1" || level === "A2") {
    const pool = lessonWords(level === "A1" ? [1, 2] : [3, 4]);
    const words = shuffle(pool, rand);
    const sentences = words.filter((w) => w.example).map((w) => w.example);
    const s = sentences[0];
    return [
      ...words.slice(0, 2).map((w) => wordItem(w, pool, rand)),
      ...grammarItems(level, 2, rand),
      listenItem(s.fa, s.en, sentences.map((x) => x.en), rand),
    ];
  }
  const lines = READINGS.flatMap((r) => r.text.flat());
  const pick = shuffle(lines, rand);
  return [...grammarItems(level, level === "B1" ? 3 : 4, rand), ...pick.slice(0, level === "B1" ? 2 : 1).map((l) => listenItem(l.fa, l.en, lines.map((x) => x.en), rand))];
}

/** The level reached: the last round passed. */
export function levelFrom(passed: (typeof ROUNDS)[number][]): PlacementLevel {
  return passed.length ? passed[passed.length - 1] : "A0";
}

/** What to do next, for the result screen. */
export function advice(level: PlacementLevel): { title: string; text: string; href: string; cta: string } {
  switch (level) {
    case "A0":
      return { title: "A fresh start", text: "Begin with the first lessons and the alphabet. You'll be holding short conversations sooner than you think.", href: "/app/lessons/", cta: "Start lesson 1" };
    case "A1":
      return { title: "You know the basics", text: "We'll skip nothing yet, but you'll move fast through the first lessons. Missions will put your words to work.", href: "/app/missions/", cta: "Try a mission" };
    case "A2":
      return { title: "You can get by", text: "The first two levels of lessons are now optional. Carry on with Level 3, A2 grammar and the scenes.", href: "/app/scenes/", cta: "Play a scene" };
    case "B1":
      return { title: "You're independent", text: "Lessons and A1–A2 grammar are optional for you. Reading lessons and B1 grammar are your level.", href: "/app/reading/", cta: "Open Reading" };
    default:
      return { title: "You're confident", text: "Go straight to B2 grammar, the reading lessons and the poetry. Lessons and earlier grammar are optional.", href: "/app/reading/", cta: "Open Reading" };
  }
}
