// Shared shapes for grammar content. Concepts live in one file per CEFR level
// (a1.ts … b2.ts); src/content/grammar.ts joins them into the course.

export type Exercise =
  | { kind: "choice"; prompt: string; options: string[]; answer: string; hint?: string }
  | { kind: "fill"; prompt: string; translation: string; answers: string[]; hint?: string }
  | { kind: "translate"; prompt: string; answers: string[]; hint?: string };

export type GrammarLevel = "A1" | "A2" | "B1" | "B2";

/** A concept as written in a level file; level, unit and order are added by `unit()`. */
export interface ConceptDraft {
  id: string;
  title: string;
  titleFa: string;
  summary: string;
  intro: string;
  table: { columns: string[]; rows: string[][] };
  keyPoints: string[];
  examples: { fa: string; tr: string; en: string }[];
  exercises: Exercise[];
}

export interface GrammarConcept extends ConceptDraft {
  order: number;
  level: GrammarLevel;
  unit: string;
}

export interface GrammarUnit {
  level: GrammarLevel;
  title: string;
  concepts: ConceptDraft[];
}

export function unit(level: GrammarLevel, title: string, concepts: ConceptDraft[]): GrammarUnit {
  return { level, title, concepts };
}

/** Zero-width non-joiner (half-space), e.g. می‌روم. */
export const ZW = "‌";
