// Numbers for the Progress page: a month calendar, XP per day and per week,
// how each sound's score has moved, and a summary of the whole course.

import { GRAMMAR } from "@/content/grammar";
import { LESSONS } from "@/content/lessons";
import { MISSIONS } from "@/content/missions";
import { READINGS } from "@/content/readings";
import { SCENES } from "@/content/scenes";
import { HARD_SOUNDS } from "@/content/sounds";
import { WORDS } from "@/content/words";
import { dayKey } from "./gamification";
import { displayState } from "./mastery";
import { PATH_UNITS, stageCount, stagesDone } from "./sound-path";
import { type ProgressState, wordsLearned } from "./store";

export type DayState = "goal" | "practised" | "none";

export function dayState(s: Pick<ProgressState, "daily" | "activity" | "settings">, key: string): DayState {
  const d = s.daily[key];
  if ((d?.words ?? 0) >= s.settings.dailyGoal) return "goal";
  if ((s.activity?.[key]?.length ?? 0) > 0 || (d?.xp ?? 0) > 0) return "practised";
  return "none";
}

/** Weeks (Monday first) of the month containing `month`; days outside the month are null. */
export function monthGrid(month: Date): (Date | null)[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

export interface Bar {
  key: string;
  label: string;
  value: number;
  current: boolean;
}

/** XP for each of the last `n` days, oldest first. */
export function xpByDay(s: Pick<ProgressState, "daily">, n = 7, now = new Date()): Bar[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (n - 1 - i));
    const key = dayKey(d);
    return { key, label: d.toLocaleDateString("en", { weekday: "short" }), value: s.daily[key]?.xp ?? 0, current: i === n - 1 };
  });
}

/** XP for each of the last `n` weeks (Monday to Sunday), oldest first. */
export function xpByWeek(s: Pick<ProgressState, "daily">, n = 8, now = new Date()): Bar[] {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: n }, (_, i) => {
    const start = new Date(monday);
    start.setDate(start.getDate() - 7 * (n - 1 - i));
    let value = 0;
    for (let k = 0; k < 7; k++) {
      const d = new Date(start);
      d.setDate(d.getDate() + k);
      value += s.daily[dayKey(d)]?.xp ?? 0;
    }
    return { key: dayKey(start), label: start.toLocaleDateString("en", { day: "numeric", month: "short" }), value, current: i === n - 1 };
  });
}

/** Each scored sound's history (oldest first) and its change since the first score. */
export function soundTrends(s: Pick<ProgressState, "soundStats" | "soundHistory">) {
  const days = Object.keys(s.soundHistory ?? {}).sort();
  return HARD_SOUNDS.filter((x) => s.soundStats?.[x.id])
    .map((x) => {
      const points = days.filter((d) => s.soundHistory[d]?.[x.id] !== undefined).map((d) => ({ day: d, value: s.soundHistory[d][x.id] }));
      const now = s.soundStats[x.id].avg;
      const first = points[0]?.value ?? now;
      return { sound: x, points, now, change: now - first };
    })
    .sort((a, b) => a.now - b.now);
}

/** The whole course at a glance. */
export function journey(s: ProgressState) {
  const pathStages = PATH_UNITS.reduce((n, u) => n + stageCount(u) + 1, 0);
  const pathDone = PATH_UNITS.reduce((n, u) => n + stagesDone(u, s.soundPath?.[u.id]), 0);
  const skills = MISSIONS.flatMap((m) => m.skills);
  return [
    { id: "words", label: "Words learned", have: wordsLearned(s), total: WORDS.length },
    { id: "lessons", label: "Lessons", have: LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length, total: LESSONS.length },
    { id: "sounds", label: "Sound stages", have: pathDone, total: pathStages },
    { id: "skills", label: "Mission skills mastered", have: skills.filter((k) => displayState(s.skills[k.id]) === "mastered").length, total: skills.length },
    { id: "grammar", label: "Grammar concepts", have: GRAMMAR.filter((g) => s.grammar[g.id]?.passed).length, total: GRAMMAR.length },
    { id: "reading", label: "Reading lessons", have: READINGS.filter((r) => s.readings?.[r.id]).length, total: READINGS.length },
    { id: "scenes", label: "Scenes played", have: SCENES.filter((x) => s.scenes?.[x.id]).length, total: SCENES.length },
  ];
}
