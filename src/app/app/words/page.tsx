"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, CalendarCheck, Layers, Mic, MonitorPlay, Search, SearchX } from "lucide-react";
import { LESSONS, LESSON_OF_WORD } from "@/content/lessons";
import { WORDS } from "@/content/words";
import { normalize } from "@/lib/answer";
import { isLearned } from "@/lib/srs";
import { useHydrated, useProgress } from "@/lib/store";
import { buildDeck, NEW_PER_DAY, type Deck } from "@/lib/flashcards";
import { FlashcardSession } from "@/components/FlashcardSession";
import { CardControls } from "@/components/CardControls";
import { Fa, PageHeader, Segmented } from "@/components/ui";
import { WordCard } from "@/components/WordCard";
import { YouglishPlayer } from "@/components/YouglishPlayer";
import { hasPersianScript } from "@/lib/youglish";

type Kind = "all" | "word" | "phrase";
type Status = "all" | "learned" | "learning" | "new";

type Tab = "cards" | "browse";

export default function WordsPage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("cards");
  const [session, setSession] = useState<{ deck: Deck; title: string; key: number } | null>(null);

  // Remember the last tab (per-viewer convenience).
  useEffect(() => {
    try {
      const t = localStorage.getItem("farsipen:words-tab");
      if (t === "browse" || t === "cards") setTab(t);
    } catch {}
  }, []);
  const changeTab = (t: Tab) => {
    setTab(t);
    try {
      localStorage.setItem("farsipen:words-tab", t);
    } catch {}
  };

  if (!hydrated) return null;
  if (session) return <FlashcardSession key={session.key} deck={session.deck} title={session.title} onExit={() => setSession(null)} />;

  return (
    <div>
      <PageHeader title="Words" subtitle={`${WORDS.length} words and phrases`}>
        <Segmented
          label="View"
          value={tab}
          onChange={changeTab}
          options={[
            { value: "cards", label: "Flashcards" },
            { value: "browse", label: "Browse" },
          ]}
        />
      </PageHeader>
      {tab === "cards" ? <DeckPicker onStart={(deck, title) => setSession({ deck, title, key: Date.now() })} /> : <Browse />}
    </div>
  );
}

function DeckPicker({ onStart }: { onStart: (deck: Deck, title: string) => void }) {
  const s = useProgress();
  const [lesson, setLesson] = useState(LESSONS[0].id);
  const today = buildDeck("today", s);
  const mine = buildDeck("mine", s);
  const byLesson = buildDeck("lesson", s, lesson);
  const due = today.ids.filter((id) => s.cards[id]).length;
  const fresh = today.ids.length - due;
  const select = "min-h-12 w-full cursor-pointer rounded-2xl border-2 border-field-edge bg-paper px-3 text-sm font-bold text-ink transition-colors focus:border-sky focus:bg-card";

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-muted">See the word, guess the meaning, flip — then rate yourself.</p>
        <CardControls />
      </div>

      <section className="card p-5">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-firuze-soft text-firuze-ink">
            <CalendarCheck className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold">Today</h2>
            <p className="text-sm font-semibold text-muted">
              {today.ids.length === 0
                ? "All caught up. Nothing is due — come back tomorrow, or pick a deck below."
                : `${due} to review${fresh ? ` · ${fresh} new word${fresh === 1 ? "" : "s"} (max ${NEW_PER_DAY} a day)` : ""}`}
            </p>
          </div>
        </div>
        <button type="button" className="btn-primary btn-lg mt-4 w-full" disabled={today.ids.length === 0} onClick={() => onStart(today, "Today")} autoFocus>
          {today.ids.length ? `Start · ${today.ids.length} cards` : "Done for today"}
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card flex flex-col p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-saffron-soft text-saffron-ink">
              <Bookmark className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold">My cards</h2>
              <p className="text-sm font-semibold text-muted">
                {mine.ids.length ? `${mine.ids.length} word${mine.ids.length === 1 ? "" : "s"} you added` : "Tap “Add to my cards” on any word to build your own deck."}
              </p>
            </div>
          </div>
          <button type="button" className="btn-secondary mt-4 w-full" disabled={!mine.ids.length} onClick={() => onStart(mine, "My cards")}>
            Study my cards
          </button>
        </section>

        <section className="card flex flex-col p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-soft text-sky-ink">
              <Layers className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold">By lesson</h2>
              <select className={`${select} mt-2`} value={lesson} onChange={(e) => setLesson(e.target.value)} aria-label="Lesson">
                {LESSONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.wordIds.length})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary mt-4 w-full"
            disabled={!byLesson.ids.length}
            onClick={() => onStart(byLesson, LESSONS.find((l) => l.id === lesson)?.title ?? "Lesson")}
          >
            Study this lesson
          </button>
        </section>
      </div>

      <Link href="/app/speak/" className="tile flex items-center gap-3 p-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-anar-soft text-anar-ink">
          <Mic className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold">Speaking practice</span>
          <span className="block text-sm font-semibold text-muted">Hear each word, say it, and get a match score.</span>
        </span>
      </Link>
    </div>
  );
}

function Browse() {
  const s = useProgress();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [kind, setKind] = useState<Kind>("all");
  const [status, setStatus] = useState<Status>("all");
  const [limit, setLimit] = useState(20);
  const [videoQuery, setVideoQuery] = useState<string | null>(null);

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

  // Real-world pronunciation: a Persian query as typed, otherwise the best match's Farsi.
  const spoken = hasPersianScript(q) ? q.trim() : q.trim() && results.length > 0 ? results[0].fa : "";

  const select = "min-h-12 min-w-0 flex-1 cursor-pointer rounded-2xl border-2 border-field-edge bg-paper px-3 text-sm font-bold text-ink transition-colors focus:border-sky focus:bg-card sm:flex-none";

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CardControls showDirection={false} />
      </div>
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
              setVideoQuery(null);
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
      <Link href={topic !== "all" ? `/app/speak/?lesson=${topic}` : "/app/speak/"} className="tile mb-6 flex items-center gap-3 p-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-anar-soft text-anar-ink">
          <Mic className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold">Practise saying {topic !== "all" ? "these words" : "your words"}</span>
          <span className="block text-sm font-semibold text-muted">Hear each word, say it, and get a match score. Or tap the mic on any card.</span>
        </span>
      </Link>
      {spoken && (
        <section className="card mb-6 p-4" aria-label="Hear it in real videos">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow text-sky-ink">Hear it in real videos</p>
              <p className="mt-1 font-semibold text-muted">
                Native speakers saying <Fa className="text-lg font-bold text-ink">{spoken}</Fa> on YouTube
              </p>
            </div>
            {videoQuery !== spoken && (
              <button type="button" className="btn-sky btn-sm" onClick={() => setVideoQuery(spoken)}>
                <MonitorPlay className="size-4" /> Play clips
              </button>
            )}
          </div>
          {videoQuery === spoken && (
            <div className="mt-4">
              <YouglishPlayer query={spoken} />
            </div>
          )}
        </section>
      )}
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
