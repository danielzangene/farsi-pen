// The Path: the whole course as one ordered list of sections, like a
// syllabus. Each section mixes what belongs to that stage — lessons,
// the missions that use those words, the grammar for the level and, later,
// reading — so the learner always knows what comes next.

import { LETTERS } from "@/content/alphabet";
import { GRAMMAR } from "@/content/grammar";
import { LESSONS, LEVELS } from "@/content/lessons";
import { MISSION_BY_ID } from "@/content/missions";
import { READINGS } from "@/content/readings";
import { SCENES } from "@/content/scenes";
import { displayState } from "./mastery";
import { PATH_UNITS, stageCount, stagesDone } from "./sound-path";
import type { ProgressState } from "./store";

export type PathItemKind = "alphabet" | "sounds" | "lesson" | "mission" | "grammar" | "scenes" | "reading";

export interface PathItem {
  id: string;
  kind: PathItemKind;
  title: string;
  subtitle: string;
  href: string;
  /** Emoji, or Persian letters for the badge. */
  badge: string;
  /** 0–1. */
  progress: number;
  done: boolean;
}

export interface PathSection {
  id: string;
  number: number;
  title: string;
  fa: string;
  cefr: string;
  description: string;
  items: PathItem[];
}

const TRACE_PASS = 60;

// Missions placed after the lessons whose words they use.
const MISSIONS_AFTER_LEVEL: Record<number, string[]> = { 1: ["meet", "cafe"], 2: ["taxi", "directions"], 3: ["bazaar", "pharmacy"], 4: ["guest"] };
// Grammar levels taught alongside each lesson level.
const GRAMMAR_FOR_LEVEL: Record<number, "A1" | "A2" | undefined> = { 2: "A1", 4: "A2" };

function grammarItem(s: ProgressState, level: "A1" | "A2" | "B1" | "B2"): PathItem {
  const concepts = GRAMMAR.filter((g) => g.level === level);
  const passed = concepts.filter((g) => s.grammar[g.id]?.passed).length;
  return {
    id: `grammar-${level}`,
    kind: "grammar",
    title: `${level} grammar`,
    subtitle: `${passed}/${concepts.length} concepts`,
    href: `/app/grammar/?level=${level}`,
    badge: "🧩",
    progress: concepts.length ? passed / concepts.length : 0,
    done: passed === concepts.length && concepts.length > 0,
  };
}

export function buildPath(s: ProgressState, now = new Date()): PathSection[] {
  const traced = LETTERS.filter((l) => (s.traced[l.id] ?? 0) >= TRACE_PASS).length;
  const stages = PATH_UNITS.reduce((n, u) => n + stageCount(u) + 1, 0);
  const stagesPlayed = PATH_UNITS.reduce((n, u) => n + stagesDone(u, s.soundPath?.[u.id]), 0);
  const sections: PathSection[] = [
    {
      id: "foundations",
      number: 1,
      title: "Script and sounds",
      fa: "خط و صدا",
      cefr: "Start",
      description: "The letters, how they join, and the Persian sounds English doesn't have.",
      items: [
        { id: "alphabet", kind: "alphabet", title: "The alphabet", subtitle: `${traced}/${LETTERS.length} letters traced`, href: "/app/alphabet/", badge: "الف", progress: traced / LETTERS.length, done: traced === LETTERS.length },
        { id: "sounds", kind: "sounds", title: "The sound path", subtitle: `${stagesPlayed}/${stages} stages`, href: "/app/sounds/", badge: "خ", progress: stages ? stagesPlayed / stages : 0, done: stagesPlayed === stages },
      ],
    },
  ];

  const lessonItems = (levelId: number): PathItem[] =>
    LESSONS.filter((l) => l.level === levelId).map((l) => {
      const rec = s.lessons[l.id];
      return {
        id: `lesson-${l.id}`,
        kind: "lesson" as const,
        title: l.title,
        subtitle: rec?.completedAt ? `Done · best ${rec.best}%` : `Lesson ${l.order} · ${l.wordIds.length} words`,
        href: `/app/lessons/${l.id}/`,
        badge: l.emoji,
        progress: rec?.completedAt ? 1 : 0,
        done: !!rec?.completedAt,
      };
    });
  // B1 vocabulary lives in the Independent section, next to the readings.
  const b1Levels = LEVELS.filter((l) => l.cefr === "B1").map((l) => l.id);
  for (const level of LEVELS.filter((l) => l.cefr !== "B1")) {
    const items: PathItem[] = lessonItems(level.id);
    for (const mid of MISSIONS_AFTER_LEVEL[level.id] ?? []) {
      const m = MISSION_BY_ID[mid];
      if (!m) continue;
      const mastered = m.skills.filter((k) => displayState(s.skills[k.id], now) === "mastered").length;
      items.push({
        id: `mission-${m.id}`,
        kind: "mission",
        title: m.title,
        subtitle: `Mission · ${mastered}/${m.skills.length} skills`,
        href: `/app/missions/${m.id}/`,
        badge: m.emoji,
        progress: mastered / m.skills.length,
        done: mastered === m.skills.length,
      });
    }
    if (level.id === 4) {
      const played = SCENES.filter((x) => s.scenes?.[x.id]).length;
      items.push({ id: "scenes", kind: "scenes", title: "Scenes with the family", subtitle: `${played}/${SCENES.length} episodes`, href: "/app/scenes/", badge: "🎬", progress: played / SCENES.length, done: played === SCENES.length });
    }
    const g = GRAMMAR_FOR_LEVEL[level.id];
    if (g) items.push(grammarItem(s, g));
    sections.push({ id: `level-${level.id}`, number: sections.length + 1, title: level.name.replace(/^Level \d+ · /, ""), fa: level.nameFa, cefr: level.cefr, description: level.description, items });
  }

  sections.push({
    id: "independent",
    number: sections.length + 1,
    title: "Independent",
    fa: "مستقل",
    cefr: "B1",
    description: "Vocabulary for news, people and paperwork, real texts about Iran in written Persian, and the grammar to read them.",
    items: [
      ...b1Levels.flatMap(lessonItems),
      ...READINGS.map((r) => ({
        id: `reading-${r.id}`,
        kind: "reading" as const,
        title: r.topic,
        subtitle: s.readings?.[r.id] ? `Done · ${s.readings[r.id].best}% understood` : `Reading ${r.number}`,
        href: `/app/reading/${r.id}/`,
        badge: "📖",
        progress: s.readings?.[r.id] ? 1 : 0,
        done: !!s.readings?.[r.id],
      })),
      grammarItem(s, "B1"),
    ],
  });
  sections.push({
    id: "confident",
    number: sections.length + 1,
    title: "Confident",
    fa: "مسلط",
    cefr: "B2",
    description: "Linking ideas, building words, register and politeness — and the classics.",
    items: [grammarItem(s, "B2"), { id: "poetry", kind: "reading", title: "Poetry", subtitle: "Hafez, Saadi and Khayyam", href: "/app/poetry/", badge: "🌹", progress: 0, done: false }],
  });
  return sections;
}

const RANK: Record<string, number> = { Start: 0, A1: 1, A2: 2, B1: 3, B2: 4 };

/**
 * The first unfinished item. Readers skip the alphabet, and sections below
 * a placement result are optional, so "next" starts at the learner's level.
 */
export function nextOnPath(sections: PathSection[], s?: Pick<ProgressState, "settings" | "placement">): { section: PathSection; item: PathItem } | null {
  const floor = RANK[s?.placement?.level ?? "A0"] ?? 0;
  for (const section of sections) {
    if (RANK[section.cefr] < floor && section.cefr !== "Start") continue;
    for (const item of section.items) {
      if (item.done) continue;
      if (item.kind === "alphabet" && (s?.settings.reads === "yes" || floor >= 2)) continue;
      return { section, item };
    }
  }
  return null;
}

export function sectionProgress(section: PathSection): { done: number; total: number } {
  return { done: section.items.filter((i) => i.done).length, total: section.items.length };
}
