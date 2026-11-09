import { describe, expect, it } from "vitest";
import { dayKey } from "./gamification";
import { dailyQuests, lastWeek } from "./quests";
import { DEFAULT_STATE } from "./store";

const now = new Date(2026, 10, 9, 12);
const key = dayKey(now);

describe("daily quests", () => {
  it("start at zero", () => {
    const q = dailyQuests(DEFAULT_STATE, now);
    expect(q.map((x) => x.have)).toEqual([0, 0, 0]);
  });
  it("read today's progress and cap it", () => {
    const s = { ...DEFAULT_STATE, daily: { [key]: { words: 3, xp: 55, spoken: 4 } }, activity: { [key]: ["speak" as const] } };
    const q = dailyQuests(s, now);
    expect(q[0]).toMatchObject({ have: 1, need: 1 });
    expect(q[1]).toMatchObject({ have: 40, need: 40 });
    expect(q[2]).toMatchObject({ have: 4, need: 10 });
  });
  it("don't let quest bonuses complete the XP quest", () => {
    const s = { ...DEFAULT_STATE, daily: { [key]: { words: 0, xp: 35, quests: ["practice"] } } };
    expect(dailyQuests(s, now)[1].have).toBe(30);
    expect(dailyQuests(s, now)[0].claimed).toBe(true);
  });
});

describe("last week", () => {
  it("lists seven days ending today", () => {
    const s = { ...DEFAULT_STATE, daily: { [key]: { words: 99, xp: 10 } } };
    const w = lastWeek(s, now);
    expect(w).toHaveLength(7);
    expect(w[6]).toMatchObject({ key, today: true, goal: true, practised: true });
    expect(w[0].practised).toBe(false);
  });
});
