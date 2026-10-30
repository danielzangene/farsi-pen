"use client";
import { useState } from "react";
import Link from "next/link";
import { Bookmark, Eye, EyeOff, Play, RotateCcw, Target, ThumbsUp, Trophy, Zap } from "lucide-react";
import { WORD_BY_ID } from "@/content/words";
import { completePractice, toggleHidden, useHydrated, useProgress, type SessionSummary } from "@/lib/store";
import { shuffle } from "@/lib/util";
import { CardControls } from "@/components/CardControls";
import { RecallRound } from "@/components/RecallRound";
import { PageHeader, Segmented, StatCard } from "@/components/ui";
import { WordCard } from "@/components/WordCard";

export default function BookmarksPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [tab, setTab] = useState<"bookmarks" | "hidden">("bookmarks");
  const [practising, setPractising] = useState<string[] | null>(null);
  const [result, setResult] = useState<{ r: SessionSummary; xp: number } | null>(null);
  const [round, setRound] = useState(0);

  const ids = tab === "bookmarks" ? s.bookmarks : s.hidden;
  const words = ids.map((id) => WORD_BY_ID[id]).filter(Boolean);

  const startPractice = () => {
    setResult(null);
    setPractising(shuffle(s.bookmarks).slice(0, 15));
    setRound((n) => n + 1);
  };

  if (practising) {
    if (!result)
      return (
        <div className="mx-auto max-w-3xl">
          <RecallRound
            key={round}
            words={practising.map((id) => WORD_BY_ID[id])}
            label="Bookmarks"
            onExit={() => setPractising(null)}
            toolbar={<CardControls />}
            onDone={(r) => setResult({ r, xp: completePractice(r) })}
          />
        </div>
      );
    const good = Object.values(result.r.outcomes).filter((o) => o !== "again").length;
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-4 text-center sm:pt-10">
        <span className="grid size-24 animate-pop place-items-center rounded-full bg-saffron text-white">
          <Trophy className="size-12" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-saffron-ink sm:text-4xl">Bookmarks practised!</h1>
        <p className="mt-2 font-semibold text-muted">
          {result.r.correct}/{result.r.total} right first time
        </p>
        <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total XP" value={result.xp} tone="saffron" icon={<Zap className="size-5 fill-current" />} />
          <StatCard label="Accuracy" value={`${Math.round((result.r.correct / result.r.total) * 100)}%`} tone="pista" icon={<Target className="size-5" />} />
          <StatCard label="Good" value={good} tone="sky" icon={<ThumbsUp className="size-5" />} />
          <StatCard label="Again" value={result.r.total - good} tone="anar" icon={<RotateCcw className="size-5" />} />
        </div>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row-reverse">
          <button type="button" className="btn-primary btn-lg flex-1" onClick={() => setPractising(null)} autoFocus>
            Back to bookmarks
          </button>
          <button type="button" className="btn-secondary btn-lg flex-1" onClick={startPractice}>
            Practise again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Bookmarks" subtitle="Your personal flashcard set.">
        <Segmented
          label="List"
          value={tab}
          onChange={setTab}
          options={[
            { value: "bookmarks", label: `Bookmarked (${s.bookmarks.length})` },
            { value: "hidden", label: `Hidden (${s.hidden.length})` },
          ]}
        />
      </PageHeader>

      {tab === "bookmarks" && words.length > 0 && (
        <button type="button" className="btn-primary btn-lg mb-6 w-full sm:w-auto" onClick={startPractice}>
          <Play className="size-5 fill-current" /> Practise bookmarks
        </button>
      )}

      {!hydrated ? null : words.length === 0 ? (
        <div className="card mx-auto flex max-w-xl flex-col items-center p-8 text-center">
          <span
            className={
              tab === "bookmarks"
                ? "grid size-20 place-items-center rounded-full bg-saffron-soft text-saffron-ink"
                : "grid size-20 place-items-center rounded-full bg-paper text-muted"
            }
          >
            {tab === "bookmarks" ? <Bookmark className="size-10" /> : <EyeOff className="size-10" />}
          </span>
          <h2 className="mt-5 text-2xl font-extrabold">{tab === "bookmarks" ? "No bookmarks yet" : "No hidden words"}</h2>
          <p className="mt-2 max-w-sm font-semibold text-muted">
            {tab === "bookmarks"
              ? "Tap the bookmark icon on any word — in lessons, practice or the Word Library — to collect it here."
              : "Words you hide during practice appear here. They won't come up in Daily Practice."}
          </p>
          {tab === "bookmarks" && (
            <Link href="/app/words/" className="btn-secondary mt-6">
              Browse the Word Library
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((w) => (
            <WordCard
              key={w.id}
              word={w}
              extra={
                tab === "hidden" && (
                  <button type="button" className="btn-ghost btn-sm" onClick={() => toggleHidden(w.id)}>
                    <Eye className="size-4" /> Unhide
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
