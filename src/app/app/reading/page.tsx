"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { READINGS } from "@/content/readings";
import { useHydrated, useProgress } from "@/lib/store";
import { Fa, PageHeader } from "@/components/ui";

export default function ReadingListPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const rec = s.readings ?? {};
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Reading"
        subtitle="For when you can get by and want more. Each lesson starts with a question, teaches through a real topic about Iran, and ends with you answering it in Persian."
      />
      <ol className="space-y-3">
        {READINGS.map((r) => {
          const done = rec[r.id];
          return (
            <li key={r.id}>
              <Link href={`/app/reading/${r.id}/`} className="tile flex items-start gap-4 p-4 sm:p-5">
                <span className="w-8 shrink-0 pt-0.5 text-center text-2xl font-extrabold text-muted">{r.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold leading-snug">{r.question.en}</span>
                  <span className="mt-1 block">
                    <Fa className="font-bold text-muted">{r.question.fa}</Fa>
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-muted">
                    <span>{r.topic}</span>
                    <span>{r.level}</span>
                    {done && (
                      <span className="flex items-center gap-1 text-pista-ink">
                        <Check className="size-4" /> Done · {done.best}% understood
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="text-sm font-semibold text-muted">More lessons are on the way. The texts are written for Farsi Pen and are still being checked by native speakers.</p>
    </div>
  );
}
