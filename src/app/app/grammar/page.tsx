"use client";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { GRAMMAR } from "@/content/grammar";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader, ProgressBar } from "@/components/ui";

export default function GrammarPage() {
  const s = useProgress();
  const passed = GRAMMAR.filter((g) => s.grammar[g.id]?.passed).length;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Grammar" subtitle="Short explanations, then exercises." />
      <div className="mb-6 flex items-center gap-3">
        <span className="eyebrow whitespace-nowrap text-plum-ink">
          {passed}/{GRAMMAR.length} concepts learned
        </span>
        <ProgressBar value={passed / GRAMMAR.length} tone="plum" className="flex-1" />
      </div>
      <ol className="space-y-3">
        {GRAMMAR.map((g) => {
          const rec = s.grammar[g.id];
          return (
            <li key={g.id}>
              <Link href={`/app/grammar/${g.id}/`} className="tile flex items-center gap-4 p-4">
                <span
                  className={cx(
                    "grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-on-accent",
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
      <p className="mt-6 text-center text-sm font-semibold text-muted">More concepts (plurals, ezafe, past tense…) are on the way.</p>
    </div>
  );
}
