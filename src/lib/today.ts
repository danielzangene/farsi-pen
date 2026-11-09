// The Today plan: one short path through the day — review what's due, learn
// one new thing, use it — shaped by the learner's goal and whether they read
// Persian script. One Continue button walks it; when it's done, the app says so.

import { LETTERS } from "@/content/alphabet";
import { GRAMMAR } from "@/content/grammar";
import { LESSONS } from "@/content/lessons";
import { MISSIONS } from "@/content/missions";
import { SOUND_BY_ID } from "@/content/sounds";
import { buildDeck } from "./flashcards";
import { dayKey } from "./gamification";
import { displayState } from "./mastery";
import { levelRank } from "./placement";
import { pickSounds, soundLevel } from "./sound-workout";
import type { ActivityKind, ProgressState } from "./store";

export interface TodayStep {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  href: string;
  done: boolean;
  emoji: string;
}

const TRACE_PASS = 60;

function nextLetter(s: ProgressState) {
  return LETTERS.find((l) => (s.traced[l.id] ?? 0) < TRACE_PASS);
}

// After a placement test, lessons and grammar below the learner's level are optional.
const below = (s: ProgressState, level: string) => levelRank(level) < levelRank(s.placement?.level);

function nextLesson(s: ProgressState) {
  return LESSONS.find((l) => !s.lessons[l.id]?.completedAt && !below(s, l.cefr));
}

function nextMission(s: ProgressState, now: Date) {
  return MISSIONS.find((m) => m.skills.some((sk) => displayState(s.skills[sk.id], now) !== "mastered"));
}

function nextGrammar(s: ProgressState) {
  return GRAMMAR.find((g) => !s.grammar[g.id]?.passed && !below(s, g.level));
}

/** Builds today's steps (at most three). */
export function planToday(s: ProgressState, now = new Date()): TodayStep[] {
  const done = new Set(s.activity?.[dayKey(now)] ?? []);
  const steps: TodayStep[] = [];
  const goal = s.settings.goal;
  const reads = s.settings.reads;

  // 1. Review: only when something is due (or was reviewed today).
  const deck = buildDeck("today", s, undefined, now);
  const due = deck.ids.filter((id) => s.cards[id]).length;
  if (due > 0 || done.has("review")) {
    steps.push({
      id: "review",
      kind: "review",
      emoji: "🗂️",
      title: due > 0 ? `Review ${due} word${due === 1 ? "" : "s"}` : "Words reviewed",
      detail: "Flashcards, right before you'd forget them",
      href: "/app/words/?start=today",
      done: due === 0 && done.has("review"),
    });
  }

  // 2. Learn one new thing. Not reading yet → letters first.
  const letter = nextLetter(s);
  const lesson = nextLesson(s);
  const grammar = nextGrammar(s);
  if (reads === "no" && letter && !done.has("lesson")) {
    steps.push({ id: "alphabet", kind: "alphabet", emoji: "✍️", title: `Learn the letter ${letter.name}`, detail: `${letter.char} · sounds like ${letter.sound}`, href: "/app/alphabet/", done: done.has("alphabet") });
  } else if (lesson && goal !== "heritage") {
    steps.push({ id: "lesson", kind: "lesson", emoji: lesson.emoji, title: lesson.title, detail: `Lesson ${lesson.order} · ${lesson.wordIds.length} new words`, href: `/app/lessons/${lesson.id}/`, done: done.has("lesson") });
  } else if (grammar) {
    steps.push({ id: "grammar", kind: "grammar", emoji: "🧩", title: grammar.title, detail: `Grammar · ${grammar.level}`, href: `/app/grammar/${grammar.id}/`, done: done.has("grammar") });
  }

  // 3. Use it: a real-world mission (travellers and heritage speakers get it first).
  const mission = nextMission(s, now);
  if (mission) {
    const step: TodayStep = { id: "mission", kind: "mission", emoji: mission.emoji, title: mission.title, detail: `Mission · ${mission.skills[0].canDo}`, href: `/app/missions/${mission.id}/`, done: done.has("mission") };
    // Travellers, and heritage speakers who already read, start with the real-world mission.
    // Someone who can't read yet starts with letters — reading is the gap to close first.
    const missionFirst = reads !== "no" && (goal === "travel" || goal === "heritage");
    if (missionFirst) steps.splice(steps.length && steps[0].kind === "review" ? 1 : 0, 0, step);
    else steps.push(step);
  } else {
    // Once some sounds have been scored, the speaking step aims at the weak ones.
    const weak = pickSounds(s.soundStats).filter((id) => soundLevel(s.soundStats?.[id]) === "weak" || soundLevel(s.soundStats?.[id]) === "ok");
    if (weak.length)
      steps.push({ id: "sounds", kind: "speak", emoji: "🗣️", title: "Sound workout", detail: `Work on ${weak.map((id) => SOUND_BY_ID[id].name).join(", ")}`, href: "/app/sounds/", done: done.has("speak") });
    else steps.push({ id: "speak", kind: "speak", emoji: "🎤", title: "Say your words out loud", detail: "Speaking practice, sound by sound", href: "/app/speak/", done: done.has("speak") });
  }

  return steps.slice(0, 3);
}

/** The step Continue should open, or null when today's plan is done. */
export function nextStep(steps: TodayStep[]): TodayStep | null {
  return steps.find((x) => !x.done) ?? null;
}

/** True when every lesson, mission and grammar concept is finished. */
export function contentFinished(s: ProgressState, now = new Date()): boolean {
  return !nextLesson(s) && !nextMission(s, now) && !nextGrammar(s);
}
