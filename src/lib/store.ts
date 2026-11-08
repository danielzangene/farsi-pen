"use client";
// Guest-mode progress store (spec §4.1: "guest mode with local progress").
// Everything lives in localStorage under one key; when accounts arrive this
// object is what gets merged into Supabase on sign-up.

import { useSyncExternalStore } from "react";
import { LESSONS } from "@/content/lessons";
import { LETTERS } from "@/content/alphabet";
import { GRAMMAR } from "@/content/grammar";
import { dayKey, earnedBadges, extendStreak, liveStreak, XP, type BadgeStats, type Streak } from "./gamification";
import { STORAGE_KEY } from "./util";
import { gradeFor, isLearned, review, type StoredCard } from "./srs";
import { DEFAULT_PIPER_VOICE, type PiperVoiceId } from "./tts";
import type { EnginePref } from "./stt";
import { applyEvidence, isMastered, type SkillRecord } from "./mastery";
import type { Evidence, MissionStatus } from "./missions";

export type Direction = "fa-en" | "en-fa";
export type Outcome = "good" | "hard" | "again";
export type Theme = "system" | "light" | "dark";

export interface Settings {
  name: string;
  dailyGoal: number;
  direction: Direction;
  /** Which writing leads on cards: transliteration or Persian script. */
  script: "latin" | "farsi";
  /** Hide transliteration entirely (reading practice). */
  scriptOnly: boolean;
  showKeyboard: boolean;
  checklistHidden: boolean;
  /** Dark by default; "system" follows the device setting. */
  theme: Theme;
  /** Natural (Piper) Persian voice used once downloaded. */
  voice: PiperVoiceId;
  /** Speech recognition engine for speaking practice. */
  speechEngine: EnginePref;
  /** Onboarding answers: why they're learning and whether they read Persian script. */
  goal: Goal | null;
  reads: Reads | null;
  onboarded: boolean;
  /** Last day (dayKey) we suggested backing up progress, so it's asked once. */
  backupNudge: string | null;
}

export type Goal = "travel" | "family" | "heritage" | "curious";
export type Reads = "yes" | "some" | "no";
/** Kinds of practice logged per day, for the Today plan. */
export type ActivityKind = "review" | "lesson" | "mission" | "grammar" | "alphabet" | "speak";

export interface ProgressState {
  version: 1;
  xp: number;
  lessons: Record<string, { best: number; attempts: number; completedAt?: string }>;
  cards: Record<string, StoredCard>;
  bookmarks: string[];
  hidden: string[];
  daily: Record<string, { words: number; xp: number }>;
  streak: Streak;
  grammar: Record<string, { best: number; passed: boolean }>;
  traced: Record<string, number>;
  practiceSessions: number;
  earnedBadges: string[];
  settings: Settings;
  /** Real-world skills (missions) and their mastery state. */
  skills: Record<string, SkillRecord>;
  missions: Record<string, MissionRecord>;
  /** What was practised each day (dayKey → kinds), last 30 days. */
  activity: Record<string, ActivityKind[]>;
  /** Words the learner added from the dictionary (id → entry). */
  customWords: Record<string, CustomWord>;
  /** How each Persian sound has gone when speaking (sound id → running score). */
  soundStats: Record<string, SoundStat>;
}

export interface SoundStat {
  /** Times scored. */
  n: number;
  /** Running score 0–100, recent takes weigh most. */
  avg: number;
  last: string;
}

export interface CustomWord {
  fa: string;
  en: string;
  tr?: string;
  /** [english, persian] */
  example?: [string, string];
  addedAt: string;
}

export interface MissionRecord {
  status: MissionStatus;
  attempts: number;
  best: number;
  lastPlayed: string;
  masteredAt?: string;
}

const KEY = STORAGE_KEY;

export const DEFAULT_STATE: ProgressState = {
  version: 1,
  xp: 0,
  lessons: {},
  cards: {},
  bookmarks: [],
  hidden: [],
  daily: {},
  streak: { current: 0, record: 0, lastDay: null },
  grammar: {},
  traced: {},
  practiceSessions: 0,
  earnedBadges: [],
  skills: {},
  missions: {},
  activity: {},
  customWords: {},
  soundStats: {},
  settings: {
    name: "",
    dailyGoal: 10,
    direction: "fa-en",
    script: "latin",
    scriptOnly: false,
    showKeyboard: true,
    checklistHidden: false,
    theme: "dark",
    voice: DEFAULT_PIPER_VOICE,
    speechEngine: "auto",
    goal: null,
    reads: null,
    onboarded: false,
    backupNudge: null,
  },
};

let state: ProgressState | null = null;
const listeners = new Set<() => void>();

function load(): ProgressState {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<ProgressState>) : {};
    state = { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...parsed.settings } };
  } catch {
    state = DEFAULT_STATE;
  }
  return state;
}

function save(next: ProgressState) {
  state = next;
  applyTheme(next.settings.theme);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage full: progress stays in memory for this visit.
  }
  listeners.forEach((l) => l());
}

/** Set <html data-theme>; "system" removes it so the CSS media query decides. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
}

function update(fn: (s: ProgressState) => ProgressState) {
  save(withBadges(fn(load())));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Progress state; the defaults during server render and hydration. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, load, () => DEFAULT_STATE);
}

/** True once the client has loaded saved progress (false during prerender). */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

// ── Derived values ─────────────────────────────────────────────────────────

export function wordsLearned(s: ProgressState): number {
  return Object.values(s.cards).filter(isLearned).length;
}

export function today(s: ProgressState) {
  return s.daily[dayKey()] ?? { words: 0, xp: 0 };
}

export function currentStreak(s: ProgressState): number {
  return liveStreak(s.streak, dayKey());
}

export function badgeStats(s: ProgressState): BadgeStats {
  return {
    lessonsDone: LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length,
    totalLessons: LESSONS.length,
    level1Done: LESSONS.filter((l) => l.level === 1 && s.lessons[l.id]?.completedAt).length,
    level1Total: LESSONS.filter((l) => l.level === 1).length,
    wordsLearned: wordsLearned(s),
    recordStreak: s.streak.record,
    xp: s.xp,
    lettersTraced: LETTERS.filter((l) => (s.traced[l.id] ?? 0) >= TRACE_PASS).length,
    totalLetters: LETTERS.length,
    grammarDone: GRAMMAR.filter((g) => s.grammar[g.id]?.passed).length,
    totalGrammar: GRAMMAR.length,
  };
}

export const TRACE_PASS = 60;

function withBadges(s: ProgressState): ProgressState {
  const earned = earnedBadges(badgeStats(s));
  // Badges are kept once earned, even if a streak later resets.
  const merged = Array.from(new Set([...s.earnedBadges, ...earned]));
  return merged.length === s.earnedBadges.length ? s : { ...s, earnedBadges: merged };
}

// ── Actions ────────────────────────────────────────────────────────────────

/** Logs a kind of practice for today (kept for 30 days). */
function logActivity(s: ProgressState, kind: ActivityKind): ProgressState {
  const key = dayKey();
  const day = s.activity?.[key] ?? [];
  if (day.includes(kind)) return s;
  const keep = Object.keys(s.activity ?? {}).sort().slice(-29);
  const activity: Record<string, ActivityKind[]> = {};
  for (const k of keep) activity[k] = s.activity[k];
  activity[key] = [...day, kind];
  return { ...s, activity };
}

export function markActivity(kind: ActivityKind) {
  update((s) => logActivity(s, kind));
}

function addActivity(s: ProgressState, words: number, xp: number): ProgressState {
  const key = dayKey();
  const day = s.daily[key] ?? { words: 0, xp: 0 };
  const nextDay = { words: day.words + words, xp: day.xp + xp };
  const goalMet = nextDay.words >= s.settings.dailyGoal;
  return {
    ...s,
    xp: s.xp + xp,
    daily: { ...s.daily, [key]: nextDay },
    streak: goalMet ? extendStreak(s.streak, key) : s.streak,
  };
}

function reviewAll(cards: Record<string, StoredCard>, outcomes: Record<string, Outcome>) {
  const next = { ...cards };
  for (const [id, o] of Object.entries(outcomes)) next[id] = review(cards[id], gradeFor(o));
  return next;
}

export interface SessionSummary {
  correct: number;
  total: number;
  outcomes: Record<string, Outcome>;
}

/** Returns the XP awarded. */
export function completeLesson(lessonId: string, r: SessionSummary): number {
  const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
  const xp = r.correct * XP.perCorrect + XP.lessonComplete + (pct === 100 ? XP.perfectBonus : 0);
  update((s) => {
    const prev = s.lessons[lessonId];
    const next: ProgressState = {
      ...s,
      cards: reviewAll(s.cards, r.outcomes),
      lessons: {
        ...s.lessons,
        [lessonId]: {
          best: Math.max(prev?.best ?? 0, pct),
          attempts: (prev?.attempts ?? 0) + 1,
          completedAt: prev?.completedAt ?? new Date().toISOString(),
        },
      },
    };
    return logActivity(addActivity(next, Object.keys(r.outcomes).length, xp), "lesson");
  });
  return xp;
}

export function completePractice(r: SessionSummary): number {
  const xp = r.correct * XP.practicePerCorrect;
  update((s) =>
    logActivity(
      addActivity(
        { ...s, cards: reviewAll(s.cards, r.outcomes), practiceSessions: s.practiceSessions + 1 },
        Object.keys(r.outcomes).length,
        xp,
      ),
      "review",
    ),
  );
  return xp;
}

/**
 * Records a mission session. Every answer is evidence for its skill; XP is
 * given only when a skill becomes mastered for the first time, so replaying
 * an easy mission earns nothing. When the whole mission is mastered its
 * vocabulary joins spaced review.
 */
export function completeMission(
  missionId: string,
  evidence: Evidence[],
  result: { status: MissionStatus; score: number } | null,
  wordIds: string[] = [],
): number {
  let xp = 0;
  update((s) => {
    const now = new Date();
    const skills = { ...s.skills };
    for (const e of evidence) {
      const before = skills[e.skill];
      const after = applyEvidence(before, e.context, e.ok, now);
      if (!before?.masteredAt && after.state === "mastered") xp += XP.skillMastered;
      skills[e.skill] = after;
    }
    let next: ProgressState = { ...s, skills };
    if (result) {
      const prev = s.missions[missionId];
      const mastered = result.status === "mastered";
      next.missions = {
        ...s.missions,
        [missionId]: {
          status: result.status,
          attempts: (prev?.attempts ?? 0) + 1,
          best: Math.max(prev?.best ?? 0, result.score),
          lastPlayed: now.toISOString(),
          masteredAt: prev?.masteredAt ?? (mastered ? now.toISOString() : undefined),
        },
      };
      if (mastered && !prev?.masteredAt) {
        xp += XP.missionMastered;
        const cards = { ...next.cards };
        for (const id of wordIds) if (!cards[id]) cards[id] = review(undefined, gradeFor("good"), now);
        next = { ...next, cards };
      }
    }
    return logActivity(addActivity(next, 0, xp), "mission");
  });
  return xp;
}

export function skillMastered(s: ProgressState, skillId: string): boolean {
  return isMastered(s.skills[skillId]);
}

/**
 * Flashcard session: every first rating updates the word's FSRS card. XP only
 * for words that were due or new, so re-running a deck can't farm points.
 */
export function completeFlashcards(outcomes: Record<string, Outcome>, eligible: Set<string>): number {
  const xp = Object.entries(outcomes).filter(([id, o]) => o !== "again" && eligible.has(id)).length * XP.practicePerCorrect;
  update((s) => logActivity(addActivity({ ...s, cards: reviewAll(s.cards, outcomes) }, Object.keys(outcomes).filter((id) => eligible.has(id)).length, xp), "review"));
  return xp;
}

/** Speaking practice: XP per word said right (or nearly); counts toward the daily goal. */
export function completeSpeaking(r: SessionSummary): number {
  const xp = r.correct * XP.speakPerCorrect;
  update((s) => logActivity(addActivity(s, Object.keys(r.outcomes).length, xp), "speak"));
  return xp;
}

export function completeGrammar(id: string, correct: number, total: number): number {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const xp = correct * XP.grammarPerCorrect;
  update((s) => {
    const prev = s.grammar[id];
    return logActivity(
      addActivity({ ...s, grammar: { ...s.grammar, [id]: { best: Math.max(prev?.best ?? 0, pct), passed: !!prev?.passed || pct >= 80 } } }, 0, xp),
      "grammar",
    );
  });
  return xp;
}

/** Records a tracing score (0–100); XP the first time a letter passes. */
export function recordTrace(letterId: string, score: number): number {
  let xp = 0;
  update((s) => {
    const prev = s.traced[letterId] ?? 0;
    xp = prev < TRACE_PASS && score >= TRACE_PASS ? XP.tracePass : 0;
    return logActivity(addActivity({ ...s, traced: { ...s.traced, [letterId]: Math.max(prev, score) } }, 0, xp), "alphabet");
  });
  return xp;
}

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/** Folds one spoken take's per-sound scores into the learner's sound stats. */
export function recordSounds(scores: { sound: string; score: number }[]) {
  if (!scores.length) return;
  update((s) => {
    const stats = { ...(s.soundStats ?? {}) };
    const at = dayKey();
    // One update per sound per take (average its letters).
    const take = new Map<string, number[]>();
    for (const { sound, score } of scores) take.set(sound, [...(take.get(sound) ?? []), score]);
    take.forEach((xs, id) => {
      const score = xs.reduce((a, b) => a + b, 0) / xs.length;
      const prev = stats[id];
      stats[id] = prev ? { n: prev.n + 1, avg: Math.round(prev.avg * 0.7 + score * 0.3), last: at } : { n: 1, avg: Math.round(score), last: at };
    });
    return { ...s, soundStats: stats };
  });
}

/** Adds a dictionary word to My cards (and returns its id). */
export function addCustomWord(w: Omit<CustomWord, "addedAt">): string {
  const id = `custom:${w.fa.replace(/\s+/g, "-")}`;
  update((s) => ({
    ...s,
    customWords: { ...s.customWords, [id]: { ...w, addedAt: s.customWords?.[id]?.addedAt ?? new Date().toISOString() } },
    bookmarks: s.bookmarks.includes(id) ? s.bookmarks : [...s.bookmarks, id],
  }));
  return id;
}

export function removeCustomWord(id: string) {
  update((s) => {
    const customWords = { ...s.customWords };
    delete customWords[id];
    return { ...s, customWords, bookmarks: s.bookmarks.filter((b) => b !== id) };
  });
}

export function toggleBookmark(wordId: string) {
  update((s) => ({ ...s, bookmarks: toggle(s.bookmarks, wordId) }));
}

export function toggleHidden(wordId: string) {
  update((s) => ({ ...s, hidden: toggle(s.hidden, wordId) }));
}

/** Current settings outside React (falls back to defaults on the server). */
export function getSettings(): Settings {
  return typeof window === "undefined" ? DEFAULT_STATE.settings : load().settings;
}

export function updateSettings(patch: Partial<Settings>) {
  update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

/** The whole progress as a JSON file's contents, for backup or moving devices. */
export function exportProgress(): string {
  return JSON.stringify({ app: "farsi-pen", exportedAt: new Date().toISOString(), progress: load() }, null, 2);
}

/** Replaces progress with an exported file. Returns false if the file isn't a Farsi Pen backup. */
export function importProgress(text: string): boolean {
  try {
    const data = JSON.parse(text) as { app?: string; progress?: Partial<ProgressState> };
    const p = data.app === "farsi-pen" ? data.progress : (data as Partial<ProgressState>);
    if (!p || p.version !== 1 || typeof p.xp !== "number" || typeof p.cards !== "object") return false;
    save(withBadges({ ...DEFAULT_STATE, ...p, settings: { ...DEFAULT_STATE.settings, ...p.settings } } as ProgressState));
    return true;
  } catch {
    return false;
  }
}

export function resetProgress() {
  save({ ...DEFAULT_STATE, settings: load().settings });
}
