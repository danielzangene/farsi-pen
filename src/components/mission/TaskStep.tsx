"use client";
import { useEffect, useState } from "react";
import { Lightbulb, ShieldCheck } from "lucide-react";
import type { Mission, MissionTask, TaskStage } from "@/content/missions";
import { checkTask, type TaskResult } from "@/lib/mission-check";
import type { TaskOutcome } from "@/lib/missions";
import { speak } from "@/lib/speech";
import { useProgress } from "@/lib/store";
import { Fa, FeedbackSheet, type FeedbackState } from "../ui";
import { AnswerInput } from "./AnswerInput";
import { Bubble } from "./InfoSteps";
import { ReportButton } from "../ReportButton";

const COPY: Record<TaskStage, { eyebrow: string; title: string; sub: string }> = {
  practice: { eyebrow: "Build sentences", title: "Say it in Persian", sub: "No options — build it yourself. Hints are there if you need them." },
  roleplay: { eyebrow: "Role-play", title: "Your turn to talk", sub: "Answer as if you were really there." },
  check: { eyebrow: "Mastery check", title: "On your own now", sub: "No hints, no translations. Show what you can do." },
  recheck: { eyebrow: "Mastery check", title: "On your own now", sub: "A new situation — no hints, no translations." },
};

/**
 * Runs a list of tasks. Guided steps offer hints and bring a missed task back
 * once at the end (not endlessly). Unguided (final) steps give no help and no
 * retries — the first answer is the evidence.
 */
export function TaskStep({
  mission,
  stage,
  tasks,
  guided,
  onDone,
}: {
  mission: Mission;
  stage: TaskStage;
  tasks: MissionTask[];
  guided: boolean;
  onDone: (outcomes: TaskOutcome[]) => void;
}) {
  const { settings } = useProgress();
  const [queue, setQueue] = useState<{ task: MissionTask; retry: boolean }[]>(() => tasks.map((task) => ({ task, retry: false })));
  const [outcomes, setOutcomes] = useState<TaskOutcome[]>([]);
  const [answer, setAnswer] = useState("");
  const [alts, setAlts] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<TaskResult | null>(null);

  const current = queue[0];
  const task = current?.task;
  const copy = COPY[stage];
  const done = tasks.length - queue.filter((q) => !q.retry).length;

  // Play what the other person says when a task with a cue appears.
  useEffect(() => {
    if (task?.cue) void speak(task.cue.fa);
  }, [task]);

  if (!task) return null;

  const check = () => {
    if (!answer.trim() || result) return;
    const r = checkTask(alts.length ? alts : answer, task.must, task.mustNot);
    setResult(r);
    if (!current.retry) setOutcomes((o) => [...o, { task, verdict: r.verdict, hintUsed: hint, answer }]);
  };

  const next = () => {
    const missed = result?.verdict === "wrong";
    const rest = queue.slice(1);
    // Guided: bring a missed task back once, at the end.
    const nextQueue = guided && missed && !current.retry ? [...rest, { task, retry: true }] : rest;
    setAnswer("");
    setAlts([]);
    setHint(false);
    setResult(null);
    if (nextQueue.length === 0) {
      onDone(outcomes);
      return;
    }
    setQueue(nextQueue);
  };

  const fb: FeedbackState = result ? result.verdict : "idle";
  const title = result?.verdict === "correct" ? "Nicely said!" : result?.verdict === "almost" ? "Almost — watch the spelling." : "Not quite — here's one way to say it.";

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow flex items-center gap-1.5 text-firuze-ink">
          {!guided && <ShieldCheck className="size-4" />} {copy.eyebrow} · {Math.min(done + 1, tasks.length)}/{tasks.length}
          {current.retry && <span className="text-muted"> · one more try</span>}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">{copy.title}</h1>
        <p className="mt-1 font-semibold text-muted">{copy.sub}</p>
      </div>

      {task.cue && (
        <div className="mb-5">
          <Bubble line={{ ...task.cue, who: "npc" }} name={mission.npc.name} showEn={guided} compact />
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-xl font-extrabold">{task.prompt}</p>
        <ReportButton itemId={`${mission.id}:${task.skill}:${task.stage}`} context={`${task.prompt} — model: ${task.model.tr}`} className="-mt-1 shrink-0" />
      </div>
      <AnswerInput
        value={answer}
        onChange={(t, a) => {
          setAnswer(t);
          setAlts(a);
        }}
        onSubmit={result ? next : check}
        disabled={!!result}
        state={result?.verdict}
      />

      {guided && task.hint && !result && (
        <div className="mt-2">
          {hint ? (
            <p className="flex gap-2 rounded-xl bg-saffron-soft p-3 text-sm font-semibold text-saffron-ink">
              <Lightbulb className="size-4 shrink-0 translate-y-0.5" strokeWidth={2.5} /> {task.hint}
            </p>
          ) : (
            <button type="button" className="btn-ghost btn-sm -ml-2" onClick={() => setHint(true)}>
              <Lightbulb className="size-4" /> Hint
            </button>
          )}
        </div>
      )}

      <FeedbackSheet
        state={fb}
        title={title}
        detail={
          result && (
            <span className="block space-y-0.5">
              {result.verdict !== "correct" && result.missing && <span className="block">Missing: {result.missing}</span>}
              <span className="flex flex-wrap items-baseline gap-x-2">
                <Fa className="text-lg font-bold">{task.model.fa}</Fa>
                {!settings.scriptOnly && <span>{task.model.tr}</span>}
              </span>
              <span className="block opacity-80">{task.model.en}</span>
            </span>
          )
        }
        onContinue={next}
      >
        {guided ? (
          <button
            type="button"
            className="btn-ghost w-full sm:w-auto"
            onClick={() => {
              setHint(true); // hearing the answer counts as help
              void speak(task.model.fa);
            }}
          >
            Hear a model answer
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="btn-primary btn-lg w-full sm:w-auto sm:min-w-40" onClick={check} disabled={!answer.trim()}>
          Check
        </button>
      </FeedbackSheet>
    </div>
  );
}
