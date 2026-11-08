"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Lightbulb, Mic, Repeat2, Volume2 } from "lucide-react";
import { SOUND_BY_ID } from "@/content/sounds";
import { joinedText, type LetterMark, type PhonicsResult, type SoundScore } from "@/lib/phonics";
import { speak } from "@/lib/speech";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { MouthDiagram } from "./MouthDiagram";
import { AudioButtons, Fa } from "./ui";

const LETTER_TONE: Record<LetterMark["status"], string> = {
  good: "text-pista-ink",
  close: "text-saffron-ink",
  off: "text-anar-ink",
  missed: "text-anar-ink opacity-60",
  silent: "",
};
const STATUS_WORD: Record<LetterMark["status"], string> = { good: "clear", close: "unclear", off: "off", missed: "not heard", silent: "silent" };

function tone(score: number) {
  return score >= 90 ? "pista" : score >= 60 ? "saffron" : "anar";
}
const TILE = {
  pista: "border-pista bg-pista-soft text-pista-ink",
  saffron: "border-saffron bg-saffron-soft text-saffron-ink",
  anar: "border-anar bg-anar-soft text-anar-ink",
};

/** The target word with each letter coloured by how clearly it was heard. */
export function ColoredWord({ letters, className }: { letters: LetterMark[]; className?: string }) {
  const label = letters
    .filter((l) => l.sound && l.status !== "silent")
    .map((l) => `${l.label} ${STATUS_WORD[l.status]}`)
    .join(", ");
  return (
    <p lang="fa" dir="rtl" className={cx("font-bold leading-loose", className)} aria-label={label}>
      <span aria-hidden>
        {letters.map((l, i) => (
          <span key={i} className={cx(LETTER_TONE[l.status], l.status === "missed" && "underline decoration-dotted decoration-2 underline-offset-8")}>
            {joinedText(l)}
          </span>
        ))}
      </span>
    </p>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 26;
  const len = 2 * Math.PI * r;
  const t = tone(value);
  return (
    <span className="relative grid size-16 shrink-0 place-items-center" role="img" aria-label={`Overall ${value}%`}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <circle cx="32" cy="32" r={r} className="fill-none stroke-line" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={r}
          className={cx("fill-none transition-[stroke-dashoffset] duration-500", t === "pista" ? "stroke-pista" : t === "saffron" ? "stroke-saffron" : "stroke-anar")}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - value / 100)}
        />
      </svg>
      <span className="text-lg font-extrabold">{value}</span>
    </span>
  );
}

/**
 * Sound-by-sound feedback after speaking: coloured letters, a tile and score
 * per sound, model / my voice / back-to-back playback, and a mouth diagram
 * with a tip for the sound that needs the most work.
 */
export function PronunciationFeedback({ result, overall, model, audio }: { result: PhonicsResult; overall: number; model: string; audio: Blob | null }) {
  const { settings } = useProgress();
  const weakest = useMemo(() => {
    const scored = result.sounds.filter((s) => s.score < 90);
    const hard = scored.filter((s) => SOUND_BY_ID[s.sound]?.tip);
    return [...(hard.length ? hard : scored)].sort((a, b) => a.score - b.score)[0] ?? null;
  }, [result]);
  const [picked, setPicked] = useState<SoundScore | null>(weakest);
  useEffect(() => setPicked(weakest), [weakest]);

  const url = useMemo(() => (audio ? URL.createObjectURL(audio) : null), [audio]);
  useEffect(() => () => (url ? URL.revokeObjectURL(url) : undefined), [url]);
  const player = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<"model" | "mine" | "both" | null>(null);

  const playMine = () =>
    new Promise<void>((resolve) => {
      if (!url) return resolve();
      player.current?.pause();
      const a = new Audio(url);
      player.current = a;
      a.onended = () => resolve();
      a.onerror = () => resolve();
      a.play().catch(() => resolve());
    });
  const run = async (what: "model" | "mine" | "both") => {
    if (playing) return;
    setPlaying(what);
    try {
      if (what !== "mine") await speak(model);
      if (what === "both") await new Promise((r) => setTimeout(r, 350));
      if (what !== "model") await playMine();
    } finally {
      setPlaying(null);
    }
  };
  useEffect(() => () => player.current?.pause(), []);

  const sound = picked ? SOUND_BY_ID[picked.sound] : null;

  return (
    <div className="space-y-4 text-start">
      <div className="flex items-center gap-4">
        <ScoreRing value={overall} />
        <div className="min-w-0 flex-1">
          <ColoredWord letters={result.letters} className="text-3xl sm:text-4xl" />
          <p className="text-sm font-semibold text-muted">
            Accuracy {result.accuracy}% · Completeness {result.completeness}%
          </p>
        </div>
      </div>

      {result.sounds.length > 0 && (
        <div>
          <p className="eyebrow mb-2 text-muted">Sound by sound</p>
          <ul dir="rtl" className="flex flex-wrap gap-2">
            {result.sounds.map((s) => {
              const t = tone(s.score);
              const on = picked?.index === s.index;
              return (
                <li key={s.index}>
                  <button
                    type="button"
                    onClick={() => setPicked(on ? null : s)}
                    aria-pressed={on}
                    aria-label={`${s.label}: ${s.score}%${SOUND_BY_ID[s.sound]?.tip ? ", show tip" : ""}`}
                    className={cx("flex min-h-11 min-w-14 flex-col items-center rounded-xl border-2 px-2 py-1 transition-transform active:translate-y-0.5", TILE[t], on && "ring-[3px] ring-sky")}
                  >
                    <Fa className="text-lg font-bold leading-tight">{s.char}</Fa>
                    <span dir="ltr" className="text-xs font-extrabold">
                      {s.label} · {s.score}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 flex flex-wrap gap-x-3 text-xs font-bold text-muted">
            <span className="text-pista-ink">● clear</span>
            <span className="text-saffron-ink">● unclear</span>
            <span className="text-anar-ink">● off or missing</span>
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={cx("btn-sky btn-sm", playing === "model" && "animate-pulse")} onClick={() => run("model")} disabled={!!playing}>
          <Volume2 className="size-4" /> Model
        </button>
        {url && (
          <>
            <button type="button" className={cx("btn-secondary btn-sm", playing === "mine" && "animate-pulse")} onClick={() => run("mine")} disabled={!!playing}>
              <Mic className="size-4" /> My voice
            </button>
            <button type="button" className={cx("btn-secondary btn-sm", playing === "both" && "animate-pulse")} onClick={() => run("both")} disabled={!!playing}>
              <Repeat2 className="size-4" /> Back to back
            </button>
          </>
        )}
      </div>
      {!url && (
        <p className="flex items-start gap-2 text-xs font-semibold text-muted">
          <Headphones className="size-4 shrink-0" />
          Hearing your own take works on a computer, or anywhere with the Whisper recogniser (Settings → Voice &amp; speech).
        </p>
      )}

      {picked && sound && (
        <div className="animate-pop rounded-2xl border-2 border-line bg-paper p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-saffron-ink" />
            <div className="min-w-0">
              <p className="font-extrabold">
                {sound.letters.split(" ").map((l) => (
                  <Fa key={l} className="me-1.5 inline-block min-w-5 rounded-md bg-card px-1 text-center font-bold">
                    {l}
                  </Fa>
                ))}{" "}
                {sound.name}
                <span className={cx("ms-2 text-sm", tone(picked.score) === "pista" ? "text-pista-ink" : tone(picked.score) === "saffron" ? "text-saffron-ink" : "text-anar-ink")}>{picked.score}%</span>
              </p>
              <p className="text-sm font-semibold text-muted">Like {sound.like}</p>
              {sound.tip && <p className="mt-2 font-semibold">{sound.tip}</p>}
            </div>
          </div>
          {sound.mouth && <MouthDiagram mouth={sound.mouth} className="mt-3" />}
          {sound.examples.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {sound.examples.map((e) => (
                <li key={e.fa} className="flex items-center gap-1 rounded-xl border-2 border-line bg-card py-1 pe-1 ps-3">
                  <Fa className="font-bold">{e.fa}</Fa>
                  {!settings.scriptOnly && <span className="text-sm font-semibold text-muted">{e.tr}</span>}
                  <span className="text-sm font-semibold text-muted">· {e.en}</span>
                  <AudioButtons text={e.fa} compact />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
