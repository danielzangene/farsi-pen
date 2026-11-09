"use client";
import { useState } from "react";
import { Trophy } from "lucide-react";
import { BADGES, levelFor } from "@/lib/gamification";
import { badgeStats, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, ProgressBar } from "./ui";

/** Level name, the bar to the next level and XP to go. */
export function LevelCard() {
  const s = useProgress();
  const level = levelFor(s.xp);
  return (
    <section className="card p-5" aria-labelledby="level-heading">
      <p className="text-sm font-semibold text-saffron-ink">Level {level.number}</p>
      <h2 id="level-heading" className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-xl font-extrabold">
        {level.current.name}
        <Fa className="text-lg font-semibold text-muted">{level.current.fa}</Fa>
      </h2>
      <ProgressBar value={level.progress} tone="saffron" className="mt-4" />
      <p className="mt-2 text-sm text-muted">
        {level.next ? (
          <>
            <strong className="font-bold text-saffron-ink">{level.toNext} XP</strong> to {level.next.name}
          </>
        ) : (
          "Top level reached"
        )}
      </p>
    </section>
  );
}

/** Badges: earned first, then the closest to being earned; four shown until expanded. */
export function BadgesCard() {
  const s = useProgress();
  const stats = badgeStats(s);
  const [all, setAll] = useState(false);
  const order = [...BADGES].sort((a, b) => {
    const ea = s.earnedBadges.includes(a.id) ? 1 : 0;
    const eb = s.earnedBadges.includes(b.id) ? 1 : 0;
    if (ea !== eb) return eb - ea;
    const [ha, na] = a.progress(stats);
    const [hb, nb] = b.progress(stats);
    return (nb ? hb / nb : 0) - (na ? ha / na : 0);
  });
  const shown = all ? order : order.slice(0, 4);
  return (
    <section className="card p-5" aria-labelledby="badges-heading">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="size-5 fill-saffron text-saffron-shadow" aria-hidden />
        <h2 id="badges-heading" className="text-xl font-extrabold">
          Badges
        </h2>
        <span className="ms-auto text-sm text-muted">
          {s.earnedBadges.length}/{BADGES.length} earned
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shown.map((b) => {
          const earned = s.earnedBadges.includes(b.id);
          const [have, need] = b.progress(stats);
          return (
            <li key={b.id} className="tile flex flex-col items-center p-3 text-center" title={b.description}>
              <span className={cx("grid size-12 place-items-center rounded-full text-2xl", earned ? "bg-saffron-soft" : "bg-paper opacity-60 grayscale")} aria-hidden>
                {b.emoji}
              </span>
              <span className={cx("mt-2 block text-sm font-semibold leading-tight", !earned && "text-muted")}>{b.name}</span>
              {earned ? (
                <span className="mt-1 text-xs font-semibold text-saffron-ink">Earned</span>
              ) : (
                <>
                  <span className="mt-0.5 block text-xs text-muted">{b.description}</span>
                  <ProgressBar value={need ? Math.min(have, need) / need : 0} size="sm" tone="saffron" className="mt-2 w-full" />
                  <span className="mt-1 text-xs text-muted">
                    {Math.min(have, need)}/{need}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn-ghost btn-sm mt-3 w-full" onClick={() => setAll(!all)} aria-expanded={all}>
        {all ? "Show fewer" : `Show all ${BADGES.length} badges`}
      </button>
    </section>
  );
}
