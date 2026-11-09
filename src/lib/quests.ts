// Daily quests on Home: three small goals that reset each day. Progress is
// read from what the learner already did today; finishing one lets them
// collect a little bonus XP.

import { dayKey } from "./gamification";
import type { ProgressState } from "./store";

export interface Quest {
  id: string;
  title: string;
  have: number;
  need: number;
  xp: number;
  claimed: boolean;
}

export function dailyQuests(s: Pick<ProgressState, "daily" | "activity">, now = new Date()): Quest[] {
  const key = dayKey(now);
  const day = s.daily[key] ?? { words: 0, xp: 0 };
  const claimed = new Set(day.quests ?? []);
  const sessions = s.activity?.[key]?.length ?? 0;
  const q = (id: string, title: string, have: number, need: number, xp: number): Quest => ({ id, title, have: Math.min(have, need), need, xp, claimed: claimed.has(id) });
  // Bonus XP from quests doesn't count towards the XP quest itself.
  const questXp = [...claimed].reduce((n, id) => n + (id === "practice" ? 5 : id === "xp" ? 10 : id === "speak" ? 10 : 0), 0);
  return [
    q("practice", "Finish a practice session", sessions, 1, 5),
    q("xp", "Earn 40 XP", day.xp - questXp, 40, 10),
    q("speak", "Say 10 things out loud", day.spoken ?? 0, 10, 10),
  ];
}

/** The last seven days, oldest first, with what happened on each. */
export function lastWeek(s: Pick<ProgressState, "daily" | "activity" | "settings">, now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const key = dayKey(d);
    const day = s.daily[key];
    const practised = (s.activity?.[key]?.length ?? 0) > 0 || (day?.xp ?? 0) > 0;
    return {
      key,
      label: d.toLocaleDateString("en", { weekday: "narrow" }),
      today: i === 6,
      goal: (day?.words ?? 0) >= s.settings.dailyGoal,
      practised,
      xp: day?.xp ?? 0,
    };
  });
}
