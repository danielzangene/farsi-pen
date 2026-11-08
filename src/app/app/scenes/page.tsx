"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { CAST, castOf, sceneOfTheDay, SCENES, type CastId } from "@/content/scenes";
import { dayKey } from "@/lib/gamification";
import { useHydrated, useProgress } from "@/lib/store";
import { CastAvatar, CastStack } from "@/components/scene/Cast";
import { Fa, PageHeader } from "@/components/ui";

const MAIN_CAST: CastId[] = ["sara", "mahin", "arash", "mamad", "shirin"];

export default function ScenesPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const today = sceneOfTheDay(dayKey());
  const rec = s.scenes ?? {};

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Scenes" subtitle="Short everyday sketches with the same family. Pick a part, the others are read for you, and you say your lines." />

      <section aria-labelledby="today-scene" className="card overflow-hidden">
        <div className="border-b-2 border-line bg-paper px-5 py-2 text-sm font-extrabold text-muted">Today&apos;s scene</div>
        <div className="p-5 sm:p-6">
          <p className="text-sm font-bold text-muted">Episode {today.episode}</p>
          <h2 id="today-scene" className="text-2xl font-extrabold">
            {today.title} <Fa className="ms-1 text-xl font-bold text-muted">{today.fa}</Fa>
          </h2>
          <p className="mt-2 font-semibold italic text-muted">{today.setting}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <CastStack ids={castOf(today)} />
            <Link href={`/app/scenes/${today.id}/`} className="btn-primary w-full sm:w-auto sm:min-w-44">
              {rec[today.id] ? "Play again" : "Play"}
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="episodes">
        <h2 id="episodes" className="mb-3 text-lg font-extrabold">
          All episodes
        </h2>
        <ol className="space-y-3">
          {SCENES.map((sc) => {
            const r = rec[sc.id];
            return (
              <li key={sc.id}>
                <Link href={`/app/scenes/${sc.id}/`} className="tile flex items-center gap-4 p-4">
                  <span className="w-8 shrink-0 text-center text-2xl font-extrabold text-muted">{sc.episode}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-extrabold">{sc.title}</span>
                      <Fa className="text-sm font-bold text-muted">{sc.fa}</Fa>
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-muted">{sc.setting}</span>
                    {r && r.parts.length > 0 && (
                      <span className="mt-1 flex items-center gap-1 text-xs font-bold text-pista-ink">
                        <Check className="size-3.5" /> Played as {r.parts.map((p) => CAST[p as CastId]?.name ?? p).join(", ")}
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:block">
                    <CastStack ids={castOf(sc)} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="cast">
        <h2 id="cast" className="mb-3 text-lg font-extrabold">
          The family and friends
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {MAIN_CAST.map((id) => (
            <li key={id} className="flex items-center gap-3">
              <CastAvatar id={id} />
              <span>
                <span className="block font-extrabold">
                  {CAST[id].name} <Fa className="text-sm font-bold text-muted">{CAST[id].fa}</Fa>
                </span>
                <span className="block text-sm font-semibold text-muted">{CAST[id].role}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
