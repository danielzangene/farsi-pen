"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Flame, Star, Zap } from "lucide-react";
import { LESSONS } from "@/content/lessons";
import { CAST, castOf, sceneOfTheDay } from "@/content/scenes";
import { SOUND_BY_ID } from "@/content/sounds";
import { dayKey } from "@/lib/gamification";
import { dailyQuests, lastWeek } from "@/lib/quests";
import { hasDeviceVoice } from "@/lib/speech";
import { nextUp, PATH_UNITS, stageCount, unitPool } from "@/lib/sound-path";
import { claimQuest, currentStreak, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { CastStack } from "../scene/Cast";
import { SayItDialog } from "../SayItButton";
import { useVoiceStatus } from "../SpeechSetup";
import { Fa, ProgressBar, TONE } from "../ui";

/** This week at a glance: a dot per day, the streak and today's XP. */
export function WeekStrip() {
  const s = useProgress();
  const week = lastWeek(s);
  const streak = currentStreak(s);
  const today = week[6];
  return (
    <section className="card p-5" aria-labelledby="week-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="week-heading" className="flex items-center gap-2 text-xl font-extrabold">
          <Flame className={cx("size-6", streak ? "fill-anar text-anar-ink" : "fill-line text-faint")} aria-hidden />
          {streak} day streak
        </h2>
        <span className="flex items-center gap-1 text-sm font-extrabold text-saffron-ink">
          <Zap className="size-4 fill-current" aria-hidden /> {today.xp} XP today
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1 text-center">
        {week.map((d) => (
          <li key={d.key} className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-extrabold text-muted" aria-hidden>
              {d.label}
            </span>
            <span
              className={cx(
                "grid aspect-square w-full max-w-10 place-items-center rounded-full border",
                d.goal ? "border-transparent bg-anar text-on-accent" : d.practised ? "border-anar bg-anar-soft text-anar-ink" : "border-line bg-paper",
                d.today && !d.goal && "ring-[3px] ring-sky/60",
              )}
              title={d.goal ? "Daily goal met" : d.practised ? "Practised" : "No practice"}
            >
              {d.goal ? <Flame className="size-4 fill-current" aria-hidden /> : null}
              <span className="sr-only">
                {d.key}: {d.goal ? "goal met" : d.practised ? "practised" : "no practice"}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm font-semibold text-muted">
        {today.goal ? "Today's goal is done. See you tomorrow." : `Reach your daily goal of ${s.settings.dailyGoal} words to keep the flame.`}
      </p>
    </section>
  );
}

/** Three small goals for today, with a bonus to collect. */
export function DailyQuests() {
  const s = useProgress();
  const quests = dailyQuests(s);
  return (
    <section className="card p-5" aria-labelledby="quests-heading">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="quests-heading" className="text-xl font-extrabold">
          Daily quests
        </h2>
        <span className="text-sm font-semibold text-muted">New every day</span>
      </div>
      <ul className="mt-4 space-y-4">
        {quests.map((q) => {
          const done = q.have >= q.need;
          return (
            <li key={q.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="flex items-center justify-between gap-2 font-bold">
                  <span className={cx(q.claimed && "text-muted line-through")}>{q.title}</span>
                  <span className="shrink-0 text-sm font-extrabold text-saffron-ink">+{q.xp} XP</span>
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <ProgressBar value={q.have / q.need} tone={done ? "pista" : "sky"} size="sm" className="flex-1" />
                  <span className="w-12 shrink-0 text-end text-xs font-bold text-muted">
                    {q.have}/{q.need}
                  </span>
                </div>
              </div>
              {done &&
                (q.claimed ? (
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pista-soft text-pista-ink" aria-label="Collected">
                    <Check className="size-5" strokeWidth={3} />
                  </span>
                ) : (
                  <button type="button" className="btn-success btn-sm shrink-0" onClick={() => claimQuest(q.id, q.xp)}>
                    Collect
                  </button>
                ))}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function SceneOfTheDay() {
  const s = useProgress();
  const sc = sceneOfTheDay(dayKey());
  const played = !!s.scenes?.[sc.id];
  return (
    <Link href={`/app/scenes/${sc.id}/`} className="tile block p-5">
      <span className="text-sm font-extrabold text-sky-ink">Scene of the day · Episode {sc.episode}</span>
      <span className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="text-xl font-extrabold">{sc.title}</span>
        <Fa className="font-bold text-muted">{sc.fa}</Fa>
      </span>
      <span className="mt-1 block font-semibold italic text-muted">{sc.setting}</span>
      <span className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-muted">
          <CastStack ids={castOf(sc)} /> Play {CAST.sara.name} or another part
        </span>
        <span className="flex shrink-0 items-center gap-1 font-extrabold text-sky-ink">
          {played ? "Again" : "Play"} <ArrowRight className="size-4" />
        </span>
      </span>
    </Link>
  );
}

/** The learner's weakest sounds, with the way to work on them. */
export function WeakSounds() {
  const s = useProgress();
  const weak = Object.entries(s.soundStats ?? {})
    .filter(([id]) => SOUND_BY_ID[id]?.hard)
    .sort((a, b) => a[1].avg - b[1].avg)
    .slice(0, 3);
  const nu = nextUp(s.soundPath ?? {});
  return (
    <section aria-labelledby="weak-heading">
      <h2 id="weak-heading" className="mb-3 text-xl font-extrabold">
        My weak sounds
      </h2>
      {weak.length ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {weak.map(([id, st]) => (
            <li key={id} className="flex items-center gap-2 rounded-full border border-line py-1 pe-3 ps-1">
              <span className="grid size-8 place-items-center rounded-full bg-paper">
                <Fa className="font-bold">{SOUND_BY_ID[id].letters.split(" ")[0]}</Fa>
              </span>
              <span className="text-sm font-bold">{SOUND_BY_ID[id].name}</span>
              <span className={cx("text-sm font-extrabold", st.avg >= 85 ? "text-pista-ink" : st.avg >= 60 ? "text-saffron-ink" : "text-anar-ink")}>{st.avg}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-3 font-semibold text-muted">Say a few words out loud and the sounds you find hardest will show up here.</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/app/sounds/" className="tile flex items-center gap-3 p-4">
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold">Sound workout</span>
            <span className="block text-sm font-semibold text-muted">Three minutes on your weakest sounds</span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted" />
        </Link>
        {nu && (
          <Link href="/app/sounds/" className="tile flex items-center gap-3 p-4">
            <span className={cx("grid size-11 shrink-0 place-items-center rounded-xl text-on-accent", TONE[nu.unit.tone].bg)}>
              <Fa className="font-bold">{nu.unit.badge}</Fa>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold">Sound path · {nu.unit.title}</span>
              <span className="block text-sm font-semibold text-muted">{nu.stage === stageCount(nu.unit) ? "Review" : `Stage ${nu.stage + 1}`}</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted" />
          </Link>
        )}
      </div>
    </section>
  );
}

/** Lessons by sound: the units of the sound path with the stars earned. */
export function SoundLessons() {
  const s = useProgress();
  return (
    <section aria-labelledby="sound-lessons">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 id="sound-lessons" className="text-xl font-extrabold">
          Lessons by sound
        </h2>
        <Link href="/app/sounds/" className="text-sm font-bold text-sky-ink">
          The whole path
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {PATH_UNITS.map((u) => {
          const rec = s.soundPath?.[u.id];
          const max = (stageCount(u) + 1) * 3;
          const stars = rec?.testedOut ? max : (rec?.stars ?? []).reduce((a, b) => a + (b ?? 0), 0);
          return (
            <li key={u.id}>
              <Link href="/app/sounds/" className="tile flex h-full flex-col p-4">
                <span className="flex items-start justify-between gap-2">
                  <span className={cx("grid size-12 place-items-center rounded-xl text-on-accent", TONE[u.tone].bg)}>
                    <Fa className="text-lg font-bold">{u.badge}</Fa>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-extrabold text-muted">
                    <Star className="size-3.5 fill-saffron text-saffron" aria-hidden /> {stars}/{max}
                  </span>
                </span>
                <span className="mt-3 block font-extrabold leading-tight">{u.title}</span>
                <span className="mt-0.5 block text-sm font-semibold text-muted">{u.subtitle}</span>
                <span className={cx("mt-auto block pt-2 text-sm font-bold", TONE[u.tone].ink)}>{unitPool(u).words.length} words</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Speaking practice by topic (each lesson's words). */
export function SpeakByTopic() {
  const [all, setAll] = useState(false);
  const shown = all ? LESSONS : LESSONS.slice(0, 6);
  return (
    <section aria-labelledby="topics-heading">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 id="topics-heading" className="text-xl font-extrabold">
          Say it by topic
        </h2>
        <span className="text-sm font-semibold text-muted">{LESSONS.length} topics</span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shown.map((l) => (
          <li key={l.id}>
            <Link href={`/app/speak/?lesson=${l.id}`} className="tile flex h-full flex-col items-center p-3 text-center">
              <span className="text-3xl" aria-hidden>
                {l.emoji}
              </span>
              <span className="mt-2 block text-sm font-extrabold leading-tight">{l.title}</span>
              <span className="mt-0.5 block text-xs font-semibold text-muted">{l.wordIds.length} words</span>
            </Link>
          </li>
        ))}
      </ul>
      {LESSONS.length > 6 && (
        <button type="button" className="btn-ghost btn-sm mt-3" onClick={() => setAll(!all)} aria-expanded={all}>
          {all ? "Show fewer" : `Show all ${LESSONS.length} topics`}
        </button>
      )}
    </section>
  );
}

/** Type any Persian and practise saying it. */
export function OwnSentence() {
  const voice = useVoiceStatus();
  const [text, setText] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const clean = text.trim();
  const persian = /[؀-ۿ]/.test(clean);
  return (
    <section className="card p-5" aria-labelledby="own-heading">
      <h2 id="own-heading" className="text-xl font-extrabold">
        Practise your own sentence
      </h2>
      <p className="mt-1 font-semibold text-muted">Type any Persian word or sentence, then say it and see each sound scored.</p>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (persian) setOpen(clean);
        }}
      >
        <input
          className="input flex-1 !text-lg"
          dir="rtl"
          lang="fa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="مثلاً: حالت چطوره؟"
          aria-label="Persian word or sentence"
        />
        <button type="submit" className="btn-primary" disabled={!persian}>
          Practise
        </button>
      </form>
      {clean && !persian && <p className="mt-2 text-sm font-bold text-anar-ink">Type it in Persian script (you can switch your keyboard to Persian).</p>}
      {voice.state !== "ready" && !hasDeviceVoice() && (
        <p className="mt-2 text-sm font-semibold text-muted">
          To hear your own sentences read aloud, download the voice in{" "}
          <Link href="/app/settings/" className="font-bold text-sky-ink underline">
            Settings
          </Link>
          .
        </p>
      )}
      {open && (
        <SayItDialog
          word={{ id: `own:${open}`, fa: open, tr: "", en: "", pos: "phrase", register: "both", soundsLike: "", example: { fa: open, tr: "", en: "" } }}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}

/** Shown until the learner has taken the placement test (and isn't far along already). */
export function PlacementPrompt() {
  const s = useProgress();
  if (s.placement || s.xp > 300) return null;
  return (
    <Link href="/app/placement/" className="tile flex items-center gap-4 p-4">
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold">Already know some Persian?</span>
        <span className="block text-sm font-semibold text-muted">Take the placement test (3–6 minutes) and start at your level.</span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-muted" />
    </Link>
  );
}
