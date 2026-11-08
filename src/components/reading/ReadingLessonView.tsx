"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Mic, Pause, Play, Plus, Square, Volume2, X, XCircle } from "lucide-react";
import { GRAMMAR_BY_ID } from "@/content/grammar";
import { readingGlossary, type FaItem, type ReadingLesson } from "@/content/readings";
import { lookupPersian } from "@/lib/dictionary";
import { soundKey } from "@/lib/pronounce";
import { speak, stopSpeaking } from "@/lib/speech";
import { cleanFa } from "@/lib/spell";
import { addCustomWord, completeReading, useProgress } from "@/lib/store";
import { listen, loadWhisper, resolveEngine, SttError, whisperLoaded, type Listening } from "@/lib/stt";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, SessionHeader, Segmented, StatCard } from "../ui";

const STEPS = ["Before you read", "Read", "Check", "Written and spoken", "Grammar in the text", "In the news", "Get to know Iran", "Your turn"] as const;

/** One reading lesson, walked step by step. */
export function ReadingLessonView({ lesson }: { lesson: ReadingLesson }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState<{ xp: number; correct: number } | null>(null);
  const correct = lesson.check.filter((q, i) => answers[i] === q.answer).length;
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    stopSpeaking();
    top.current?.scrollIntoView({ block: "start" });
  }, [step]);

  if (done)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-6 text-center sm:pt-12">
        <p lang="fa" className="text-5xl font-bold text-saffron-ink">
          آفرین
        </p>
        <h1 className="mt-4 text-3xl font-extrabold">Lesson {lesson.number} done</h1>
        <p className="mt-2 font-semibold text-muted">{lesson.topic}</p>
        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <StatCard label="Total XP" value={done.xp} tone="saffron" />
          <StatCard label="Understood" value={`${done.correct}/${lesson.check.length}`} tone="pista" />
        </div>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <Link href="/app/reading/" className="btn-primary btn-lg" autoFocus>
            All reading lessons
          </Link>
          <button type="button" className="btn-secondary btn-lg" onClick={() => (setDone(null), setStep(1))}>
            Read it again
          </button>
        </div>
      </div>
    );

  const last = step === STEPS.length - 1;
  const canNext = step !== 2 || Object.keys(answers).length === lesson.check.length;

  return (
    <div>
      <div ref={top} className="scroll-mt-20" />
      <SessionHeader exitHref="/app/reading/" progress={(step + 1) / STEPS.length} right={<span className="eyebrow text-muted">{step + 1}/{STEPS.length}</span>} />
      <p className="text-sm font-bold text-muted">
        Reading {lesson.number} · {lesson.topic}
      </p>
      <h1 className="mt-1 text-2xl font-extrabold">{STEPS[step]}</h1>

      <div className="mt-6">
        {step === 0 && <BeforeYouRead lesson={lesson} />}
        {step === 1 && <ReadText lesson={lesson} />}
        {step === 2 && <CheckStep lesson={lesson} answers={answers} onAnswer={(i, a) => setAnswers((x) => (i in x ? x : { ...x, [i]: a }))} />}
        {step === 3 && <SpokenStep lesson={lesson} />}
        {step === 4 && <GrammarStep lesson={lesson} />}
        {step === 5 && <NewsStep lesson={lesson} />}
        {step === 6 && <CultureStep lesson={lesson} />}
        {step === 7 && <TaskStep lesson={lesson} />}
      </div>

      <div className="h-32" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <button type="button" className="btn-ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </button>
          {step === 2 && !canNext && <span className="hidden text-sm font-semibold text-muted sm:block">Answer every question to go on</span>}
          <button
            type="button"
            className="btn-primary min-w-36"
            disabled={!canNext}
            onClick={() => (last ? setDone({ xp: completeReading(lesson.id, correct, lesson.check.length), correct }) : setStep(step + 1))}
          >
            {last ? "Finish" : step === 0 ? "Start reading" : "Next"} {!last && <ArrowRight className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function WordList({ words }: { words: FaItem[] }) {
  const { settings } = useProgress();
  return (
    <ul className="divide-y-2 divide-line rounded-2xl border-2 border-line">
      {words.map((w) => (
        <li key={w.fa} className="flex items-center gap-3 py-2 pe-1 ps-4">
          <Fa className="text-xl font-bold">{w.fa}</Fa>
          <span className="min-w-0 flex-1 text-sm font-semibold text-muted">
            {!settings.scriptOnly && <span>{w.tr} · </span>}
            <span className="text-ink">{w.en}</span>
          </span>
          <AudioButtons text={w.fa} compact />
        </li>
      ))}
    </ul>
  );
}

function BeforeYouRead({ lesson }: { lesson: ReadingLesson }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-line p-5">
        <p className="text-xl font-extrabold">{lesson.question.en}</p>
        <p className="mt-2 flex items-center gap-1">
          <Fa className="text-xl font-bold leading-relaxed">{lesson.question.fa}</Fa>
          <AudioButtons text={lesson.question.fa} compact />
        </p>
        <p className="mt-3 text-sm font-semibold text-muted">Think about your answer for a moment, or say it out loud. You&apos;ll come back to it at the end.</p>
      </div>
      <div>
        <h2 className="mb-2 font-extrabold">Words you&apos;ll meet</h2>
        <WordList words={lesson.keyWords} />
      </div>
    </div>
  );
}

function ReadText({ lesson }: { lesson: ReadingLesson }) {
  const [mode, setMode] = useState<"text" | "lines">("text");
  const [word, setWord] = useState<string | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const run = useRef(0);
  const sentences = lesson.text.flat();
  const glossary = useMemo(() => readingGlossary(lesson), [lesson]);
  const glossed = (tok: string) => {
    const t = clean(tok);
    for (const k of glossary.keys()) if (k === t || (k.length >= 3 && !k.includes(" ") && t.startsWith(k))) return true;
    return false;
  };

  const playAll = async (from = 0) => {
    const id = ++run.current;
    for (let i = from; i < sentences.length; i++) {
      if (run.current !== id) return;
      setPlaying(i);
      await speak(sentences[i].fa);
    }
    if (run.current === id) setPlaying(null);
  };
  const stop = () => {
    run.current++;
    stopSpeaking();
    setPlaying(null);
  };
  useEffect(() => () => void run.current++, []);

  let n = -1;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="View"
          value={mode}
          onChange={setMode}
          options={[
            { value: "text", label: "Text" },
            { value: "lines", label: "Line by line" },
          ]}
        />
        <button type="button" className="btn-sky btn-sm" onClick={() => (playing === null ? void playAll() : stop())}>
          {playing === null ? <Play className="size-4 fill-current" /> : <Pause className="size-4 fill-current" />} {playing === null ? "Listen to it all" : "Stop"}
        </button>
      </div>

      {mode === "text" ? (
        <>
          <p className="text-sm font-semibold text-muted">Tap any word to see what it means. Underlined words are the ones to learn.</p>
          <div lang="fa" dir="rtl" className="space-y-5 rounded-2xl bg-paper p-5 text-xl leading-[2.3] sm:p-7 sm:text-2xl sm:leading-[2.3]">
            {lesson.text.map((para, pi) => (
              <p key={pi}>
                {para.map((s) => {
                  n++;
                  const idx = n;
                  return (
                    <span key={idx} className={cx("rounded-md transition-colors", playing === idx && "bg-sky-soft")}>
                      {s.fa.split(" ").map((tok, k) => (
                        <span key={k}>
                          <button
                            type="button"
                            onClick={() => setWord(tok)}
                            className={cx("rounded px-0.5 hover:bg-sky-soft focus-visible:bg-sky-soft", glossed(tok) && "underline decoration-saffron decoration-dotted decoration-2 underline-offset-[10px]")}
                          >
                            {tok}
                          </button>{" "}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </>
      ) : (
        <ol className="space-y-3">
          {sentences.map((s, i) => (
            <li key={i} className={cx("flex items-start gap-2 rounded-2xl border-2 p-3", playing === i ? "border-sky bg-sky-soft" : "border-line")}>
              <button type="button" className="btn-ghost btn-icon shrink-0 !text-sky-ink" onClick={() => (stop(), void playAll(i))} aria-label={`Play sentence ${i + 1}`}>
                <Volume2 className="size-5" />
              </button>
              <div className="min-w-0 flex-1">
                <p dir="rtl" lang="fa" className="text-xl leading-loose">
                  {s.fa}
                </p>
                <p className="text-sm font-semibold text-muted">{s.en}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {word && <Gloss word={word} glossary={glossary} onClose={() => setWord(null)} />}
    </div>
  );
}

const clean = (tok: string) => cleanFa(tok).replace(/[.،؛:!?؟«»"()]/g, "");

function Gloss({ word, glossary, onClose }: { word: string; glossary: Map<string, FaItem>; onClose: () => void }) {
  const s = useProgress();
  const plain = clean(word);
  const local = glossary.get(plain) ?? [...glossary.values()].find((g) => g.fa.length >= 3 && !g.fa.includes(" ") && plain.startsWith(g.fa));
  const [found, setFound] = useState<{ fa: string; en: string; tr?: string } | null | undefined>(local ?? undefined);
  useEffect(() => {
    if (local) return setFound(local);
    let c = false;
    setFound(undefined);
    lookupPersian(plain).then((e) => !c && setFound(e ? { fa: e.fa[0], en: e.en.split(",").slice(0, 3).join(", "), tr: e.course?.tr } : null));
    return () => {
      c = true;
    };
  }, [plain, local]);
  const id = found ? `custom:${found.fa.replace(/\s+/g, "-")}` : "";
  const added = !!found && s.bookmarks.includes(id);
  return (
    <div role="status" className="fixed inset-x-0 bottom-20 z-40 px-4">
      <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border-2 border-sky bg-card p-4 shadow-lg">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <Fa className="text-2xl font-bold">{found?.fa ?? plain}</Fa>
            <AudioButtons text={found?.fa ?? plain} compact />
          </div>
          <p className="font-semibold">
            {found === undefined ? "Looking up…" : found ? found.en : "Not in the dictionary."}
            {found?.tr && !s.settings.scriptOnly && <span className="ms-2 text-sm text-muted">{found.tr}</span>}
          </p>
          {found && (
            <button type="button" className="btn-ghost btn-sm -ms-2 mt-1" disabled={added} onClick={() => addCustomWord({ fa: found.fa, en: found.en.split(",")[0].trim(), tr: found.tr })}>
              {added ? <Check className="size-4" /> : <Plus className="size-4" />} {added ? "In my cards" : "Add to my cards"}
            </button>
          )}
        </div>
        <button type="button" className="btn-ghost btn-icon -me-2 -mt-1" onClick={onClose} aria-label="Close">
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}

function CheckStep({ lesson, answers, onAnswer }: { lesson: ReadingLesson; answers: Record<number, string>; onAnswer: (i: number, a: string) => void }) {
  return (
    <ol className="space-y-6">
      {lesson.check.map((q, i) => {
        const a = answers[i];
        return (
          <li key={i}>
            <p className="font-extrabold">
              {i + 1}. {q.prompt}
            </p>
            <div className="mt-2 grid gap-2">
              {q.options.map((o) => {
                const state = a === undefined ? undefined : o === q.answer ? "correct" : o === a ? "wrong" : undefined;
                return (
                  <button key={o} type="button" className="tile flex items-center justify-between p-3 text-start font-bold" data-state={state} disabled={a !== undefined} onClick={() => onAnswer(i, o)}>
                    {o}
                    {state === "correct" && <CheckCircle2 className="size-5 shrink-0" />}
                    {state === "wrong" && <XCircle className="size-5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SpokenStep({ lesson }: { lesson: ReadingLesson }) {
  return (
    <div className="space-y-5">
      <p className="font-semibold">{lesson.spokenNote}</p>
      <ul className="space-y-3">
        {lesson.spoken.map((p) => (
          <li key={p.fa} className="rounded-2xl border-2 border-line p-4">
            <p className="text-sm font-semibold text-muted">{p.en}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-extrabold text-muted">Written</p>
                <p className="flex items-center gap-1">
                  <Fa className="text-lg font-bold">{p.fa}</Fa>
                  <AudioButtons text={p.fa} compact />
                </p>
              </div>
              <div>
                <p className="text-xs font-extrabold text-firuze-ink">Spoken</p>
                <p className="flex items-center gap-1">
                  <Fa className="text-lg font-bold">{p.spoken}</Fa>
                  <AudioButtons text={p.spoken} compact />
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GrammarStep({ lesson }: { lesson: ReadingLesson }) {
  const g = GRAMMAR_BY_ID[lesson.grammar.conceptId];
  return (
    <div className="space-y-5">
      <p className="font-semibold">{lesson.grammar.note}</p>
      <ul className="space-y-2">
        {lesson.grammar.examples.map((e) => (
          <li key={e} className="flex items-center gap-1 rounded-2xl bg-paper px-4 py-3">
            <Fa className="flex-1 text-lg font-bold">{e}</Fa>
            <AudioButtons text={e} compact />
          </li>
        ))}
      </ul>
      {g && (
        <Link href={`/app/grammar/${g.id}/`} className="tile flex items-center justify-between p-4">
          <span>
            <span className="block text-sm font-bold text-muted">Grammar · {g.level}</span>
            <span className="block font-extrabold">{g.title}</span>
          </span>
          <ArrowRight className="size-5 text-muted" />
        </Link>
      )}
    </div>
  );
}

function NewsStep({ lesson }: { lesson: ReadingLesson }) {
  return (
    <div className="space-y-6">
      <p className="font-semibold text-muted">Words you&apos;ll see in the news about {lesson.news.topic.toLowerCase()}.</p>
      <WordList words={lesson.news.words} />
      <div>
        <h2 className="mb-2 font-extrabold">Read the headlines</h2>
        <ul className="space-y-2">
          {lesson.news.headlines.map((h) => (
            <li key={h.fa} className="border-s-4 border-ink/70 py-1 ps-4">
              <p className="flex items-center gap-1">
                <Fa className="flex-1 text-lg font-extrabold">{h.fa}</Fa>
                <AudioButtons text={h.fa} compact />
              </p>
              <p className="text-sm font-semibold text-muted">{h.en}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs font-semibold text-muted">Example headlines written for practice.</p>
      </div>
    </div>
  );
}

function CultureStep({ lesson }: { lesson: ReadingLesson }) {
  const c = lesson.culture;
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold">
        {c.title} <Fa className="ms-1 font-bold text-muted">{c.fa}</Fa>
      </h2>
      <p className="font-semibold leading-relaxed">{c.text}</p>
      <WordList words={c.words} />
    </div>
  );
}

function TaskStep({ lesson }: { lesson: ReadingLesson }) {
  const { settings } = useProgress();
  const engine = resolveEngine(settings.speechEngine);
  const [state, setState] = useState<"idle" | "loading" | "listening" | "checking">("idle");
  const [heard, setHeard] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [model, setModel] = useState(false);
  const live = useRef<Listening | null>(null);
  useEffect(() => () => live.current?.cancel(), []);

  const say = async () => {
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
      const l = listen(engine, 15000);
      live.current = l;
      setState("listening");
      setHeard((await l.result)[0] ?? "");
    } catch (e) {
      const code = e instanceof SttError ? e.code : "failed";
      if (code !== "aborted") setError(code === "no-speech" ? "Didn't catch that — try again." : "Couldn't listen — check the microphone and try again.");
    } finally {
      live.current = null;
      setState("idle");
    }
  };

  const used = heard ? lesson.task.phrases.filter((p) => soundKey(heard).includes(soundKey(p.fa))) : [];

  return (
    <div className="space-y-6">
      <p className="text-lg font-extrabold">{lesson.task.prompt}</p>
      <div>
        <h2 className="mb-2 font-extrabold">Useful phrases</h2>
        <ul className="flex flex-wrap gap-2">
          {lesson.task.phrases.map((p) => {
            const on = used.includes(p);
            return (
              <li key={p.fa} className={cx("flex items-center gap-1 rounded-xl border-2 py-1 pe-1 ps-3", on ? "border-pista bg-pista-soft text-pista-ink" : "border-line")}>
                {on && <Check className="size-4" />}
                <Fa className="font-bold">{p.fa}</Fa>
                <span className="text-sm font-semibold text-muted">· {p.en}</span>
                <AudioButtons text={p.fa} compact />
              </li>
            );
          })}
        </ul>
      </div>

      {engine && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={say}
            disabled={state === "loading" || state === "checking"}
            aria-label={state === "listening" ? "Stop recording" : "Say your answer"}
            className={cx("btn-icon !size-16 shrink-0 !rounded-full", state === "listening" ? "btn-danger" : "btn-primary")}
          >
            {state === "loading" || state === "checking" ? <Loader2 className="size-7 animate-spin" /> : state === "listening" ? <Square className="size-6 fill-current" /> : <Mic className="size-8" />}
          </button>
          <div role="status" className="min-w-0">
            {state === "listening" ? (
              <p className="font-extrabold">Listening… tap to stop</p>
            ) : heard !== null ? (
              <>
                <p className="text-sm font-bold text-muted">We heard</p>
                <p>
                  <Fa className="text-lg font-bold">{heard || "…"}</Fa>
                </p>
                <p className="text-sm font-bold text-firuze-ink">
                  {used.length ? `You used ${used.length} of the phrases.` : "Try working in one of the phrases above."}
                </p>
              </>
            ) : (
              <p className="font-semibold text-muted">Tap the mic and answer in a few sentences.</p>
            )}
            {error && <p className="text-sm font-bold text-anar-ink">{error}</p>}
          </div>
        </div>
      )}

      <div>
        <button type="button" className="btn-secondary btn-sm" onClick={() => setModel(!model)} aria-expanded={model}>
          {model ? "Hide the model answer" : "Hear a model answer"}
        </button>
        {model && (
          <ul className="mt-3 space-y-2">
            {lesson.task.model.map((m) => (
              <li key={m.fa} className="rounded-2xl bg-paper px-4 py-3">
                <p className="flex items-center gap-1">
                  <Fa className="flex-1 text-lg font-bold">{m.fa}</Fa>
                  <AudioButtons text={m.fa} compact />
                </p>
                <p className="text-sm font-semibold text-muted">{m.en}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
