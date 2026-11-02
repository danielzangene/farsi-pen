"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { useProgress } from "@/lib/store";
import { listen, loadWhisper, resolveEngine, SttError, whisperLoaded, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";

/**
 * Free answer box: type in Finglish or Persian script, or tap the mic and say it.
 * Speech gives several transcripts; all are passed on so the checker can pick the best.
 */
export function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled,
  state,
  autoFocus = true,
}: {
  value: string;
  onChange: (text: string, alternatives: string[]) => void;
  onSubmit: () => void;
  disabled?: boolean;
  state?: "correct" | "almost" | "wrong";
  autoFocus?: boolean;
}) {
  const { settings } = useProgress();
  const [engineOk, setEngineOk] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "listening" | "checking">("idle");
  const [note, setNote] = useState("");
  const live = useRef<Listening | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setEngineOk(resolveEngine(settings.speechEngine) !== null), [settings.speechEngine]);
  useEffect(() => () => live.current?.cancel(), []);
  useEffect(() => {
    if (autoFocus && !disabled) inputRef.current?.focus();
  }, [autoFocus, disabled]);

  const mic = async () => {
    if (phase === "listening") {
      live.current?.stop();
      setPhase("checking");
      return;
    }
    const engine = resolveEngine(settings.speechEngine);
    if (!engine || phase !== "idle") return;
    setNote("");
    try {
      if (engine === "whisper" && !whisperLoaded()) {
        setPhase("loading");
        await loadWhisper();
      }
      const l = listen(engine);
      live.current = l;
      setPhase("listening");
      const alts = await l.result;
      onChange(alts[0], alts);
    } catch (e) {
      const code = e instanceof SttError ? e.code : "failed";
      if (code === "no-speech") setNote("Didn't catch that — try again or type it.");
      else if (code === "not-allowed") setNote("Microphone is blocked — you can type instead.");
      else if (code !== "aborted") setNote("Speech isn't working here — type your answer instead.");
    } finally {
      live.current = null;
      setPhase("idle");
    }
  };

  return (
    <div>
      <div className="flex items-stretch gap-2">
        <input
          ref={inputRef}
          className={cx(
            "input min-h-14 flex-1 !text-lg",
            state === "wrong" && "animate-shake !border-anar",
            state === "correct" && "!border-pista",
            state === "almost" && "!border-pista",
          )}
          value={value}
          onChange={(e) => onChange(e.target.value, [])}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          disabled={disabled}
          dir="auto"
          placeholder="Type in Finglish or فارسی…"
          aria-label="Your answer"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {engineOk && (
          <button
            type="button"
            className={cx("btn-icon !size-14 shrink-0", phase === "listening" ? "btn-danger" : "btn-sky")}
            onClick={mic}
            disabled={disabled || phase === "loading" || phase === "checking"}
            aria-label={phase === "listening" ? "Stop recording" : "Say your answer"}
          >
            {phase === "loading" || phase === "checking" ? (
              <Loader2 className="size-6 animate-spin" />
            ) : phase === "listening" ? (
              <Square className="size-5 fill-current" />
            ) : (
              <Mic className="size-6" />
            )}
          </button>
        )}
      </div>
      <p role="status" className="mt-2 min-h-5 text-sm font-semibold text-muted">
        {phase === "listening" ? "Listening… say your answer in Persian." : phase === "loading" ? "Loading speech model…" : note}
      </p>
    </div>
  );
}
