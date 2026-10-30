import { WORD_BY_ID, type Word } from "./words";

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

export const LEVELS = [{ id: 1, name: "Level 1 · First Steps", nameFa: "قدم\u200cهای اول", cefr: "A1",
    description: "Greetings, courtesy, family, numbers and food: the words for your first conversations." },
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

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function lessonWords(lesson: Lesson): Word[] {
  return lesson.wordIds.map((id) => WORD_BY_ID[id]);
}

/** Which lesson a word was introduced in. */
export const LESSON_OF_WORD: Record<string, string> = Object.fromEntries(
  LESSONS.flatMap((l) => l.wordIds.map((w) => [w, l.id])),
);
