"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AudioLines, PartyPopper, Star, Target, X, Zap } from "lucide-react";
import { HARD_SOUNDS, SOUND_BY_ID, SOUNDS, type Sound } from "@/content/sounds";
import type { Word } from "@/content/words";
import { buildWorkout, pickSounds, soundLevel, wordsForSound, type WorkoutItem } from "@/lib/sound-workout";
import { passedTestOut, stageCount, stageItems, starsFor, testOutItems } from "@/lib/sound-path";
import { completeSoundStage, completeSpeaking, useHydrated, useProgress, type SessionSummary, type SoundStat } from "@/lib/store";
import { resolveEngine } from "@/lib/stt";
import { cx } from "@/lib/util";
import { SoundTipCard } from "@/components/PronunciationFeedback";
import { SayItButton } from "@/components/SayItButton";
import { NextUpCard, SoundPathList, type PathPlay } from "@/components/SoundPath";
import { SpeakRound } from "@/components/SpeakRound";
import { AudioButtons, Fa, PageHeader, ProgressBar, StatCard } from "@/components/ui";

const LEVEL = {
  new: { text: "Not tried", chip: "bg-paper text-muted" },
  weak: { text: "Needs work", chip: "bg-anar-soft text-anar-ink" },
  ok: { text: "Getting there", chip: "bg-saffron-soft text-saffron-ink" },
  solid: { text: "Solid", chip: "bg-pista-soft text-pista-ink" },
} as const;

type Session = { items: WorkoutItem[]; before: Record<string, SoundStat>; sounds: string[] };

export default function SoundsPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [session, setSession] = useState<Session | null>(null);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<{ r: SessionSummary; xp: number } | null>(null);
  const [open, setOpen] = useState<Sound | null>(null);
  const [path, setPath] = useState<(PathPlay & { words: Word[] }) | null>(null);
  const [pathResult, setPathResult] = useState<{ xp: number; stars: number; correct: number; total: number; passed: boolean } | null>(null);

  const stats = s.soundStats ?? {};
  const next = pickSounds(stats);
  const engine = hydrated ? resolveEngine(s.settings.speechEngine) : null;

  const start = (sounds: string[], perSound = 3) => {
    setOpen(null);
    setSession({ items: buildWorkout(sounds, perSound), before: { ...stats }, sounds });
    setResult(null);
    setRound((n) => n + 1);
  };

  const playPath = (p: PathPlay) => {
    const rec = s.soundPath?.[p.unit.id];
    const words = p.stage === "test" ? testOutItems(p.unit) : stageItems(p.unit, p.stage, rec);
    setPathResult(null);
    setPath({ ...p, words });
    setRound((n) => n + 1);
  };

  if (!hydrated) return null;

  if (path && !pathResult)
    return (
      <div className="mx-auto max-w-3xl">
        <SpeakRound
          key={round}
          words={path.words}
          focus={Object.fromEntries(path.words.map((w) => [w.id, path.unit.sounds[0]]))}
          exitHref="/app/sounds/"
          onDone={(r) => {
            const stars = starsFor(r.correct, r.total);
            const passed = path.stage === "test" && passedTestOut(r.correct, r.total);
            const xp = completeSoundStage(path.unit.id, path.stage, r.outcomes, stars, passed);
            setPathResult({ xp, stars, correct: r.correct, total: r.total, passed });
          }}
        />
      </div>
    );

  if (path && pathResult) {
    const test = path.stage === "test";
    const n = stageCount(path.unit);
    const nextStage = typeof path.stage === "number" && path.stage < n ? path.stage + 1 : null;
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-6 text-center sm:pt-12">
        <Fa className="text-5xl font-bold">{path.unit.badge}</Fa>
        <h1 className="mt-4 text-3xl font-extrabold">
          {test ? (pathResult.passed ? "Tested out!" : "Not yet") : path.stage === n ? "Review done" : `Stage ${(path.stage as number) + 1} done`}
        </h1>
        <p className="mt-2 font-semibold text-muted">
          {test
            ? pathResult.passed
              ? `You can already say ${path.unit.title.toLowerCase()} — the next unit is open.`
              : "Worth working through the stages — they're short."
            : `${pathResult.correct} of ${pathResult.total} said well.`}
        </p>
        {!test && (
          <span className="mt-5 flex gap-2" aria-label={`${pathResult.stars} of 3 stars`}>
            {[1, 2, 3].map((i) => (
              <Star key={i} className={cx("size-12 animate-pop", i <= pathResult.stars ? "fill-saffron text-saffron" : "text-line-strong")} strokeWidth={2} />
            ))}
          </span>
        )}
        <p className="mt-4 font-extrabold text-saffron-ink">+{pathResult.xp} XP</p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          {nextStage !== null && nextStage <= n && (
            <button type="button" className="btn-primary btn-lg" onClick={() => playPath({ unit: path.unit, stage: nextStage })} autoFocus>
              {nextStage === n ? "Go to the review" : `Stage ${nextStage + 1}`}
            </button>
          )}
          <button type="button" className={nextStage !== null && nextStage <= n ? "btn-secondary btn-lg" : "btn-primary btn-lg"} onClick={() => setPath(null)}>
            Back to the path
          </button>
        </div>
      </div>
    );
  }

  if (session && !result)
    return (
      <div className="mx-auto max-w-3xl">
        <SpeakRound
          key={round}
          words={session.items.map((x) => x.word)}
          focus={Object.fromEntries(session.items.map((x) => [x.word.id, x.sound]))}
          exitHref="/app/sounds/"
          onDone={(r) => setResult({ r, xp: completeSpeaking(r) })}
        />
      </div>
    );

  if (session && result)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-4 text-center sm:pt-10">
        <span className="grid size-24 animate-pop place-items-center rounded-full bg-saffron text-on-accent">
          <PartyPopper className="size-12" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">Workout done!</h1>
        <p className="mt-2 font-semibold text-muted">Little and often is how new sounds settle in.</p>
        <div className="mt-6 grid w-full grid-cols-3 gap-3">
          <StatCard label="Total XP" value={result.xp} tone="saffron" icon={<Zap className="size-5 fill-current" />} />
          <StatCard label="Accuracy" value={`${Math.round((result.r.correct / result.r.total) * 100)}%`} tone="pista" icon={<Target className="size-5" />} />
          <StatCard label="Words" value={result.r.total} tone="sky" icon={<AudioLines className="size-5" />} />
        </div>
        <ul className="mt-6 w-full space-y-3 text-start">
          {session.sounds.map((id) => {
            const snd = SOUND_BY_ID[id];
            const was = session.before[id]?.avg;
            const now = stats[id]?.avg;
            return (
              <li key={id} className="card flex items-center gap-3 p-3">
                <Fa className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper text-xl font-bold">{snd.letters.split(" ")[0]}</Fa>
                <div className="min-w-0 flex-1">
                  <p className="flex justify-between gap-2 font-extrabold">
                    <span>{snd.name}</span>
                    <span className="text-sm text-muted">
                      {was !== undefined && now !== undefined && was !== now ? `${was}% → ${now}%` : now !== undefined ? `${now}%` : "—"}
                    </span>
                  </p>
                  <ProgressBar value={(now ?? 0) / 100} tone={soundLevel(stats[id]) === "solid" ? "pista" : soundLevel(stats[id]) === "ok" ? "saffron" : "anar"} size="sm" className="mt-1" />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse">
          <button type="button" className="btn-primary btn-lg flex-1" onClick={() => setSession(null)} autoFocus>
            Continue
          </button>
          <button type="button" className="btn-secondary btn-lg flex-1" onClick={() => start(session.sounds)}>
            Go again
          </button>
        </div>
      </div>
    );

  const easy = SOUNDS.filter((x) => !x.hard);
  const tried = HARD_SOUNDS.filter((x) => stats[x.id]).length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Persian sounds" subtitle="The sounds English doesn't have: a path of short stages, a guide to making each one, and a daily workout on your weakest." />

      <NextUpCard all={s.soundPath ?? {}} onPlay={playPath} disabled={!engine} />

      <section aria-labelledby="path-heading">
        <h2 id="path-heading" className="mb-3 text-lg font-extrabold">
          The sound path
        </h2>
        <SoundPathList all={s.soundPath ?? {}} onPlay={playPath} onInfo={(u) => setOpen(SOUND_BY_ID[u.sounds[0]])} disabled={!engine} />
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="workout-heading">
        <div>
          <div>
            <h2 id="workout-heading" className="text-xl font-extrabold">
              Quick workout
            </h2>
            <p className="mt-1 font-semibold text-muted">
              {tried ? "Three minutes on your weakest sounds, from anywhere on the path." : "Three sounds, three words each — about three minutes."} {next.length * 3} words.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {next.map((id) => (
                <li key={id} className="chip flex items-center gap-1.5 bg-paper">
                  <Fa className="font-bold">{SOUND_BY_ID[id].letters.split(" ")[0]}</Fa> {SOUND_BY_ID[id].name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button type="button" className="btn-primary btn-lg mt-5 w-full sm:w-auto sm:min-w-56" onClick={() => start(next)} disabled={!engine}>
          Start workout
        </button>
        {!engine && (
          <p className="mt-3 text-sm font-bold text-anar-ink">
            This browser can&apos;t listen to speech. Try Chrome, Edge or Safari, or pick another engine in{" "}
            <Link href="/app/settings/" className="underline">
              Settings
            </Link>
            .
          </p>
        )}
      </section>

      <section aria-labelledby="hard-heading">
        <h2 id="hard-heading" className="eyebrow mb-3 text-muted">
          Sound guide
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {HARD_SOUNDS.map((snd) => {
            const st = stats[snd.id];
            const lv = LEVEL[soundLevel(st)];
            return (
              <li key={snd.id}>
                <button type="button" className="tile flex h-full w-full items-center gap-3 p-3 text-start" onClick={() => setOpen(snd)}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper">
                    <Fa className="text-2xl font-bold">{snd.letters.split(" ")[0]}</Fa>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2">
                      <span className="font-extrabold">{snd.name}</span>
                      <span className={cx("chip !py-0.5 text-xs", lv.chip)}>{st ? `${st.avg}%` : lv.text}</span>
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-muted">Like {snd.like}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="easy-heading">
        <h2 id="easy-heading" className="eyebrow mb-1 text-muted">
          Same as in English
        </h2>
        <p className="mb-3 text-sm font-semibold text-muted">These letters sound just like their English partners.</p>
        <ul className="flex flex-wrap gap-2">
          {easy.map((snd) => (
            <li key={snd.id} className="flex items-center gap-2 rounded-xl border border-line py-1 pe-1 ps-3" title={`Like ${snd.like}`}>
              <Fa className="font-bold">{snd.letters}</Fa>
              <span className="text-sm font-bold text-muted">{snd.label}</span>
              <AudioButtons text={snd.examples[0].fa} compact />
            </li>
          ))}
        </ul>
      </section>

      {open && <SoundDialog sound={open} canPractise={!!engine && practisable(open)} onPractise={() => start([open.id], 5)} onClose={() => setOpen(null)} />}
    </div>
  );
}

const practisable = (x: Sound) => x.id !== "glottal" && wordsForSound(x.id, 1).length > 0;

function SoundDialog({ sound, canPractise, onPractise, onClose }: { sound: Sound; canPractise: boolean; onPractise: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { settings } = useProgress();
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  const words = wordsForSound(sound.id, 6);
  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="card m-auto !rounded-[1.75rem] max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] animate-pop overflow-y-auto p-0 text-ink backdrop:bg-black/40"
      aria-label={`The ${sound.name} sound`}
    >
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <p className="eyebrow text-saffron-ink">Persian sound</p>
          <button type="button" className="btn-ghost btn-icon -mr-2 -mt-2" onClick={onClose} aria-label="Close">
            <X className="size-6" />
          </button>
        </div>
        <SoundTipCard sound={sound} />
        {words.length > 0 && (
          <>
            <p className="eyebrow mb-2 mt-5 text-muted">Words from the course</p>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {words.map((w) => (
                <li key={w.id} className="flex items-center gap-2 py-1.5 pe-1 ps-3">
                  <Fa className="text-lg font-bold">{w.fa}</Fa>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-muted">
                    {!settings.scriptOnly && `${w.tr} · `}
                    {w.en}
                  </span>
                  <AudioButtons text={w.fa} compact />
                  <SayItButton word={w} />
                </li>
              ))}
            </ul>
          </>
        )}
        {canPractise && (
          <button type="button" className="btn-primary mt-5 w-full" onClick={onPractise}>
            Practise this sound · 5 words
          </button>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
