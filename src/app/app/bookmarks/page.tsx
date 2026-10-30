"use client";
import { useState } from "react";
import Link from "next/link";
import { Bookmark, Eye } from "lucide-react";
import { WORD_BY_ID } from "@/content/words";
import { completePractice, toggleHidden, useHydrated, useProgress, type SessionSummary } from "@/lib/store";
import { cx, shuffle } from "@/lib/util";
import { CardControls } from "@/components/CardControls";
import { RecallRound } from "@/components/RecallRound";
import { PageHeader, Segmented } from "@/components/ui";
import { WordCard } from "@/components/WordCard";

export default function BookmarksPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [tab, setTab] = useState<"bookmarks" | "hidden">("bookmarks");
  const [practising, setPractising] = useState<string[] | null>(null);
  const [result, setResult] = useState<{ r: SessionSummary; xp: number } | null>(null);

  const ids = tab === "bookmarks" ? s.bookmarks : s.hidden;
  const words = ids.map((id) => WORD_BY_ID[id]).filter(Boolean);

  if (practising) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Bookmark practice">
          <CardControls />
        </PageHeader>
        {result ? (
          <div className="card p-8 text-center">
            <h2 className="font-display text-2xl font-semibold">Done!</h2>
            <p className="mt-1 text-muted">
              {result.r.correct}/{result.r.total} right first time · +{result.xp} XP
            </p>
            <button type="button" className="btn-primary mt-5" onClick={() => setPractising(null)}>
              Back to bookmarks
            </button>
          </div>
        ) : (
          <RecallRound
            words={practising.map((id) => WORD_BY_ID[id])}
            label="Bookmarks"
            onDone={(r) => setResult({ r, xp: completePractice(r) })}
          />
        )}
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
        <button
          type="button"
          className="btn-primary mb-5"
          onClick={() => {
            setResult(null);
            setPractising(shuffle(s.bookmarks).slice(0, 15));
          }}
        >
          Practise bookmarks
        </button>
      )}

      {!hydrated ? null : words.length === 0 ? (
        <div className="card p-8 text-center">
          <Bookmark className="mx-auto size-10 text-saffron" />
          <h2 className="mt-3 text-lg font-semibold">{tab === "bookmarks" ? "No bookmarks yet" : "No hidden words"}</h2>
          <p className="mx-auto mt-1 max-w-sm text-muted">
            {tab === "bookmarks"
              ? "Tap the bookmark icon on any word — in lessons, practice or the Word Library — to collect it here."
              : "Words you hide during practice appear here. They won't come up in Daily Practice."}
          </p>
          {tab === "bookmarks" && (
            <Link href="/app/words/" className="btn-secondary mt-5">
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
                  <button type="button" className={cx("btn-ghost !py-1 text-xs")} onClick={() => toggleHidden(w.id)}>
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
