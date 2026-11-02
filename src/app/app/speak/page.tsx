"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, PartyPopper, Target, Zap } from "lucide-react";
import { LESSONS } from "@/content/lessons";
import { WORD_BY_ID, type Word } from "@/content/words";
import { hasDeviceVoice } from "@/lib/speech";
import { completeSpeaking, useHydrated, useProgress, type SessionSummary } from "@/lib/store";
import { resolveEngine } from "@/lib/stt";
import { shuffle } from "@/lib/util";
import { SpeakRound } from "@/components/SpeakRound";
import { useVoiceStatus, VoiceSetup } from "@/components/SpeechSetup";
import { StatCard } from "@/components/ui";

const SESSION = 8;

export default function SpeakPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const voice = useVoiceStatus();
  const [deviceVoice, setDeviceVoice] = useState(true);
  const [source, setSource] = useState("mine");
  const [session, setSession] = useState<Word[] | null>(null);
  const [result, setResult] = useState<{ r: SessionSummary; xp: number } | null>(null);
  const [round, setRound] = useState(0);
  useEffect(() => {
    setDeviceVoice(hasDeviceVoice());
    // Opened from the Word Library with a lesson filter: start with those words.
    const lesson = new URLSearchParams(window.location.search).get("lesson");
    if (lesson && LESSONS.some((l) => l.id === lesson)) setSource(lesson);
  }, []);

  const mine = Object.keys(s.cards).filter((id) => !s.hidden.includes(id) && WORD_BY_ID[id]);
  const effective = source === "mine" && mine.length === 0 ? LESSONS[0].id : source;

  const start = () => {
    const ids = effective === "mine" ? shuffle(mine).slice(0, SESSION) : shuffle(LESSONS.find((l) => l.id === effective)?.wordIds ?? []).slice(0, SESSION);
    setSession(ids.map((id) => WORD_BY_ID[id]).filter(Boolean));
    setResult(null);
    setRound((n) => n + 1);
  };

  if (!hydrated) return null;

  if (session && !result)
    return (
      <div className="mx-auto max-w-3xl">
        <SpeakRound key={round} words={session} onDone={(r) => setResult({ r, xp: completeSpeaking(r) })} />
      </div>
    );

  if (result)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-4 text-center sm:pt-10">
        <span className="grid size-24 animate-pop place-items-center rounded-full bg-saffron text-on-accent">
          <PartyPopper className="size-12" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">Nicely said!</h1>
        <p className="mt-2 font-semibold text-muted">Speaking out loud is the fastest way to sound natural.</p>
        <div className="mt-6 grid w-full grid-cols-3 gap-3">
          <StatCard label="Total XP" value={result.xp} tone="saffron" icon={<Zap className="size-5 fill-current" />} />
          <StatCard label="Accuracy" value={`${Math.round((result.r.correct / result.r.total) * 100)}%`} tone="pista" icon={<Target className="size-5" />} />
          <StatCard label="Words" value={result.r.total} tone="sky" icon={<Mic className="size-5" />} />
        </div>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse">
          <Link href="/app/" className="btn-primary btn-lg flex-1" autoFocus>
            Continue
          </Link>
          <button type="button" className="btn-secondary btn-lg flex-1" onClick={start}>
            Speak again
          </button>
        </div>
      </div>
    );

  const engine = resolveEngine(s.settings.speechEngine);
  const select = "min-h-12 w-full cursor-pointer rounded-2xl border-2 border-field-edge bg-paper px-3 text-sm font-bold text-ink transition-colors focus:border-sky focus:bg-card";

  return (
    <div className="mx-auto max-w-xl space-y-6 pt-4 sm:pt-10">
      <div className="card flex flex-col items-center p-6 text-center sm:p-8">
        <span className="grid size-20 place-items-center rounded-full bg-anar-soft text-anar-ink">
          <Mic className="size-10" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Speaking practice</h1>
        <p className="mt-2 max-w-sm font-semibold text-muted">
          Hear each word, say it out loud, and we&apos;ll tell you how close it sounded. {SESSION} words, about two minutes.
        </p>
        <label className="mt-6 block w-full max-w-xs text-left">
          <span className="eyebrow text-muted">Words</span>
          <select className={`${select} mt-1.5`} value={effective} onChange={(e) => setSource(e.target.value)}>
            {mine.length > 0 && <option value="mine">My words ({mine.length})</option>}
            {LESSONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn-primary btn-lg mt-6 w-full sm:min-w-56 sm:w-auto" onClick={start} disabled={!engine} autoFocus>
          Start
        </button>
        {!engine && (
          <p className="mt-3 max-w-sm text-sm font-bold text-anar-ink">
            This browser can&apos;t listen to speech. Try Chrome, Edge or Safari, or pick another engine in{" "}
            <Link href="/app/settings/" className="underline">
              Settings
            </Link>
            .
          </p>
        )}
      </div>

      {voice.state !== "ready" && (
        <section className="card p-5">
          <h2 className="eyebrow text-sky-ink">Hear a natural voice</h2>
          <p className="mb-3 mt-1 text-sm font-semibold text-muted">
            {deviceVoice ? "Your device has a Persian voice. For a clearer, more natural one that also works offline:" : "Words play with an online voice right now. Download a natural voice to hear them offline:"}
          </p>
          <VoiceSetup compact />
        </section>
      )}
    </div>
  );
}
