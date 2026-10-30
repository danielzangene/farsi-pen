"use client";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { GRAMMAR } from "@/content/grammar";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader } from "@/components/ui";

export default function GrammarPage() {
  const s = useProgress();
  const passed = GRAMMAR.filter((g) => s.grammar[g.id]?.passed).length;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Grammar" subtitle={`${passed}/${GRAMMAR.length} concepts learned · short explanations, then exercises`} />
      <ol className="space-y-3">
        {GRAMMAR.map((g) => {
          const rec = s.grammar[g.id];
          return (
            <li key={g.id}>
              <Link href={`/app/grammar/${g.id}/`} className="card flex items-center gap-4 p-4 transition hover:border-firuze">
                <span className={cx("grid size-11 shrink-0 place-items-center rounded-xl font-bold", rec?.passed ? "bg-firuze text-white" : "bg-paper text-muted")}>
                  {rec?.passed ? <Check className="size-5" /> : `G${g.order}`}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {g.title} <Fa className="ms-1 text-sm font-normal text-muted">{g.titleFa}</Fa>
                  </span>
                  <span className="block text-sm text-muted">{rec ? `Best ${rec.best}% · ${g.exercises.length} exercises` : g.summary}</span>
                </span>
                <ChevronRight className="size-4 text-muted" />
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-center text-sm text-muted">More concepts (plurals, ezafe, past tense…) are on the way.</p>
    </div>
  );
}
