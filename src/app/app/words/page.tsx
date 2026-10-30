"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LESSONS, LESSON_OF_WORD } from "@/content/lessons";
import { WORDS } from "@/content/words";
import { normalize } from "@/lib/answer";
import { isLearned } from "@/lib/srs";
import { useProgress } from "@/lib/store";
import { CardControls } from "@/components/CardControls";
import { PageHeader } from "@/components/ui";
import { WordCard } from "@/components/WordCard";

type Kind = "all" | "word" | "phrase";
type Status = "all" | "learned" | "learning" | "new";

export default function WordsPage() {
  const s = useProgress();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [kind, setKind] = useState<Kind>("all");
  const [status, setStatus] = useState<Status>("all");
  const [limit, setLimit] = useState(20);

  const results = useMemo(() => {
    const key = normalize(q);
    return WORDS.filter((w) => {
      if (topic !== "all" && LESSON_OF_WORD[w.id] !== topic) return false;
      if (kind !== "all" && (w.pos === "phrase") !== (kind === "phrase")) return false;
      const card = s.cards[w.id];
      const st = !card ? "new" : isLearned(card) ? "learned" : "learning";
      if (status !== "all" && st !== status) return false;
      if (!key) return true;
      return [w.en, w.tr, w.fa, ...(w.alt ?? [])].some((t) => normalize(t).includes(key));
    });
  }, [q, topic, kind, status, s.cards]);

  const select = "rounded-xl border border-line bg-card px-3 py-2 text-sm";

  return (
    <div>
      <PageHeader title="Word Library" subtitle={`${WORDS.length} words and phrases`}>
        <CardControls showDirection={false} />
      </PageHeader>
      <div className="mb-5 flex flex-wrap gap-2">
        <label className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className="input !py-2 !pl-9 !text-base"
            placeholder="Search English, Farsi or transliteration"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(20);
            }}
            dir="auto"
            aria-label="Search words"
          />
        </label>
        <select className={select} value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Lesson">
          <option value="all">All lessons</option>
          {LESSONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
        <select className={select} value={kind} onChange={(e) => setKind(e.target.value as Kind)} aria-label="Type">
          <option value="all">Words & phrases</option>
          <option value="word">Words</option>
          <option value="phrase">Phrases</option>
        </select>
        <select className={select} value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Progress">
          <option value="all">Any progress</option>
          <option value="learned">Learned</option>
          <option value="learning">In progress</option>
          <option value="new">Not seen</option>
        </select>
      </div>
      {results.length === 0 ? (
        <p className="card p-8 text-center text-muted">No words match. Try another search.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, limit).map((w) => (
              <WordCard key={w.id} word={w} hideMeaning />
            ))}
          </div>
          {results.length > limit && (
            <div className="mt-5 flex justify-center gap-2">
              <button type="button" className="btn-secondary" onClick={() => setLimit(limit + 20)}>
                Show 20 more
              </button>
              <button type="button" className="btn-ghost" onClick={() => setLimit(results.length)}>
                Show all {results.length}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
