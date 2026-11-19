import { describe, expect, it } from "vitest";
import { buildLexicon, isKnown, suggest } from "./spell";

const lex = buildLexicon(["سلام", "کتاب", "خداحافظ", "می‌خورم", "صبح"], ["سلم", "کباب", "خانه", "سبح"]);

describe("spelling suggestions", () => {
  it("knows words and normalises Arabic letters", () => {
    expect(isKnown("كتاب", lex)).toBe(true);
    expect(suggest("سلام", lex)).toEqual([]);
  });

  it("prefers a sound-alike fix over another edit", () => {
    // صلام → سلام (ص/س sound the same) beats any one-letter change
    expect(suggest("صلام", lex)[0]).toEqual({ word: "سلام", cost: 0.4 });
  });

  it("ranks course words above general words at the same cost", () => {
    // سبح is one sound-alike swap from صبح (course word) and is itself a general word, so it's known
    expect(suggest("سبح", lex)).toEqual([]);
    expect(suggest("ثبح", lex)[0].word).toBe("صبح");
  });

  it("fixes a missing half-space cheaply", () => {
    expect(suggest("میخورم", lex)[0]).toEqual({ word: "می‌خورم", cost: 0.3 });
  });

  it("finds words two edits away when one isn't enough", () => {
    expect(suggest("خداحفذ", lex)[0].word).toBe("خداحافظ");
  });

  it("returns nothing for gibberish", () => {
    expect(suggest("ژژژژژ", lex)).toEqual([]);
  });
});
