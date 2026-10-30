"use client";
import Link from "next/link";
import { ArrowRight, Check, Flame, Repeat, Trophy, X } from "lucide-react";
import { LESSONS } from "@/content/lessons";
import { WORDS } from "@/content/words";
import { BADGES, levelFor } from "@/lib/gamification";
import { badgeStats, currentStreak, today, updateSettings, useHydrated, useProgress, wordsLearned } from "@/lib/store";
import { isDue } from "@/lib/srs";
import { cx } from "@/lib/util";
import { Fa, ProgressBar } from "@/components/ui";

export default function Dashboard() {
  const s = useProgress();
  const hydrated = useHydrated();
  const level = levelFor(s.xp);
  const day = today(s);
  const nextLesson = LESSONS.find((l) => !s.lessons[l.id]?.completedAt);
  const dueCount = Object.entries(s.cards).filter(([id, c]) => !s.hidden.includes(id) && isDue(c)).length;
  const stats = badgeStats(s);
  const goalPct = Math.min(1, day.words / s.settings.dailyGoal);

  return (
    <div className={cx("space-y-6 transition-opacity", hydrated ? "opacity-100" : "opacity-0")}>
      <div>
        <p className="text-muted">
          <Fa>سلام</Fa> · salâm{s.settings.name ? `, ${s.settings.name}` : ""}!
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        {/* Level card */}
        <section className="card relative overflow-hidden p-5">
          <div className="tile-bg absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <p className="text-sm font-medium text-muted">Level {level.number}</p>
            <h2 className="mt-1 flex flex-wrap items-baseline gap-x-3 font-display text-2xl font-semibold">
              {level.current.name}
              <Fa className="text-xl font-normal text-firuze">{level.current.fa}</Fa>
            </h2>
            <ProgressBar value={level.progress} className="mt-4 h-3" />
            <p className="mt-2 text-sm text-muted">
              {level.next ? (
                <>
                  <strong className="text-ink">{level.toNext} XP</strong> to {level.next.name}
                </>
              ) : (
                "Top level reached"
              )}
            </p>
          </div>
        </section>

        {/* Daily goal */}
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Today’s goal</h2>
            <span className="chip bg-anar-soft text-anar">
              <Flame className="size-3.5" /> {currentStreak(s)} day streak
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold">
            {Math.min(day.words, s.settings.dailyGoal)}
            <span className="text-lg font-medium text-muted">/{s.settings.dailyGoal} words</span>
          </p>
          <ProgressBar value={goalPct} className="mt-3" />
          <p className="mt-2 text-sm text-muted">{goalPct >= 1 ? "🎉 Goal reached! See you tomorrow." : "Practise words to keep your streak alive."}</p>
        </section>
      </div>

      {/* Continue */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/app/practice/" className="card group flex items-center gap-4 p-5 transition hover:border-firuze">
          <span className="grid size-12 place-items-center rounded-xl bg-firuze-soft text-firuze">
            <Repeat className="size-6" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Daily Practice</span>
            <span className="text-sm text-muted">
              {Object.keys(s.cards).length === 0 ? "Unlocks after your first lesson" : dueCount > 0 ? `${dueCount} word${dueCount === 1 ? "" : "s"} ready for review` : "Keep your words fresh"}
            </span>
          </span>
          <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-firuze" />
        </Link>
        {nextLesson ? (
          <Link href={`/app/lessons/${nextLesson.id}/`} className="card group flex items-center gap-4 p-5 transition hover:border-firuze">
            <span className="grid size-12 place-items-center rounded-xl bg-saffron-soft text-2xl">{nextLesson.emoji}</span>
            <span className="flex-1">
              <span className="block font-semibold">{s.lessons[nextLesson.id] ? "Continue" : "Next lesson"}: {nextLesson.title}</span>
              <span className="text-sm text-muted">
                Lesson {nextLesson.order} · {nextLesson.wordIds.length} new words
              </span>
            </span>
            <ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-firuze" />
          </Link>
        ) : (
          <Link href="/app/grammar/" className="card group flex items-center gap-4 p-5 transition hover:border-firuze">
            <span className="grid size-12 place-items-center rounded-xl bg-saffron-soft text-2xl">🧩</span>
            <span className="flex-1">
              <span className="block font-semibold">All Level 1 lessons done!</span>
              <span className="text-sm text-muted">Try grammar next</span>
            </span>
            <ArrowRight className="size-5 text-muted" />
          </Link>
        )}
      </div>

      {!s.settings.checklistHidden && <Checklist />}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total XP" value={s.xp} />
        <Stat label="Record streak" value={`${s.streak.record} days`} />
        <Stat label="Lessons done" value={`${stats.lessonsDone}/${stats.totalLessons}`} />
        <Stat label="Words learned" value={`${wordsLearned(s)}/${WORDS.length}`} hint="A word counts as learned once it graduates to long-term review." />
      </section>

      {/* Badges */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="size-5 text-saffron" />
          <h2 className="font-semibold">Badges</h2>
          <span className="text-sm text-muted">
            {s.earnedBadges.length}/{BADGES.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const earned = s.earnedBadges.includes(b.id);
            const [have, need] = b.progress(stats);
            return (
              <div key={b.id} className={cx("card flex items-center gap-3 p-3", !earned && "opacity-70")}>
                <span className={cx("grid size-10 shrink-0 place-items-center rounded-full text-xl", earned ? "bg-saffron-soft" : "bg-paper grayscale")}>{b.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{b.name}</span>
                  <span className="block text-xs text-muted">{earned ? "Earned" : `${Math.min(have, need)}/${need} · ${b.description}`}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card p-4" title={hint}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
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
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          Getting started <span className="ms-1 text-sm font-normal text-muted">{done}/{steps.length}</span>
        </h2>
        <button type="button" className="btn-ghost !p-1.5" onClick={() => updateSettings({ checklistHidden: true })} aria-label="Hide checklist">
          <X className="size-4" />
        </button>
      </div>
      <ProgressBar value={done / steps.length} className="mt-3" />
      <ul className="mt-3 grid gap-1 sm:grid-cols-2">
        {steps.map((x) => (
          <li key={x.label}>
            <Link href={x.href} className={cx("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-paper", x.done && "text-muted line-through")}>
              <span className={cx("grid size-5 place-items-center rounded-full border", x.done ? "border-firuze bg-firuze text-white" : "border-line")}>
                {x.done && <Check className="size-3" />}
              </span>
              {x.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
