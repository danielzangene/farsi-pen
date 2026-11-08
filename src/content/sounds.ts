// Persian sounds an English speaker needs to notice, with a plain-English
// tip and the mouth position drawn by <MouthDiagram>. Sound ids match
// lib/phonics.ts. Sounds English already has get a one-line note only.

export type Place = "lips" | "teeth" | "ridge" | "palate" | "velum" | "uvula" | "glottis" | "open";

export interface Mouth {
  /** Where the tongue (or lips/throat) makes the sound. */
  place: Place;
  lips: "neutral" | "rounded" | "spread";
  jaw: "close" | "mid" | "open";
  /** How the air moves at that point. */
  manner: "friction" | "stop" | "tap" | "vowel" | "nasal";
  voiced: boolean;
}

export interface Sound {
  id: string;
  letters: string;
  label: string;
  name: string;
  /** Is this a sound English speakers usually find hard? */
  hard?: boolean;
  /** Closest thing in English (or another language they may know). */
  like: string;
  tip?: string;
  mouth?: Mouth;
  examples: { fa: string; tr: string; en: string }[];
}

export const SOUNDS: Sound[] = [
  {
    id: "kh", letters: "خ", label: "kh", name: "kh", hard: true,
    like: "ch in Scottish “loch” or German “Bach”",
    tip: "Lift the back of your tongue towards the soft roof of your mouth, leave a narrow gap, and push air through so it rasps. Don't stop the air like k.",
    mouth: { place: "velum", lips: "neutral", jaw: "mid", manner: "friction", voiced: false },
    examples: [{ fa: "خوب", tr: "khub", en: "good" }, { fa: "خانه", tr: "khâne", en: "house" }, { fa: "خدا", tr: "khodâ", en: "God" }],
  },
  {
    id: "gh", letters: "ق غ", label: "gh", name: "gh", hard: true,
    like: "a soft gargle, close to the French r in “Paris”",
    tip: "Like kh but further back and with your voice on: the back of the tongue nearly touches the little uvula at the back of your throat. Hum while you do it.",
    mouth: { place: "uvula", lips: "neutral", jaw: "mid", manner: "friction", voiced: true },
    examples: [{ fa: "قهوه", tr: "ghahve", en: "coffee" }, { fa: "غذا", tr: "ghazâ", en: "food" }, { fa: "اتاق", tr: "otâgh", en: "room" }],
  },
  {
    id: "r", letters: "ر", label: "r", name: "rolled r", hard: true,
    like: "the quick r in Spanish “pero”, or the tt in American “butter”",
    tip: "Flick the tip of your tongue once against the ridge just behind your top teeth. Keep your lips relaxed — no English “rr”.",
    mouth: { place: "ridge", lips: "neutral", jaw: "mid", manner: "tap", voiced: true },
    examples: [{ fa: "مرسی", tr: "mersi", en: "thanks" }, { fa: "برادر", tr: "barâdar", en: "brother" }, { fa: "روز", tr: "ruz", en: "day" }],
  },
  {
    id: "zh", letters: "ژ", label: "zh", name: "zh", hard: true,
    like: "the s in “measure” or “vision”",
    tip: "Say sh, then turn your voice on without moving anything. That buzzing sh is zh.",
    mouth: { place: "palate", lips: "rounded", jaw: "close", manner: "friction", voiced: true },
    examples: [{ fa: "ژاپن", tr: "zhâpon", en: "Japan" }, { fa: "مژه", tr: "mozhe", en: "eyelash" }],
  },
  {
    id: "aa", letters: "آ ا", label: "â", name: "long â", hard: true,
    like: "the a in British “all” — between “father” and “law”",
    tip: "Drop your jaw, pull the tongue back and round your lips slightly. Hold it a little longer than short a. Mixing â and a changes words: sâl (year) vs sal.",
    mouth: { place: "open", lips: "rounded", jaw: "open", manner: "vowel", voiced: true },
    examples: [{ fa: "آب", tr: "âb", en: "water" }, { fa: "سال", tr: "sâl", en: "year" }, { fa: "بابا", tr: "bâbâ", en: "dad" }],
  },
  {
    id: "a", letters: "اَ", label: "a", name: "short a", hard: true,
    like: "the a in “cat”",
    tip: "Short and bright, with lips spread and the tongue forward. Don't round it into â.",
    mouth: { place: "open", lips: "spread", jaw: "open", manner: "vowel", voiced: true },
    examples: [{ fa: "اسب", tr: "asb", en: "horse" }, { fa: "در", tr: "dar", en: "door" }],
  },
  {
    id: "u", letters: "و", label: "u", name: "long u", hard: true,
    like: "the oo in “food”, without gliding",
    tip: "Round and push your lips forward and keep them still for the whole vowel. English “oo” slides; Persian u stays put.",
    mouth: { place: "velum", lips: "rounded", jaw: "close", manner: "vowel", voiced: true },
    examples: [{ fa: "خوب", tr: "khub", en: "good" }, { fa: "روز", tr: "ruz", en: "day" }],
  },
  {
    id: "i", letters: "ی", label: "i", name: "long i", hard: true,
    like: "the ee in “see”, without gliding",
    tip: "Spread your lips into a small smile, tongue high and forward, and hold it steady.",
    mouth: { place: "palate", lips: "spread", jaw: "close", manner: "vowel", voiced: true },
    examples: [{ fa: "مرسی", tr: "mersi", en: "thanks" }, { fa: "سیب", tr: "sib", en: "apple" }],
  },
  {
    id: "o", letters: "و ـُ", label: "o", name: "short o", hard: true,
    like: "the o in “go” — but short and pure",
    tip: "Rounded lips, mid jaw, and no “w” glide at the end: do, not “dow”.",
    mouth: { place: "velum", lips: "rounded", jaw: "mid", manner: "vowel", voiced: true },
    examples: [{ fa: "تو", tr: "to", en: "you" }, { fa: "دو", tr: "do", en: "two" }],
  },
  {
    id: "e", letters: "ه ـِ", label: "e", name: "short e", hard: true,
    like: "the e in “bed”",
    tip: "Final ـه usually says e. Keep it short and clean: khâne, not “khaa-nay”.",
    mouth: { place: "palate", lips: "spread", jaw: "mid", manner: "vowel", voiced: true },
    examples: [{ fa: "خانه", tr: "khâne", en: "house" }, { fa: "بچه", tr: "bache", en: "child" }],
  },
  {
    id: "h", letters: "ه ح", label: "h", name: "h", hard: true,
    like: "the h in “hat” — even at the end of a syllable",
    tip: "Persian keeps h everywhere: in the middle (ghahve) and at the end (koh). Breathe it out clearly; don't drop it.",
    mouth: { place: "glottis", lips: "neutral", jaw: "mid", manner: "friction", voiced: false },
    examples: [{ fa: "قهوه", tr: "ghahve", en: "coffee" }, { fa: "حال", tr: "hâl", en: "state" }],
  },
  {
    id: "glottal", letters: "ع ء", label: "’", name: "catch", hard: true,
    like: "the catch in “uh-oh”",
    tip: "A short stop in the throat. In everyday speech it is light; between vowels it separates them: sâ’at (hour).",
    mouth: { place: "glottis", lips: "neutral", jaw: "mid", manner: "stop", voiced: false },
    examples: [{ fa: "ساعت", tr: "sâ’at", en: "hour, watch" }, { fa: "معلم", tr: "mo’allem", en: "teacher" }],
  },
  {
    id: "v", letters: "و", label: "v", name: "v", like: "v in “very” (some speakers say it like w after o)",
    tip: "Top teeth lightly on the lower lip, voice on.",
    mouth: { place: "lips", lips: "neutral", jaw: "close", manner: "friction", voiced: true },
    examples: [{ fa: "وقت", tr: "vaght", en: "time" }],
  },
  { id: "y", letters: "ی", label: "y", name: "y", like: "y in “yes”", examples: [{ fa: "یک", tr: "yek", en: "one" }] },
  { id: "b", letters: "ب", label: "b", name: "b", like: "b in “bat”", examples: [{ fa: "بابا", tr: "bâbâ", en: "dad" }] },
  { id: "p", letters: "پ", label: "p", name: "p", like: "p in “pen”", examples: [{ fa: "پدر", tr: "pedar", en: "father" }] },
  {
    id: "t", letters: "ت ط", label: "t", name: "t", like: "t in “tea”, with the tongue on the teeth",
    tip: "Touch the back of your top teeth, not the ridge behind them.",
    mouth: { place: "teeth", lips: "neutral", jaw: "mid", manner: "stop", voiced: false },
    examples: [{ fa: "توت", tr: "tut", en: "mulberry" }],
  },
  { id: "s", letters: "س ص ث", label: "s", name: "s", like: "s in “sun”", examples: [{ fa: "سلام", tr: "salâm", en: "hello" }] },
  { id: "j", letters: "ج", label: "j", name: "j", like: "j in “jam”", examples: [{ fa: "جوان", tr: "javân", en: "young" }] },
  { id: "ch", letters: "چ", label: "ch", name: "ch", like: "ch in “church”", examples: [{ fa: "چای", tr: "chây", en: "tea" }] },
  {
    id: "d", letters: "د", label: "d", name: "d", like: "d in “day”, with the tongue on the teeth",
    mouth: { place: "teeth", lips: "neutral", jaw: "mid", manner: "stop", voiced: true },
    examples: [{ fa: "در", tr: "dar", en: "door" }],
  },
  { id: "z", letters: "ز ذ ض ظ", label: "z", name: "z", like: "z in “zoo”", examples: [{ fa: "زن", tr: "zan", en: "woman" }] },
  { id: "sh", letters: "ش", label: "sh", name: "sh", like: "sh in “shop”", examples: [{ fa: "شب", tr: "shab", en: "night" }] },
  { id: "f", letters: "ف", label: "f", name: "f", like: "f in “fun”", examples: [{ fa: "فردا", tr: "fardâ", en: "tomorrow" }] },
  { id: "k", letters: "ک", label: "k", name: "k", like: "k in “key”", examples: [{ fa: "کتاب", tr: "ketâb", en: "book" }] },
  { id: "g", letters: "گ", label: "g", name: "g", like: "g in “go”", examples: [{ fa: "گل", tr: "gol", en: "flower" }] },
  { id: "l", letters: "ل", label: "l", name: "l", like: "a light l, as in “leaf”", examples: [{ fa: "لب", tr: "lab", en: "lip" }] },
  { id: "m", letters: "م", label: "m", name: "m", like: "m in “man”", examples: [{ fa: "مادر", tr: "mâdar", en: "mother" }] },
  { id: "n", letters: "ن", label: "n", name: "n", like: "n in “no”", examples: [{ fa: "نان", tr: "nân", en: "bread" }] },
];

export const SOUND_BY_ID: Record<string, Sound> = Object.fromEntries(SOUNDS.map((s) => [s.id, s]));
export const HARD_SOUNDS = SOUNDS.filter((s) => s.hard);
