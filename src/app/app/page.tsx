"use client";
import Link from "next/link";
import { AudioLines, BookHeart, BookOpenText, Clapperboard, Headphones, Bookmark, BookOpen, Check, ChevronRight, Compass, Flame, GraduationCap, Layers, Mic, PenLine, Puzzle, Repeat, Star, Trophy, Volume2, X } from "lucide-react";
import { LESSONS } from "@/content/lessons";
import { WORDS } from "@/content/words";
import { MISSIONS } from "@/content/missions";
import { GRAMMAR } from "@/content/grammar";
import { LETTERS } from "@/content/alphabet";
import { HARD_SOUNDS } from "@/content/sounds";
import { SCENES } from "@/content/scenes";
import { READINGS } from "@/content/readings";
import { soundLevel } from "@/lib/sound-workout";
import { displayState } from "@/lib/mastery";
import { buildDeck } from "@/lib/flashcards";
import { useVoiceStatus } from "@/components/SpeechSetup";
import type { Tone } from "@/components/ui";
import { BADGES, levelFor } from "@/lib/gamification";
import { badgeStats, currentStreak, today, TRACE_PASS, updateSettings, useHydrated, useProgress, wordsLearned } from "@/lib/store";
import { isDue } from "@/lib/srs";
import { cx } from "@/lib/util";
import { Fa, ProgressBar, TONE } from "@/components/ui";
import { BackupNudge, Onboarding, TodayPlan } from "@/components/TodayPlan";
import { DailyQuests, OwnSentence, SceneOfTheDay, SoundLessons, SpeakByTopic, WeakSounds, WeekStrip } from "@/components/home/HomeSections";

export default function Dashboard() {
  const s = useProgress();
  const hydrated = useHydrated();
  const level = levelFor(s.xp);
  const day = today(s);
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
          <h1 className="text-3xl font-extrabold tracking-tight">{s.xp > 0 ? "Welcome back" : "Welcome"}</h1>
        </div>

        {/* The one main action: today's path (or two quick questions the first time). */}
        {s.settings.onboarded ? <TodayPlan /> : <Onboarding />}
        <BackupNudge />

        {s.settings.onboarded && (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <WeekStrip />
              <DailyQuests />
            </div>
            <SceneOfTheDay />
            <WeakSounds />
            <SoundLessons />
            <SpeakByTopic />
            <OwnSentence />
          </>
        )}

        <Explore dueCount={dueCount} />

        {!s.settings.checklistHidden && <Checklist />}

        <section aria-labelledby="stats-heading">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 id="stats-heading" className="eyebrow text-muted">
              Your stats
            </h2>
            <Link href="/app/progress/" className="text-sm font-bold text-sky-ink">
              All progress
            </Link>
          </div>
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

type Feature = { href: string; title: string; text: string; status: string; icon: typeof Star; tone: Tone; badge?: number };

/** Every area of the app with a live status, so nothing is hidden behind a small icon. */
function Explore({ dueCount }: { dueCount: number }) {
  const s = useProgress();
  const voice = useVoiceStatus();
  const skills = MISSIONS.flatMap((m) => m.skills);
  const mastered = skills.filter((sk) => displayState(s.skills[sk.id]) === "mastered").length;
  const missionsDone = MISSIONS.filter((m) => m.skills.every((sk) => displayState(s.skills[sk.id]) === "mastered")).length;
  const lessonsDone = LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length;
  const cardsToday = buildDeck("today", s).ids.length;
  const grammarDone = GRAMMAR.filter((g) => s.grammar[g.id]?.passed).length;
  const soundsTried = HARD_SOUNDS.some((x) => s.soundStats?.[x.id]);
  const soundsSolid = HARD_SOUNDS.filter((x) => soundLevel(s.soundStats?.[x.id]) === "solid").length;
  const traced = LETTERS.filter((l) => (s.traced[l.id] ?? 0) >= TRACE_PASS).length;

  const features: Feature[] = [
    { href: "/app/missions/", title: "Missions", text: "Real situations: taxi, café, bazaar, ta'ârof", status: `${missionsDone}/${MISSIONS.length} mastered · ${mastered}/${skills.length} skills`, icon: Compass, tone: "firuze" },
    { href: "/app/words/", title: "Words", text: "Flashcards and a dictionary for any word", status: cardsToday ? `${cardsToday} cards for today` : "All caught up today", icon: Layers, tone: "sky", badge: cardsToday || undefined },
    { href: "/app/speak/", title: "Speak", text: "Say words, see each sound scored", status: "Free speech recognition", icon: Mic, tone: "anar" },
    { href: "/app/listen/", title: "Hands-free", text: "Hear it, say it, repeat it — on a walk", status: "Earphone controls", icon: Headphones, tone: "firuze" },
    { href: "/app/scenes/", title: "Scenes", text: "Play Sara, Arash or Khale Mahin", status: `${Object.keys(s.scenes ?? {}).length}/${SCENES.length} episodes played`, icon: Clapperboard, tone: "sky" },
    { href: "/app/sounds/", title: "Sounds", text: "kh, gh, rolled r and the vowels English lacks", status: soundsTried ? `${soundsSolid}/${HARD_SOUNDS.length} sounds solid` : "Daily 3-minute workout", icon: AudioLines, tone: "saffron" },
    { href: "/app/lessons/", title: "Lessons", text: "Learn new words step by step", status: `${lessonsDone}/${LESSONS.length} done`, icon: BookOpen, tone: "saffron" },
    { href: "/app/reading/", title: "Reading", text: "B1 texts about Iran: read, discuss, answer", status: `${Object.keys(s.readings ?? {}).length}/${READINGS.length} lessons done`, icon: BookOpenText, tone: "plum" },
    { href: "/app/grammar/", title: "Grammar", text: "A1 → B2, with exercises", status: `${grammarDone}/${GRAMMAR.length} concepts`, icon: Puzzle, tone: "plum" },
    { href: "/app/alphabet/", title: "Alphabet", text: "Letters, vowel signs, tracing", status: `${traced}/${LETTERS.length} traced`, icon: PenLine, tone: "pista" },
    { href: "/app/practice/", title: "Daily Practice", text: "Type words from memory", status: Object.keys(s.cards).length === 0 ? "Unlocks after a lesson" : dueCount ? `${dueCount} ready` : "Nothing due", icon: Repeat, tone: "sky", badge: dueCount || undefined },
    { href: "/app/poetry/", title: "Poetry", text: "Fâl-e Hâfez, Saadi, Khayyam", status: "A new poem every day", icon: BookHeart, tone: "plum" },
    { href: "/app/bookmarks/", title: "My cards", text: "Words you saved", status: `${s.bookmarks.length} saved`, icon: Bookmark, tone: "saffron" },
    { href: "/app/settings/", title: "Voice & speech", text: "Natural voice, recognition", status: voice.state === "ready" ? "Voice downloaded" : "Course audio recorded", icon: Volume2, tone: "firuze" },
  ];

  return (
    <section aria-labelledby="explore-heading">
      <h2 id="explore-heading" className="eyebrow mb-3 text-muted">
        Everything in Farsi Pen
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {features.map((f) => (
          <li key={f.href}>
            <Link href={f.href} className="tile relative flex h-full flex-col p-3.5 sm:p-4">
              {f.badge && <span className={cx("chip absolute right-2.5 top-2.5", TONE[f.tone].soft, TONE[f.tone].ink)}>{f.badge}</span>}
              <span className={cx("grid size-10 place-items-center rounded-full", TONE[f.tone].soft, TONE[f.tone].ink)}>
                <f.icon className="size-5" strokeWidth={2.5} />
              </span>
              <span className="mt-3 block font-extrabold leading-tight">{f.title}</span>
              <span className="mt-0.5 block text-xs font-semibold text-muted sm:text-sm">{f.text}</span>
              <span className={cx("mt-auto block pt-2 text-xs font-bold", TONE[f.tone].ink)}>{f.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
