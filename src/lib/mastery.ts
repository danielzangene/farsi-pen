// Skill mastery model shared by missions (and, later, the adaptive engine).
//
// A skill is a real-world ability ("ask the taxi fare"). Evidence moves it
// through states; only an unguided success in a mastery check makes it
// "mastered". Mastered skills come back for a short check when their review
// date passes ("fading"), with intervals that grow after each success —
// review when needed, never daily busywork. Pure functions so the same rules
// can move server-side later.

export type SkillState = "new" | "recognized" | "usable" | "mastered";
export type SkillDisplay = SkillState | "fading";

/** guided = with hints/options; unguided = free answer in practice; check = mastery check (no help). */
export type EvidenceContext = "guided" | "unguided" | "check";

export interface SkillRecord {
  state: SkillState;
  correct: number;
  wrong: number;
  lastSeen: string;
  masteredAt?: string;
  /** Days until the next mastery re-check. */
  interval?: number;
  /** ISO date when a mastered skill should be re-checked. */
  due?: string;
}

const RANK: Record<SkillState, number> = { new: 0, recognized: 1, usable: 2, mastered: 3 };
const atLeast = (s: SkillState, min: SkillState): SkillState => (RANK[s] >= RANK[min] ? s : min);

export const FIRST_INTERVAL_DAYS = 7;
export const MAX_INTERVAL_DAYS = 180;

function addDays(d: Date, days: number): string {
  return new Date(d.getTime() + days * 86_400_000).toISOString();
}

export function applyEvidence(rec: SkillRecord | undefined, context: EvidenceContext, ok: boolean, now = new Date()): SkillRecord {
  const base: SkillRecord = rec ?? { state: "new", correct: 0, wrong: 0, lastSeen: now.toISOString() };
  const next: SkillRecord = { ...base, lastSeen: now.toISOString(), correct: base.correct + (ok ? 1 : 0), wrong: base.wrong + (ok ? 0 : 1) };
  if (context === "check") {
    if (ok) {
      const interval = base.state === "mastered" && base.interval ? Math.min(Math.round(base.interval * 2.5), MAX_INTERVAL_DAYS) : FIRST_INTERVAL_DAYS;
      return { ...next, state: "mastered", masteredAt: base.masteredAt ?? now.toISOString(), interval, due: addDays(now, interval) };
    }
    // A failed check: a mastered skill drops back to usable and is due now.
    return { ...next, state: base.state === "mastered" ? "usable" : base.state, interval: undefined, due: now.toISOString() };
  }
  if (!ok) return next; // practice mistakes never downgrade a skill
  return { ...next, state: atLeast(base.state, context === "guided" ? "recognized" : "usable") };
}

export function displayState(rec: SkillRecord | undefined, now = new Date()): SkillDisplay {
  if (!rec) return "new";
  if (rec.state === "mastered" && rec.due && new Date(rec.due) <= now) return "fading";
  return rec.state;
}

export function isMastered(rec: SkillRecord | undefined, now = new Date()): boolean {
  return displayState(rec, now) === "mastered";
}
