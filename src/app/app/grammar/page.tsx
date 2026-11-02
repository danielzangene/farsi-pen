"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { GRAMMAR, GRAMMAR_LEVELS, GRAMMAR_UNITS, type GrammarLevel } from "@/content/grammar";
import { useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader, ProgressBar, Segmented } from "@/components/ui";

export default function GrammarPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const isPassed = (id: string) => !!s.grammar[id]?.passed;
  const passed = GRAMMAR.filter((g) => isPassed(g.id)).length;
  const [level, setLevel] = useState<GrammarLevel>("A1");

  // Open on the first level that still has concepts to learn.
  useEffect(() => {
    if (!hydrated) return;
    const next = GRAMMAR.find((g) => !s.grammar[g.id]?.passed);
    if (next) setLevel(next.level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const info = GRAMMAR_LEVELS.find((l) => l.id === level)!;
  const inLevel = GRAMMAR.filter((g) => g.level === level);
  const levelPassed = inLevel.filter((g) => isPassed(g.id)).length;
  const units = GRAMMAR_UNITS.filter((u) => u.level === level);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Grammar" subtitle={`${GRAMMAR.length} concepts from first sentences to upper-intermediate.`} />
      <div className="mb-6 flex items-center gap-3">
        <span className="eyebrow whitespace-nowrap text-plum-ink">
          {passed}/{GRAMMAR.length} learned
        </span>
        <ProgressBar value={passed / GRAMMAR.length} tone="plum" className="flex-1" />
      </div>

      <div className="mb-6 overflow-x-auto">
        <Segmented<GrammarLevel>
          label="Level"
          value={level}
          onChange={setLevel}
          options={GRAMMAR_LEVELS.map((l) => ({ value: l.id, label: l.id }))}
        />
      </div>

      <section className="mb-6 rounded-2xl bg-plum p-5 text-on-accent">
        <p className="eyebrow opacity-70">Level {info.id}</p>
        <h2 className="mt-1 text-2xl font-extrabold">
          {info.name} <Fa className="ms-1 text-lg font-bold opacity-80">{info.nameFa}</Fa>
        </h2>
        <p className="mt-1 font-semibold opacity-90">
          {levelPassed}/{inLevel.length} concepts learned
        </p>
      </section>

      <div className="space-y-8">
        {units.map((u) => (
          <section key={u.title}>
            <h3 className="eyebrow mb-3 text-muted">{u.title}</h3>
            <ol className="space-y-3">
              {u.concepts.map((c) => {
                const g = GRAMMAR.find((x) => x.id === c.id)!;
                const rec = s.grammar[g.id];
                return (
                  <li key={g.id}>
                    <Link href={`/app/grammar/${g.id}/`} className="tile flex items-center gap-4 p-4">
                      <span
                        className={cx(
                          "grid size-12 shrink-0 place-items-center rounded-2xl text-base font-extrabold text-on-accent",
                          rec?.passed ? "bg-pista shadow-[0_4px_0_var(--color-pista-shadow)]" : "bg-plum shadow-[0_4px_0_var(--color-plum-shadow)]",
                        )}
                        aria-label={rec?.passed ? "Learned" : undefined}
                      >
                        {rec?.passed ? <Check className="size-6" strokeWidth={3.5} /> : `G${g.order}`}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-extrabold">
                          {g.title} <Fa className="ms-1 text-sm font-semibold text-muted">{g.titleFa}</Fa>
                        </span>
                        <span className="block text-sm font-semibold text-muted">{rec ? `Best ${rec.best}% · ${g.exercises.length} exercises` : g.summary}</span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-faint" strokeWidth={3} />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
      <p className="mt-8 text-center text-sm font-semibold text-muted">All explanations are drafts awaiting review by a native-speaker teacher.</p>
    </div>
  );
}
