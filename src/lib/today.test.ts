import { describe, expect, it } from "vitest";
import { LESSONS } from "@/content/lessons";
import { dayKey } from "./gamification";
import { DEFAULT_STATE, type ProgressState } from "./store";
import { nextStep, planToday } from "./today";
import { newCard } from "./srs";

const now = new Date();
const state = (patch: Partial<ProgressState> = {}, settings: Partial<ProgressState["settings"]> = {}): ProgressState => ({
  ...DEFAULT_STATE,
  ...patch,
  settings: { ...DEFAULT_STATE.settings, ...settings },
});

describe("today plan", () => {
  it("starts a new learner with a lesson, then a mission", () => {
    const steps = planToday(state(), now);
    expect(steps.map((s) => s.kind)).toEqual(["lesson", "mission"]);
    expect(nextStep(steps)?.href).toBe(`/app/lessons/${LESSONS[0].id}/`);
  });

  it("puts due reviews first", () => {
    const past = new Date(now.getTime() - 2 * 86_400_000);
    const s = state({ cards: { salam: { ...newCard(past), due: past.toISOString() } } });
    expect(planToday(s, now)[0].kind).toBe("review");
  });

  it("teaches letters first to someone who doesn't read yet, even a heritage speaker", () => {
    expect(planToday(state({}, { reads: "no" }), now)[0].kind).toBe("alphabet");
    const heritage = planToday(state({}, { goal: "heritage", reads: "no" }), now);
    expect(heritage.map((s) => s.kind)).toEqual(["alphabet", "mission"]);
  });

  it("leads with missions for travellers and heritage speakers", () => {
    expect(planToday(state({}, { goal: "travel" }), now)[0].kind).toBe("mission");
    const heritage = planToday(state({}, { goal: "heritage", reads: "yes" }), now);
    expect(heritage[0].kind).toBe("mission");
    expect(heritage.map((s) => s.kind)).not.toContain("lesson");
  });

  it("marks steps done from today's activity and ends the day", () => {
    const s = state({ activity: { [dayKey(now)]: ["lesson", "mission"] } });
    const steps = planToday(s, now);
    expect(steps.every((x) => x.done)).toBe(true);
    expect(nextStep(steps)).toBeNull();
  });
});

