"use client";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { updateSettings, useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, ProgressBar } from "@/components/ui";
import { BackupNudge, Onboarding, TodayPlan } from "@/components/TodayPlan";
import { DailyQuests, OwnSentence, PlacementPrompt, PracticeStudio, SceneOfTheDay, SpeakByTopic, WeakSounds, WeekStrip } from "@/components/home/HomeSections";

/**
 * Home: what to do today, then every way to practise. The course itself
 * lives on Path, exams on Exams, numbers on Progress, settings on Profile.
 */
export default function Home() {
  const s = useProgress();
  const hydrated = useHydrated();
  return (
    <div className={cx("mx-auto max-w-2xl space-y-6 transition-opacity", hydrated ? "opacity-100" : "opacity-0")}>
      <div>
        <p className="text-muted">
          <Fa>سلام</Fa> · salâm{s.settings.name ? `, ${s.settings.name}` : ""}!
        </p>
        <h1 className="text-3xl font-extrabold">{s.xp > 0 ? "Welcome back" : "Welcome"}</h1>
      </div>

      {s.settings.onboarded ? <TodayPlan /> : <Onboarding />}
      <BackupNudge />

      {s.settings.onboarded && (
        <>
          <PlacementPrompt />
          <div className="grid gap-6 sm:grid-cols-2">
            <WeekStrip />
            <DailyQuests />
          </div>
          <PracticeStudio />
          <SceneOfTheDay />
          <WeakSounds />
          <SpeakByTopic />
          <OwnSentence />
          {!s.settings.checklistHidden && <Checklist />}
        </>
      )}
    </div>
  );
}

function Checklist() {
  const s = useProgress();
  const steps = [
    { label: "Start your first lesson", done: Object.keys(s.lessons).length > 0, href: "/app/lessons/" },
    { label: "Do a Daily Practice", done: s.practiceSessions > 0, href: "/app/practice/" },
    { label: "Trace a letter of the alphabet", done: Object.keys(s.traced).length > 0, href: "/app/alphabet/" },
    { label: "Try a grammar lesson", done: Object.keys(s.grammar).length > 0, href: "/app/grammar/" },
    { label: "Bookmark a word", done: s.bookmarks.length > 0, href: "/app/words/" },
  ];
  const done = steps.filter((x) => x.done).length;
  return (
    <section className="card p-5" aria-labelledby="checklist-heading">
      <div className="flex items-center justify-between gap-2">
        <h2 id="checklist-heading" className="text-lg font-extrabold">
          Getting started{" "}
          <span className="ms-1 text-sm font-bold text-muted">
            {done}/{steps.length}
          </span>
        </h2>
        <button type="button" className="btn-ghost btn-icon -mr-2" onClick={() => updateSettings({ checklistHidden: true })} aria-label="Hide checklist">
          <X className="size-5" strokeWidth={3} />
        </button>
      </div>
      <ProgressBar value={done / steps.length} className="mt-3" />
      <ul className="mt-4 grid gap-1 sm:grid-cols-2">
        {steps.map((x) => (
          <li key={x.label}>
            <Link href={x.href} className={cx("flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-bold hover:bg-paper", x.done ? "text-muted line-through" : "text-ink")}>
              <span
                className={cx(
                  "grid size-7 shrink-0 place-items-center rounded-full border",
                  x.done ? "border-saffron-shadow bg-saffron text-on-accent" : "border-line-strong bg-card",
                )}
              >
                {x.done && <Check className="size-4" strokeWidth={3.5} />}
              </span>
              {x.label}
              {x.done && <span className="sr-only">(done)</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
