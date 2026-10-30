"use client";
import { useState } from "react";
import Link from "next/link";
import { PartyPopper, Repeat, RotateCcw, Target, ThumbsUp, Zap } from "lucide-react";
import { WORD_BY_ID, type Word } from "@/content/words";
import { pickPractice } from "@/lib/srs";
import { completePractice, useHydrated, useProgress, type SessionSummary } from "@/lib/store";
import { CardControls } from "@/components/CardControls";
import { RecallRound } from "@/components/RecallRound";
import { StatCard } from "@/components/ui";

export default function PracticePage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [session, setSession] = useState<Word[] | null>(null);
  const [result, setResult] = useState<{ r: SessionSummary; xp: number } | null>(null);
  const [round, setRound] = useState(0);

  const start = () => {
    const ids = pickPractice(s.cards, new Set(s.hidden), 10);
    setSession(ids.map((id) => WORD_BY_ID[id]).filter(Boolean));
    setResult(null);
    setRound((n) => n + 1);
  };

  const known = Object.keys(s.cards).filter((id) => !s.hidden.includes(id)).length;

  if (!hydrated) return null;

  if (session && !result)
    return (
      <div className="mx-auto max-w-3xl">
        <RecallRound
          key={round}
          words={session}
          label="Daily Practice"
          exitHref="/app/"
          toolbar={<CardControls />}
          onDone={(r) => setResult({ r, xp: completePractice(r) })}
        />
      </div>
    );

  return (
    <div className="mx-auto max-w-xl pt-4 sm:pt-10">
      {result ? (
        <PracticeResult r={result.r} xp={result.xp} onAgain={start} />
      ) : known === 0 ? (
        <div className="card flex flex-col items-center p-8 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-firuze-soft text-firuze-ink">
            <Repeat className="size-10" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold">Nothing to practise yet</h1>
          <p className="mt-2 max-w-sm font-semibold text-muted">Finish a lesson and its words will show up here.</p>
          <Link href="/app/lessons/" className="btn-primary btn-lg mt-6 w-full sm:w-auto">
            Go to lessons
          </Link>
        </div>
      ) : (
        <div className="card flex flex-col items-center p-6 text-center sm:p-8">
          <span className="grid size-20 place-items-center rounded-full bg-firuze-soft text-firuze-ink">
            <Repeat className="size-10" />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold">Daily Practice</h1>
          <p className="mt-2 max-w-sm font-semibold text-muted">
            Ten words, picked by spaced repetition — tricky words come back more often. You have {known} word{known === 1 ? "" : "s"} in
            rotation; a session takes about two minutes.
          </p>
          <div className="mt-6 flex justify-center">
            <CardControls />
          </div>
          <button type="button" className="btn-primary btn-lg mt-6 w-full sm:min-w-56 sm:w-auto" onClick={start} autoFocus>
            Start
          </button>
        </div>
      )}
    </div>
  );
}

function PracticeResult({ r, xp, onAgain }: { r: SessionSummary; xp: number; onAgain: () => void }) {
  const good = Object.values(r.outcomes).filter((o) => o !== "again").length;
  return (
    <div className="flex flex-col items-center text-center">
      <span className="grid size-24 animate-pop place-items-center rounded-full bg-saffron text-white">
        <PartyPopper className="size-12" />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">Practice complete!</h1>
      <p className="mt-2 font-semibold text-muted">Keep the streak alive — see you tomorrow.</p>
      <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total XP" value={xp} tone="saffron" icon={<Zap className="size-5 fill-current" />} />
        <StatCard label="Accuracy" value={`${Math.round((r.correct / r.total) * 100)}%`} tone="pista" icon={<Target className="size-5" />} />
        <StatCard label="Good" value={good} tone="sky" icon={<ThumbsUp className="size-5" />} />
        <StatCard label="Again" value={r.total - good} tone="anar" icon={<RotateCcw className="size-5" />} />
      </div>
      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse">
        <Link href="/app/" className="btn-primary btn-lg flex-1" autoFocus>
          Continue
        </Link>
        <button type="button" className="btn-secondary btn-lg flex-1" onClick={onAgain}>
          Keep practising
        </button>
      </div>
    </div>
  );
}
