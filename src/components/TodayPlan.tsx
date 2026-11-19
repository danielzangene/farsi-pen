"use client";
import Link from "next/link";
import { ArrowRight, Check, Download, PartyPopper, X } from "lucide-react";
import { dayKey } from "@/lib/gamification";
import { contentFinished, nextStep, planToday } from "@/lib/today";
import { currentStreak, exportProgress, updateSettings, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";

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
                className={cx("flex items-center gap-3 rounded-2xl border p-3 transition-colors", current ? "border-firuze bg-firuze-soft" : "border-line hover:bg-paper")}
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
