import { describe, expect, it } from "vitest";
import { normalize } from "@/lib/answer";
import { GRAMMAR, GRAMMAR_LEVELS, GRAMMAR_UNITS } from "./grammar";

describe("grammar course", () => {
  it("has unique ids and sequential order", () => {
    const ids = GRAMMAR.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    GRAMMAR.forEach((g, i) => expect(g.order).toBe(i + 1));
  });

  it("covers every level, in order", () => {
    const levels = GRAMMAR_UNITS.map((u) => u.level);
    expect([...new Set(levels)]).toEqual(GRAMMAR_LEVELS.map((l) => l.id));
  });

  for (const g of GRAMMAR) {
    it(`${g.id}: complete and answerable`, () => {
      expect(g.title && g.titleFa && g.summary && g.intro).toBeTruthy();
      expect(g.table.rows.length).toBeGreaterThan(0);
      g.table.rows.forEach((r) => expect(r.length).toBe(g.table.columns.length));
      expect(g.keyPoints.length).toBeGreaterThanOrEqual(3);
      expect(g.examples.length).toBeGreaterThanOrEqual(3);
      expect(g.exercises.length).toBeGreaterThanOrEqual(6);
      for (const ex of g.exercises) {
        if (ex.kind === "choice") {
          expect(ex.options).toContain(ex.answer);
          expect(new Set(ex.options).size).toBe(ex.options.length);
        } else {
          expect(ex.answers.length).toBeGreaterThan(0);
          ex.answers.forEach((a) => expect(normalize(a)).not.toBe(""));
        }
        if (ex.kind === "fill") expect(ex.prompt).toContain("___");
      }
    });
  }
});
