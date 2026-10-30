"use client";
import Link from "next/link";
import { Check, Library, Lock } from "lucide-react";
import { LESSONS, LEVELS } from "@/content/lessons";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Bubble, Fa, PageHeader } from "@/components/ui";

/** Horizontal offsets (px) that give the path its gentle zig-zag. */
const ZIGZAG = [0, 44, 66, 44, 0, -44, -66, -44];

const NODE = {
  done: "bg-saffron text-white shadow-[0_6px_0_var(--color-saffron-shadow)]",
  current: "bg-firuze text-white shadow-[0_6px_0_var(--color-firuze-shadow)]",
  locked: "bg-line text-faint shadow-[0_6px_0_var(--color-line-strong)]",
};

export default function LessonsPage() {
  const s = useProgress();
  const done = LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length;
  const currentIdx = LESSONS.findIndex((l) => !s.lessons[l.id]?.completedAt);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Lessons" subtitle={`${done} of ${LESSONS.length} lessons complete`} />
      {LEVELS.map((level) => (
        <section key={level.id} aria-labelledby={`unit-${level.id}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-firuze p-5 text-white sm:p-6">
            <div className="min-w-0">
              <p className="eyebrow inline-block rounded-full bg-firuze-shadow px-2.5 py-1 text-white">
                Unit {level.id} · {level.cefr}
              </p>
              <h2 id={`unit-${level.id}`} className="mt-2 flex flex-wrap items-baseline gap-x-2 text-2xl font-extrabold">
                {level.name}
                <Fa className="text-xl font-bold">{level.nameFa}</Fa>
              </h2>
              <p className="mt-1 text-[15px] font-bold">{level.description}</p>
            </div>
            <Link href="/app/words/" className="btn-secondary btn-sm shrink-0">
              <Library className="size-4" strokeWidth={2.5} /> Word list
            </Link>
          </div>

          <ol className="mt-12 flex flex-col items-center gap-10 pb-4">
            {LESSONS.filter((l) => l.level === level.id).map((l, i) => {
              const rec = s.lessons[l.id];
              const isDone = !!rec?.completedAt;
              const isCurrent = i === currentIdx;
              const state = isDone ? "done" : isCurrent ? "current" : "locked";
              const status = isDone ? `Best ${rec.best}%` : isCurrent ? (rec ? "In progress" : "Up next") : "Not started";
              const label = isDone
                ? `${l.order}. ${l.title}: done, best ${rec.best}%. Tap to review`
                : isCurrent
                  ? `${l.order}. ${l.title}: ${rec ? "continue" : "start"} lesson`
                  : `${l.order}. ${l.title}: not started — you can still open it`;
              return (
                <li key={l.id} className={cx(isCurrent && "pt-10")} style={{ transform: `translateX(${ZIGZAG[i % ZIGZAG.length]}px)` }}>
                  <Link href={`/app/lessons/${l.id}/`} aria-label={label} className="group flex w-40 flex-col items-center rounded-2xl text-center">
                    <span className="relative">
                      {isCurrent && (
                        <>
                          <Bubble className="absolute bottom-full left-1/2 mb-5 animate-bob whitespace-nowrap">{rec ? "Continue" : "Start"}</Bubble>
                          <span className="absolute -inset-x-2.5 -top-[7px] -bottom-[13px] rounded-full border-[6px] border-firuze-soft" aria-hidden />
                        </>
                      )}
                      <span
                        className={cx(
                          "relative grid size-[72px] place-items-center rounded-full transition-[transform,box-shadow,filter] duration-100",
                          "group-hover:brightness-105 group-active:translate-y-1.5 group-active:shadow-none",
                          NODE[state],
                        )}
                        aria-hidden
                      >
                        {isDone ? (
                          <Check className="size-9" strokeWidth={4} />
                        ) : isCurrent ? (
                          <span className="text-3xl">{l.emoji}</span>
                        ) : (
                          <Lock className="size-7" strokeWidth={3} />
                        )}
                      </span>
                    </span>
                    <span className={cx("mt-4 block font-extrabold leading-tight", state === "locked" ? "text-muted" : "text-ink")}>{l.title}</span>
                    <span className={cx("mt-0.5 block text-xs font-bold", isDone ? "text-saffron-ink" : isCurrent ? "text-firuze-ink" : "text-muted")}>{status}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <p className="mt-6 text-center text-sm font-semibold text-muted">Lessons unlock in order, but you can open any of them to skip ahead.</p>
    </div>
  );
}
