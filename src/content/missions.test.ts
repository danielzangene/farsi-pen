import { describe, expect, it } from "vitest";
import { GRAMMAR_BY_ID } from "./grammar";
import { MISSIONS } from "./missions";
import { WORD_BY_ID } from "./words";
import { checkTask } from "@/lib/mission-check";
import { planSession, scoreCheck, weakSkills, type TaskOutcome } from "@/lib/missions";
import { applyEvidence } from "@/lib/mastery";
import { hasPersianScript } from "@/lib/youglish";

const STAGES = ["practice", "roleplay", "check", "recheck"] as const;

describe("mission content", () => {
  it("has unique mission and skill ids", () => {
    const ids = MISSIONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const skills = MISSIONS.flatMap((m) => m.skills.map((s) => s.id));
    expect(new Set(skills).size).toBe(skills.length);
  });

  for (const m of MISSIONS) {
    describe(m.id, () => {
      const skillIds = m.skills.map((s) => s.id);

      it("gives every skill one task per stage", () => {
        for (const skill of skillIds)
          for (const stage of STAGES) expect(m.tasks.filter((t) => t.skill === skill && t.stage === stage), `${skill}/${stage}`).toHaveLength(1);
        m.tasks.forEach((t) => expect(skillIds).toContain(t.skill));
        m.phrases.forEach((p) => expect(skillIds).toContain(p.skill));
      });

      it("writes every required piece in both Finglish and Persian script", () => {
        for (const t of m.tasks)
          for (const group of t.must) {
            expect(group.some((c) => hasPersianScript(c)), `${t.skill}/${t.stage}: ${group}`).toBe(true);
            expect(group.some((c) => !hasPersianScript(c)), `${t.skill}/${t.stage}: ${group}`).toBe(true);
          }
      });

      it("accepts its own model answers, typed or spoken", () => {
        for (const t of m.tasks) {
          expect(checkTask(t.model.tr, t.must, t.mustNot).verdict, `${t.skill}/${t.stage} tr`).toBe("correct");
          expect(checkTask(t.model.fa, t.must, t.mustNot).verdict, `${t.skill}/${t.stage} fa`).toBe("correct");
        }
      });

      it("doesn't accept another skill's answer", () => {
        for (const t of m.tasks)
          for (const other of m.tasks.filter((o) => o.skill !== t.skill && (o.stage === "check" || o.stage === "recheck"))) {
            expect(checkTask(other.model.tr, t.must, t.mustNot).verdict, `${other.skill} model passes ${t.skill}/${t.stage}`).toBe("wrong");
            expect(checkTask(other.model.fa, t.must, t.mustNot).verdict, `${other.skill} model (fa) passes ${t.skill}/${t.stage}`).toBe("wrong");
          }
      });

      it("has checks that need a cue and differ from practice", () => {
        for (const t of m.tasks.filter((x) => x.stage === "check" || x.stage === "recheck")) expect(t.cue).toBeTruthy();
        for (const skill of skillIds) {
          const check = m.tasks.find((t) => t.skill === skill && t.stage === "check")!;
          const recheck = m.tasks.find((t) => t.skill === skill && t.stage === "recheck")!;
          expect(check.prompt).not.toBe(recheck.prompt);
        }
      });

      it("links to real words, grammar and answerable questions", () => {
        m.wordIds.forEach((id) => expect(WORD_BY_ID[id], id).toBeTruthy());
        m.grammar.concepts.forEach((id) => expect(GRAMMAR_BY_ID[id], id).toBeTruthy());
        m.questions.forEach((q) => expect(q.options).toContain(q.answer));
      });
    });
  }
});

describe("session planner", () => {
  const m = MISSIONS[0];
  const outcome = (skill: string, verdict: TaskOutcome["verdict"]): TaskOutcome => ({
    task: m.tasks.find((t) => t.skill === skill && t.stage === "check")!,
    verdict,
    hintUsed: false,
    answer: "",
  });

  it("plans the full mission ending in an unguided check", () => {
    const steps = planSession(m, "full");
    expect(steps.map((s) => s.kind)).toEqual(["listen", "phrases", "grammar", "tasks", "tasks", "tasks"]);
    const last = steps.at(-1)!;
    expect(last.kind === "tasks" && last.final && !last.guided).toBe(true);
  });

  it("lets you prove it straight away", () => {
    const steps = planSession(m, "prove");
    expect(steps).toHaveLength(1);
    expect(steps[0].kind === "tasks" && steps[0].stage).toBe("check");
  });

  it("repairs only weak skills, with a check you haven't seen", () => {
    const weak = [m.skills[1].id];
    const steps = planSession(m, "repair", weak);
    const last = steps.at(-1)!;
    expect(last.kind === "tasks" && last.stage).toBe("recheck");
    expect(last.kind === "tasks" && last.tasks.map((t) => t.skill)).toEqual(weak);
  });

  it("scores mastered / needs practice / retry", () => {
    const ids = m.skills.map((s) => s.id);
    expect(scoreCheck(ids.map((id) => outcome(id, "correct"))).status).toBe("mastered");
    expect(scoreCheck([outcome(ids[0], "almost"), outcome(ids[1], "wrong")]).status).toBe("needs-practice");
    expect(scoreCheck(ids.map((id) => outcome(id, "wrong"))).status).toBe("retry");
  });

  it("finds weak skills from mastery records", () => {
    const records = { [m.skills[0].id]: applyEvidence(undefined, "check", true) };
    expect(weakSkills(m, records)).toEqual(m.skills.slice(1).map((s) => s.id));
  });
});
