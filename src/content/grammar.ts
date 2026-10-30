// Grammar concepts — original Farsi Pen content (DRAFT, pending native review).
// Translation answers are typed in transliteration; the answer checker ignores
// â vs a, apostrophes and hyphens, so "ma irani hastim" matches "mâ irâni hastim".

export type Exercise =
  | { kind: "choice"; prompt: string; options: string[]; answer: string; hint?: string }
  | { kind: "fill"; prompt: string; translation: string; answers: string[]; hint?: string }
  | { kind: "translate"; prompt: string; answers: string[]; hint?: string };

export interface GrammarConcept {
  id: string;
  order: number;
  title: string;
  titleFa: string;
  summary: string;
  intro: string;
  table: { columns: string[]; rows: string[][] };
  keyPoints: string[];
  examples: { fa: string; tr: string; en: string }[];
  exercises: Exercise[];
}

export const GRAMMAR: GrammarConcept[] = [
  {
    id: "pronouns",
    order: 1,
    title: "Personal pronouns",
    titleFa: "ضمیرهای شخصی",
    summary: "I, you, he/she, we, you (plural/polite), they.",
    intro:
      "Persian has six personal pronouns. There is no grammatical gender, so one word, u, covers both \"he\" and \"she\".",
    table: {
      columns: ["Farsi", "Transliteration", "English"],
      rows: [
        ["من", "man", "I"],
        ["تو", "to", "you (one friend)"],
        ["او", "u", "he / she"],
        ["ما", "mâ", "we"],
        ["شما", "shomâ", "you (plural, or polite)"],
        ["آن\u200cها", "ânhâ", "they"],
      ],
    },
    keyPoints: [
      "u means both he and she — context tells you which.",
      "Use shomâ for one person when you want to be polite: a teacher, a shopkeeper, an older relative.",
      "In everyday speech ânhâ usually sounds like unâ.",
      "Pronouns are often dropped, because the verb ending already shows who is speaking.",
    ],
    examples: [
      { fa: "من دانشجو هستم.", tr: "man dâneshju hastam.", en: "I am a student." },
      { fa: "او معلم است.", tr: "u mo'allem ast.", en: "He / She is a teacher." },
      { fa: "شما ایرانی هستید؟", tr: "shomâ irâni hastid?", en: "Are you Iranian? (polite)" },
    ],
    exercises: [
      { kind: "choice", prompt: "Which pronoun means \"we\"?", options: ["man", "mâ", "shomâ", "ânhâ"], answer: "mâ" },
      { kind: "choice", prompt: "What does u mean?", options: ["he or she", "I", "they", "you"], answer: "he or she" },
      { kind: "fill", prompt: "___ dâneshju hastam.", translation: "I am a student.", answers: ["man"], hint: "hastam ends in -am: it's about me." },
      { kind: "choice", prompt: "You are speaking to your teacher. Which \"you\" do you use?", options: ["to", "shomâ", "u", "man"], answer: "shomâ" },
      { kind: "translate", prompt: "they", answers: ["ânhâ", "unhâ", "unâ"], hint: "ân + hâ" },
      { kind: "fill", prompt: "___ irâni hastid?", translation: "Are you Iranian? (polite)", answers: ["shomâ"], hint: "The ending -id goes with the polite \"you\"." },
    ],
  },
  {
    id: "to-be",
    order: 2,
    title: "\"To be\" in the present",
    titleFa: "فعل بودن",
    summary: "hastam, hasti, ast, hastim, hastid, hastand — and their short endings.",
    intro:
      "\"To be\" comes at the end of the sentence. Each person has a full form (hastam…) and a short ending that attaches to the word before it (-am…).",
    table: {
      columns: ["Person", "Full form", "Short ending", "Example"],
      rows: [
        ["man", "hastam", "-am", "man khaste-am — I am tired"],
        ["to", "hasti", "-i", "to khaste-i — you are tired"],
        ["u", "ast", "-e (spoken)", "u khub ast / u khub-e — he/she is good"],
        ["mâ", "hastim", "-im", "mâ khaste-im — we are tired"],
        ["shomâ", "hastid", "-id", "shomâ khaste-id — you are tired"],
        ["ânhâ", "hastand", "-and", "ânhâ khaste-and — they are tired"],
      ],
    },
    keyPoints: [
      "The verb goes last: subject → description → verb.",
      "Full and short forms mean the same; short forms are more common in speech.",
      "For \"he/she is\", writing uses ast; speech usually uses -e: u khub-e (he/she is good).",
    ],
    examples: [
      { fa: "ما ایرانی هستیم.", tr: "mâ irâni hastim.", en: "We are Iranian." },
      { fa: "تو خسته\u200cای؟", tr: "to khaste-i?", en: "Are you tired?" },
      { fa: "آن\u200cها خوشحال هستند.", tr: "ânhâ khoshhâl hastand.", en: "They are happy." },
    ],
    exercises: [
      { kind: "fill", prompt: "man khoshhâl ___.", translation: "I am happy.", answers: ["hastam"], hint: "Full form for man." },
      { kind: "choice", prompt: "mâ irâni ___. (We are Iranian.)", options: ["hastam", "hastim", "hastid", "ast"], answer: "hastim" },
      { kind: "fill", prompt: "u mo'allem ___.", translation: "He / She is a teacher.", answers: ["ast"], hint: "The written form for u is short — just three letters." },
      { kind: "translate", prompt: "You are tired. (informal)", answers: ["to khaste hasti", "to khaste-i", "khaste hasti", "khaste-i"], hint: "to + khaste + hasti" },
      { kind: "choice", prompt: "How would most people say \"He is good\" in conversation?", options: ["u khub-e", "u khub hastand", "u khub hastam", "u khub-im"], answer: "u khub-e" },
      { kind: "translate", prompt: "We are Iranian.", answers: ["mâ irâni hastim", "irâni hastim", "mâ irâni-im"], hint: "mâ + irâni + hastim" },
    ],
  },
];

export const GRAMMAR_BY_ID: Record<string, GrammarConcept> = Object.fromEntries(GRAMMAR.map((g) => [g.id, g]));
