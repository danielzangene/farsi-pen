import { describe, expect, it } from "vitest";
import { CAST, castOf, isLine, playableParts, sceneOfTheDay, SCENES } from "./scenes";

describe("scenes", () => {
  it("have unique ids and episodes in order", () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
    SCENES.forEach((s, i) => expect(s.episode).toBe(i + 1));
  });
  it("only use known characters and complete lines", () => {
    for (const s of SCENES)
      for (const x of s.script)
        if (isLine(x)) {
          expect(CAST[x.who], `${s.id}: ${x.fa}`).toBeDefined();
          expect(x.fa && x.tr && x.en, `${s.id}: ${x.fa}`).toBeTruthy();
          expect(/[a-z]/i.test(x.fa), x.fa).toBe(false);
        }
  });
  it("always lets you play Sara", () => {
    for (const s of SCENES) expect(playableParts(s), s.id).toContain("sara");
    for (const s of SCENES) expect(castOf(s).length).toBeGreaterThan(1);
  });
  it("picks a scene of the day deterministically", () => {
    expect(sceneOfTheDay("2026-11-08").id).toBe(sceneOfTheDay("2026-11-08").id);
    const days = Array.from({ length: 30 }, (_, i) => sceneOfTheDay(`2026-11-${String(i + 1).padStart(2, "0")}`).id);
    expect(new Set(days).size).toBeGreaterThan(3);
  });
});
