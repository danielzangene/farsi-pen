import { describe, expect, it } from "vitest";
import { applyEvidence, displayState, FIRST_INTERVAL_DAYS } from "./mastery";

const day = (n: number) => new Date(Date.UTC(2026, 0, 1 + n));

describe("skill mastery", () => {
  it("moves up with guided, unguided and check evidence", () => {
    let r = applyEvidence(undefined, "guided", true, day(0));
    expect(r.state).toBe("recognized");
    r = applyEvidence(r, "unguided", true, day(0));
    expect(r.state).toBe("usable");
    r = applyEvidence(r, "check", true, day(0));
    expect(r.state).toBe("mastered");
    expect(r.interval).toBe(FIRST_INTERVAL_DAYS);
  });

  it("can be mastered directly by proving it", () => {
    expect(applyEvidence(undefined, "check", true, day(0)).state).toBe("mastered");
  });

  it("never downgrades on practice mistakes", () => {
    let r = applyEvidence(undefined, "unguided", true, day(0));
    r = applyEvidence(r, "guided", false, day(0));
    expect(r.state).toBe("usable");
    expect(r.wrong).toBe(1);
  });

  it("drops a mastered skill to usable after a failed check", () => {
    let r = applyEvidence(undefined, "check", true, day(0));
    r = applyEvidence(r, "check", false, day(1));
    expect(r.state).toBe("usable");
    expect(r.due).toBe(day(1).toISOString());
  });

  it("fades when the review date passes and grows the interval after each re-check", () => {
    const r = applyEvidence(undefined, "check", true, day(0));
    expect(displayState(r, day(3))).toBe("mastered");
    expect(displayState(r, day(FIRST_INTERVAL_DAYS))).toBe("fading");
    const again = applyEvidence(r, "check", true, day(FIRST_INTERVAL_DAYS));
    expect(again.interval).toBeGreaterThan(FIRST_INTERVAL_DAYS);
  });
});
