// Real-world missions. Add a mission by writing a Mission object in
// src/content/missions/<id>.ts and listing it here — no UI changes needed.
import { BAZAAR } from "./missions/bazaar";
import { CAFE } from "./missions/cafe";
import { GUEST } from "./missions/guest";
import { MEET } from "./missions/meet";
import { TAXI } from "./missions/taxi";
import type { Mission } from "./missions/types";

export type { Line, Mission, MissionSkill, MissionTask, Phrase, TaskStage } from "./missions/types";

export const MISSIONS: Mission[] = [MEET, TAXI, CAFE, BAZAAR, GUEST];

/** Situations planned next, shown as "coming soon". */
export const UPCOMING_MISSIONS: { title: string; emoji: string; world: string }[] = [
  { title: "At the pharmacy", emoji: "💊", world: "Health" },
  { title: "Ask for directions", emoji: "🧭", world: "Getting around" },
];

export const MISSION_BY_ID: Record<string, Mission> = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));
