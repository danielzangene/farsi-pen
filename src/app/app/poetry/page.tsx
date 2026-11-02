"use client";
import { useState } from "react";
import { BookHeart, Sparkles } from "lucide-react";
import { FAL, MORE, POETS, poemOfTheDay } from "@/content/poems";
import { useHydrated } from "@/lib/store";
import { PoemCard } from "@/components/Poetry";
import { Fa, PageHeader, Segmented } from "@/components/ui";

type Tab = "fal" | "poems";

export default function PoetryPage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("fal");
  if (!hydrated) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Poetry" subtitle="Hafez, Saadi and Khayyam — the lines every Iranian knows, with help to read them.">
        <Segmented
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { value: "fal", label: "Fâl-e Hâfez" },
            { value: "poems", label: "Poems" },
          ]}
        />
      </PageHeader>
      {tab === "fal" ? <Fal /> : <Poems />}
    </div>
  );
}

function Fal() {
  const [pick, setPick] = useState<number | null>(null);
  const [opening, setOpening] = useState(false);

  const open = () => {
    setOpening(true);
    setTimeout(() => {
      setPick((prev) => {
        let n = Math.floor(Math.random() * FAL.length);
        if (prev !== null && FAL.length > 1 && n === prev) n = (n + 1) % FAL.length;
        return n;
      });
      setOpening(false);
    }, 900);
  };

  if (pick !== null && !opening)
    return (
      <div className="space-y-4">
        <PoemCard poem={FAL[pick]} showOmen className="animate-pop" />
        <p className="text-center text-sm font-semibold text-muted">Tradition says: one question, one fâl. But no one is watching.</p>
        <div className="flex justify-center">
          <button type="button" className="btn-secondary" onClick={open}>
            Ask another question
          </button>
        </div>
      </div>
    );

  return (
    <section className="card p-6 text-center sm:p-8">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-saffron-soft text-saffron-ink">
        <BookHeart className={opening ? "size-10 animate-bob" : "size-10"} />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold">
        Fâl-e Hâfez <Fa className="ms-1 text-xl font-bold text-muted">فال حافظ</Fa>
      </h2>
      <p className="mx-auto mt-2 max-w-md font-semibold text-muted">
        On Yalda night and at Nowruz, Iranian families open {POETS.hafez.name}&apos;s Divan at a random page for an answer. Close your eyes, think of a
        question, then open the book.
      </p>
      <button type="button" className="btn-primary btn-lg mt-6 w-full sm:w-auto" onClick={open} disabled={opening} autoFocus>
        <Sparkles className="size-5" /> {opening ? "Opening the Divan…" : "Open the Divan"}
      </button>
    </section>
  );
}

function Poems() {
  const today = poemOfTheDay();
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-lg font-extrabold">Poem of the day</h2>
        <PoemCard poem={today} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-extrabold">More to read</h2>
        <div className="space-y-4">
          {[...MORE, ...FAL].filter((p) => p.id !== today.id).map((p) => (
            <PoemCard key={p.id} poem={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
