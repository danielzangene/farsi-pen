import { describe, expect, it } from "vitest";
import { dayKey } from "./gamification";
import { dayState, journey, monthGrid, soundTrends, xpByDay, xpByWeek } from "./progress";
import { DEFAULT_STATE } from "./store";

const now = new Date(2026, 10, 9, 12); // Monday 9 Nov 2026

describe("progress", () => {
  it("lays a month out Monday-first", () => {
    const g = monthGrid(now);
    expect(g[0].findIndex((d) => d?.getDate() === 1)).toBe(6); // 1 Nov 2026 is a Sunday
    expect(g.flat().filter(Boolean)).toHaveLength(30);
    g.forEach((w) => expect(w).toHaveLength(7));
  });
  it("tells goal days from practice days", () => {
    const s = { ...DEFAULT_STATE, daily: { a: { words: 20, xp: 5 }, b: { words: 1, xp: 3 } } };
    expect(dayState(s, "a")).toBe("goal");
    expect(dayState(s, "b")).toBe("practised");
    expect(dayState(s, "c")).toBe("none");
  });
  it("sums XP by day and by week", () => {
    const daily = { [dayKey(now)]: { words: 0, xp: 10 }, "2026-11-08": { words: 0, xp: 5 }, "2026-11-02": { words: 0, xp: 7 } };
    const days = xpByDay({ daily }, 7, now);
    expect(days[6]).toMatchObject({ value: 10, current: true });
    expect(days[5].value).toBe(5);
    const weeks = xpByWeek({ daily }, 2, now);
    expect(weeks[1].value).toBe(10); // this week: Mon 9 Nov
    expect(weeks[0].value).toBe(12); // 2–8 Nov
  });
  it("tracks how sounds moved", () => {
    const s = { soundStats: { kh: { n: 4, avg: 70, last: "" } }, soundHistory: { "2026-11-01": { kh: 30 }, "2026-11-05": { kh: 55 } } };
    const [t] = soundTrends(s);
    expect(t.points.map((p) => p.value)).toEqual([30, 55]);
    expect(t.change).toBe(40);
  });
  it("summarises the course", () => {
    const j = journey(DEFAULT_STATE);
    expect(j.every((x) => x.have === 0 && x.total > 0)).toBe(true);
  });
});
