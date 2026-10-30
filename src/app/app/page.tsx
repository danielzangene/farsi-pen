"use client";
import Link from "next/link";
import { BookOpen, Check, ChevronRight, Flame, GraduationCap, Repeat, Star, Trophy, X } from "lucide-react";
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
  const streak = currentStreak(s);

  return (
    <div
      className={cx(
        "grid gap-6 transition-opacity lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_20rem]",
        hydrated ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="min-w-0 space-y-6">
        <div>
          <p className="font-semibold text-muted">
            <Fa>سلام</Fa> · salâm{s.settings.name ? `, ${s.settings.name}` : ""}!
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
        </div>

        {/* Continue: the one main action */}
        {nextLesson ? (
          <section className="card p-5 sm:p-6" aria-labelledby="next-lesson">
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="grid size-20 shrink-0 place-items-center rounded-full bg-firuze text-4xl shadow-[0_6px_0_var(--color-firuze-shadow)]" aria-hidden>
                {nextLesson.emoji}
              </span>
              <div className="min-w-0">
                <p className="eyebrow text-firuze-ink">
                  Unit 1 · Lesson {nextLesson.order}
                </p>
                <h2 id="next-lesson" className="mt-0.5 text-2xl font-extrabold tracking-tight">
                  {nextLesson.title}
                </h2>
                <p className="mt-0.5 text-sm font-semibold text-muted">
                  {s.lessons[nextLesson.id] ? "In progress" : "Up next"} · {nextLesson.wordIds.length} new words
                </p>
              </div>
            </div>
            <Link href={`/app/lessons/${nextLesson.id}/`} className="btn-primary btn-lg mt-5 w-full">
              {s.lessons[nextLesson.id] ? "Continue" : "Start"}
            </Link>
          </section>
        ) : (
          <section className="card p-5 sm:p-6" aria-labelledby="next-lesson">
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="grid size-20 shrink-0 place-items-center rounded-full bg-plum text-4xl shadow-[0_6px_0_var(--color-plum-shadow)]" aria-hidden>
                🧩
              </span>
              <div className="min-w-0">
                <p className="eyebrow text-plum-ink">Unit 1 complete</p>
                <h2 id="next-lesson" className="mt-0.5 text-2xl font-extrabold tracking-tight">
                  All Level 1 lessons done!
                </h2>
                <p className="mt-0.5 text-sm font-semibold text-muted">Try grammar next</p>
              </div>
            </div>
            <Link href="/app/grammar/" className="btn-plum btn-lg mt-5 w-full">
              Go to grammar
            </Link>
          </section>
        )}

        <Link href="/app/practice/" className="tile flex items-center gap-4 p-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-soft text-sky-ink">
            <Repeat className="size-6" strokeWidth={2.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-extrabold">Daily Practice</span>
            <span className="block text-sm font-semibold text-muted">
              {Object.keys(s.cards).length === 0 ? "Unlocks after your first lesson" : dueCount > 0 ? `${dueCount} word${dueCount === 1 ? "" : "s"} ready for review` : "Keep your words fresh"}
            </span>
          </span>
          {dueCount > 0 && <span className="chip bg-sky-soft text-sky-ink">{dueCount}</span>}
          <ChevronRight className="size-5 shrink-0 text-faint" strokeWidth={3} />
        </Link>

        {!s.settings.checklistHidden && <Checklist />}

        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="eyebrow mb-3 text-muted">
            Your stats
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Stat icon={<Star className="size-5 fill-saffron text-saffron-shadow" />} label="Total XP" value={s.xp} />
            <Stat icon={<Flame className="size-5 fill-anar text-anar-ink" />} label="Record streak" value={`${s.streak.record} days`} />
            <Stat icon={<BookOpen className="size-5 text-firuze-ink" strokeWidth={2.5} />} label="Lessons done" value={`${stats.lessonsDone}/${stats.totalLessons}`} />
            <Stat
              icon={<GraduationCap className="size-5 text-sky-ink" strokeWidth={2.5} />}
              label="Words learned"
              value={`${wordsLearned(s)}/${WORDS.length}`}
              hint="A word counts as learned once it graduates to long-term review."
            />
          </div>
        </section>
      </div>

      <aside className="min-w-0 space-y-4" aria-label="Progress">
        <section className="card p-5" aria-labelledby="level-heading">
          <p className="eyebrow text-saffron-ink">Level {level.number}</p>
          <h2 id="level-heading" className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xl font-extrabold">
            {level.current.name}
            <Fa className="text-lg font-bold text-muted">{level.current.fa}</Fa>
          </h2>
          <ProgressBar value={level.progress} tone="saffron" className="mt-4" />
          <p className="mt-2 text-sm font-semibold text-muted">
            {level.next ? (
              <>
                <strong className="font-extrabold text-saffron-ink">{level.toNext} XP</strong> to {level.next.name}
              </>
            ) : (
              "Top level reached"
            )}
          </p>
        </section>

        <section className="card p-5" aria-labelledby="goal-heading">
          <div className="flex items-center justify-between gap-2">
            <h2 id="goal-heading" className="eyebrow text-muted">
              Daily goal
            </h2>
            <span className="flex items-center gap-1 text-sm font-extrabold text-anar-ink">
              <Flame className={cx("size-5", streak > 0 ? "fill-anar" : "fill-line text-faint")} aria-hidden /> {streak} day streak
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold">
            {Math.min(day.words, s.settings.dailyGoal)}
            <span className="text-lg font-bold text-muted">/{s.settings.dailyGoal} words</span>
          </p>
          <ProgressBar value={goalPct} className="mt-3" />
          <p className="mt-2 text-sm font-semibold text-muted">{goalPct >= 1 ? "🎉 Goal reached! See you tomorrow." : "Practise words to keep your streak alive."}</p>
        </section>

        <section className="card p-5" aria-labelledby="badges-heading">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="size-5 fill-saffron text-saffron-shadow" aria-hidden />
            <h2 id="badges-heading" className="text-lg font-extrabold">
              Badges
            </h2>
            <span className="ms-auto text-sm font-bold text-muted">
              {s.earnedBadges.length}/{BADGES.length} earned
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {BADGES.map((b) => {
              const earned = s.earnedBadges.includes(b.id);
              const [have, need] = b.progress(stats);
              return (
                <li key={b.id} className="tile flex flex-col items-center p-3 text-center" title={b.description}>
                  <span className={cx("grid size-12 place-items-center rounded-full text-2xl", earned ? "bg-saffron-soft" : "bg-paper opacity-60 grayscale")} aria-hidden>
                    {b.emoji}
                  </span>
                  <span className={cx("mt-2 block text-sm font-extrabold leading-tight", !earned && "text-muted")}>{b.name}</span>
                  {earned ? (
                    <span className="eyebrow mt-1 text-saffron-ink">Earned</span>
                  ) : (
                    <>
                      <span className="mt-0.5 block text-xs font-semibold text-muted">{b.description}</span>
                      <ProgressBar value={need ? Math.min(have, need) / need : 0} size="sm" tone="saffron" className="mt-2 w-full" />
                      <span className="mt-1 text-xs font-bold text-muted">
                        {Math.min(have, need)}/{need}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card flex items-start gap-3 p-3.5" title={hint}>
      <span className="mt-0.5 shrink-0" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-extrabold leading-tight">{value}</span>
        <span className="block text-xs font-semibold text-muted">{label}</span>
      </span>
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
                  "grid size-7 shrink-0 place-items-center rounded-full border-2",
                  x.done ? "border-saffron-shadow bg-saffron text-white" : "border-line-strong bg-card",
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
