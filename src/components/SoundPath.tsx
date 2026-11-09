"use client";
import { useState } from "react";
import { Check, ChevronDown, Crown, Lock, RotateCcw, Star } from "lucide-react";
import { nextUp, PATH_UNITS, stageCount, stageItems, stagesDone, unitDone, unitOpen, type PathUnit } from "@/lib/sound-path";
import type { SoundPathRecord } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, ProgressBar, TONE } from "./ui";

export type PathPlay = { unit: PathUnit; stage: number | "test" };

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} className={cx("size-4", i <= n ? "fill-saffron text-saffron" : "text-line-strong")} strokeWidth={2.5} />
      ))}
    </span>
  );
}

/** "Next up" card: the stage the learner should play now. */
export function NextUpCard({ all, onPlay, disabled }: { all: Record<string, SoundPathRecord>; onPlay: (p: PathPlay) => void; disabled?: boolean }) {
  const nu = nextUp(all);
  if (!nu)
    return (
      <section className="card p-5 text-center">
        <p className="text-xl font-extrabold">Every sound unit is done</p>
        <p className="mt-1 font-semibold text-muted">Replay any stage to keep them sharp, or try the daily workout below.</p>
      </section>
    );
  const { unit, index, stage } = nu;
  const total = stageCount(unit) + 1;
  const review = stage === stageCount(unit);
  return (
    <section aria-labelledby="next-up" className={cx("rounded-2xl border-2 p-5 sm:p-6", TONE[unit.tone].border, TONE[unit.tone].soft)}>
      <div className="flex items-center gap-4">
        <span className={cx("grid size-16 shrink-0 place-items-center rounded-2xl text-on-accent", TONE[unit.tone].bg)}>
          <Fa className="text-2xl font-bold">{unit.badge}</Fa>
        </span>
        <div className="min-w-0">
          <p className={cx("text-sm font-extrabold", TONE[unit.tone].ink)}>Next up · Unit {index + 1}</p>
          <h2 id="next-up" className="text-2xl font-extrabold">
            {unit.title}
          </h2>
          <p className="text-sm font-semibold text-muted">{review ? "Review" : `Stage ${stage + 1}`}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={stage / total} tone={unit.tone} size="sm" className="flex-1" />
        <span className="shrink-0 text-sm font-bold text-muted">
          {stage} of {total} stages
        </span>
      </div>
      <button type="button" className="btn-primary btn-lg mt-4 w-full" onClick={() => onPlay({ unit, stage })} disabled={disabled}>
        {stage === 0 ? "Start" : "Continue"}
      </button>
    </section>
  );
}

/** Units of the sound path, each opening into its stages. */
export function SoundPathList({ all, onPlay, onInfo, disabled }: { all: Record<string, SoundPathRecord>; onPlay: (p: PathPlay) => void; onInfo: (u: PathUnit) => void; disabled?: boolean }) {
  const current = nextUp(all)?.unit.id;
  const [openIds, setOpenIds] = useState<string[]>(current ? [current] : []);
  const toggle = (id: string) => setOpenIds((x) => (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]));

  return (
    <ol className="space-y-4">
      {PATH_UNITS.map((u, i) => {
        const rec = all[u.id];
        const open = unitOpen(i, all);
        const done = unitDone(u, rec);
        const n = stageCount(u);
        const played = stagesDone(u, rec);
        const expanded = openIds.includes(u.id);
        return (
          <li key={u.id}>
            <div className={cx("rounded-2xl border-2 border-line", !open && "opacity-75")}>
              <button type="button" className="flex w-full items-center gap-4 p-4 text-start" onClick={() => toggle(u.id)} aria-expanded={expanded}>
                <span className={cx("grid size-14 shrink-0 place-items-center rounded-2xl", open ? cx(TONE[u.tone].bg, "text-on-accent") : "bg-paper text-muted")}>
                  <Fa className="text-xl font-bold">{u.badge}</Fa>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cx("block text-sm font-extrabold", TONE[u.tone].ink)}>Unit {i + 1}</span>
                  <span className="block text-lg font-extrabold leading-tight">{u.title}</span>
                  <span className="block text-sm font-semibold text-muted">{u.subtitle}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  {rec?.testedOut ? (
                    <span className="chip bg-pista-soft text-pista-ink">
                      <Check className="size-3.5" /> Tested out
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-muted">
                      {played} of {n + 1}
                    </span>
                  )}
                  <ChevronDown className={cx("size-5 text-muted transition-transform", expanded && "rotate-180")} />
                </span>
              </button>

              {expanded && (
                <div className="border-t-2 border-line px-4 pb-4 pt-3">
                  <ol className="relative">
                    {Array.from({ length: n + 1 }, (_, k) => {
                      const review = k === n;
                      const stars = rec?.stars?.[k];
                      const isDone = rec?.testedOut || stars !== undefined;
                      const unlocked = open && (k === 0 || rec?.testedOut || rec?.stars?.[k - 1] !== undefined);
                      const isNext = unlocked && !isDone;
                      const items = stageItems(u, k, rec);
                      const words = items.filter((w) => !w.id.startsWith("ex:")).length;
                      const sentences = items.length - words;
                      return (
                        <li key={k} className="relative flex items-stretch gap-3 pb-2 last:pb-0">
                          {/* timeline */}
                          <span className="relative flex w-9 shrink-0 justify-center">
                            {k < n && <span className={cx("absolute bottom-[-0.5rem] top-9 w-1 rounded-full", isDone ? TONE[u.tone].bg : "bg-line")} aria-hidden />}
                            <span
                              className={cx(
                                "relative z-[1] mt-3 grid size-9 place-items-center rounded-full border-[3px]",
                                isDone ? cx(TONE[u.tone].bg, "border-transparent text-on-accent") : isNext ? cx(TONE[u.tone].border, "bg-card") : "border-line bg-card text-faint",
                              )}
                              aria-hidden
                            >
                              {review ? <Crown className="size-4" /> : isDone ? <Check className="size-4" strokeWidth={3.5} /> : null}
                            </span>
                          </span>
                          <button
                            type="button"
                            className="tile flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3 text-start"
                            data-state={isNext ? "current" : undefined}
                            disabled={!unlocked || disabled}
                            onClick={() => onPlay({ unit: u, stage: k })}
                            aria-label={`${review ? "Review" : `Stage ${k + 1}`}${isDone ? (stars ? `, ${stars} stars, play again` : ", done") : unlocked ? ", start" : ", locked"}`}
                          >
                            <span className="min-w-0">
                              <span className="block font-extrabold">{review ? "Review" : `Stage ${k + 1}`}</span>
                              {stars ? (
                                <Stars n={stars} />
                              ) : (
                                <span className="block text-sm font-semibold text-muted">
                                  {review ? "Your weakest words" : `${words} words`}
                                  {sentences > 0 && ` · ${sentences} sentence${sentences > 1 ? "s" : ""}`}
                                </span>
                              )}
                            </span>
                            {!unlocked ? <Lock className="size-5 shrink-0 text-faint" /> : isDone ? <RotateCcw className={cx("size-5 shrink-0", TONE[u.tone].ink)} /> : null}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="mt-3 flex flex-wrap gap-2 ps-12">
                    <button type="button" className="btn-ghost btn-sm" onClick={() => onInfo(u)}>
                      How to say it
                    </button>
                    {!done && (
                      <button type="button" className="btn-secondary btn-sm" disabled={disabled} onClick={() => onPlay({ unit: u, stage: "test" })}>
                        Test out of this unit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
