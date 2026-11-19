"use client";
import { useState } from "react";
import Link from "next/link";
import { Headphones, Zap } from "lucide-react";
import { LESSONS } from "@/content/lessons";
import { SCENES } from "@/content/scenes";
import { WORD_BY_ID } from "@/content/words";
import { parseSource, sourceKey, type Source } from "@/lib/handsfree";
import { useHydrated, useProgress } from "@/lib/store";
import { resolveEngine } from "@/lib/stt";
import { HandsFree, type Pace } from "@/components/HandsFree";
import { PageHeader, Segmented, StatCard } from "@/components/ui";

export default function ListenPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [key, setKey] = useState<string | null>(null);
  const [pace, setPace] = useState<Pace>("medium");
  const [english, setEnglish] = useState(true);
  const [score, setScore] = useState(false);
  const [session, setSession] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<{ heard: number; xp: number } | null>(null);
  if (!hydrated) return null;

  const mine = Object.keys(s.cards).filter((id) => !s.hidden.includes(id) && WORD_BY_ID[id]).length;
  const effective = key ?? (mine ? "mine" : `lesson:${LESSONS[0].id}`);
  const source: Source = parseSource(effective);
  const isScene = source.kind === "scene";
  const label =
    source.kind === "mine" ? "My cards" : source.kind === "lesson" ? (LESSONS.find((l) => l.id === source.id)?.title ?? "Lesson") : `Scene · ${SCENES.find((x) => x.id === source.id)?.title ?? ""}`;
  const canScore = resolveEngine(s.settings.speechEngine) !== null;

  if (running)
    return (
      <div className="mx-auto max-w-3xl">
        <HandsFree
          key={session}
          source={source}
          label={label}
          pace={pace}
          englishFirst={english && !isScene}
          scoreRepeats={score && canScore}
          onExit={() => setRunning(false)}
          onDone={(heard, xp) => {
            setRunning(false);
            setDone({ heard, xp });
          }}
        />
      </div>
    );

  if (done)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-6 text-center sm:pt-12">
        <Headphones className="size-16 text-firuze-ink" strokeWidth={2.2} />
        <h1 className="mt-4 text-3xl font-extrabold text-firuze-ink">{done.heard ? "Nice listening" : "Stopped"}</h1>
        <p className="mt-2 font-semibold text-muted">{done.heard ? `You heard and repeated ${done.heard} ${done.heard === 1 ? "item" : "items"}.` : "Come back when you have a few minutes."}</p>
        {done.heard > 0 && (
          <div className="mt-6 grid w-full max-w-xs grid-cols-1">
            <StatCard label="Total XP" value={done.xp} tone="saffron" icon={<Zap className="size-5 fill-current" />} />
          </div>
        )}
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            className="btn-primary btn-lg flex-1"
            onClick={() => {
              setDone(null);
              setSession((n) => n + 1);
              setRunning(true);
            }}
            autoFocus
          >
            Play again
          </button>
          <Link href="/app/" className="btn-secondary btn-lg flex-1">
            Home
          </Link>
        </div>
      </div>
    );

  const select = "select w-full";

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Hands-free" subtitle="Phone in your pocket, earphones in: hear it, say it, repeat it. For walks, cooking and the commute." />

      <div className="card space-y-6 p-5 sm:p-6">
        <label className="block">
          <span className="text-sm font-extrabold">What to play</span>
          <select className={`${select} mt-1.5`} value={effective} onChange={(e) => setKey(e.target.value)}>
            {mine > 0 && <option value={sourceKey({ kind: "mine" })}>My cards ({mine})</option>}
            <optgroup label="Lessons">
              {LESSONS.map((l) => (
                <option key={l.id} value={sourceKey({ kind: "lesson", id: l.id })}>
                  {l.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Scenes — repeat after each line">
              {SCENES.map((x) => (
                <option key={x.id} value={sourceKey({ kind: "scene", id: x.id })}>
                  {x.episode}. {x.title}
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <div>
          <p className="mb-1.5 text-sm font-extrabold">Time to repeat</p>
          <Segmented
            label="Time to repeat"
            value={pace}
            onChange={setPace}
            options={[
              { value: "short", label: "Short" },
              { value: "medium", label: "Medium" },
              { value: "long", label: "Long" },
            ]}
          />
        </div>

        <div className="space-y-3">
          {!isScene && (
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" className="mt-1 size-5 shrink-0 accent-firuze" checked={english} onChange={(e) => setEnglish(e.target.checked)} />
              <span>
                <span className="block font-bold">Say the English first</span>
                <span className="block text-sm font-semibold text-muted">You get a moment to answer in Persian before you hear it.</span>
              </span>
            </label>
          )}
          <label className={`flex items-start gap-3 ${canScore ? "cursor-pointer" : "opacity-60"}`}>
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-firuze" checked={score && canScore} disabled={!canScore} onChange={(e) => setScore(e.target.checked)} />
            <span>
              <span className="block font-bold">Score my repeats</span>
              <span className="block text-sm font-semibold text-muted">
                {canScore ? "Listens through the mic after each line and plays a short tone: high for right, low for try again." : "This browser can't listen to speech."}
              </span>
            </span>
          </label>
        </div>

        <button
          type="button"
          className="btn-primary btn-lg w-full"
          onClick={() => {
            setSession((n) => n + 1);
            setRunning(true);
          }}
        >
          Start
        </button>
        <p className="text-sm font-semibold text-muted">Keeps the screen on while it plays. Earphone buttons pause and skip.</p>
      </div>
    </div>
  );
}
