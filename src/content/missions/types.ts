// Mission content model. A mission is a real-world situation built from a few
// skills (abilities you can prove). Every task is tagged with the skill it
// trains and the stage it belongs to, so the session planner can build a full
// mission, a "prove it" check, or a targeted repair for weak skills — without
// any scenario-specific code. Missions reuse existing words (WORDS) and grammar
// concepts (GRAMMAR) by id.

import type { Register } from "../words";

export type MissionLevel = "A1" | "A2" | "B1" | "B2";

export interface MissionSkill {
  id: string;
  /** "Can do" statement shown to the learner. */
  canDo: string;
}

export interface Line {
  who: "npc" | "you";
  fa: string;
  tr: string;
  en: string;
  register?: Register;
}

export interface Phrase {
  fa: string;
  tr: string;
  en: string;
  skill: string;
  register?: Register;
  note?: string;
}

export interface ComprehensionQuestion {
  prompt: string;
  options: string[];
  answer: string;
}

/**
 * Where a task is used:
 *  practice — guided sentence building (hints, model shown after).
 *  roleplay — answer the character in context (hints available).
 *  check    — final mastery check (no hints, no translation).
 *  recheck  — a second, different check used after targeted repair.
 */
export type TaskStage = "practice" | "roleplay" | "check" | "recheck";

export interface MissionTask {
  skill: string;
  stage: TaskStage;
  /** What the other person says first (role-play and checks). */
  cue?: Omit<Line, "who">;
  /** Instruction in English: what to say. */
  prompt: string;
  /** Required pieces: every group must appear; each group lists alternatives in Finglish and Persian script. */
  must: string[][];
  /** A natural answer, shown after checking. */
  model: { fa: string; tr: string; en: string };
  hint?: string;
}

export interface Mission {
  id: string;
  title: string;
  titleFa: string;
  emoji: string;
  level: MissionLevel;
  /** Area of life, e.g. "Getting around". */
  world: string;
  /** One-line situation shown before starting. */
  scene: string;
  npc: { name: string; role: string };
  skills: MissionSkill[];
  dialogue: Line[];
  questions: ComprehensionQuestion[];
  phrases: Phrase[];
  grammar: {
    points: string[];
    table?: { columns: string[]; rows: string[][] };
    /** Ids of full grammar concepts for "learn more". */
    concepts: string[];
  };
  /** Existing vocabulary used here; added to spaced review when the mission is mastered. */
  wordIds: string[];
  tasks: MissionTask[];
  /** Cultural or usage notes. */
  culture?: string;
}
