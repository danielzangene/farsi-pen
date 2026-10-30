import { describe, expect, it } from "vitest";
import { checkAnswer, normalize } from "./answer";

describe("normalize", () => {
  it("folds case, punctuation, accents and spaces", () => {
    expect(normalize("  Good Night! ")).toBe("goodnight");
    expect(normalize("mâ irâni hastim")).toBe("mairanihastim");
    expect(normalize("sâ'at-e shesh")).toBe("saateshesh");
  });

  it("maps Arabic letters to Persian and drops ZWNJ", () => {
    expect(normalize("كتاب")).toBe(normalize("کتاب"));
    expect(normalize("علي")).toBe(normalize("علی"));
    expect(normalize("می\u200cبینمت")).toBe(normalize("میبینمت"));
    expect(normalize("می بینمت")).toBe(normalize("میبینمت"));
  });

  it("drops notes in parentheses and leading articles", () => {
    expect(normalize("you (polite)")).toBe("you");
    expect(normalize("an apple")).toBe("apple");
    expect(normalize("the book")).toBe("book");
  });
});

describe("checkAnswer", () => {
  const table: [string, string[], "correct" | "almost" | "wrong"][] = [
    // exact and synonyms
    ["hello", ["hello", "hi"], "correct"],
    ["Hi", ["hello", "hi"], "correct"],
    ["Hello!", ["hello"], "correct"],
    ["I am fine", ["I'm fine"], "correct"],
    ["what is your name", ["what's your name?"], "correct"],
    ["good nigth", ["good night"], "almost"],
    ["godbye", ["goodbye"], "almost"],
    ["grandfahter", ["grandfather"], "almost"],
    // transliteration variants
    ["salam", ["سلام", "salâm"], "correct"],
    ["khodahafez", ["khodâhâfez"], "correct"],
    ["khodahafes", ["khodâhâfez"], "almost"],
    ["mamnoon", ["mamnun"], "wrong"],
    ["ma irani hastim", ["mâ irâni hastim"], "correct"],
    ["to khaste-i", ["to khaste hasti", "to khaste-i"], "correct"],
    // Persian script
    ["سلام", ["سلام", "salâm"], "correct"],
    ["سلم", ["سلام"], "almost"],
    ["كتاب", ["کتاب"], "correct"],
    // short answers must be exact
    ["ne", ["na"], "wrong"],
    ["to", ["do"], "wrong"],
    ["tee", ["tea"], "almost"],
    // wrong
    ["", ["hello"], "wrong"],
    ["goodbye", ["hello", "hi"], "wrong"],
    ["mother", ["father", "dad"], "wrong"],
  ];

  it.each(table)("%j vs %j → %s", (input, accepted, verdict) => {
    expect(checkAnswer(input, accepted).verdict).toBe(verdict);
  });

  it("accepts informal English spellings only for English answers", () => {
    expect(checkAnswer("good nite", ["good night"], { lang: "en" }).verdict).toBe("correct");
    expect(checkAnswer("thx", ["thanks"], { lang: "en" }).verdict).toBe("correct");
    expect(checkAnswer("u", ["you"], { lang: "en" }).verdict).toBe("correct");
    expect(checkAnswer("u", ["ânhâ"]).verdict).toBe("wrong");
  });

  it("does not accept another item's answer as a typo", () => {
    expect(checkAnswer("grandmother", ["grandfather"]).verdict).toBe("almost");
    expect(checkAnswer("grandmother", ["grandfather"], { reject: ["grandmother"] }).verdict).toBe("wrong");
  });

  it("reports the closest accepted answer", () => {
    expect(checkAnswer("thnks", ["thank you", "thanks"]).closest).toBe("thanks");
  });
});
