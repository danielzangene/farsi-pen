"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Download, PartyPopper, X } from "lucide-react";
import { dayKey } from "@/lib/gamification";
import { contentFinished, nextStep, planToday } from "@/lib/today";
import { currentStreak, exportProgress, updateSettings, useProgress, type Goal, type Reads } from "@/lib/store";
import { cx } from "@/lib/util";

const GOALS: { value: Goal; label: string; hint: string; emoji: string }[] = [
  { value: "travel", label: "Travel", hint: "Get around, order, shop", emoji: "🧳" },
  { value: "family", label: "Family & friends", hint: "Talk with people I love", emoji: "👨‍👩‍👧" },
  { value: "heritage", label: "My heritage", hint: "I grew up hearing Persian", emoji: "🏡" },
  { value: "curious", label: "Just curious", hint: "Language, culture, poetry", emoji: "✨" },
];

const READS: { value: Reads; label: string; hint: string }[] = [
  { value: "no", label: "Not yet", hint: "Start me with the letters" },
  { value: "some", label: "A little", hint: "I know some letters" },
  { value: "yes", label: "Yes", hint: "Show me Persian script first" },
];

/** Two questions that shape the Today plan. Skippable; asked once. */
export function Onboarding() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const finish = (reads: Reads | null) =>
    updateSettings({
      goal,
      reads,
      onboarded: true,
      // Readers see Persian first; learners who can't read yet lean on transliteration.
      ...(reads === "yes" ? { script: "farsi" as const } : reads === "no" ? { script: "latin" as const } : {}),
    });

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="onboarding-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted">Question {step} of 2</p>
          <h2 id="onboarding-heading" className="mt-1 text-2xl font-extrabold">
            {step === 1 ? "Why are you learning Persian?" : "Can you read Persian script?"}
          </h2>
        </div>
        <button type="button" className="btn-ghost btn-sm -mr-2 shrink-0" onClick={() => updateSettings({ onboarded: true })}>
          Skip
        </button>
      </div>
      {step === 1 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              className="tile flex items-center gap-3 p-4 text-left"
              data-state={goal === g.value ? "selected" : undefined}
              aria-pressed={goal === g.value}
              onClick={() => {
                setGoal(g.value);
                setStep(2);
              }}
            >
              <span className="text-3xl" aria-hidden>
                {g.emoji}
              </span>
              <span>
                <span className="block font-extrabold">{g.label}</span>
                <span className="block text-sm font-semibold text-muted">{g.hint}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="mt-1 font-semibold text-muted">
            Like this: <span lang="fa" dir="rtl" className="text-lg font-bold text-ink">سلام، خوش آمدید</span>
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {READS.map((r) => (
              <button key={r.value} type="button" className="tile p-4 text-left" onClick={() => finish(r.value)}>
                <span className="block font-extrabold">{r.label}</span>
                <span className="block text-sm font-semibold text-muted">{r.hint}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-ghost btn-sm -ml-3 mt-3" onClick={() => setStep(1)}>
            Back
          </button>
        </>
      )}
    </section>
  );
}

/** Today's short path with one Continue button; says when the day is done. */
export function TodayPlan() {
  const s = useProgress();
  const steps = planToday(s);
  const next = nextStep(steps);
  const doneCount = steps.filter((x) => x.done).length;
  const finished = contentFinished(s);

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="today-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="today-heading" className="text-2xl font-extrabold">
          Today
        </h2>
        <span className="text-sm font-bold text-muted">
          {doneCount} of {steps.length} done
        </span>
      </div>
      <ol className="mt-4 space-y-2">
        {steps.map((x) => {
          const current = next?.id === x.id;
          return (
            <li key={x.id}>
              <Link
                href={x.href}
                className={cx("flex items-center gap-3 rounded-2xl border-2 p-3 transition-colors", current ? "border-firuze bg-firuze-soft" : "border-line hover:bg-paper")}
                aria-current={current ? "step" : undefined}
              >
                <span
                  className={cx(
                    "grid size-11 shrink-0 place-items-center rounded-full text-xl",
                    x.done ? "bg-pista text-on-accent" : current ? "bg-card" : "bg-paper",
                  )}
                  aria-hidden
                >
                  {x.done ? <Check className="size-6" strokeWidth={3.5} /> : x.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cx("block font-extrabold", x.done && "text-muted line-through")}>{x.title}</span>
                  <span className="block truncate text-sm font-semibold text-muted">{x.detail}</span>
                </span>
                <span className="sr-only">{x.done ? "Done" : current ? "Next" : ""}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {next ? (
        <Link href={next.href} className="btn-primary btn-lg mt-5 w-full">
          {doneCount === 0 ? "Start" : "Continue"} <ArrowRight className="size-5" />
        </Link>
      ) : finished ? (
        <div className="mt-5 rounded-2xl bg-saffron-soft p-4 text-saffron-ink">
          <p className="flex items-center gap-2 text-lg font-extrabold">
            <PartyPopper className="size-6" /> You&apos;ve finished everything here so far
          </p>
          <p className="mt-1 text-sm font-semibold">
            Every lesson, mission and grammar concept in this version is done. Reviews keep coming back when they&apos;re due, and new levels are being written.
            Keep your streak with flashcards and speaking in the meantime.
          </p>
        </div>
      ) : (
        <p className="mt-5 flex items-center gap-2 rounded-2xl bg-pista-soft p-4 font-extrabold text-pista-ink">
          <PartyPopper className="size-6 shrink-0" /> That&apos;s enough for today. See you tomorrow!
        </p>
      )}
    </section>
  );
}

/** After a 3-day streak, suggests saving a backup file (asked once a month). */
export function BackupNudge() {
  const s = useProgress();
  const streak = currentStreak(s);
  const last = s.settings.backupNudge;
  const due = !last || Date.now() - new Date(last).getTime() > 30 * 86_400_000;
  if (streak < 3 || !due) return null;
  const dismiss = () => updateSettings({ backupNudge: new Date(dayKey()).toISOString() });
  return (
    <section className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center" aria-label="Back up your progress">
      <span className="text-2xl" aria-hidden>
        🔥
      </span>
      <p className="flex-1 text-sm font-semibold">
        <strong className="font-extrabold">{streak} days in a row!</strong> Your progress lives only in this browser. Save a backup file so clearing it, or a new
        phone, doesn&apos;t reset your streak and reviews.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={() => {
            downloadBackup();
            dismiss();
          }}
        >
          <Download className="size-4" /> Save backup
        </button>
        <button type="button" className="btn-ghost btn-icon" onClick={dismiss} aria-label="Not now">
          <X className="size-5" />
        </button>
      </div>
    </section>
  );
}

export function downloadBackup() {
  const blob = new Blob([exportProgress()], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `farsi-pen-progress-${dayKey()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
