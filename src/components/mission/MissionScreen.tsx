"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, CircleDot, Clock, Hourglass, ShieldCheck } from "lucide-react";
import type { Mission } from "@/content/missions";
import { displayState, type SkillDisplay } from "@/lib/mastery";
import { weakSkills, type SessionMode } from "@/lib/missions";
import { useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa } from "../ui";
import { MissionSession } from "./MissionSession";

export const SKILL_STATE: Record<SkillDisplay, { label: string; className: string; icon: typeof Circle }> = {
  new: { label: "New", className: "text-muted", icon: Circle },
  recognized: { label: "Seen", className: "text-sky-ink", icon: CircleDot },
  usable: { label: "Practised", className: "text-sky-ink", icon: CircleDot },
  mastered: { label: "Mastered", className: "text-pista-ink", icon: CheckCircle2 },
  fading: { label: "Due for a check", className: "text-saffron-ink", icon: Hourglass },
};

/** Mission landing page: what you'll be able to do, then start, prove it, or repair. */
export function MissionScreen({ mission }: { mission: Mission }) {
  const s = useProgress();
  const hydrated = useHydrated();
  const [session, setSession] = useState<{ mode: SessionMode; focus?: string[]; key: number } | null>(null);

  if (!hydrated) return null;

  if (session)
    return (
      <MissionSession
        key={session.key}
        mission={mission}
        mode={session.mode}
        focus={session.focus}
        onFinish={(next) => setSession(next ? { ...next, key: session.key + 1 } : null)}
      />
    );

  const rec = s.missions[mission.id];
  const states = mission.skills.map((sk) => ({ ...sk, state: displayState(s.skills[sk.id]) }));
  const weak = weakSkills(mission, s.skills);
  const fading = states.filter((x) => x.state === "fading").map((x) => x.id);
  const allMastered = weak.length === 0;
  const tried = !!rec;
  const start = (mode: SessionMode, focus?: string[]) => setSession({ mode, focus, key: Date.now() });

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/app/missions/" className="btn-ghost btn-sm -ml-3 mb-4">
        <ArrowLeft className="size-4" strokeWidth={3} /> Missions
      </Link>

      <div className="flex items-start gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-firuze-soft text-4xl" aria-hidden>
          {mission.emoji}
        </span>
        <div className="min-w-0">
          <p className="eyebrow text-firuze-ink">
            {mission.world} · {mission.level}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {mission.title} <Fa className="ms-1 text-xl font-bold text-muted">{mission.titleFa}</Fa>
          </h1>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium">{mission.scene}</p>

      <section className="card mt-6 p-5">
        <h2 className="eyebrow text-muted">After this mission you can</h2>
        <ul className="mt-3 space-y-2.5">
          {states.map((x) => {
            const st = SKILL_STATE[x.state];
            return (
              <li key={x.id} className="flex items-center gap-3">
                <st.icon className={cx("size-5 shrink-0", st.className)} strokeWidth={2.5} />
                <span className="flex-1 font-bold">{x.canDo}</span>
                <span className={cx("chip bg-paper", st.className)}>{st.label}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted">
          <Clock className="size-4" /> About 10 minutes · listening, phrases, grammar, role-play, final check
        </p>
      </section>

      <div className="mt-6 flex flex-col gap-3">
        {allMastered ? (
          <>
            <p className="flex items-center gap-2 rounded-2xl bg-pista-soft p-4 font-bold text-pista-ink">
              <ShieldCheck className="size-5" /> Mastered — nothing to do here until a check is due.
            </p>
            <button type="button" className="btn-secondary" onClick={() => start("full")}>
              Replay the mission (no XP)
            </button>
          </>
        ) : fading.length > 0 && fading.length === weak.length ? (
          <button type="button" className="btn-primary btn-lg" onClick={() => start("review", fading)} autoFocus>
            Quick check ({fading.length} skill{fading.length === 1 ? "" : "s"})
          </button>
        ) : tried ? (
          <>
            <button type="button" className="btn-primary btn-lg" onClick={() => start("repair", weak)} autoFocus>
              Practise what&apos;s left ({weak.length} skill{weak.length === 1 ? "" : "s"})
            </button>
            <button type="button" className="btn-secondary" onClick={() => start("full")}>
              Go through the whole mission
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-primary btn-lg" onClick={() => start("full")} autoFocus>
              Start mission
            </button>
            <button type="button" className="btn-secondary" onClick={() => start("prove")}>
              Already know this? Prove it
            </button>
          </>
        )}
      </div>
    </article>
  );
}
