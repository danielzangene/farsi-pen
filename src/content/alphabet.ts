// The 32 letters of the Persian alphabet. Letter forms are produced by the
// browser's text shaping: a zero-width joiner (U+200D) on one or both sides
// makes the letter render in its initial, medial or final form.

export interface Letter {
  id: string;
  char: string;
  name: string;
  sound: string;
  /** Non-connectors never join to the letter after them. */
  connects: boolean;
  /** One of the four letters added for Persian (not in Arabic). */
  persianOnly?: boolean;
  example: { fa: string; tr: string; en: string };
  note?: string;
}

const ZWJ = "\u200d";

export function letterForms(l: Letter) {
  return {
    isolated: l.char,
    initial: l.connects ? l.char + ZWJ : l.char,
    medial: l.connects ? ZWJ + l.char + ZWJ : ZWJ + l.char,
    final: ZWJ + l.char,
  };
}

export const LETTERS: Letter[] = [
  { id: "alef", char: "ا", name: "alef", sound: "â / a", connects: false, example: { fa: "آب", tr: "âb", en: "water" }, note: "With a hat (آ) at the start of a word it says â." },
  { id: "be", char: "ب", name: "be", sound: "b", connects: true, example: { fa: "بابا", tr: "bâbâ", en: "dad" } },
  { id: "pe", char: "پ", name: "pe", sound: "p", connects: true, persianOnly: true, example: { fa: "پدر", tr: "pedar", en: "father" } },
  { id: "te", char: "ت", name: "te", sound: "t", connects: true, example: { fa: "توت", tr: "tut", en: "mulberry" } },
  { id: "se1", char: "ث", name: "se", sound: "s", connects: true, example: { fa: "ثانیه", tr: "sâniye", en: "second" } },
  { id: "jim", char: "ج", name: "jim", sound: "j", connects: true, example: { fa: "جوان", tr: "javân", en: "young" } },
  { id: "che", char: "چ", name: "che", sound: "ch", connects: true, persianOnly: true, example: { fa: "چای", tr: "chây", en: "tea" } },
  { id: "he1", char: "ح", name: "he (jimi)", sound: "h", connects: true, example: { fa: "حال", tr: "hâl", en: "mood, state" } },
  { id: "khe", char: "خ", name: "khe", sound: "kh", connects: true, example: { fa: "خانه", tr: "khâne", en: "house" } },
  { id: "dal", char: "د", name: "dâl", sound: "d", connects: false, example: { fa: "در", tr: "dar", en: "door" } },
  { id: "zal", char: "ذ", name: "zâl", sound: "z", connects: false, example: { fa: "ذرت", tr: "zorrat", en: "corn" } },
  { id: "re", char: "ر", name: "re", sound: "r", connects: false, example: { fa: "روز", tr: "ruz", en: "day" } },
  { id: "ze", char: "ز", name: "ze", sound: "z", connects: false, example: { fa: "زبان", tr: "zabân", en: "language" } },
  { id: "zhe", char: "ژ", name: "zhe", sound: "zh", connects: false, persianOnly: true, example: { fa: "ژاکت", tr: "zhâket", en: "cardigan" } },
  { id: "sin", char: "س", name: "sin", sound: "s", connects: true, example: { fa: "سیب", tr: "sib", en: "apple" } },
  { id: "shin", char: "ش", name: "shin", sound: "sh", connects: true, example: { fa: "شب", tr: "shab", en: "night" } },
  { id: "sad", char: "ص", name: "sâd", sound: "s", connects: true, example: { fa: "صبح", tr: "sobh", en: "morning" } },
  { id: "zad", char: "ض", name: "zâd", sound: "z", connects: true, example: { fa: "ضعیف", tr: "za'if", en: "weak" } },
  { id: "ta", char: "ط", name: "tâ", sound: "t", connects: true, example: { fa: "طلا", tr: "talâ", en: "gold" } },
  { id: "za", char: "ظ", name: "zâ", sound: "z", connects: true, example: { fa: "ظهر", tr: "zohr", en: "noon" } },
  { id: "eyn", char: "ع", name: "eyn", sound: "' (glottal stop)", connects: true, example: { fa: "عسل", tr: "asal", en: "honey" } },
  { id: "gheyn", char: "غ", name: "gheyn", sound: "gh", connects: true, example: { fa: "غذا", tr: "ghazâ", en: "food" } },
  { id: "fe", char: "ف", name: "fe", sound: "f", connects: true, example: { fa: "فردا", tr: "fardâ", en: "tomorrow" } },
  { id: "ghaf", char: "ق", name: "ghâf", sound: "gh", connects: true, example: { fa: "قهوه", tr: "ghahve", en: "coffee" } },
  { id: "kaf", char: "ک", name: "kâf", sound: "k", connects: true, example: { fa: "کتاب", tr: "ketâb", en: "book" } },
  { id: "gaf", char: "گ", name: "gâf", sound: "g", connects: true, persianOnly: true, example: { fa: "گل", tr: "gol", en: "flower" } },
  { id: "lam", char: "ل", name: "lâm", sound: "l", connects: true, example: { fa: "لب", tr: "lab", en: "lip" } },
  { id: "mim", char: "م", name: "mim", sound: "m", connects: true, example: { fa: "مادر", tr: "mâdar", en: "mother" } },
  { id: "nun", char: "ن", name: "nun", sound: "n", connects: true, example: { fa: "نان", tr: "nân", en: "bread" } },
  { id: "vav", char: "و", name: "vâv", sound: "v / u / o", connects: false, example: { fa: "ورزش", tr: "varzesh", en: "sport" } },
  { id: "he2", char: "ه", name: "he (do-cheshm)", sound: "h / e", connects: true, example: { fa: "هفت", tr: "haft", en: "seven" }, note: "At the end of a word it often just says e, as in خانه khâne." },
  { id: "ye", char: "ی", name: "ye", sound: "y / i", connects: true, example: { fa: "یک", tr: "yek", en: "one" } },
];

export const LETTER_BY_ID: Record<string, Letter> = Object.fromEntries(LETTERS.map((l) => [l.id, l]));
