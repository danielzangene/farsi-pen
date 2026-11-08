"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, CircleAlert, Headphones, Loader2, Mic, Pause, Play, RotateCcw, Square, Volume2, XCircle } from "lucide-react";
import { CAST, castOf, isLine, playableParts, type CastId, type Scene } from "@/content/scenes";
import { analyzeSpoken, type PhonicsResult } from "@/lib/phonics";
import { checkSpoken, type SpeakVerdict } from "@/lib/pronounce";
import { speak, stopSpeaking } from "@/lib/speech";
import { completeScene, recordSounds, useProgress } from "@/lib/store";
import { listen, loadWhisper, resolveEngine, SttError, whisperLoaded, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { ColoredWord } from "../PronunciationFeedback";
import { Fa, SessionHeader, StatCard, TONE } from "../ui";
import { CastAvatar } from "./Cast";

type Phase = "choose" | "run" | "done";
type Take = { verdict: SpeakVerdict; score: number; phonics: PhonicsResult; tries: number };
type MicState = "idle" | "loading" | "listening" | "checking";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STT_ERRORS: Record<SttError["code"], string> = {
  "no-speech": "Didn't catch that — tap the mic and try again.",
  "not-allowed": "Microphone access is blocked. Allow it in your browser's site settings.",
  network: "The browser's recogniser needs internet. Try again, or switch to Whisper in Settings.",
  unsupported: "Persian recognition isn't available here. Switch to Whisper in Settings.",
  aborted: "",
  failed: "Something went wrong — try again.",
};

/** Plays a scene: pick a part, the voice reads the others, you say your lines. */
export function ScenePlayer({ scene }: { scene: Scene }) {
  const s = useProgress();
  const [phase, setPhase] = useState<Phase>("choose");
  const [part, setPart] = useState<CastId | null>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showEn, setShowEn] = useState(true);
  const [takes, setTakes] = useState<Record<number, Take>>({});
  const [mic, setMic] = useState<MicState>("idle");
  const [error, setError] = useState("");
  const [xp, setXp] = useState(0);
  const live = useRef<Listening | null>(null);
  const current = useRef<HTMLLIElement | null>(null);
  const saved = useRef(false);

  const engine = resolveEngine(s.settings.speechEngine);
  const script = scene.script;
  const item = script[idx];
  const mine = !!item && isLine(item) && item.who === part;
  const take = takes[idx];

  const begin = (p: CastId | null) => {
    setPart(p);
    setIdx(0);
    setTakes({});
    setPaused(false);
    setError("");
    saved.current = false;
    setPhase("run");
  };

  // Everyone else's lines (and stage directions) play by themselves.
  useEffect(() => {
    if (phase !== "run" || paused || !item || mine) return;
    let cancelled = false;
    (async () => {
      if (isLine(item)) await speak(item.fa);
      else await sleep(1400);
      await sleep(450);
      if (!cancelled) setIdx((i) => i + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [phase, paused, idx, item, mine]);

  // Keep the current line in view.
  useEffect(() => {
    current.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [idx, take]);

  // End of the script.
  useEffect(() => {
    if (phase !== "run" || idx < script.length || saved.current) return;
    saved.current = true;
    const yours = script.filter((x) => isLine(x) && x.who === part).length;
    const good = Object.values(takes).filter((t) => t.verdict !== "wrong").length;
    setXp(completeScene(scene.id, part, good, engine ? yours : 0));
    setPhase("done");
  }, [phase, idx, script, part, takes, scene.id, engine]);

  useEffect(
    () => () => {
      live.current?.cancel();
      stopSpeaking();
    },
    [],
  );

  const say = async () => {
    if (!engine || !item || !isLine(item)) return;
    if (mic === "listening") {
      live.current?.stop();
      if (engine === "whisper") setMic("checking");
      return;
    }
    setError("");
    try {
      if (engine === "whisper" && !whisperLoaded()) {
        setMic("loading");
        await loadWhisper();
      }
      const l = listen(engine, 8000);
      live.current = l;
      setMic("listening");
      const heard = await l.result;
      const r = checkSpoken(heard, [item.fa, item.fa.replace(/[!؟?.،,…]/g, "")]);
      const p = analyzeSpoken(r.verdict === "correct" ? [item.fa] : heard, item.fa);
      recordSounds(p.sounds);
      setTakes((t) => {
        const prev = t[idx];
        // Keep the best take, but count every try.
        const better = !prev || r.score >= prev.score;
        return { ...t, [idx]: better ? { verdict: r.verdict, score: r.score, phonics: p, tries: (prev?.tries ?? 0) + 1 } : { ...prev, tries: prev.tries + 1 } };
      });
    } catch (e) {
      const code = e instanceof SttError ? e.code : "failed";
      if (code !== "aborted") setError(STT_ERRORS[code]);
    } finally {
      live.current = null;
      setMic("idle");
    }
  };

  const next = () => {
    setError("");
    setIdx((i) => i + 1);
  };

  if (phase === "choose") return <Choose scene={scene} played={s.scenes?.[scene.id]?.parts ?? []} onPick={begin} />;

  if (phase === "done") {
    const yours = script.filter((x) => isLine(x) && x.who === part).length;
    const good = Object.values(takes).filter((t) => t.verdict !== "wrong").length;
    const others = playableParts(scene).filter((p) => p !== part);
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-4 text-center sm:pt-10">
        {part ? <CastAvatar id={part} size="lg" className="!size-20 !text-4xl" /> : <Headphones className="size-14 text-sky-ink" />}
        <h1 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">{part ? "That's a wrap!" : "End of the scene"}</h1>
        <p className="mt-2 font-semibold text-muted">
          {part ? `You played ${CAST[part].name} in “${scene.title}”.` : "Now try it again with a part of your own."}
        </p>
        {part && (
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <StatCard label="Total XP" value={xp} tone="saffron" />
            <StatCard label="Lines said well" value={engine ? `${good}/${yours}` : "—"} tone="pista" />
          </div>
        )}
        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          {others.length > 0 && (
            <button type="button" className="btn-primary btn-lg" onClick={() => begin(others[0])} autoFocus>
              Play {CAST[others[0]].name}
            </button>
          )}
          <button type="button" className="btn-secondary btn-lg" onClick={() => begin(part)}>
            {part ? `Play ${CAST[part].name} again` : "Listen again"}
          </button>
          <Link href="/app/scenes/" className="btn-ghost btn-lg">
            All scenes
          </Link>
        </div>
      </div>
    );
  }

  const shown = script.slice(0, Math.min(idx + 1, script.length));
  const speaker = item && isLine(item) ? item.who : null;
  const busy = mic === "loading" || mic === "checking";
  const good = take && take.verdict !== "wrong";

  return (
    <div>
      <SessionHeader
        exitHref="/app/scenes/"
        progress={idx / script.length}
        right={
          <button type="button" className="btn-ghost btn-sm" onClick={() => setShowEn(!showEn)} aria-pressed={showEn}>
            {showEn ? "Hide English" : "Show English"}
          </button>
        }
      />
      <p className="text-sm font-bold text-muted">
        Episode {scene.episode} · {scene.title}
      </p>
      <p className="mt-1 font-semibold italic text-muted">{scene.setting}</p>

      <ol className="mt-6 space-y-5">
        {shown.map((x, i) => {
          const isCurrent = i === idx;
          if (!isLine(x))
            return (
              <li key={i} ref={isCurrent ? current : undefined} className="animate-pop border-y-2 border-dashed border-line py-2 text-center text-sm font-semibold italic text-muted">
                {x.stage}
              </li>
            );
          const yours = x.who === part;
          const t = takes[i];
          const c = CAST[x.who];
          return (
            <li
              key={i}
              ref={isCurrent ? current : undefined}
              className={cx("flex animate-pop gap-3", yours && "-mx-3 rounded-2xl border-s-4 border-firuze bg-firuze-soft p-3", !isCurrent && !yours && "opacity-80")}
            >
              <CastAvatar id={x.who} speaking={isCurrent && !yours && !paused} />
              <div className="min-w-0 flex-1">
                <p className={cx("text-sm font-extrabold", TONE[c.tone].ink)}>
                  {c.name}
                  {yours && <span className="font-bold text-muted"> · your line</span>}
                </p>
                {t ? (
                  <ColoredWord letters={t.phonics.letters} className="text-left text-xl sm:text-2xl" />
                ) : (
                  <p>
                    <Fa className="text-xl font-bold leading-relaxed sm:text-2xl">{x.fa}</Fa>
                  </p>
                )}
                {!s.settings.scriptOnly && <p className="text-sm font-semibold text-muted">{x.tr}</p>}
                {(showEn || yours) && <p className="text-sm font-semibold">{x.en}</p>}
                {x.note && <p className="mt-1 text-sm font-semibold text-saffron-ink">{x.note}</p>}
                {t && (
                  <p className={cx("mt-1 flex items-center gap-1 text-sm font-extrabold", t.verdict === "wrong" ? "text-anar-ink" : "text-pista-ink")}>
                    {t.verdict === "wrong" ? <XCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
                    {t.score}%
                  </p>
                )}
              </div>
              <button type="button" className="btn-ghost btn-icon -me-2 shrink-0 !text-sky-ink" onClick={() => void speak(x.fa)} aria-label={`Play ${c.name}'s line`}>
                <Volume2 className="size-5" />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="h-48" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:py-5">
          {!mine ? (
            <>
              <p role="status" className="flex min-w-0 items-center gap-2 font-bold text-muted">
                {speaker && <CastAvatar id={speaker} size="sm" />}
                {paused ? "Paused" : speaker ? `${CAST[speaker].name} is speaking…` : "…"}
              </p>
              <button type="button" className="btn-secondary btn-sm" onClick={() => {
                  if (!paused) stopSpeaking();
                  setPaused(!paused);
                }}>
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />} {paused ? "Resume" : "Pause"}
              </button>
            </>
          ) : take && mic === "idle" ? (
            <>
              <p role="status" className={cx("flex items-center gap-2 text-lg font-extrabold", good ? "text-pista-ink" : "text-anar-ink")}>
                {good ? <CheckCircle2 className="size-6" /> : <XCircle className="size-6" />}
                {take.verdict === "correct" ? "Spot on!" : take.verdict === "almost" ? "Almost — sounds close." : "Not quite yet."}
              </p>
              <div className="flex w-full gap-2 sm:w-auto">
                {take.verdict !== "correct" && take.tries < 3 && (
                  <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={say}>
                    <RotateCcw className="size-4" /> Again
                  </button>
                )}
                <button type="button" className={cx(good ? "btn-success" : "btn-primary", "flex-1 sm:flex-none sm:min-w-36")} onClick={next} autoFocus>
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="min-w-0">
                <p role="status" className="font-extrabold">
                  {mic === "listening" ? "Listening…" : mic === "checking" ? "Checking…" : mic === "loading" ? "Loading speech model…" : engine ? "Your line — say it out loud" : "Your line — say it, then continue"}
                </p>
                {error && <p className="text-sm font-bold text-anar-ink">{error}</p>}
                {!engine && (
                  <p className="flex items-center gap-1 text-sm font-semibold text-muted">
                    <CircleAlert className="size-4" /> This browser can&apos;t listen, so lines aren&apos;t scored.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-ghost btn-sm" onClick={next}>
                  Skip
                </button>
                {item && isLine(item) && (
                  <button type="button" className="btn-sky btn-icon" onClick={() => void speak(item.fa)} aria-label="Hear your line">
                    <Volume2 className="size-5" />
                  </button>
                )}
                {engine ? (
                  <span className="relative grid place-items-center">
                    {mic === "listening" && <span className="absolute inset-0 animate-ping rounded-full bg-anar/30" aria-hidden />}
                    <button
                      type="button"
                      onClick={say}
                      disabled={busy}
                      aria-label={mic === "listening" ? "Stop recording" : "Say your line"}
                      className={cx("btn-icon relative !size-16 !rounded-full", mic === "listening" ? "btn-danger" : "btn-primary")}
                    >
                      {busy ? <Loader2 className="size-7 animate-spin" /> : mic === "listening" ? <Square className="size-6 fill-current" /> : <Mic className="size-8" />}
                    </button>
                  </span>
                ) : (
                  <button type="button" className="btn-primary" onClick={next}>
                    <Check className="size-4" /> Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Choose({ scene, played, onPick }: { scene: Scene; played: string[]; onPick: (p: CastId | null) => void }) {
  const parts = playableParts(scene);
  const lines = (id: CastId) => scene.script.filter((x) => isLine(x) && x.who === id).length;
  return (
    <div className="mx-auto max-w-xl pt-2">
      <Link href="/app/scenes/" className="btn-ghost btn-sm -ms-3">
        <ArrowLeft className="size-4" /> Scenes
      </Link>
      <p className="mt-4 text-sm font-bold text-muted">Episode {scene.episode}</p>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{scene.title}</h1>
      <p className="mt-1">
        <Fa className="text-2xl font-bold text-muted">{scene.fa}</Fa>
      </p>
      <p className="mt-3 font-semibold italic text-muted">{scene.setting}</p>

      <h2 className="mt-8 text-lg font-extrabold">Choose your part</h2>
      <ul className="mt-3 space-y-3">
        {parts.map((id) => (
          <li key={id}>
            <button type="button" className="tile flex w-full items-center gap-3 p-3 text-start" onClick={() => onPick(id)}>
              <CastAvatar id={id} />
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">Play {CAST[id].name}</span>
                <span className="block text-sm font-semibold text-muted">
                  {CAST[id].role} · {lines(id)} lines
                </span>
              </span>
              {played.includes(id) && (
                <span className="chip bg-pista-soft text-pista-ink">
                  <Check className="size-3.5" /> Played
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn-secondary mt-4 w-full" onClick={() => onPick(null)}>
        <Headphones className="size-4" /> Just listen first
      </button>

      <h2 className="mt-8 text-sm font-extrabold text-muted">In this scene</h2>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {castOf(scene).map((id) => (
          <li key={id} className="flex items-center gap-2">
            <CastAvatar id={id} size="sm" />
            <span className="text-sm font-bold">
              {CAST[id].name} <span className="font-semibold text-muted">· {CAST[id].role}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
