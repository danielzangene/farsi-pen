"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { buildItems, repeatGap, type HandsFreeItem, type Source } from "@/lib/handsfree";
import { analyzeSpoken, type PhonicsResult } from "@/lib/phonics";
import { checkSpoken, type SpeakVerdict } from "@/lib/pronounce";
import { speak, speakEnglish, stopSpeaking } from "@/lib/speech";
import { completeHandsFree, recordSounds, useProgress } from "@/lib/store";
import { listen, resolveEngine, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { ColoredWord } from "./PronunciationFeedback";
import { Fa, ProgressBar, SessionHeader } from "./ui";

export type Pace = "short" | "medium" | "long";
type Step = "en" | "try" | "fa" | "repeat" | "listen" | "again" | "between";

const STEP_TEXT: Record<Step, string> = {
  en: "Listen",
  try: "Say it in Persian…",
  fa: "Listen",
  repeat: "Your turn — say it",
  listen: "Your turn — say it",
  again: "Once more",
  between: "",
};

// Short tones for hands-free scoring, made on the fly (no files).
let ctx: AudioContext | null = null;
function chime(v: SpeakVerdict) {
  if (!ctx) return;
  const notes = v === "correct" ? [660, 880] : v === "almost" ? [660] : [330];
  notes.forEach((f, i) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, ctx!.currentTime + i * 0.14);
    g.gain.exponentialRampToValueAtTime(0.25, ctx!.currentTime + i * 0.14 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx!.currentTime + i * 0.14 + 0.25);
    o.connect(g).connect(ctx!.destination);
    o.start(ctx!.currentTime + i * 0.14);
    o.stop(ctx!.currentTime + i * 0.14 + 0.3);
  });
}

/**
 * Hands-free player: each item is read out (English first, if chosen), with
 * a pause to answer, then the Persian and a pause to repeat it. Keeps the
 * screen awake and answers headphone / lock-screen play, pause and skip.
 */
export function HandsFree({
  source,
  label,
  pace,
  englishFirst,
  scoreRepeats,
  onExit,
  onDone,
}: {
  source: Source;
  label: string;
  pace: Pace;
  englishFirst: boolean;
  scoreRepeats: boolean;
  onExit: () => void;
  onDone: (heard: number, xp: number) => void;
}) {
  const s = useProgress();
  const [items] = useState<HandsFreeItem[]>(() => buildItems(source, s));
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState<Step>("between");
  const [playing, setPlaying] = useState(false);
  const [gap, setGap] = useState<{ ms: number; left: number } | null>(null);
  const [take, setTake] = useState<{ i: number; verdict: SpeakVerdict; score: number; phonics: PhonicsResult } | null>(null);
  const run = useRef(0);
  const live = useRef<Listening | null>(null);
  const reached = useRef(0);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);
  const engine = scoreRepeats ? resolveEngine(s.settings.speechEngine) : null;

  const stopAll = useCallback(() => {
    run.current++;
    live.current?.cancel();
    live.current = null;
    stopSpeaking();
    setGap(null);
  }, []);

  const keepAwake = async (on: boolean) => {
    try {
      if (on && !wake.current && "wakeLock" in navigator) wake.current = await (navigator as Navigator & { wakeLock: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock.request("screen");
      if (!on && wake.current) {
        await wake.current.release();
        wake.current = null;
      }
    } catch {
      // Not allowed here (battery saver, old browser): the player still works with the screen on.
    }
  };

  const finish = useCallback(() => {
    const heard = Math.min(items.length, reached.current);
    onDone(heard, completeHandsFree(heard));
  }, [items.length, onDone]);

  const playFrom = useCallback(
    async (start: number) => {
      const id = ++run.current;
      const alive = () => run.current === id;
      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          const end = Date.now() + ms;
          setGap({ ms, left: ms });
          const t = setInterval(() => {
            if (!alive()) {
              clearInterval(t);
              return resolve();
            }
            const left = end - Date.now();
            setGap({ ms, left: Math.max(0, left) });
            if (left <= 0) {
              clearInterval(t);
              setGap(null);
              resolve();
            }
          }, 100);
        });
      setPlaying(true);
      void keepAwake(true);
      for (let i = start; i < items.length; i++) {
        if (!alive()) return;
        const it = items[i];
        setIdx(i);
        setTake(null);
        reached.current = Math.max(reached.current, i);
        if (englishFirst) {
          setStep("en");
          await speakEnglish(it.en);
          if (!alive()) return;
          setStep("try");
          await wait(pace === "short" ? 2000 : pace === "long" ? 4000 : 3000);
          if (!alive()) return;
        }
        setStep("fa");
        const t0 = Date.now();
        await speak(it.fa);
        const took = Date.now() - t0;
        if (!alive()) return;
        if (engine) {
          setStep("listen");
          try {
            const l = listen(engine, repeatGap(took, pace) + 1500);
            live.current = l;
            const heard = await l.result;
            if (!alive()) return;
            const r = checkSpoken(heard, [it.fa, it.fa.replace(/[!؟?.،,…]/g, "")]);
            const p = analyzeSpoken(r.verdict === "correct" ? [it.fa] : heard, it.fa);
            recordSounds(p.sounds);
            setTake({ i, verdict: r.verdict, score: r.score, phonics: p });
            chime(r.verdict);
            await wait(1200);
          } catch {
            if (!alive()) return;
            await wait(600); // nothing heard: carry on
          } finally {
            live.current = null;
          }
        } else {
          setStep("repeat");
          await wait(repeatGap(took, pace));
        }
        if (!alive()) return;
        if (!it.who) {
          setStep("again");
          await speak(it.fa);
          if (!alive()) return;
        }
        reached.current = Math.max(reached.current, i + 1);
        setStep("between");
        await wait(700);
      }
      if (!alive()) return;
      setPlaying(false);
      void keepAwake(false);
      finish();
    },
    [items, englishFirst, pace, engine, finish],
  );

  const pause = useCallback(() => {
    stopAll();
    setPlaying(false);
    setStep("between");
    void keepAwake(false);
  }, [stopAll]);
  const resume = useCallback(() => void playFrom(idx), [playFrom, idx]);
  const jump = useCallback(
    (to: number) => {
      stopAll();
      const i = Math.max(0, Math.min(items.length - 1, to));
      setIdx(i);
      void playFrom(i);
    },
    [stopAll, items.length, playFrom],
  );

  // Start as soon as the player opens (the Start tap unlocked audio).
  useEffect(() => {
    if (!ctx && typeof AudioContext !== "undefined" && scoreRepeats) ctx = new AudioContext();
    if (items.length) void playFrom(0);
    return () => {
      stopAll();
      void keepAwake(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Headphone and lock-screen controls.
  useEffect(() => {
    const ms = typeof navigator !== "undefined" ? navigator.mediaSession : undefined;
    const it = items[idx];
    if (!ms || !it) return;
    try {
      ms.metadata = new MediaMetadata({ title: it.en, artist: "Farsi Pen · hands-free", album: label });
      ms.setActionHandler("play", resume);
      ms.setActionHandler("pause", pause);
      ms.setActionHandler("nexttrack", () => jump(idx + 1));
      ms.setActionHandler("previoustrack", () => jump(idx - 1));
    } catch {}
  }, [idx, items, label, resume, pause, jump]);
  useEffect(
    () => () => {
      try {
        const ms = navigator.mediaSession;
        (["play", "pause", "nexttrack", "previoustrack"] as const).forEach((a) => ms?.setActionHandler(a, null));
      } catch {}
    },
    [],
  );

  // Keep the screen awake again after coming back to the tab.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && playing) {
        wake.current = null;
        void keepAwake(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  const it = items[idx];
  if (!it)
    return (
      <div className="mx-auto max-w-md pt-10 text-center">
        <p className="text-xl font-extrabold">Nothing to play yet</p>
        <p className="mt-2 font-semibold text-muted">Learn a few words in a lesson first, or pick a lesson or scene.</p>
        <button type="button" className="btn-primary mt-6" onClick={onExit}>
          Back
        </button>
      </div>
    );

  const showPersian = !(englishFirst && (step === "en" || step === "try"));

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col">
      <SessionHeader
        exitHref="/app/listen/"
        onExit={() => {
          pause();
          finish();
        }}
        progress={reached.current / items.length}
        right={
          <span className="eyebrow text-muted">
            {idx + 1}/{items.length}
          </span>
        }
      />
      <p className="text-sm font-bold text-muted">{label}</p>

      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        {it.who && <p className="mb-2 text-sm font-extrabold text-muted">{it.who}</p>}
        <p className="text-2xl font-extrabold sm:text-3xl">{it.en}</p>
        <div className={cx("mt-6 min-h-24 transition-opacity", showPersian ? "opacity-100" : "opacity-0")} aria-hidden={!showPersian}>
          {take && take.i === idx ? (
            <ColoredWord letters={take.phonics.letters} className="text-4xl sm:text-5xl" />
          ) : (
            <p>
              <Fa className="text-4xl font-bold leading-relaxed sm:text-5xl">{it.fa}</Fa>
            </p>
          )}
          {!s.settings.scriptOnly && <p className="mt-1 text-lg font-semibold text-muted">{it.tr}</p>}
        </div>

        <div className="mt-8 h-14 w-full max-w-xs">
          <p role="status" className={cx("text-lg font-extrabold", step === "repeat" || step === "listen" || step === "try" ? "text-firuze-ink" : "text-muted")}>
            {!playing ? "Paused" : take && take.i === idx ? `${take.verdict === "correct" ? "Spot on" : take.verdict === "almost" ? "Close" : "Not quite"} · ${take.score}%` : STEP_TEXT[step]}
          </p>
          {gap && playing && <ProgressBar value={gap.left / gap.ms} tone="firuze" size="sm" className="mt-2" />}
        </div>
      </div>

      <div className="sticky bottom-0 flex items-center justify-center gap-6 bg-card pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <button type="button" className="btn-ghost btn-icon !size-14" onClick={() => jump(idx - 1)} disabled={idx === 0} aria-label="Previous">
          <SkipBack className="size-7" />
        </button>
        <button type="button" className="btn-primary btn-icon !size-20 !rounded-full" onClick={playing ? pause : resume} aria-label={playing ? "Pause" : "Play"} autoFocus>
          {playing ? <Pause className="size-9 fill-current" /> : <Play className="size-9 fill-current" />}
        </button>
        <button type="button" className="btn-ghost btn-icon !size-14" onClick={() => jump(idx + 1)} disabled={idx >= items.length - 1} aria-label="Next">
          <SkipForward className="size-7" />
        </button>
      </div>
    </div>
  );
}
