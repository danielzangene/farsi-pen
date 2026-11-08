"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CheckCircle2, CircleAlert, Loader2, Mic, Square, X, XCircle } from "lucide-react";
import type { Word } from "@/content/words";
import { analyzeSpoken, type PhonicsResult } from "@/lib/phonics";
import { checkSpoken, type SpeakResult } from "@/lib/pronounce";
import { recordSounds, useProgress } from "@/lib/store";
import { listen, loadWhisper, resolveEngine, SttError, whisperLoaded, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { PronunciationFeedback } from "./PronunciationFeedback";
import { AudioButtons, FaWord, Fa } from "./ui";

/** Mic button on a word card: say the word and see how close it sounded. */
export function SayItButton({ word }: { word: Word }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-ghost btn-icon !text-anar-ink" onClick={() => setOpen(true)} aria-label={`Say “${word.tr}” and check your pronunciation`} title="Say it">
        <Mic className="size-5" />
      </button>
      {open && <SayItDialog word={word} onClose={() => setOpen(false)} />}
    </>
  );
}

type Phase = "idle" | "loading" | "listening" | "checking" | "done";

const ERRORS: Record<SttError["code"], string> = {
  "no-speech": "Didn't catch that — tap the mic and try again.",
  "not-allowed": "Microphone access is blocked. Allow it in your browser's site settings.",
  network: "The browser's recogniser needs internet. Try again, or switch to Whisper in Settings.",
  unsupported: "Persian recognition isn't available here. Switch to Whisper in Settings.",
  aborted: "",
  failed: "Something went wrong — try again.",
};

function SayItDialog({ word, onClose }: { word: Word; onClose: () => void }) {
  const { settings } = useProgress();
  const ref = useRef<HTMLDialogElement>(null);
  const live = useRef<Listening | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<SpeakResult | null>(null);
  const [phonics, setPhonics] = useState<PhonicsResult | null>(null);
  const [take, setTake] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const engine = resolveEngine(settings.speechEngine);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    return () => live.current?.cancel();
  }, []);

  const start = async () => {
    if (!engine) return;
    if (phase === "listening") {
      live.current?.stop();
      if (engine === "whisper") setPhase("checking");
      return;
    }
    setError("");
    setResult(null);
    setPhonics(null);
    setTake(null);
    try {
      if (engine === "whisper" && !whisperLoaded()) {
        setPhase("loading");
        await loadWhisper();
      }
      const l = listen(engine, 5000, { record: true });
      live.current = l;
      setPhase("listening");
      const heard = await l.result;
      const r = checkSpoken(heard, [word.fa, word.fa.replace(/[!؟?.،,]/g, "")]);
      const p = analyzeSpoken(r.verdict === "correct" ? [word.fa] : heard, word.fa);
      setResult(r);
      setPhonics(p);
      setTake(await Promise.race([l.audio, new Promise<null>((res) => setTimeout(() => res(null), 1500))]));
      recordSounds(p.sounds);
      setPhase("done");
    } catch (e) {
      const code = e instanceof SttError ? e.code : "failed";
      setPhase("idle");
      if (code !== "aborted") setError(ERRORS[code]);
    } finally {
      live.current = null;
    }
  };

  const busy = phase === "loading" || phase === "checking";
  const listening = phase === "listening";
  const good = result && result.verdict !== "wrong";

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="card m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] animate-pop overflow-y-auto p-0 text-ink backdrop:bg-black/50"
      aria-label="Say it"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <p className="eyebrow text-anar-ink">Say it</p>
          <button type="button" className="btn-ghost btn-icon -mr-2 -mt-2" onClick={onClose} aria-label="Close">
            <X className="size-6" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <FaWord word={word} settings={settings} size="lg" />
          <p className="font-bold text-muted">{word.en}</p>
          {!settings.scriptOnly && <p className="text-sm font-semibold text-muted">sounds like “{word.soundsLike}”</p>}
          <AudioButtons text={word.fa} />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          {engine ? (
            <>
              <span className="relative grid place-items-center">
                {listening && <span className="absolute inset-0 animate-ping rounded-full bg-anar/30" aria-hidden />}
                <button
                  type="button"
                  onClick={start}
                  disabled={busy}
                  aria-label={listening ? "Stop recording" : "Start speaking"}
                  className={cx("btn-icon relative !size-20 !rounded-full", listening ? "btn-danger" : "btn-primary")}
                >
                  {busy ? <Loader2 className="size-9 animate-spin" /> : listening ? <Square className="size-8 fill-current" /> : <Mic className="size-10" />}
                </button>
              </span>
              <p role="status" className="min-h-6 font-bold text-muted">
                {phase === "loading"
                  ? "Loading speech model…"
                  : listening
                    ? "Listening…"
                    : phase === "checking"
                      ? "Checking…"
                      : result
                        ? "Tap to try again"
                        : "Listen, then tap the mic and say it"}
              </p>
            </>
          ) : (
            <p className="flex gap-2 rounded-2xl bg-paper p-3 text-sm font-semibold text-muted">
              <CircleAlert className="size-5 shrink-0" />
              <span>
                This browser can&apos;t listen to speech. Try Chrome, Edge or Safari, or choose Whisper in{" "}
                <Link href="/app/settings/" className="font-bold text-sky-ink underline">
                  Settings
                </Link>
                .
              </span>
            </p>
          )}
          {error && <p className="text-center text-sm font-bold text-anar-ink">{error}</p>}
        </div>

        {result && phonics && (
          <div className="mt-4 space-y-4">
            <div role="status">
              <p className={cx("flex items-center gap-2 text-lg font-extrabold", good ? "text-pista-ink" : "text-anar-ink")}>
                {good ? <CheckCircle2 className="size-6 shrink-0" /> : <XCircle className="size-6 shrink-0" />}
                {result.verdict === "correct" ? "Spot on!" : result.verdict === "almost" ? "Almost — sounds close." : "Not quite yet."}
              </p>
              <p className="ms-8 text-sm font-semibold text-muted">
                We heard <Fa className="text-base font-bold">{result.heard || "…"}</Fa>
              </p>
            </div>
            <PronunciationFeedback result={phonics} overall={result.score} model={word.fa} audio={take} />
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
