import { describe, expect, it } from "vitest";
import { advice, buildRound, levelFrom, levelRank, PER_ROUND, ROUNDS } from "./placement";

const seeded = (seed: number) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

describe("placement", () => {
  it("builds five answerable questions per round", () => {
    for (const r of ROUNDS)
      for (let i = 0; i < 5; i++) {
        const items = buildRound(r, seeded(i + 1));
        expect(items, r).toHaveLength(PER_ROUND);
        for (const it of items) {
          expect(it.options, it.prompt).toContain(it.answer);
          expect(new Set(it.options).size, it.prompt).toBe(it.options.length);
          if (it.kind !== "grammar") expect(it.fa).toBeTruthy();
        }
      }
  });
  it("reports the last round passed", () => {
    expect(levelFrom([])).toBe("A0");
    expect(levelFrom(["A1", "A2"])).toBe("A2");
    expect(levelRank("B1")).toBeGreaterThan(levelRank("A2"));
    expect(advice("B2").href).toBe("/app/reading/");
  });
});
