"use client";
import { useState } from "react";
import Link from "next/link";
import { PartyPopper, Repeat } from "lucide-react";
import { WORD_BY_ID, type Word } from "@/content/words";
import { pickPractice } from "@/lib/srs";
import { completePractice, useHydrated, useProgress, type SessionSummary } from "@/lib/store";
import { CardControls } from "@/components/CardControls";
import { RecallRound } from "@/components/RecallRound";
import { PageHeader } from "@/components/ui";

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

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Daily Practice" subtitle="Ten words, picked by spaced repetition — tricky words come back more often.">
        {session && !result && <CardControls />}
      </PageHeader>

      {!hydrated ? null : result ? (
        <PracticeResult r={result.r} xp={result.xp} onAgain={start} />
      ) : session ? (
        <RecallRound
          key={round}
          words={session}
          label="Practice"
          onDone={(r) => setResult({ r, xp: completePractice(r) })}
        />
      ) : known === 0 ? (
        <div className="card p-8 text-center">
          <Repeat className="mx-auto size-10 text-firuze" />
          <h2 className="mt-3 text-xl font-semibold">Nothing to practise yet</h2>
          <p className="mt-1 text-muted">Finish a lesson and its words will show up here.</p>
          <Link href="/app/lessons/" className="btn-primary mt-5">
            Go to lessons
          </Link>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Repeat className="mx-auto size-10 text-firuze" />
          <h2 className="mt-3 text-xl font-semibold">Ready when you are</h2>
          <p className="mt-1 text-muted">
            You have {known} word{known === 1 ? "" : "s"} in rotation. A session takes about two minutes.
          </p>
          <div className="mt-5 flex justify-center">
            <CardControls />
          </div>
          <button type="button" className="btn-primary mt-5" onClick={start} autoFocus>
            Start practice
          </button>
        </div>
      )}
    </div>
  );
}

function PracticeResult({ r, xp, onAgain }: { r: SessionSummary; xp: number; onAgain: () => void }) {
  const good = Object.values(r.outcomes).filter((o) => o !== "again").length;
  return (
    <div className="card p-8 text-center">
      <PartyPopper className="mx-auto size-12 text-saffron" />
      <h2 className="mt-3 font-display text-3xl font-semibold">Session complete</h2>
      <p className="mt-2 text-muted">
        {Math.round((r.correct / r.total) * 100)}% right first time · Good {good} · Again {r.total - good}
      </p>
      <p className="mt-4 inline-flex rounded-full bg-saffron-soft px-4 py-2 font-semibold text-saffron">+{xp} XP</p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href="/app/" className="btn-secondary">
          Back to dashboard
        </Link>
        <button type="button" className="btn-primary" onClick={onAgain}>
          Keep practising
        </button>
      </div>
    </div>
  );
}
