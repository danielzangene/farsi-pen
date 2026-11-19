// The grammar course: CEFR levels A1 → B2, grouped into units.
// Content lives in src/content/grammar/<level>.ts — original Farsi Pen
// content (DRAFT, pending native review).
import { A1 } from "./grammar/a1";
import { A2 } from "./grammar/a2";
import { B1 } from "./grammar/b1";
import { B2 } from "./grammar/b2";
import type { GrammarConcept, GrammarLevel, GrammarUnit } from "./grammar/types";

export type { Exercise, GrammarConcept, GrammarLevel, GrammarUnit } from "./grammar/types";

export const GRAMMAR_UNITS: GrammarUnit[] = [...A1, ...A2, ...B1, ...B2];

export const GRAMMAR_LEVELS: { id: GrammarLevel; name: string; nameFa: string }[] = [
  { id: "A1", name: "Beginner", nameFa: "مبتدی" },
  { id: "A2", name: "Elementary", nameFa: "مقدماتی" },
  { id: "B1", name: "Intermediate", nameFa: "متوسط" },
  { id: "B2", name: "Upper intermediate", nameFa: "فوق‌متوسط" },
];

export const GRAMMAR: GrammarConcept[] = GRAMMAR_UNITS.flatMap((u) => u.concepts.map((c) => ({ ...c, level: u.level, unit: u.title }))).map(
  (c, i) => ({ ...c, order: i + 1 }),
);

export const GRAMMAR_BY_ID: Record<string, GrammarConcept> = Object.fromEntries(GRAMMAR.map((g) => [g.id, g]));
