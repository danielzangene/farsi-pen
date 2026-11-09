"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { buildPath, nextOnPath, sectionProgress, type PathItem } from "@/lib/path";
import { useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, PageHeader, ProgressBar, TONE, type Tone } from "@/components/ui";

const TONES: Tone[] = ["firuze", "saffron", "sky", "pista", "plum", "anar", "firuze"];
const KIND_LABEL: Record<PathItem["kind"], string> = { alphabet: "Letters", sounds: "Sounds", lesson: "Lesson", mission: "Mission", grammar: "Grammar", scenes: "Scenes", reading: "Reading" };

function Badge({ text, tone, done }: { text: string; tone: Tone; done?: boolean }) {
  const emoji = /\p{Extended_Pictographic}/u.test(text);
  return (
    <span className={cx("grid size-11 shrink-0 place-items-center rounded-xl", done ? cx(TONE[tone].bg, "text-on-accent") : TONE[tone].soft)}>
      {emoji ? (
        <span className="text-xl" aria-hidden>
          {text}
        </span>
      ) : (
        <Fa className={cx("text-lg font-bold", !done && TONE[tone].ink)}>{text}</Fa>
      )}
    </span>
  );
}

export default function PathPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const sections = buildPath(s);
  const next = nextOnPath(sections, s);
  const [open, setOpen] = useState<string[]>([]);
  useEffect(() => {
    if (hydrated && next) setOpen([next.section.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  if (!hydrated) return null;
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  const all = sections.flatMap((x) => x.items);
  const done = all.filter((i) => i.done).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Path" subtitle="The whole course in order, from the first letter to reading real Persian." />

      {next ? (
        <section aria-labelledby="next-heading" className={cx("rounded-[1.25rem] p-5 sm:p-6", TONE[TONES[(next.section.number - 1) % TONES.length]].soft)}>
          <p className={cx("text-sm font-semibold", TONE[TONES[(next.section.number - 1) % TONES.length]].ink)}>
            Next up · Section {next.section.number} · {next.section.title}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <Badge text={next.item.badge} tone={TONES[(next.section.number - 1) % TONES.length]} />
            <div className="min-w-0">
              <h2 id="next-heading" className="text-2xl font-extrabold leading-tight">
                {next.item.title}
              </h2>
              <p className="text-sm text-muted">
                {KIND_LABEL[next.item.kind]} · {next.item.subtitle}
              </p>
            </div>
          </div>
          <Link href={next.item.href} className="btn-primary btn-lg mt-5 w-full">
            {next.item.progress > 0 ? "Continue" : "Start"}
          </Link>
        </section>
      ) : (
        <section className="card p-5 text-center">
          <p className="text-xl font-extrabold">You&apos;ve walked the whole path</p>
          <p className="mt-1 text-muted">Keep it fresh with reviews, scenes and the SAMFA mock.</p>
        </section>
      )}

      <div className="card flex items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Your journey</p>
          <ProgressBar value={all.length ? done / all.length : 0} tone="firuze" size="sm" className="mt-2" />
        </div>
        <p className="shrink-0 text-sm text-muted">
          <span className="font-bold text-ink">{done}</span> of {all.length} steps
        </p>
      </div>

      <ol className="space-y-4">
        {sections.map((sec) => {
          const tone = TONES[(sec.number - 1) % TONES.length];
          const p = sectionProgress(sec);
          const expanded = open.includes(sec.id);
          return (
            <li key={sec.id} className="card overflow-hidden !p-0">
              <button type="button" className="flex w-full items-center gap-4 p-4 text-start sm:p-5" onClick={() => toggle(sec.id)} aria-expanded={expanded}>
                <span className={cx("grid size-12 shrink-0 place-items-center rounded-full text-lg font-extrabold text-on-accent", TONE[tone].bg)}>{sec.number}</span>
                <span className="min-w-0 flex-1">
                  <span className={cx("block text-xs font-semibold", TONE[tone].ink)}>
                    Section {sec.number} · {sec.cefr}
                  </span>
                  <span className="block text-lg font-extrabold leading-tight">
                    {sec.title} <Fa className="ms-1 inline-block whitespace-nowrap text-base font-semibold text-muted">{sec.fa}</Fa>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {p.done} of {p.total} done
                  </span>
                </span>
                <ChevronDown className={cx("size-5 shrink-0 text-faint transition-transform duration-300", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="border-t border-line px-4 pb-4 pt-3 sm:px-5">
                  <p className="mb-3 text-sm text-muted">{sec.description}</p>
                  <ol>
                    {sec.items.map((it, k) => {
                      const isNext = next?.item.id === it.id;
                      const last = k === sec.items.length - 1;
                      return (
                        <li key={it.id} className="relative flex gap-3 pb-2 last:pb-0">
                          <span className="relative flex w-6 shrink-0 justify-center" aria-hidden>
                            {!last && <span className={cx("absolute bottom-[-0.5rem] top-8 w-0.5 rounded-full", it.done ? TONE[tone].bg : "bg-line")} />}
                            <span
                              className={cx(
                                "relative z-[1] mt-5 grid size-6 place-items-center rounded-full border-2",
                                it.done ? cx(TONE[tone].bg, "border-transparent text-on-accent") : isNext ? cx(TONE[tone].border, "bg-card") : "border-line bg-card",
                              )}
                            >
                              {it.done && <Check className="size-3.5" strokeWidth={3.5} />}
                            </span>
                          </span>
                          <Link href={it.href} className="tile flex min-w-0 flex-1 items-center gap-3 p-3" data-state={isNext ? "current" : undefined}>
                            <Badge text={it.badge} tone={tone} done={it.done} />
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs font-semibold text-muted">{isNext ? "Up next" : KIND_LABEL[it.kind]}</span>
                              <span className="block font-semibold leading-tight">{it.title}</span>
                              <span className="block truncate text-sm text-muted">{it.subtitle}</span>
                              {it.progress > 0 && it.progress < 1 && <ProgressBar value={it.progress} tone={tone} size="sm" className="mt-1.5" />}
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-faint" />
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
