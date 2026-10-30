"use client";
import Link from "next/link";
import { Check, ChevronRight, Lock } from "lucide-react";
import { LESSONS, LEVELS } from "@/content/lessons";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader, ProgressBar } from "@/components/ui";

export default function LessonsPage() {
  const s = useProgress();
  const done = LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length;
  const currentIdx = LESSONS.findIndex((l) => !s.lessons[l.id]?.completedAt);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Lessons" subtitle={`${done} of ${LESSONS.length} lessons complete`} />
      {LEVELS.map((level) => (
        <section key={level.id}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-semibold">
              {level.name} <Fa className="ms-1 font-normal text-muted">{level.nameFa}</Fa>
            </h2>
            <span className="chip bg-firuze-soft text-firuze">{level.cefr}</span>
          </div>
          <ProgressBar value={done / LESSONS.length} className="mb-5" />
          <ol className="relative space-y-3 before:absolute before:inset-y-6 before:left-7 before:w-0.5 before:bg-line">
            {LESSONS.filter((l) => l.level === level.id).map((l, i) => {
              const rec = s.lessons[l.id];
              const isDone = !!rec?.completedAt;
              const isCurrent = i === currentIdx;
              const locked = !isDone && !isCurrent;
              return (
                <li key={l.id} className="relative">
                  <Link
                    href={`/app/lessons/${l.id}/`}
                    className={cx(
                      "card flex items-center gap-4 p-3 pr-4 transition hover:border-firuze",
                      isCurrent && "!border-firuze shadow-[0_0_0_3px_var(--color-firuze-soft)]",
                    )}
                  >
                    <span
                      className={cx(
                        "relative grid size-11 shrink-0 place-items-center rounded-xl text-xl",
                        isDone ? "bg-firuze text-white" : isCurrent ? "bg-saffron-soft" : "bg-paper",
                      )}
                    >
                      {isDone ? <Check className="size-5" /> : l.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {l.order}. {l.title}
                      </span>
                      <span className="block truncate text-sm text-muted">
                        {isDone ? `Best ${rec.best}% · tap to review` : l.description}
                      </span>
                    </span>
                    {isCurrent && <span className="btn-primary !px-3 !py-1.5 text-xs">{rec ? "Continue" : "Start"}</span>}
                    {locked && <Lock className="size-4 text-muted" aria-label="Not started — you can still open it" />}
                    {isDone && <ChevronRight className="size-4 text-muted" />}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <p className="mt-6 text-center text-sm text-muted">Lessons unlock in order, but you can open any of them to skip ahead.</p>
    </div>
  );
}
