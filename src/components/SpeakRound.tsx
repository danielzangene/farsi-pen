"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, RotateCcw, Square } from "lucide-react";
import type { Word } from "@/content/words";
import { checkSpoken, type SpeakResult } from "@/lib/pronounce";
import { type Outcome, type SessionSummary, useProgress } from "@/lib/store";
import { listen, loadWhisper, resolveEngine, SttError, whisperLoaded, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, FaWord, FeedbackSheet, ProgressBar, SessionHeader, type FeedbackState } from "./ui";

type Phase = "idle" | "preparing" | "listening" | "checking" | "done";

const ERRORS: Record<SttError["code"], string> = {
  "no-speech": "Didn't catch that — tap the mic and try again.",
  "not-allowed": "Microphone access is blocked. Allow it in your browser's site settings.",
  network: "The browser's recogniser needs internet. Try again, or switch to Whisper in Settings.",
  unsupported: "Persian recognition isn't available here. Switch to Whisper in Settings.",
  aborted: "",
  failed: "Something went wrong — try again.",
};

/**
 * Speaking practice: hear the word, say it, and see how close it sounded.
 * Up to three tries per word; the first try sets the outcome.
 */
export function SpeakRound({ words, onDone, exitHref = "/app/speak/" }: { words: Word[]; onDone: (r: SessionSummary) => void; exitHref?: string }) {
  const { settings } = useProgress();
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [prep, setPrep] = useState(0);
  const [result, setResult] = useState<SpeakResult | null>(null);
  const [tries, setTries] = useState(0);
  const [error, setError] = useState("");
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>({});
  const [correct, setCorrect] = useState(0);
  const live = useRef<Listening | null>(null);

  const word = words[i];
  const engine = resolveEngine(settings.speechEngine);
  const targets = [word.fa, word.fa.replace(/[!؟?.،,]/g, "")];

  useEffect(() => () => live.current?.cancel(), []);

  const start = async () => {
    if (!engine || phase === "listening" || phase === "checking" || phase === "preparing") return;
    setError("");
    setResult(null);
    if (engine === "whisper" && !whisperLoaded()) {
      setPhase("preparing");
      try {
        await loadWhisper(setPrep);
      } catch {
        setPhase("idle");
        setError("Couldn't download the Whisper model. Check your connection and try again.");
        return;
      }
    }
    let l: Listening;
    try {
      l = listen(engine);
    } catch (e) {
      setPhase("idle");
      setError(e instanceof SttError ? ERRORS[e.code] : ERRORS.failed);
      return;
    }
    live.current = l;
    setPhase("listening");
    // Whisper transcribes after recording stops; show that as "checking".
    const stopWatch = engine === "whisper" ? setTimeout(() => setPhase((p) => (p === "listening" ? "checking" : p)), 5000) : null;
    try {
      const heard = await l.result;
      const r = checkSpoken(heard, targets);
      setResult(r);
      setPhase("done");
      setTries((n) => n + 1);
      if (!(word.id in outcomes)) {
        setOutcomes((o) => ({ ...o, [word.id]: r.verdict === "correct" ? "good" : r.verdict === "almost" ? "hard" : "again" }));
        if (r.verdict !== "wrong") setCorrect((n) => n + 1);
      }
    } catch (e) {
      setPhase("idle");
      const code = e instanceof SttError ? e.code : "failed";
      if (code !== "aborted") setError(ERRORS[code]);
    } finally {
      if (stopWatch) clearTimeout(stopWatch);
      live.current = null;
    }
  };

  const stop = () => {
    if (phase !== "listening") return;
    live.current?.stop();
    if (engine === "whisper") setPhase("checking");
  };

  const next = () => {
    const out = word.id in outcomes ? outcomes : { ...outcomes, [word.id]: "again" as Outcome };
    if (i + 1 >= words.length) {
      onDone({ correct, total: words.length, outcomes: out });
      return;
    }
    setOutcomes(out);
    setI(i + 1);
    setPhase("idle");
    setResult(null);
    setTries(0);
    setError("");
  };

  const fb: FeedbackState = phase !== "done" || !result ? "idle" : result.verdict;
  const canRetry = phase === "done" && result?.verdict !== "correct" && tries < 3;
  const listening = phase === "listening";
  const busy = phase === "preparing" || phase === "checking";

  return (
    <div>
      <SessionHeader exitHref={exitHref} progress={(i + (phase === "done" ? 1 : 0)) / words.length} right={<span className="eyebrow text-muted">{i + 1}/{words.length}</span>} />
      <h1 className="text-2xl font-extrabold">Say this out loud</h1>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <FaWord word={word} settings={settings} size="xl" />
        <p className="text-lg font-bold text-muted">{word.en}</p>
        {!settings.scriptOnly && <p className="text-sm font-semibold text-muted">sounds like “{word.soundsLike}”</p>}
        <AudioButtons text={word.fa} big />
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        {engine ? (
          <>
            <span className="relative grid place-items-center">
              {listening && <span className="absolute inset-0 animate-ping rounded-full bg-anar/30" aria-hidden />}
              <button
                type="button"
                onClick={listening ? stop : start}
                disabled={busy || (phase === "done" && !canRetry)}
                aria-label={listening ? "Stop recording" : "Start speaking"}
                className={cx("btn-icon relative !size-24 !rounded-full", listening ? "btn-danger" : "btn-primary")}
              >
                {busy ? <Loader2 className="size-10 animate-spin" /> : listening ? <Square className="size-9 fill-current" /> : <Mic className="size-11" />}
              </button>
            </span>
            <p role="status" className="min-h-6 font-bold text-muted">
              {phase === "preparing"
                ? `Downloading speech model… ${Math.round(prep * 100)}%`
                : listening
                  ? engine === "whisper"
                    ? "Listening… tap to stop"
                    : "Listening…"
                  : phase === "checking"
                    ? "Checking…"
                    : phase === "done"
                      ? canRetry
                        ? "Tap to try again"
                        : ""
                      : "Tap the mic, then say the word"}
            </p>
            {phase === "preparing" && <ProgressBar value={prep} tone="sky" size="sm" className="w-56" />}
            {error && <p className="max-w-sm text-center text-sm font-bold text-anar-ink">{error}</p>}
          </>
        ) : (
          <p className="card max-w-sm p-4 text-center font-semibold text-muted">
            This browser can&apos;t listen to speech. Try Chrome, Edge or Safari, or allow microphone access.
          </p>
        )}
      </div>

      <FeedbackSheet
        state={fb}
        title={result?.verdict === "correct" ? "Spot on!" : result?.verdict === "almost" ? "Almost — sounds close." : "Not quite yet."}
        detail={
          result && (
            <span className="flex flex-wrap items-center gap-x-2">
              We heard <Fa className="text-base font-bold">{result.heard || "…"}</Fa> · {result.score}% match
            </span>
          )
        }
        onContinue={next}
        continueLabel={i + 1 >= words.length ? "Finish" : "Continue"}
      >
        <button type="button" className="btn-ghost w-full sm:w-auto" onClick={next}>
          Skip
        </button>
        <span className="hidden text-sm font-semibold text-muted sm:block">Listen first, then speak clearly and close to the mic.</span>
      </FeedbackSheet>
      {canRetry && (
        <div className="fixed inset-x-0 bottom-44 z-40 flex justify-center sm:bottom-32">
          <button type="button" className="btn-secondary btn-sm shadow-lg" onClick={start}>
            <RotateCcw className="size-4" /> Try again ({3 - tries} left)
          </button>
        </div>
      )}
    </div>
  );
}
