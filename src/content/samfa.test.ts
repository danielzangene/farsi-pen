import { describe, expect, it } from "vitest";
import { CONNECTORS, rubricScore, RUBRIC, SAMFA_FACTS, SPEAKING_TASKS, WRITING_TASKS } from "./samfa";

describe("SAMFA content", () => {
  it("adds up to 240 across four skills", () => {
    expect(SAMFA_FACTS.sections).toHaveLength(4);
    expect(SAMFA_FACTS.sections.reduce((n, x) => n + x.points, 0)).toBe(240);
  });
  it("has complete, unique writing and speaking tasks", () => {
    for (const list of [WRITING_TASKS, SPEAKING_TASKS]) {
      expect(new Set(list.map((t) => t.id)).size).toBe(list.length);
      for (const t of list) {
        expect(t.prompt.fa && t.prompt.en).toBeTruthy();
        expect(t.model.length).toBeGreaterThanOrEqual(3);
      }
    }
    expect(CONNECTORS.length).toBeGreaterThanOrEqual(8);
  });
  it("scales the self-check to 60", () => {
    expect(rubricScore({})).toBe(0);
    expect(rubricScore(Object.fromEntries(RUBRIC.map((r) => [r.id, 3])))).toBe(60);
  });
});
