// Real-world missions. Add a mission by writing a Mission object in
// src/content/missions/<id>.ts and listing it here — no UI changes needed.
import { TAXI } from "./missions/taxi";
import type { Mission } from "./missions/types";

export type { Line, Mission, MissionSkill, MissionTask, Phrase, TaskStage } from "./missions/types";

export const MISSIONS: Mission[] = [TAXI];

/** Situations planned next, shown as "coming soon". */
export const UPCOMING_MISSIONS: { title: string; emoji: string; world: string }[] = [
  { title: "Meet someone new", emoji: "👋", world: "People" },
  { title: "Order at a café", emoji: "☕", world: "Food" },
  { title: "Shop at the bazaar", emoji: "🧺", world: "Getting around" },
  { title: "Be a guest: ta'ârof at home", emoji: "🫖", world: "People" },
];

export const MISSION_BY_ID: Record<string, Mission> = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));
