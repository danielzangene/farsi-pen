"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock, Loader2, Mic, Pause, Play, RotateCcw, Square, XCircle } from "lucide-react";
import type { ReadingLesson } from "@/content/readings";
import { CONNECTORS, RUBRIC, rubricScore, type SpeakingTask, type WritingTask } from "@/content/samfa";
import { WORDS } from "@/content/words";
import { soundKey } from "@/lib/pronounce";
import { speak, stopSpeaking } from "@/lib/speech";
import { cleanFa, isKnown, loadLexicon, suggest, type Lexicon } from "@/lib/spell";
import { useProgress } from "@/lib/store";
import { listen, loadWhisper, resolveEngine, SttError, whisperLoaded, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { AudioButtons, Fa } from "../ui";

/** Counts down from `seconds`; returns seconds left (0 when time is up). */
function useCountdown(seconds: number, running = true) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => setLeft(seconds), [seconds]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  return left;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Timer({ left, label = "left" }: { left: number; label?: string }) {
  return (
    <span className={cx("flex items-center gap-1 text-sm font-extrabold", left <= 30 ? "text-anar-ink" : "text-muted")} role="timer">
      <Clock className="size-4" /> {mmss(left)} {label}
    </span>
  );
}

function Questions({ lesson, answers, setAnswers, submitted }: { lesson: ReadingLesson; answers: Record<number, string>; setAnswers: (a: Record<number, string>) => void; submitted: boolean }) {
  return (
    <ol className="space-y-5">
      {lesson.check.map((q, i) => (
        <li key={i}>
          <p className="font-extrabold">
            {i + 1}. {q.prompt}
          </p>
          <div className="mt-2 grid gap-2">
            {q.options.map((o) => {
              const state = submitted ? (o === q.answer ? "correct" : answers[i] === o ? "wrong" : undefined) : answers[i] === o ? "selected" : undefined;
              return (
                <button key={o} type="button" disabled={submitted} className="tile flex items-center justify-between p-3 text-start font-bold" data-state={state} onClick={() => setAnswers({ ...answers, [i]: o })}>
                  {o}
                  {state === "correct" && <CheckCircle2 className="size-5 shrink-0" />}
                  {state === "wrong" && <XCircle className="size-5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Listening: the passage plays with no text (two plays), then questions. */
export function ListeningPractice({ lesson, onDone }: { lesson: ReadingLesson; onDone: (correct: number, total: number) => void }) {
  const sentences = lesson.text.flat();
  const [plays, setPlays] = useState(0);
  const [at, setAt] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const run = useRef(0);
  useEffect(() => () => (run.current++, stopSpeaking()), []);

  const play = async () => {
    const id = ++run.current;
    setPlays((n) => n + 1);
    for (let i = 0; i < sentences.length; i++) {
      if (run.current !== id) return;
      setAt(i);
      await speak(sentences[i].fa);
    }
    if (run.current === id) setAt(null);
  };
  const stop = () => {
    run.current++;
    stopSpeaking();
    setAt(null);
  };
  const correct = lesson.check.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line p-5 text-center">
        <p className="font-semibold text-muted">Listen to the passage — you can play it twice. Read the questions first.</p>
        <button type="button" className="btn-sky btn-lg mt-4" onClick={() => (at === null ? void play() : stop())} disabled={at === null && plays >= 2}>
          {at === null ? <Play className="size-5 fill-current" /> : <Pause className="size-5 fill-current" />}
          {at === null ? (plays ? "Play again" : "Play") : `Playing ${at + 1}/${sentences.length}`}
        </button>
        <p className="mt-2 text-sm font-bold text-muted">{2 - plays} {2 - plays === 1 ? "play" : "plays"} left</p>
      </div>
      <Questions lesson={lesson} answers={answers} setAnswers={setAnswers} submitted={submitted} />
      {submitted ? (
        <div className="space-y-4">
          <p className="text-lg font-extrabold">
            {correct} of {lesson.check.length} right
          </p>
          <details className="rounded-2xl bg-paper p-4">
            <summary className="cursor-pointer font-bold">Show what was said</summary>
            <ul className="mt-3 space-y-2">
              {sentences.map((s, i) => (
                <li key={i}>
                  <p dir="rtl" lang="fa" className="text-lg">
                    {s.fa}
                  </p>
                  <p className="text-sm font-semibold text-muted">{s.en}</p>
                </li>
              ))}
            </ul>
          </details>
          <button type="button" className="btn-primary w-full" onClick={() => onDone(correct, lesson.check.length)}>
            Continue
          </button>
        </div>
      ) : (
        <button type="button" className="btn-primary w-full" disabled={Object.keys(answers).length < lesson.check.length} onClick={() => (stop(), setSubmitted(true))}>
          Check answers
        </button>
      )}
    </div>
  );
}

/** Reading: a timed passage in script only, then questions. */
export function ReadingPractice({ lesson, minutes = 8, onDone }: { lesson: ReadingLesson; minutes?: number; onDone: (correct: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const left = useCountdown(minutes * 60, !submitted);
  const correct = lesson.check.filter((q, i) => answers[i] === q.answer).length;
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Timer left={left} />
      </div>
      <div lang="fa" dir="rtl" className="space-y-4 rounded-2xl bg-paper p-5 text-xl leading-[2.2] sm:p-7">
        {lesson.text.map((p, i) => (
          <p key={i}>{p.map((s) => s.fa).join(" ")}</p>
        ))}
      </div>
      {left === 0 && !submitted && <p className="font-bold text-anar-ink">Time's up — answer what you can and check.</p>}
      <Questions lesson={lesson} answers={answers} setAnswers={setAnswers} submitted={submitted} />
      {submitted ? (
        <div className="space-y-3">
          <p className="text-lg font-extrabold">
            {correct} of {lesson.check.length} right
          </p>
          <button type="button" className="btn-primary w-full" onClick={() => onDone(correct, lesson.check.length)}>
            Continue
          </button>
        </div>
      ) : (
        <button type="button" className="btn-primary w-full" disabled={Object.keys(answers).length < lesson.check.length} onClick={() => setSubmitted(true)}>
          Check answers
        </button>
      )}
    </div>
  );
}

function Rubric({ marks, setMarks }: { marks: Record<string, number>; setMarks: (m: Record<string, number>) => void }) {
  return (
    <div className="space-y-3">
      <p className="font-extrabold">Mark yourself honestly against the model</p>
      {RUBRIC.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold">{r.label}</span>
          <span className="flex gap-1" role="radiogroup" aria-label={r.label}>
            {[0, 1, 2, 3].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={marks[r.id] === n} className="tile grid size-10 place-items-center text-sm font-extrabold" data-state={marks[r.id] === n ? "selected" : undefined} onClick={() => setMarks({ ...marks, [r.id]: n })}>
                {n}
              </button>
            ))}
          </span>
        </div>
      ))}
      <p className="text-xs font-semibold text-muted">0 = not yet · 1 = partly · 2 = mostly · 3 = fully. This is an estimate, not an official score.</p>
    </div>
  );
}

function ModelAnswer({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-2xl bg-paper p-4">
      <p className="mb-2 text-sm font-extrabold text-muted">Model answer</p>
      <ul className="space-y-1">
        {lines.map((l) => (
          <li key={l} className="flex items-center gap-1">
            <Fa className="flex-1 text-lg leading-loose">{l}</Fa>
            <AudioButtons text={l} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Writing: a timed task with a plan, linking words, a word count and a spelling check. */
export function WritingPractice({ task, onDone }: { task: WritingTask; onDone: (score60: number) => void }) {
  const [text, setText] = useState("");
  const [finished, setFinished] = useState(false);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [lex, setLex] = useState<Lexicon | null>(null);
  const [checking, setChecking] = useState(false);
  const left = useCountdown(task.minutes * 60, !finished);
  const area = useRef<HTMLTextAreaElement>(null);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const used = CONNECTORS.filter((c) => text.includes(c.fa));
  const unknown = useMemo(() => {
    if (!lex) return [];
    const seen = new Set<string>();
    return text
      .split(/\s+/)
      .map((w) => cleanFa(w).replace(/[.،؛:!؟«»"()]/g, ""))
      .filter((w) => w && /[؀-ۿ]/.test(w) && !seen.has(w) && (seen.add(w), true) && !isKnown(w, lex))
      .slice(0, 12)
      .map((w) => ({ w, s: suggest(w, lex, 2).map((x) => x.word) }));
  }, [text, lex]);

  const insert = (fa: string) => {
    const el = area.current;
    const at = el?.selectionStart ?? text.length;
    const next = text.slice(0, at) + (at && !/\s$/.test(text.slice(0, at)) ? " " : "") + fa + " " + text.slice(at);
    setText(next);
    requestAnimationFrame(() => el?.focus());
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line p-5">
        <p className="flex items-start gap-1">
          <Fa className="flex-1 text-xl font-bold leading-relaxed">{task.prompt.fa}</Fa>
          <AudioButtons text={task.prompt.fa} compact />
        </p>
        <p className="mt-1 text-sm font-semibold text-muted">{task.prompt.en}</p>
        <p className="mt-2 text-sm font-bold">
          About {task.words} words · {task.minutes} minutes
        </p>
      </div>
      <details className="rounded-2xl bg-paper p-4" open>
        <summary className="cursor-pointer font-bold">A plan to follow</summary>
        <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm font-semibold">
          {task.plan.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </details>
      <div>
        <p className="mb-2 text-sm font-extrabold text-muted">Linking words — tap to add</p>
        <div className="flex flex-wrap gap-2">
          {CONNECTORS.map((c) => (
            <button key={c.fa} type="button" className={cx("rounded-xl border px-3 py-1", used.includes(c) ? "border-pista bg-pista-soft text-pista-ink" : "border-line")} onClick={() => insert(c.fa)} title={c.en} disabled={finished}>
              <Fa className="font-bold">{c.fa}</Fa> <span className="text-xs font-semibold text-muted">{c.en}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className={cx("text-sm font-extrabold", words >= task.words ? "text-pista-ink" : "text-muted")}>
            {words} / {task.words} words
          </span>
          <Timer left={left} />
        </div>
        <textarea
          ref={area}
          className="input min-h-64 resize-y !text-lg !leading-loose"
          dir="rtl"
          lang="fa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          readOnly={finished}
          placeholder="اینجا بنویسید…"
          aria-label="Your answer in Persian"
        />
      </div>
      {!finished && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary btn-sm"
            disabled={!words || checking}
            onClick={async () => {
              setChecking(true);
              setLex(await loadLexicon(WORDS.map((w) => w.fa)));
              setChecking(false);
            }}
          >
            {checking ? <Loader2 className="size-4 animate-spin" /> : null} Check spelling
          </button>
          <button type="button" className="btn-primary btn-sm" disabled={!words} onClick={() => setFinished(true)}>
            I&apos;m done
          </button>
        </div>
      )}
      {lex && (
        <div className="rounded-2xl border border-line p-4">
          {unknown.length === 0 ? (
            <p className="font-bold text-pista-ink">No unusual spellings found.</p>
          ) : (
            <>
              <p className="mb-2 font-bold">Words to double-check</p>
              <ul className="flex flex-wrap gap-2">
                {unknown.map(({ w, s }) => (
                  <li key={w} className="rounded-xl bg-saffron-soft px-3 py-1 text-saffron-ink">
                    <Fa className="font-bold">{w}</Fa>
                    {s.length > 0 && (
                      <span className="text-sm font-semibold">
                        {" "}
                        → <Fa>{s.join("، ")}</Fa>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs font-semibold text-muted">Names and rare words can show up here too.</p>
            </>
          )}
        </div>
      )}
      {finished && (
        <div className="space-y-5">
          <ModelAnswer lines={task.model} />
          <Rubric marks={marks} setMarks={setMarks} />
          <button type="button" className="btn-primary w-full" disabled={Object.keys(marks).length < RUBRIC.length} onClick={() => onDone(rubricScore(marks))}>
            Save · about {rubricScore(marks)}/60
          </button>
        </div>
      )}
    </div>
  );
}

/** Speaking: preparation time, then a timed answer that is transcribed. */
export function SpeakingPractice({ task, onDone }: { task: SpeakingTask; onDone: (score60: number) => void }) {
  const { settings } = useProgress();
  const engine = resolveEngine(settings.speechEngine);
  const [phase, setPhase] = useState<"prep" | "speak" | "review">("prep");
  const [state, setState] = useState<"idle" | "loading" | "listening" | "checking">("idle");
  const [heard, setHeard] = useState("");
  const [error, setError] = useState("");
  const [marks, setMarks] = useState<Record<string, number>>({});
  const live = useRef<Listening | null>(null);
  const prepLeft = useCountdown(task.prepSeconds, phase === "prep");
  const speakLeft = useCountdown(task.speakSeconds, state === "listening");
  useEffect(() => () => live.current?.cancel(), []);
  useEffect(() => {
    if (phase === "prep" && prepLeft === 0) setPhase("speak");
  }, [phase, prepLeft]);

  const record = async () => {
    if (!engine) return;
    if (state === "listening") {
      live.current?.stop();
      if (engine === "whisper") setState("checking");
      return;
    }
    setError("");
    try {
      if (engine === "whisper" && !whisperLoaded()) {
        setState("loading");
        await loadWhisper();
      }
      const l = listen(engine, task.speakSeconds * 1000, { continuous: true });
      live.current = l;
      setState("listening");
      setHeard((await l.result)[0] ?? "");
      setPhase("review");
    } catch (e) {
      const code = e instanceof SttError ? e.code : "failed";
      if (code !== "aborted") setError(code === "no-speech" ? "Didn't catch anything — try again." : "Couldn't listen — check the microphone.");
    } finally {
      live.current = null;
      setState("idle");
    }
  };

  const key = soundKey(heard);
  const usedPhrases = task.phrases.filter((p) => key.includes(soundKey(p.fa.replace(/…/g, "").trim())));
  const usedConnectors = CONNECTORS.filter((c) => key.includes(soundKey(c.fa)));
  const words = heard.trim() ? heard.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-line p-5">
        <p className="flex items-start gap-1">
          <Fa className="flex-1 text-xl font-bold leading-relaxed">{task.prompt.fa}</Fa>
          <AudioButtons text={task.prompt.fa} compact />
        </p>
        <p className="mt-1 text-sm font-semibold text-muted">{task.prompt.en}</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-extrabold text-muted">Useful phrases</p>
        <ul className="flex flex-wrap gap-2">
          {task.phrases.map((p) => (
            <li key={p.fa} className={cx("rounded-xl border px-3 py-1", usedPhrases.includes(p) ? "border-pista bg-pista-soft text-pista-ink" : "border-line")}>
              <Fa className="font-bold">{p.fa}</Fa> <span className="text-xs font-semibold text-muted">{p.en}</span>
            </li>
          ))}
        </ul>
      </div>

      {phase === "prep" && (
        <div className="rounded-2xl bg-paper p-5 text-center">
          <p className="font-extrabold">Get ready: think about what you'll say.</p>
          <p className="mt-2 text-4xl font-extrabold">{mmss(prepLeft)}</p>
          <button type="button" className="btn-secondary btn-sm mt-3" onClick={() => setPhase("speak")}>
            I&apos;m ready
          </button>
        </div>
      )}

      {phase === "speak" &&
        (engine ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-paper p-5 text-center">
            <button
              type="button"
              onClick={record}
              disabled={state === "loading" || state === "checking"}
              aria-label={state === "listening" ? "Stop" : "Start speaking"}
              className={cx("btn-icon !size-20 !rounded-full", state === "listening" ? "btn-danger" : "btn-primary")}
            >
              {state === "loading" || state === "checking" ? <Loader2 className="size-9 animate-spin" /> : state === "listening" ? <Square className="size-8 fill-current" /> : <Mic className="size-10" />}
            </button>
            <p role="status" className="font-extrabold">
              {state === "listening" ? `Speaking… ${mmss(speakLeft)} left — tap to finish` : `Tap the mic and talk for up to ${mmss(task.speakSeconds)}`}
            </p>
            {error && <p className="text-sm font-bold text-anar-ink">{error}</p>}
          </div>
        ) : (
          <div className="rounded-2xl bg-paper p-5">
            <p className="font-semibold">This browser can&apos;t listen, so say your answer aloud on your own, then compare it with the model.</p>
            <button type="button" className="btn-primary btn-sm mt-3" onClick={() => setPhase("review")}>
              I&apos;ve answered
            </button>
          </div>
        ))}

      {phase === "review" && (
        <div className="space-y-5">
          {heard && (
            <div className="rounded-2xl border border-line p-4">
              <p className="text-sm font-extrabold text-muted">What we heard · {words} words</p>
              <p dir="rtl" lang="fa" className="mt-1 text-lg leading-loose">
                {heard}
              </p>
              <p className="mt-2 text-sm font-bold text-firuze-ink">
                {usedPhrases.length} useful {usedPhrases.length === 1 ? "phrase" : "phrases"} · {usedConnectors.length} linking {usedConnectors.length === 1 ? "word" : "words"}
              </p>
            </div>
          )}
          <ModelAnswer lines={task.model} />
          <button type="button" className="btn-ghost btn-sm" onClick={() => (setHeard(""), setPhase("speak"))}>
            <RotateCcw className="size-4" /> Try again
          </button>
          <Rubric marks={marks} setMarks={setMarks} />
          <button type="button" className="btn-primary w-full" disabled={Object.keys(marks).length < RUBRIC.length} onClick={() => (stopSpeaking(), onDone(rubricScore(marks)))}>
            Save · about {rubricScore(marks)}/60
          </button>
        </div>
      )}
    </div>
  );
}

