"use client";
import { useEffect, useState } from "react";
import { BookOpen, Check, Loader2, Plus, SpellCheck } from "lucide-react";
import { LESSON_BY_ID, LESSON_OF_WORD } from "@/content/lessons";
import { WORDS } from "@/content/words";
import { lookup, type DictEntry } from "@/lib/dictionary";
import { loadLexicon, suggest, type Suggestion } from "@/lib/spell";
import { addCustomWord, toggleBookmark, useProgress } from "@/lib/store";
import { hasPersianScript } from "@/lib/youglish";
import { AudioButtons, Fa } from "./ui";

/** Course words and the words of their example sentences: first in spelling suggestions. */
function courseVocabulary(): string[] {
  const out: string[] = [];
  for (const w of WORDS) {
    out.push(w.fa);
    for (const t of w.example.fa.replace(/[.،؟!?,:«»()…—-]/g, " ").split(/\s+/)) if (t) out.push(t);
  }
  return out;
}

/**
 * Look-up for anything typed in the word search: the course word if there is
 * one, otherwise the dictionary, plus "Did you mean …?" for misspelled Persian.
 */
export function DictionaryPanel({ query, onPick }: { query: string; onPick: (q: string) => void }) {
  const s = useProgress();
  const [state, setState] = useState<{ q: string; entry: DictEntry | null; suggestions: Suggestion[]; loading: boolean }>({
    q: "",
    entry: null,
    suggestions: [],
    loading: false,
  });

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setState({ q, entry: null, suggestions: [], loading: false });
      return;
    }
    let cancelled = false;
    setState((st) => ({ ...st, loading: true }));
    const t = setTimeout(async () => {
      const entry = await lookup(q);
      let suggestions: Suggestion[] = [];
      if (!entry && hasPersianScript(q) && !q.includes(" ")) {
        const lex = await loadLexicon(courseVocabulary());
        suggestions = suggest(q, lex, 3);
      }
      if (!cancelled) setState({ q, entry, suggestions, loading: false });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  if (query.trim().length < 2) return null;
  const { entry, suggestions, loading } = state;

  return (
    <section className="card mb-6 p-4" aria-label="Dictionary" aria-busy={loading}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="eyebrow text-firuze-ink">Dictionary</h2>
        {loading && <Loader2 className="size-4 animate-spin text-muted" aria-label="Looking up" />}
      </div>

      {!loading && !entry && suggestions.length === 0 && (
        <p className="mt-2 text-sm font-semibold text-muted">
          No entry for <span dir="auto" className="font-bold text-ink">“{query.trim()}”</span>. Try the singular, or the word without endings.
        </p>
      )}

      {suggestions.length > 0 && !entry && (
        <div className="mt-2">
          <p className="flex items-center gap-1.5 text-sm font-bold text-saffron-ink">
            <SpellCheck className="size-4" /> Did you mean…
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((sg) => (
              <button key={sg.word} type="button" className="btn-secondary btn-sm" onClick={() => onPick(sg.word)}>
                <Fa className="text-base">{sg.word}</Fa>
              </button>
            ))}
          </div>
        </div>
      )}

      {entry && <EntryView entry={entry} inCards={(id) => s.bookmarks.includes(id)} />}
    </section>
  );
}

function EntryView({ entry, inCards }: { entry: DictEntry; inCards: (id: string) => boolean }) {
  const s = useProgress();
  const course = entry.course;
  const lesson = course ? LESSON_BY_ID[LESSON_OF_WORD[course.id]] : undefined;
  const persianQuery = hasPersianScript(entry.fa[0] ?? "") && entry.fa.length === 1 && !course;

  return (
    <div className="mt-2 space-y-3">
      <p className="text-lg font-extrabold">{entry.en}</p>

      {course && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-firuze-soft p-3">
          <Fa className="text-2xl font-bold">{course.fa}</Fa>
          {!s.settings.scriptOnly && <span className="font-bold text-firuze-ink">{course.tr}</span>}
          <AudioButtons text={course.fa} compact />
          <span className="ms-auto flex items-center gap-1.5 text-sm font-bold text-firuze-ink">
            <BookOpen className="size-4" /> In the course{lesson ? `: ${lesson.title}` : ""}
          </span>
          <button type="button" className="btn-ghost btn-sm" onClick={() => toggleBookmark(course.id)} aria-pressed={inCards(course.id)}>
            {inCards(course.id) ? <Check className="size-4" /> : <Plus className="size-4" />} {inCards(course.id) ? "In my cards" : "Add to my cards"}
          </button>
        </div>
      )}

      {!course && (
        <ul className="space-y-2">
          {entry.fa.slice(0, 5).map((m) => {
            const id = `custom:${m.replace(/\s+/g, "-")}`;
            const added = inCards(id);
            const english = persianQuery ? entry.en.split(",")[0].trim() : entry.en;
            return (
              <li key={m} className="flex flex-wrap items-center gap-2 rounded-2xl bg-paper p-3">
                <Fa className="text-xl font-bold">{m}</Fa>
                <AudioButtons text={m} compact />
                <button
                  type="button"
                  className="btn-ghost btn-sm ms-auto"
                  disabled={added}
                  onClick={() => addCustomWord({ fa: m, en: english, example: entry.examples[0] })}
                >
                  {added ? <Check className="size-4" /> : <Plus className="size-4" />} {added ? "In my cards" : "Add to my cards"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {entry.examples.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-bold text-muted">In a sentence</p>
          {entry.examples.slice(0, 2).map(([en, fa]) => (
            <div key={en} className="rounded-2xl border-2 border-line p-3">
              <div className="flex items-start justify-between gap-2">
                <Fa className="block text-lg leading-relaxed">{fa}</Fa>
                <AudioButtons text={fa} compact />
              </div>
              <p className="text-sm font-semibold text-muted">{en}</p>
            </div>
          ))}
        </div>
      )}

      {!course && (
        <p className="text-xs font-semibold text-muted">
          From an open English–Persian dictionary. Words outside the course have no transliteration yet; meanings can be formal or old-fashioned.
        </p>
      )}
    </div>
  );
}
