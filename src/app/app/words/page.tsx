"use client";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
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

  const select = "min-h-12 min-w-0 flex-1 cursor-pointer rounded-2xl border-2 border-line bg-paper px-3 text-sm font-bold text-ink transition-colors focus:border-sky focus:bg-card sm:flex-none";

  return (
    <div>
      <PageHeader title="Word Library" subtitle={`${WORDS.length} words and phrases`}>
        <CardControls showDirection={false} />
      </PageHeader>
      <div className="mb-6 flex flex-wrap gap-2">
        <label className="relative w-full sm:w-auto sm:min-w-60 sm:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-faint" strokeWidth={2.5} />
          <input
            className="input min-h-12 !py-2.5 !pl-11 !text-base"
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
        <div className="card flex flex-col items-center px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-paper text-faint">
            <SearchX className="size-7" strokeWidth={2.5} />
          </span>
          <p className="mt-3 text-lg font-extrabold">No words match</p>
          <p className="mt-1 font-semibold text-muted">Try another search or loosen the filters.</p>
          <button
            type="button"
            className="btn-secondary btn-sm mt-4"
            onClick={() => {
              setQ("");
              setTopic("all");
              setKind("all");
              setStatus("all");
              setLimit(20);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, limit).map((w) => (
              <WordCard key={w.id} word={w} hideMeaning />
            ))}
          </div>
          {results.length > limit && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
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
