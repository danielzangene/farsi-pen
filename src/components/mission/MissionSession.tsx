"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert, PartyPopper, RotateCcw, Star, Target } from "lucide-react";
import { MISSIONS, type Mission } from "@/content/missions";
import { evidenceFrom, planSession, scoreCheck, stepLabel, type MissionResult, type SessionMode, type TaskOutcome } from "@/lib/missions";
import { FIRST_INTERVAL_DAYS } from "@/lib/mastery";
import { completeMission, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, FocusMode, SessionHeader, StatCard } from "../ui";
import { GrammarStep, ListenStep, PhrasesStep } from "./InfoSteps";
import { TaskStep } from "./TaskStep";

/** Plays one planned session (full, prove, repair or review) and reports the result. */
export function MissionSession({
  mission,
  mode,
  focus,
  onFinish,
}: {
  mission: Mission;
  mode: SessionMode;
  focus?: string[];
  onFinish: (next: { mode: SessionMode; focus?: string[] } | null) => void;
}) {
  const steps = useMemo(() => planSession(mission, mode, focus), [mission, mode, focus]);
  const [i, setI] = useState(0);
  const [result, setResult] = useState<{ r: MissionResult; xp: number } | null>(null);

  const step = steps[i];
  const advance = () => setI((n) => n + 1);

  if (result) return <MissionResultView mission={mission} result={result.r} xp={result.xp} onFinish={onFinish} />;
  if (!step) return null;

  const onTasksDone = (outcomes: TaskOutcome[]) => {
    if (step.kind !== "tasks") return;
    const evidence = evidenceFrom(outcomes, step.final);
    if (step.final) {
      const r = scoreCheck(outcomes);
      const xp = completeMission(mission.id, evidence, r, mission.wordIds);
      setResult({ r, xp });
    } else {
      completeMission(mission.id, evidence, null);
      advance();
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SessionHeader
        exitHref="/app/missions/"
        progress={i / steps.length}
        right={<span className="eyebrow hidden whitespace-nowrap text-muted sm:inline">{stepLabel(step)}</span>}
      />
      {step.kind === "listen" && <ListenStep key={i} mission={mission} onNext={advance} />}
      {step.kind === "phrases" && <PhrasesStep key={i} mission={mission} skills={step.skills} onNext={advance} />}
      {step.kind === "grammar" && <GrammarStep key={i} mission={mission} onNext={advance} />}
      {step.kind === "tasks" && <TaskStep key={i} mission={mission} stage={step.stage} tasks={step.tasks} guided={step.guided} onDone={onTasksDone} />}
    </div>
  );
}

function MissionResultView({
  mission,
  result,
  xp,
  onFinish,
}: {
  mission: Mission;
  result: MissionResult;
  xp: number;
  onFinish: (next: { mode: SessionMode; focus?: string[] } | null) => void;
}) {
  const { settings } = useProgress();
  const weak = [...new Set(result.failed.map((f) => f.skill))];
  const nextMission = MISSIONS[MISSIONS.findIndex((m) => m.id === mission.id) + 1];
  const tested = new Set([...result.passed, ...weak]);
  const heading = {
    mastered: { text: "Mission mastered!", tone: "text-saffron-ink", icon: <PartyPopper className="size-12" />, bg: "bg-saffron text-on-accent" },
    "needs-practice": { text: "Nearly there", tone: "text-ink", icon: <Target className="size-11" />, bg: "bg-sky-soft text-sky-ink" },
    retry: { text: "Not yet — and that's fine", tone: "text-ink", icon: <RotateCcw className="size-11" />, bg: "bg-plum-soft text-plum-ink" },
  }[result.status];

  return (
    <div className="mx-auto max-w-xl py-6 text-center">
      <FocusMode />
      <span className={cx("mx-auto grid size-24 animate-pop place-items-center rounded-full", heading.bg)}>{heading.icon}</span>
      <h1 className={cx("mt-5 text-3xl font-extrabold sm:text-4xl", heading.tone)}>{heading.text}</h1>
      <p className="mt-2 font-semibold text-muted">
        {result.status === "mastered"
          ? "You did it without help. Here's what you can do now:"
          : result.status === "needs-practice"
            ? "Most of it is there. Just a little practice on what's left:"
            : "Going through the mission once will make the check much easier."}
      </p>

      <ul className="mt-6 space-y-2 text-left">
        {mission.skills
          .filter((s) => tested.has(s.id))
          .map((s) => {
            const fail = result.failed.find((f) => f.skill === s.id);
            return (
              <li key={s.id} className={cx("card flex gap-3 p-3.5", fail ? "border-anar/40" : "border-pista/40")}>
                {fail ? <CircleAlert className="mt-0.5 size-5 shrink-0 text-anar-ink" /> : <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-pista-ink" />}
                <span className="min-w-0">
                  <span className="block font-extrabold">{s.canDo}</span>
                  {fail && (
                    <span className="mt-1 block text-sm font-semibold text-muted">
                      Try: <Fa className="font-bold text-ink">{fail.outcome.task.model.fa}</Fa>
                      {!settings.scriptOnly && <> · {fail.outcome.task.model.tr}</>}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
      </ul>

      {(xp > 0 || result.status === "mastered") && (
        <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
          <StatCard label="XP" tone="saffron" value={xp} icon={<Star className="size-5 fill-current" />} />
          <StatCard label="Check" tone="pista" value={`${result.score}%`} />
        </div>
      )}

      {result.status === "mastered" && (
        <p className="mt-6 rounded-2xl bg-paper p-4 text-sm font-semibold text-muted">
          That&apos;s enough for this situation. It&apos;ll come back for a quick check in about {FIRST_INTERVAL_DAYS} days — no daily repeats.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-center">
        {result.status === "needs-practice" && (
          <button type="button" className="btn-primary btn-lg" onClick={() => onFinish({ mode: "repair", focus: weak })} autoFocus>
            Practise {weak.length === 1 ? "this skill" : `these ${weak.length} skills`}
          </button>
        )}
        {result.status === "retry" && (
          <button type="button" className="btn-primary btn-lg" onClick={() => onFinish({ mode: "full" })} autoFocus>
            Go through the mission
          </button>
        )}
        {result.status === "mastered" &&
          (nextMission ? (
            <Link href={`/app/missions/${nextMission.id}/`} className="btn-primary btn-lg" autoFocus>
              Next mission
            </Link>
          ) : (
            <Link href="/app/missions/" className="btn-primary btn-lg" autoFocus>
              Back to missions
            </Link>
          ))}
        <button type="button" className="btn-secondary btn-lg" onClick={() => onFinish(null)}>
          {result.status === "mastered" ? "Done" : "Done for now"}
        </button>
      </div>
    </div>
  );
}
