import { WORD_BY_ID, type Word } from "./words";
import type { LessonDraft } from "./words/define";
import { LEVEL2 } from "./words/level2";
import { LEVEL3 } from "./words/level3";
import { LEVEL4 } from "./words/level4";
import { LEVEL5 } from "./words/level5";

export interface Lesson {
  id: string;
  order: number;
  level: number;
  cefr: "A1" | "A2" | "B1";
  title: string;
  titleFa: string;
  emoji: string;
  description: string;
  wordIds: string[];
}

export const LEVELS = [
  { id: 1, name: "Level 1 · First Steps", nameFa: "قدم\u200cهای اول", cefr: "A1",
    description: "Greetings, courtesy, family, numbers and food: the words for your first conversations." },
  { id: 2, name: "Level 2 · Everyday Life", nameFa: "زندگی روزمره", cefr: "A1",
    description: "Numbers and money, time, home, the city, getting around, food, shopping, health and the verbs you'll use most." },
  { id: 3, name: "Level 3 · Getting Around", nameFa: "سفر و شهر", cefr: "A2",
    description: "More verbs, feelings, weather, work, study, question words, family, travel and your phone." },
  { id: 4, name: "Level 4 · Conversations", nameFa: "گفت\u200cوگو", cefr: "A2",
    description: "Ta'ârof, opinions, free time, nature, celebrations, relationships, the kitchen, emergencies and describing things." },
  { id: 5, name: "Level 5 · Independent", nameFa: "مستقل", cefr: "B1",
    description: "News and society, character, renting and paperwork, and the words that link ideas." },
];

export const LESSONS: Lesson[] = [
  {
    id: "greetings", order: 1, level: 1, cefr: "A1", emoji: "👋",
    title: "Greetings", titleFa: "سلام و احوالپرسی",
    description: "Say hello, goodbye and ask how someone is doing.",
    wordIds: ["salam", "khodahafez", "sobh-bekheyr", "shab-bekheyr", "khosh-amadid", "halet-chetore", "khubam", "esmet-chiye"],
  },
  {
    id: "courtesy", order: 2, level: 1, cefr: "A1", emoji: "🙏",
    title: "Courtesy", titleFa: "ادب",
    description: "Please, thank you, yes, no — the words you use all day.",
    wordIds: ["mersi", "mamnun", "lotfan", "bebakhshid", "bale", "are", "na", "khahesh-mikonam"],
  },
  {
    id: "family", order: 3, level: 1, cefr: "A1", emoji: "👨\u200d👩\u200d👧",
    title: "Family", titleFa: "خانواده",
    description: "Talk about the people closest to you.",
    wordIds: ["pedar", "madar", "baradar", "khahar", "pesar", "dokhtar", "pedarbozorg", "khanevade"],
  },
  {
    id: "numbers", order: 4, level: 1, cefr: "A1", emoji: "🔢",
    title: "Numbers 1–10", titleFa: "اعداد",
    description: "Count from one to ten.",
    wordIds: ["yek", "do", "se", "chahar", "panj", "shesh", "haft", "hasht", "noh", "dah"],
  },
  {
    id: "food", order: 5, level: 1, cefr: "A1", emoji: "🍵",
    title: "Food & Drink", titleFa: "خوراکی",
    description: "Order tea, bread and the rest of breakfast.",
    wordIds: ["ab", "chay", "nan", "ghaza", "sib", "berenj", "panir", "ghahve"],
  },
  {
    id: "everyday", order: 6, level: 1, cefr: "A1", emoji: "📅",
    title: "Everyday Words", titleFa: "کلمات روزمره",
    description: "Home, friends, work and the days.",
    wordIds: ["khane", "ketab", "dust", "kar", "ruz", "shab", "emruz", "farda"],
  },
];

function fromDrafts(drafts: LessonDraft[], level: number, cefr: Lesson["cefr"], startOrder: number): Lesson[] {
  return drafts.map((d, i) => ({
    id: d.id,
    order: startOrder + i,
    level,
    cefr,
    emoji: d.emoji,
    title: d.title,
    titleFa: d.titleFa,
    description: d.description,
    wordIds: d.words.map((w) => w.id),
  }));
}

LESSONS.push(
  ...fromDrafts(LEVEL2, 2, "A1", LESSONS.length + 1),
);
LESSONS.push(...fromDrafts(LEVEL3, 3, "A2", LESSONS.length + 1));
LESSONS.push(...fromDrafts(LEVEL4, 4, "A2", LESSONS.length + 1));
LESSONS.push(...fromDrafts(LEVEL5, 5, "B1", LESSONS.length + 1));

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function lessonWords(lesson: Lesson): Word[] {
  return lesson.wordIds.map((id) => WORD_BY_ID[id]);
}

/** Which lesson a word was introduced in. */
export const LESSON_OF_WORD: Record<string, string> = Object.fromEntries(
  LESSONS.flatMap((l) => l.wordIds.map((w) => [w, l.id])),
);
