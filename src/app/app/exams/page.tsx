"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SAMFA_FACTS } from "@/content/samfa";
import { useHydrated, useProgress } from "@/lib/store";
import { Fa, PageHeader, ProgressBar } from "@/components/ui";

const LEVEL_NAME = { A0: "Beginner", A1: "A1 · Basic", A2: "A2 · Elementary", B1: "B1 · Intermediate", B2: "B2 · Upper intermediate" } as const;

export default function ExamsPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const mocks = s.samfa?.mocks ?? [];
  const last = mocks[mocks.length - 1];
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Exams" subtitle="Find your level, and get ready for the SAMFA Persian proficiency test." />

      <section className="card p-5 sm:p-6" aria-labelledby="placement-heading">
        <p className="text-sm font-semibold text-firuze-ink">Placement test · 3–6 minutes</p>
        <h2 id="placement-heading" className="mt-1 text-2xl font-extrabold">
          Find your level
        </h2>
        <p className="mt-1 text-muted">Words, grammar and listening from A1 up to B2. Your Path and Today plan then start where you are.</p>
        {s.placement && (
          <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm">
            Last result: <strong className="font-bold">{LEVEL_NAME[s.placement.level]}</strong> · {s.placement.correct}/{s.placement.total} right
          </p>
        )}
        <Link href="/app/placement/" className="btn-primary btn-lg mt-5 w-full">
          {s.placement ? "Take it again" : "Start the test"}
        </Link>
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="samfa-heading">
        <p className="text-sm font-semibold text-plum-ink">
          {SAMFA_FACTS.full} · <Fa>{SAMFA_FACTS.fa}</Fa>
        </p>
        <h2 id="samfa-heading" className="mt-1 text-2xl font-extrabold">
          SAMFA
        </h2>
        <p className="mt-1 text-muted">Listening, reading, writing and speaking, 60 points each. Practise one part or take a short mock scored out of 240.</p>
        {last ? (
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Last mini mock</span>
              <span className="font-bold">{last.total}/240</span>
            </div>
            <ProgressBar value={last.total / 240} tone="plum" size="sm" className="mt-1.5" />
          </div>
        ) : null}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link href="/app/samfa/" className="btn-plum btn-lg">
            Open SAMFA
          </Link>
        </div>
      </section>

      <ul className="card divide-y divide-line overflow-hidden !p-0">
        {[
          { href: "/app/grammar/", title: "Grammar, A1 to B2", text: "Every concept the exams expect" },
          { href: "/app/reading/", title: "Reading lessons", text: "Written Persian with news vocabulary" },
          { href: "/app/practice/", title: "Daily practice", text: "Type words from memory" },
        ].map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="flex min-h-[3.75rem] items-center gap-3 px-4 py-2.5 hover:bg-paper active:bg-paper">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{x.title}</span>
                <span className="block text-sm text-muted">{x.text}</span>
              </span>
              <ChevronRight className="size-4 text-faint" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
