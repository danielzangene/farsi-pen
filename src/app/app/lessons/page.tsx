"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Library, Lock } from "lucide-react";
import { LESSONS, LEVELS } from "@/content/lessons";
import { useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Bubble, Fa, PageHeader } from "@/components/ui";

/** Horizontal offsets (px) that give the path its gentle zig-zag. */
const ZIGZAG = [0, 44, 66, 44, 0, -44, -66, -44];

const NODE = {
  done: "bg-saffron text-on-accent",
  current: "bg-firuze text-on-accent",
  locked: "bg-line text-faint",
};

export default function LessonsPage() {
  const s = useProgress();
  const done = LESSONS.filter((l) => s.lessons[l.id]?.completedAt).length;
  const current = LESSONS.find((l) => !s.lessons[l.id]?.completedAt);
  // Only the learner's current unit starts open; the others are closed until tapped.
  const hydrated = useHydrated();
  const [open, setOpen] = useState<number[]>([]);
  useEffect(() => {
    if (hydrated && current) setOpen([current.level]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  const toggle = (id: number) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Lessons" subtitle={`${done} of ${LESSONS.length} lessons complete`} />
      <div className="space-y-4">
        {LEVELS.map((level) => {
          const unit = LESSONS.filter((l) => l.level === level.id);
          const unitDone = unit.filter((l) => s.lessons[l.id]?.completedAt).length;
          const isOpen = open.includes(level.id);
          return (
            <section key={level.id} aria-labelledby={`unit-${level.id}`}>
              {/* The whole banner toggles the unit (the button's ::after covers it); Word list sits above that layer. */}
              <div className="relative flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-firuze p-5 text-on-accent transition-transform duration-150 active:scale-[0.99] sm:p-6">
                <div className="min-w-0">
                  <p className="eyebrow inline-block rounded-full bg-card px-2.5 py-1 text-firuze-ink">
                    Unit {level.id} · {level.cefr}
                  </p>
                  <h2 id={`unit-${level.id}`} className="mt-2 text-2xl font-extrabold">
                    <button
                      type="button"
                      onClick={() => toggle(level.id)}
                      aria-expanded={isOpen}
                      aria-controls={`unit-${level.id}-lessons`}
                      className="flex flex-wrap items-baseline gap-x-2 text-left after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-firuze"
                    >
                      {level.name}
                      <Fa className="text-xl font-bold">{level.nameFa}</Fa>
                    </button>
                  </h2>
                  <p className="mt-1 text-[15px] font-bold">{level.description}</p>
                  <p className="mt-2 text-sm font-semibold">
                    {unitDone} of {unit.length} lessons done
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href="/app/words/" className="btn btn-sm relative z-[1] [--btn-bg:rgb(0_0_0/0.2)] [--btn-fg:var(--color-on-accent)]">
                    <Library className="size-4" strokeWidth={2.5} /> Word list
                  </Link>
                  <ChevronDown
                    className={cx("size-6 transition-transform duration-200 motion-reduce:transition-none", isOpen && "rotate-180")}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </div>
              </div>

              {isOpen && (
                <ol id={`unit-${level.id}-lessons`} className="mt-12 flex flex-col items-center gap-10 pb-4">
                  {unit.map((l, i) => {
                    const rec = s.lessons[l.id];
                    const isDone = !!rec?.completedAt;
                    const isCurrent = l.id === current?.id;
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
                          <span className="relative block size-[72px]">
                            {isCurrent && (
                              <>
                                {/* Positioned by a wrapper: Bubble's own `relative` would beat an `absolute` class and push the node down. */}
                                <span className="absolute bottom-full left-1/2 mb-5 -translate-x-1/2 whitespace-nowrap">
                                  <Bubble>{rec ? "Continue" : "Start"}</Bubble>
                                </span>
                                <span className="absolute -left-2.5 -top-[7px] size-[92px] rounded-full border-[6px] border-firuze-soft" aria-hidden />
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
              )}
            </section>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm font-semibold text-muted">Lessons unlock in order, but you can open any of them to skip ahead.</p>
      <section className="card mt-8 p-5 text-center" aria-labelledby="whats-next">
        <h2 id="whats-next" className="text-lg font-extrabold">
          {done === LESSONS.length ? "You've finished every lesson so far" : `That's all ${LESSONS.length} lessons for now`}
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-muted">
          Level 5 is being written. Your reviews keep coming back when they&apos;re due, and missions, grammar and poetry go further than the
          lessons.
        </p>
      </section>
    </div>
  );
}
