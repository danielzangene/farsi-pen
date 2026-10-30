"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye, PartyPopper, RotateCcw, Sparkles, Target, ThumbsUp, Zap } from "lucide-react";
import { LESSONS, lessonWords, type Lesson } from "@/content/lessons";
import type { Word } from "@/content/words";
import { completeLesson, useProgress, type SessionSummary } from "@/lib/store";
import { shuffle } from "@/lib/util";
import { CardControls } from "./CardControls";
import { ChoiceRound } from "./ChoiceRound";
import { RecallRound } from "./RecallRound";
import { AudioButtons, BookmarkButton, Fa, FaWord, FeedbackSheet, RegisterTag, SessionHeader, StatCard } from "./ui";
import { WordCard } from "./WordCard";

type Phase =
  | { name: "preview" }
  | { name: "study"; index: number; revealed: boolean }
  | { name: "recognition" }
  | { name: "interstitial"; recognised: number }
  | { name: "recall"; recognised: number }
  | { name: "result"; recognised: number; recall: SessionSummary; xp: number };

const EXIT = "/app/lessons/";
// The session progress bar splits evenly: study, round 1, round 2.
const STEP = 1 / 3;

function Counter({ n, total }: { n: number; total: number }) {
  return (
    <span className="text-sm font-extrabold tabular-nums text-muted">
      {n}/{total}
    </span>
  );
}

function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="-mt-3 mb-5 flex justify-center">{children}</div>;
}

export function LessonSession({ lesson }: { lesson: Lesson }) {
  const progress = useProgress();
  const words = useMemo(() => lessonWords(lesson), [lesson]);
  const quizWords = useMemo(() => shuffle(words), [words]);
  const [phase, setPhase] = useState<Phase>({ name: "preview" });
  const record = progress.lessons[lesson.id];

  const nextLesson = LESSONS.find((l) => l.order === lesson.order + 1);

  return (
    <div className="mx-auto max-w-3xl">
      {phase.name === "preview" && (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link href={EXIT} className="btn-ghost -ml-3">
              <ArrowLeft className="size-4" /> Lessons
            </Link>
            <CardControls showDirection={false} />
          </div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-bold text-muted">
              <span className="chip bg-firuze-soft text-firuze-ink">{lesson.cefr}</span>
              Lesson {lesson.order} · {words.length} words
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              {lesson.emoji} {lesson.title} <Fa className="ms-2 text-2xl font-semibold text-muted">{lesson.titleFa}</Fa>
            </h1>
            <p className="mt-1 font-semibold text-muted">{lesson.description}</p>
            {record?.completedAt && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-saffron-ink">
                <CheckCircle2 className="size-4" /> Completed · best score {record.best}% · {record.attempts} attempt{record.attempts === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {words.map((w) => (
              <WordCard key={w.id} word={w} isNew={!progress.cards[w.id]} />
            ))}
          </div>
          <details className="card mt-4 p-4 text-sm">
            <summary className="cursor-pointer font-extrabold">Study tips</summary>
            <ul className="mt-2 list-disc space-y-1 ps-5 font-semibold text-muted">
              <li>Say each word out loud before you reveal it.</li>
              <li>Words marked “Spoken” are how people talk; “Formal” is for writing and polite speech.</li>
              <li>Typos are fine — you’ll see “almost” and a spelling tip instead of a red cross.</li>
            </ul>
          </details>
          <div className="sticky bottom-20 z-20 -mx-4 mt-6 border-t-2 border-line bg-card/95 px-4 py-3 backdrop-blur sm:bottom-0">
            <div className="flex gap-3 sm:justify-end">
              <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={() => setPhase({ name: "recognition" })}>
                Skip to quiz
              </button>
              <button type="button" className="btn-primary flex-1 sm:min-w-40 sm:flex-none" onClick={() => setPhase({ name: "study", index: 0, revealed: false })}>
                Start
              </button>
            </div>
          </div>
        </>
      )}

      {phase.name === "study" && (
        <Study
          word={words[phase.index]}
          index={phase.index}
          total={words.length}
          revealed={phase.revealed}
          onReveal={() => setPhase({ ...phase, revealed: true })}
          onNext={() =>
            phase.index + 1 < words.length
              ? setPhase({ name: "study", index: phase.index + 1, revealed: false })
              : setPhase({ name: "recognition" })
          }
          onSkip={() => setPhase({ name: "recognition" })}
        />
      )}

      {phase.name === "recognition" && (
        <ChoiceRound
          words={quizWords}
          exitHref={EXIT}
          progressSpan={[STEP, 2 * STEP]}
          toolbar={<CardControls />}
          onDone={(ids) => setPhase({ name: "interstitial", recognised: ids.length })}
        />
      )}

      {phase.name === "interstitial" && (
        <>
          <SessionHeader exitHref={EXIT} progress={2 * STEP} />
          <Toolbar>
            <CardControls />
          </Toolbar>
          <div className="flex flex-col items-center py-6 text-center">
            <span className="grid size-20 animate-pop place-items-center rounded-full bg-saffron-soft text-saffron-ink">
              <Sparkles className="size-10" />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold">Round 1 complete!</h2>
            <p className="mt-2 max-w-sm font-semibold text-muted">
              You recognised {phase.recognised} of {words.length} words ({Math.round((phase.recognised / words.length) * 100)}%).
            </p>
            <div className="mt-6 w-44">
              <StatCard label="Recognised" value={`${phase.recognised}/${words.length}`} tone="pista" icon={<Target className="size-5" />} />
            </div>
            <p className="mt-6 max-w-sm font-semibold">Next: type each word from memory. Missed words come back at the end.</p>
          </div>
          <FeedbackSheet state="idle">
            <p className="hidden font-extrabold text-muted sm:block">Round 2 · Type from memory</p>
            <button
              type="button"
              className="btn-primary btn-lg w-full sm:w-auto sm:min-w-40"
              autoFocus
              onClick={() => setPhase({ name: "recall", recognised: phase.recognised })}
            >
              Continue
            </button>
          </FeedbackSheet>
        </>
      )}

      {phase.name === "recall" && (
        <RecallRound
          words={quizWords}
          label="Round 2 · Recall"
          exitHref={EXIT}
          progressSpan={[2 * STEP, 1]}
          toolbar={<CardControls />}
          onDone={(recall) => {
            const xp = completeLesson(lesson.id, {
              ...recall,
              correct: recall.correct + phase.recognised,
              total: recall.total * 2,
            });
            setPhase({ name: "result", recognised: phase.recognised, recall, xp });
          }}
        />
      )}

      {phase.name === "result" && (
        <Result
          words={words}
          recognised={phase.recognised}
          recall={phase.recall}
          xp={phase.xp}
          nextLesson={nextLesson}
          onReview={() => setPhase({ name: "preview" })}
        />
      )}
    </div>
  );
}

function Study(props: {
  word: Word;
  index: number;
  total: number;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const { settings } = useProgress();
  const { word, index, total, revealed } = props;
  return (
    <>
      <SessionHeader exitHref={EXIT} progress={((index + (revealed ? 1 : 0)) / total) * STEP} right={<Counter n={index + 1} total={total} />} />
      <Toolbar>
        <CardControls showDirection={false} />
      </Toolbar>

      <h2 className="text-2xl font-extrabold">Learn this word</h2>

      <div className="card relative mt-5 flex min-h-72 flex-col items-center justify-center gap-4 p-6 text-center sm:p-10">
        <div className="absolute right-2 top-2">
          <BookmarkButton wordId={word.id} />
        </div>
        <RegisterTag register={word.register} />
        <FaWord word={word} settings={settings} size="xl" />
        {!settings.scriptOnly && <p className="font-semibold text-muted">sounds like “{word.soundsLike}”</p>}
        <AudioButtons text={word.fa} big />
      </div>

      {revealed && (
        <div className="card mt-4 animate-pop p-5 text-center sm:p-6">
          <p className="eyebrow text-muted">Meaning</p>
          <p className="mt-1 text-2xl font-extrabold">{word.en}</p>
          <div className="mt-4 rounded-xl bg-paper p-4">
            <Fa className="block text-lg">{word.example.fa}</Fa>
            {!settings.scriptOnly && <p className="text-sm font-semibold text-muted">{word.example.tr}</p>}
            <p className="font-semibold">{word.example.en}</p>
          </div>
          {word.note && <p className="mt-3 text-sm font-semibold text-muted">💡 {word.note}</p>}
        </div>
      )}

      <FeedbackSheet state="idle">
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="btn-ghost" onClick={props.onSkip}>
            Skip to quiz
          </button>
          <button
            key={revealed ? "next" : "reveal"}
            type="button"
            className="btn-primary btn-lg w-full sm:w-auto sm:min-w-40"
            onClick={revealed ? props.onNext : props.onReveal}
            autoFocus
          >
            {revealed ? (
              index + 1 < total ? "Continue" : "Start quiz"
            ) : (
              <>
                <Eye className="size-5" /> Reveal
              </>
            )}
          </button>
        </div>
      </FeedbackSheet>
    </>
  );
}

function Result({
  words,
  recognised,
  recall,
  xp,
  nextLesson,
  onReview,
}: {
  words: Word[];
  recognised: number;
  recall: SessionSummary;
  xp: number;
  nextLesson?: Lesson;
  onReview: () => void;
}) {
  const total = words.length * 2;
  const correct = recognised + recall.correct;
  const pct = Math.round((correct / total) * 100);
  const good = Object.values(recall.outcomes).filter((o) => o !== "again").length;
  const again = words.length - good;
  return (
    <>
      <SessionHeader exitHref={EXIT} progress={1} />
      <div className="flex flex-col items-center py-4 text-center">
        <span className="grid size-24 animate-pop place-items-center rounded-full bg-saffron text-white">
          <PartyPopper className="size-12" />
        </span>
        <h2 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">Lesson complete!</h2>
        <p className="mt-2 font-semibold text-muted">
          {correct}/{total} answers right
        </p>
        <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total XP" value={xp} tone="saffron" icon={<Zap className="size-5 fill-current" />} />
          <StatCard label="Accuracy" value={`${pct}%`} tone="pista" icon={<Target className="size-5" />} />
          <StatCard label="Good" value={good} tone="sky" icon={<ThumbsUp className="size-5" />} />
          <StatCard label="Again" value={again} tone="anar" icon={<RotateCcw className="size-5" />} />
        </div>
        <p className="mt-6 max-w-md text-sm font-semibold text-muted">
          These words are now in your Daily Practice — they’ll come back when you’re about to forget them.
        </p>
        {nextLesson && (
          <p className="mt-4 text-sm font-bold">
            Up next: {nextLesson.emoji} {nextLesson.title}
          </p>
        )}
        <div className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse">
          {nextLesson ? (
            <Link href={`/app/lessons/${nextLesson.id}/`} className="btn-primary btn-lg flex-1" autoFocus>
              Continue
            </Link>
          ) : (
            <Link href="/app/practice/" className="btn-primary btn-lg flex-1" autoFocus>
              Daily Practice
            </Link>
          )}
          <button type="button" className="btn-secondary btn-lg flex-1" onClick={onReview}>
            Review
          </button>
        </div>
      </div>
    </>
  );
}
