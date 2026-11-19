import { describe, expect, it } from "vitest";
import { GRAMMAR_BY_ID } from "./grammar";
import { READINGS } from "./readings";

describe("reading lessons", () => {
  it("are numbered in order with unique ids", () => {
    expect(new Set(READINGS.map((r) => r.id)).size).toBe(READINGS.length);
    READINGS.forEach((r, i) => expect(r.number).toBe(i + 1));
  });
  it("link to grammar that exists, with examples from the text", () => {
    for (const r of READINGS) {
      expect(GRAMMAR_BY_ID[r.grammar.conceptId], r.id).toBeDefined();
      const text = r.text.flat().map((s) => s.fa).join(" ");
      for (const ex of r.grammar.examples) {
        const core = ex.replace(/[.،!؟]/g, "").split(" ").slice(-2).join(" ");
        expect(text.includes(core), `${r.id}: ${ex}`).toBe(true);
      }
    }
  });
  it("have answerable questions and every key word in the text", () => {
    for (const r of READINGS) {
      for (const q of r.check) expect(q.options, q.prompt).toContain(q.answer);
      const text = r.text.flat().map((s) => s.fa).join(" ");
      for (const w of r.keyWords) {
        const stem = w.fa.split(" ")[0].replace(/(ن|کردن|ماندن|شدن|گرفتن)$/, "");
        expect(text.includes(stem), `${r.id}: ${w.fa}`).toBe(true);
      }
    }
  });
  it("keep Persian and English filled in", () => {
    for (const r of READINGS) {
      for (const s of r.text.flat()) expect(s.fa && s.en).toBeTruthy();
      for (const s of r.spoken) expect(s.fa && s.spoken && s.en).toBeTruthy();
    }
  });
});
