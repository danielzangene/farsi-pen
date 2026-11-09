"use client";
import { useEffect, useState } from "react";
import { BookOpenText, Check, Languages, Loader2, Plus, X } from "lucide-react";
import { GANJOOR_DATA, POETS, type Couplet } from "@/content/poems";
import { lookupPersian, type DictEntry } from "@/lib/dictionary";
import { cleanFa } from "@/lib/spell";
import { addCustomWord, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { AudioButtons, Fa } from "./ui";

/** A couplet or quatrain: Persian with vowel marks, transliteration, meaning, key words. */
export function PoemCard({ poem, showOmen, className }: { poem: Couplet; showOmen?: boolean; className?: string }) {
  const { settings } = useProgress();
  const [full, setFull] = useState(false);
  const poet = POETS[poem.poet];
  return (
    <article className={cx("card p-5 sm:p-6", className)}>
      <p className="text-sm font-bold text-muted">
        {poet.name} <Fa className="font-bold">{poet.fa}</Fa>
      </p>
      <div className="mt-4 space-y-3 text-center">
        {poem.lines.map((line, i) => (
          <div key={i}>
            <div className="flex flex-wrap items-center justify-center gap-x-1">
              <Fa className="text-xl font-bold leading-loose sm:text-3xl">{line}</Fa>
              <AudioButtons text={line} compact />
            </div>
            {!settings.scriptOnly && <p className="text-sm font-semibold text-muted">{poem.tr[i]}</p>}
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl bg-paper p-4 font-semibold">{poem.en}</p>
      {showOmen && poem.omen && (
        <p className="mt-3 rounded-2xl bg-saffron-soft p-4 font-bold text-saffron-ink">
          <span className="block text-sm font-extrabold">What Hafez tells you</span>
          {poem.omen}
        </p>
      )}
      <div className="mt-4">
        <p className="text-sm font-bold text-muted">Words to know</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {poem.words.map((w) => (
            <li key={w.fa} className="flex items-center gap-1 rounded-xl border border-line py-1 pe-1 ps-3">
              <Fa className="font-bold">{w.fa}</Fa>
              <span className="text-sm font-semibold text-muted">
                {w.tr} · {w.en}
              </span>
              <AudioButtons text={w.fa} compact />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-secondary btn-sm" onClick={() => setFull(!full)} aria-expanded={full}>
          <BookOpenText className="size-4" /> {full ? "Hide the full poem" : "Read the full poem"}
        </button>
      </div>
      {full && <FullPoem path={poem.path} />}
    </article>
  );
}

interface GanjoorVerse {
  Text: string;
  Position: string;
  CoupletIndex: number;
  CoupletSummary?: string;
}

/** The whole poem from Ganjoor's open data; tap any word to look it up. */
export function FullPoem({ path }: { path: string }) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; verses: GanjoorVerse[]; summary?: string }>({ status: "loading", verses: [] });
  const [explain, setExplain] = useState(false);
  const [word, setWord] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${GANJOOR_DATA}/poets${path}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { Verses: GanjoorVerse[]; PoemSummary?: string }) => !cancelled && setState({ status: "ready", verses: d.Verses ?? [], summary: d.PoemSummary }))
      .catch(() => !cancelled && setState({ status: "error", verses: [] }));
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (state.status === "loading")
    return (
      <p role="status" className="mt-4 flex items-center gap-2 font-bold text-muted">
        <Loader2 className="size-5 animate-spin" /> Opening the poem…
      </p>
    );
  if (state.status === "error")
    return (
      <p className="mt-4 rounded-2xl bg-paper p-4 text-sm font-semibold text-muted">Couldn&apos;t load the poem. Check your connection and try again.</p>
    );

  const couplets = new Map<number, GanjoorVerse[]>();
  for (const v of state.verses) couplets.set(v.CoupletIndex, [...(couplets.get(v.CoupletIndex) ?? []), v]);

  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-muted">Tap any word to look it up.</p>
        <button type="button" className="btn-ghost btn-sm" onClick={() => setExplain(!explain)} aria-pressed={explain}>
          <Languages className="size-4" /> {explain ? "Hide modern Persian" : "Explain in modern Persian"}
        </button>
      </div>
      {word && <WordLookup word={word} onClose={() => setWord(null)} />}
      <ol className="space-y-5">
        {[...couplets.entries()].map(([i, vs]) => {
          const summary = vs.find((v) => v.CoupletSummary)?.CoupletSummary;
          const ai = summary?.startsWith("هوش مصنوعی");
          return (
            <li key={i} className="text-center">
              {vs.map((v, j) => (
                <p key={j} lang="fa" dir="rtl" className="text-xl leading-loose">
                  {v.Text.split(/\s+/).map((t, k) => (
                    <button key={k} type="button" className="rounded-md px-0.5 hover:bg-sky-soft focus-visible:bg-sky-soft" onClick={() => setWord(t)}>
                      {t}
                    </button>
                  ))}
                </p>
              ))}
              {explain && summary && (
                <p lang="fa" dir="rtl" className="mt-1 rounded-xl bg-paper p-3 text-start text-base leading-relaxed text-muted">
                  {summary.replace(/^هوش مصنوعی:\s*/, "")}
                  {ai && (
                    <span lang="en" dir="ltr" className="ms-2 inline-block text-xs font-bold">
                      (AI-written on Ganjoor)
                    </span>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-xs font-semibold text-muted">
        Text and explanations: Ganjoor (ganjoor.net).
      </p>
    </div>
  );
}

function WordLookup({ word, onClose }: { word: string; onClose: () => void }) {
  const s = useProgress();
  const [entry, setEntry] = useState<DictEntry | null | undefined>(undefined);
  const plain = cleanFa(word).replace(/[.،؛:!?؟«»"]/g, "");
  useEffect(() => {
    let c = false;
    setEntry(undefined);
    lookupPersian(plain).then((e) => !c && setEntry(e));
    return () => {
      c = true;
    };
  }, [plain]);
  const id = `custom:${plain}`;
  const added = s.bookmarks.includes(id) || (entry?.course && s.bookmarks.includes(entry.course.id));
  return (
    <div role="status" className="sticky top-16 z-10 mb-4 flex items-start gap-3 rounded-2xl border border-sky bg-sky-soft p-3 text-sky-ink shadow-lg">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Fa className="text-xl font-bold">{word}</Fa>
          <AudioButtons text={plain} compact />
        </div>
        <p className="font-semibold">
          {entry === undefined ? "Looking up…" : entry ? entry.en : "Not in the dictionary — poetic and old words often aren't."}
          {entry?.course && !s.settings.scriptOnly && <span className="ms-2 text-sm">({entry.course.tr})</span>}
        </p>
        {entry && !entry.course && (
          <button type="button" className="btn-ghost btn-sm -ms-2 mt-1" disabled={!!added} onClick={() => addCustomWord({ fa: entry.fa[0], en: entry.en.split(",")[0].trim() })}>
            {added ? <Check className="size-4" /> : <Plus className="size-4" />} {added ? "In my cards" : "Add to my cards"}
          </button>
        )}
      </div>
      <button type="button" className="btn-ghost btn-icon -me-2 -mt-1" onClick={onClose} aria-label="Close">
        <X className="size-5" />
      </button>
    </div>
  );
}
