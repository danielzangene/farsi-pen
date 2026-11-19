"use client";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { MISSIONS, UPCOMING_MISSIONS } from "@/content/missions";
import { displayState } from "@/lib/mastery";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader } from "@/components/ui";

export default function MissionsPage() {
  const s = useProgress();
  const skillsTotal = MISSIONS.reduce((n, m) => n + m.skills.length, 0);
  const skillsMastered = MISSIONS.flatMap((m) => m.skills).filter((sk) => displayState(s.skills[sk.id]) === "mastered").length;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Missions" subtitle="Real situations. Each one ends with something you can actually do in Persian." />
      <p className="mb-6 rounded-2xl bg-firuze-soft p-4 font-bold text-firuze-ink">
        {skillsMastered}/{skillsTotal} real-world skills mastered
      </p>

      <ol className="space-y-3">
        {MISSIONS.map((m) => {
          const states = m.skills.map((sk) => displayState(s.skills[sk.id]));
          const mastered = states.filter((x) => x === "mastered").length;
          const fading = states.includes("fading");
          const label = mastered === m.skills.length ? "Mastered" : fading ? "Check due" : s.missions[m.id] ? `${mastered}/${m.skills.length} skills` : "New";
          return (
            <li key={m.id}>
              <Link href={`/app/missions/${m.id}/`} className="tile flex items-center gap-4 p-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-firuze-soft text-3xl" aria-hidden>
                  {m.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-muted">
                    {m.world} · {m.level}
                  </span>
                  <span className="block text-lg font-extrabold">
                    {m.title} <Fa className="ms-1 text-sm font-semibold text-muted">{m.titleFa}</Fa>
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold text-muted">
                    {m.skills.length} skills · {m.skills.map((sk) => sk.canDo).join(" · ")}
                  </span>
                </span>
                <span
                  className={cx(
                    "chip shrink-0",
                    label === "Mastered" ? "bg-pista-soft text-pista-ink" : fading ? "bg-saffron-soft text-saffron-ink" : "bg-paper text-muted",
                  )}
                >
                  {label}
                </span>
                <ChevronRight className="size-5 shrink-0 text-faint" strokeWidth={3} />
              </Link>
            </li>
          );
        })}
        {UPCOMING_MISSIONS.map((m) => (
          <li key={m.title} className="card flex items-center gap-4 p-4 opacity-70">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-paper text-3xl grayscale" aria-hidden>
              {m.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="eyebrow block text-muted">{m.world}</span>
              <span className="block text-lg font-extrabold">{m.title}</span>
            </span>
            <span className="chip flex shrink-0 items-center gap-1 bg-paper text-muted">
              <Lock className="size-3.5" /> Soon
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
