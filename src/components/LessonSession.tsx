"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, PartyPopper, Sparkles } from "lucide-react";
import { LESSONS, lessonWords, type Lesson } from "@/content/lessons";
import type { Word } from "@/content/words";
import { completeLesson, useProgress, type SessionSummary } from "@/lib/store";
import { shuffle } from "@/lib/util";
import { CardControls } from "./CardControls";
import { ChoiceRound } from "./ChoiceRound";
import { RecallRound } from "./RecallRound";
import { AudioButtons, BookmarkButton, Fa, FaWord, ProgressBar, RegisterTag } from "./ui";
import { WordCard } from "./WordCard";

type Phase =
  | { name: "preview" }
  | { name: "study"; index: number; revealed: boolean }
  | { name: "recognition" }
  | { name: "interstitial"; recognised: number }
  | { name: "recall"; recognised: number }
  | { name: "result"; recognised: number; recall: SessionSummary; xp: number };

export function LessonSession({ lesson }: { lesson: Lesson }) {
  const progress = useProgress();
  const words = useMemo(() => lessonWords(lesson), [lesson]);
  const quizWords = useMemo(() => shuffle(words), [words]);
  const [phase, setPhase] = useState<Phase>({ name: "preview" });
  const record = progress.lessons[lesson.id];

  const nextLesson = LESSONS.find((l) => l.order === lesson.order + 1);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/app/lessons/" className="btn-ghost -ml-3">
          <ArrowLeft className="size-4" /> Lessons
        </Link>
        <CardControls showDirection={phase.name !== "preview" && phase.name !== "study"} />
      </div>

      {phase.name === "preview" && (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="chip bg-firuze-soft text-firuze">{lesson.cefr}</span>
              Lesson {lesson.order} · {words.length} words
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold">
              {lesson.emoji} {lesson.title} <Fa className="ms-2 text-2xl font-normal text-muted">{lesson.titleFa}</Fa>
            </h1>
            <p className="mt-1 text-muted">{lesson.description}</p>
            {record?.completedAt && (
              <p className="mt-2 text-sm text-firuze">
                ✓ Completed · best score {record.best}% · {record.attempts} attempt{record.attempts === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {words.map((w) => (
              <WordCard key={w.id} word={w} isNew={!progress.cards[w.id]} />
            ))}
          </div>
          <details className="card mt-4 p-4 text-sm">
            <summary className="cursor-pointer font-semibold">Study tips</summary>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-muted">
              <li>Say each word out loud before you reveal it.</li>
              <li>Words marked “Spoken” are how people talk; “Formal” is for writing and polite speech.</li>
              <li>Typos are fine — you’ll see “almost” and a spelling tip instead of a red cross.</li>
            </ul>
          </details>
          <div className="sticky bottom-20 mt-6 flex justify-end gap-2 sm:bottom-4">
            <button type="button" className="btn-secondary shadow-sm" onClick={() => setPhase({ name: "recognition" })}>
              Skip to quiz
            </button>
            <button type="button" className="btn-primary shadow-sm" onClick={() => setPhase({ name: "study", index: 0, revealed: false })}>
              Start learning <ArrowRight className="size-4" />
            </button>
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
        <ChoiceRound words={quizWords} onDone={(ids) => setPhase({ name: "interstitial", recognised: ids.length })} />
      )}

      {phase.name === "interstitial" && (
        <div className="card p-8 text-center">
          <Sparkles className="mx-auto size-10 text-saffron" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Round 1 complete</h2>
          <p className="mt-1 text-muted">
            You recognised {phase.recognised} of {words.length} words ({Math.round((phase.recognised / words.length) * 100)}%).
          </p>
          <p className="mt-4 text-sm">Next: type each word from memory. Missed words come back at the end.</p>
          <button type="button" className="btn-primary mt-6" autoFocus onClick={() => setPhase({ name: "recall", recognised: phase.recognised })}>
            Round 2: type from memory <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {phase.name === "recall" && (
        <RecallRound
          words={quizWords}
          label="Round 2 · Recall"
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
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm text-muted">
        <span className="whitespace-nowrap">Study</span>
        <ProgressBar value={(index + (revealed ? 1 : 0)) / total} className="flex-1" />
        <span>
          {index + 1}/{total}
        </span>
      </div>
      <div className="card flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center sm:p-10">
        <div className="flex gap-2">
          <RegisterTag register={word.register} />
        </div>
        <FaWord word={word} settings={settings} size="xl" />
        {!settings.scriptOnly && <p className="text-sm text-muted">sounds like “{word.soundsLike}”</p>}
        <div className="flex items-center">
          <AudioButtons text={word.fa} />
          <BookmarkButton wordId={word.id} />
        </div>
        {revealed ? (
          <div className="mt-2 w-full max-w-md border-t border-line pt-4">
            <p className="font-display text-2xl font-semibold">{word.en}</p>
            <div className="mt-3 rounded-xl bg-paper p-3 text-sm">
              <Fa className="block text-lg">{word.example.fa}</Fa>
              {!settings.scriptOnly && <p className="text-muted">{word.example.tr}</p>}
              <p>{word.example.en}</p>
            </div>
            {word.note && <p className="mt-2 text-xs text-muted">💡 {word.note}</p>}
          </div>
        ) : (
          <button type="button" className="btn-secondary mt-2" onClick={props.onReveal} autoFocus>
            <Eye className="size-4" /> Reveal meaning
          </button>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <button type="button" className="btn-ghost" onClick={props.onSkip}>
          Skip to quiz
        </button>
        <button type="button" className="btn-primary" onClick={props.onNext} disabled={!revealed} autoFocus={revealed} key={String(revealed)}>
          {index + 1 < total ? "Next word" : "Start quiz"} <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
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
    <div className="card p-6 text-center sm:p-10">
      <PartyPopper className="mx-auto size-12 text-saffron" />
      <h2 className="mt-3 font-display text-3xl font-semibold">Lesson completed!</h2>
      <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Score" value={`${pct}%`} />
        <Stat label="Correct" value={`${correct}/${total}`} />
        <Stat label="Good" value={good} tone="firuze" />
        <Stat label="Again" value={again} tone="anar" />
      </div>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-saffron-soft px-4 py-2 font-semibold text-saffron">+{xp} XP</p>
      <p className="mt-3 text-sm text-muted">These words are now in your Daily Practice — they’ll come back when you’re about to forget them.</p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <button type="button" className="btn-secondary" onClick={onReview}>
          Review this lesson
        </button>
        {nextLesson ? (
          <Link href={`/app/lessons/${nextLesson.id}/`} className="btn-primary" autoFocus>
            Next: {nextLesson.title} <ArrowRight className="size-4" />
          </Link>
        ) : (
          <Link href="/app/practice/" className="btn-primary">
            Go to Daily Practice <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "firuze" | "anar" }) {
  return (
    <div className="rounded-xl bg-paper p-3">
      <p className={tone === "firuze" ? "text-2xl font-bold text-firuze" : tone === "anar" ? "text-2xl font-bold text-anar" : "text-2xl font-bold"}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
