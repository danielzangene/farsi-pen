import { describe, expect, it } from "vitest";
import { FORM_NAMES, formsOf, LETTERS, letterForms } from "./alphabet";

const ZWJ = "‍";
const byId = (id: string) => LETTERS.find((l) => l.id === id)!;

describe("formsOf", () => {
  it("shows آ only alone and at the start of a word", () => {
    expect(formsOf(byId("alef-madde"))).toEqual(["isolated", "initial"]);
  });

  it("shows ا only alone and at the end of a word", () => {
    expect(formsOf(byId("alef"))).toEqual(["isolated", "final"]);
  });

  it("shows all four forms for other letters", () => {
    expect(formsOf(byId("be"))).toEqual(FORM_NAMES);
  });
});

describe("letterForms", () => {
  it("joins a connecting letter on the right sides", () => {
    const f = letterForms(byId("be"));
    expect([f.isolated, f.initial, f.medial, f.final]).toEqual(["ب", "ب" + ZWJ, ZWJ + "ب" + ZWJ, ZWJ + "ب"]);
  });
});
