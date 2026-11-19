import { describe, expect, it } from "vitest";
import { alignChars, analyzeSpoken, joinedText } from "./phonics";

describe("alignChars", () => {
  it("marks matches, substitutions and deletions", () => {
    expect(alignChars("abc", "abc")).toEqual(["match", "match", "match"]);
    expect(alignChars("abc", "axc")).toEqual(["match", "sub", "match"]);
    expect(alignChars("abc", "ac")).toEqual(["match", "del", "match"]);
  });
});

describe("analyzeSpoken", () => {
  it("marks every letter good for a perfect take", () => {
    const r = analyzeSpoken(["سلام"], "سلام");
    expect(r.letters.map((l) => l.status)).toEqual(["good", "good", "good", "good"]);
    expect(r.accuracy).toBe(100);
    expect(r.completeness).toBe(100);
  });
  it("treats sound-alike spellings as correct", () => {
    expect(analyzeSpoken(["صلام"], "سلام").accuracy).toBe(100);
  });
  it("finds the sound that was off", () => {
    const r = analyzeSpoken(["کدا حافظ"], "خدا حافظ");
    expect(r.letters[0].status).toBe("off");
    expect(r.letters[0].sound).toBe("kh");
    expect(r.letters.filter((l) => l.status === "good").length).toBe(6);
  });
  it("calls a letter close when only a weaker guess had it", () => {
    const r = analyzeSpoken(["کدا", "خدر"], "خدا");
    expect(r.heard).toBe("کدا");
    expect(r.letters[0].status).toBe("close");
    // …and a perfect guess anywhere in the list wins outright.
    expect(analyzeSpoken(["کدا", "خدا"], "خدا").accuracy).toBe(100);
  });
  it("marks dropped sounds missed and lowers completeness", () => {
    const r = analyzeSpoken(["مرس"], "مرسی");
    expect(r.letters[3].status).toBe("missed");
    expect(r.completeness).toBe(75);
  });
  it("labels vowels by position", () => {
    const r = analyzeSpoken(["او"], "آب");
    expect(r.letters[0].label).toBe("â");
    const w = analyzeSpoken([], "وقت");
    expect(w.letters[0].sound).toBe("v");
    expect(analyzeSpoken([], "خوب").letters[1].sound).toBe("u");
    expect(analyzeSpoken([], "یک").letters[0].sound).toBe("y");
    expect(analyzeSpoken([], "مرسی").letters[3].sound).toBe("i");
    expect(analyzeSpoken([], "خانه").letters[3].sound).toBe("e");
  });
  it("keeps spaces and joins letters with zero-width joiners", () => {
    const r = analyzeSpoken(["خدا حافظ"], "خدا حافظ");
    expect(r.letters[3].space).toBe(true);
    expect(joinedText(r.letters[0])).toBe("خ‍");
    expect(joinedText(r.letters[1])).toBe("‍د");
    expect(joinedText(r.letters[2])).toBe("ا"); // د doesn't join forward
  });
  it("marks nothing heard as missed", () => {
    const r = analyzeSpoken([], "نان");
    expect(r.accuracy).toBe(0);
    expect(r.letters.every((l) => l.status === "missed")).toBe(true);
  });
});

import { SOUND_BY_ID, SOUNDS } from "@/content/sounds";

describe("sound guide", () => {
  it("covers every sound the analyser can produce", () => {
    const text = "آب اسب پدر توت ثانیه جوان چای حال خوب دو ذرت روز زن ژاپن سال شب صبح ضرب طلا ظرف ساعت غذا فردا قهوه کتاب گل لب مادر نان وقت یک مرسی خانه تو";
    for (const l of analyzeSpoken([], text).letters) if (l.sound) expect(SOUND_BY_ID[l.sound], l.sound).toBeDefined();
  });
  it("gives hard sounds a tip, a mouth position and examples", () => {
    for (const s of SOUNDS.filter((x) => x.hard)) {
      expect(s.tip, s.id).toBeTruthy();
      expect(s.mouth, s.id).toBeDefined();
      expect(s.examples.length, s.id).toBeGreaterThan(0);
    }
  });
});

describe("final he", () => {
  it("is h after a long vowel letter", () => {
    expect(analyzeSpoken([], "ماه").letters[2].sound).toBe("h");
    expect(analyzeSpoken([], "کوه").letters[2].sound).toBe("h");
  });
});

describe("punctuation", () => {
  it("keeps the space after a full stop", () => {
    const text = analyzeSpoken([], "سلام. یه نون").letters.map((l) => l.text).join("");
    expect(text).toBe("سلام. یه نون");
  });
});
