// Mission session planning and scoring. Scenario-agnostic: everything comes
// from the Mission data, so new situations need content only.

import type { Mission, MissionTask, TaskStage } from "@/content/missions";
import { displayState, type EvidenceContext, type SkillRecord } from "./mastery";
import type { TaskVerdict } from "./mission-check";

export type SessionMode = "full" | "prove" | "repair" | "review";

export type Step =
  | { kind: "listen" }
  | { kind: "phrases"; skills: string[] }
  | { kind: "grammar" }
  | { kind: "tasks"; stage: TaskStage; tasks: MissionTask[]; guided: boolean; final: boolean };

const STEP_LABEL: Record<TaskStage, string> = {
  practice: "Build sentences",
  roleplay: "Role-play",
  check: "Mastery check",
  recheck: "Mastery check",
};

export function stepLabel(step: Step): string {
  if (step.kind === "listen") return "Listen";
  if (step.kind === "phrases") return "Key phrases";
  if (step.kind === "grammar") return "Grammar on demand";
  return STEP_LABEL[step.stage];
}

function tasksFor(m: Mission, stage: TaskStage, skills: string[]): MissionTask[] {
  // Keep the mission's own order so role-plays read as one conversation.
  return m.tasks.filter((t) => t.stage === stage && skills.includes(t.skill));
}

/** Skills that need work: not mastered, or mastered but due for a re-check. */
export function weakSkills(m: Mission, records: Record<string, SkillRecord | undefined>, now = new Date()): string[] {
  return m.skills.map((s) => s.id).filter((id) => displayState(records[id], now) !== "mastered");
}

export function planSession(m: Mission, mode: SessionMode, focus: string[] = m.skills.map((s) => s.id)): Step[] {
  const all = m.skills.map((s) => s.id);
  const skills = focus.length ? focus : all;
  switch (mode) {
    case "prove":
      return [{ kind: "tasks", stage: "check", tasks: tasksFor(m, "check", all), guided: false, final: true }];
    case "review":
      // Mastered skills that are fading: a short, different check only.
      return [{ kind: "tasks", stage: "recheck", tasks: tasksFor(m, "recheck", skills), guided: false, final: true }];
    case "repair":
      // Target weak skills only: phrases → guided role-play → a fresh check they haven't seen.
      return [
        { kind: "phrases", skills },
        { kind: "tasks", stage: "roleplay", tasks: tasksFor(m, "roleplay", skills), guided: true, final: false },
        { kind: "tasks", stage: "recheck", tasks: tasksFor(m, "recheck", skills), guided: false, final: true },
      ];
    default:
      return [
        { kind: "listen" },
        { kind: "phrases", skills: all },
        { kind: "grammar" },
        { kind: "tasks", stage: "practice", tasks: tasksFor(m, "practice", all), guided: true, final: false },
        { kind: "tasks", stage: "roleplay", tasks: tasksFor(m, "roleplay", all), guided: true, final: false },
        { kind: "tasks", stage: "check", tasks: tasksFor(m, "check", all), guided: false, final: true },
      ];
  }
}

export interface TaskOutcome {
  task: MissionTask;
  verdict: TaskVerdict;
  hintUsed: boolean;
  answer: string;
}

export interface Evidence {
  skill: string;
  context: EvidenceContext;
  ok: boolean;
}

/** First attempt at each task counts as evidence; hints make it "guided". */
export function evidenceFrom(outcomes: TaskOutcome[], final: boolean): Evidence[] {
  return outcomes.map((o) => ({
    skill: o.task.skill,
    context: final ? "check" : o.hintUsed ? "guided" : "unguided",
    ok: o.verdict !== "wrong",
  }));
}

export type MissionStatus = "mastered" | "needs-practice" | "retry";

export interface MissionResult {
  status: MissionStatus;
  /** Skills tested in the final check, split by outcome. */
  passed: string[];
  failed: { skill: string; outcome: TaskOutcome }[];
  score: number;
}

/** Scores the final check. Mastered = every tested skill passed. */
export function scoreCheck(outcomes: TaskOutcome[]): MissionResult {
  const passed: string[] = [];
  const failed: MissionResult["failed"] = [];
  for (const o of outcomes) {
    if (o.verdict === "wrong") failed.push({ skill: o.task.skill, outcome: o });
    else passed.push(o.task.skill);
  }
  const score = outcomes.length ? Math.round((passed.length / outcomes.length) * 100) : 0;
  const status: MissionStatus = failed.length === 0 ? "mastered" : passed.length > 0 ? "needs-practice" : "retry";
  return { status, passed, failed, score };
}
