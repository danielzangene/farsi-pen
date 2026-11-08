"use client";
// Living style guide for presentations and reviews: every token and
// component rendered with the app's own classes and primitives, so it can't
// drift from the product. Specs: docs/ui-kit/, rules: the
// farsi-pen-design-system skill.
import Link from "next/link";
import { Bookmark, Check, CheckCircle2, Compass, Flame, House, Layers, Lock, Menu, Mic, Star, Volume2, X, XCircle } from "lucide-react";
import { Logo, LogoMark } from "@/components/AppNav";
import { WordCard } from "@/components/WordCard";
import { Bubble, PageHeader, ProgressBar, Segmented, StatCard } from "@/components/ui";
import { WORDS } from "@/content/words";
import { updateSettings, useProgress, type Theme } from "@/lib/store";
import { asset, cx } from "@/lib/util";

const HUES = [
  { name: "firuze", role: "Primary, brand, current progress" },
  { name: "pista", role: "Correct, success" },
  { name: "anar", role: "Wrong, destructive, streak" },
  { name: "saffron", role: "XP, badges, done" },
  { name: "sky", role: "Selected, audio, focus, links" },
  { name: "plum", role: "Grammar, Formal" },
];
const NEUTRALS = [
  { name: "card", role: "Page and surfaces" },
  { name: "paper", role: "Inputs, inset, hover" },
  { name: "line", role: "2px borders" },
  { name: "field-edge", role: "Input borders" },
  { name: "faint", role: "Placeholders only" },
  { name: "muted", role: "Secondary text" },
  { name: "ink", role: "Body and headings" },
];
const TYPE = [
  { name: "page-title", cls: "text-3xl font-extrabold tracking-tight", sample: "Lessons" },
  { name: "prompt", cls: "text-2xl font-extrabold", sample: "Select the correct meaning" },
  { name: "title", cls: "text-xl font-extrabold", sample: "Nicely done!" },
  { name: "body", cls: "text-base font-semibold", sample: "Say hello, goodbye and ask how someone is doing." },
  { name: "body-sm", cls: "text-sm font-semibold text-muted", sample: "Unlocks after your first lesson" },
  { name: "eyebrow", cls: "eyebrow text-muted", sample: "Unit 1 · Lesson 1" },
];
const SECTIONS = ["Colour", "Type", "Buttons", "Surfaces", "Forms", "Feedback", "Learning", "Navigation"];

const v = (name: string) => `var(--color-${name})`;
const slug = (s: string) => s.toLowerCase();

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section id={slug(title)} className="scroll-mt-20 space-y-4 border-t-2 border-line pt-10">
      <div>
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="mt-1 max-w-2xl font-semibold text-muted">{note}</p>
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, role, edge }: { name: string; role: string; edge?: boolean }) {
  return (
    <div className="card overflow-hidden">
      <div className="h-16" style={{ background: v(name), boxShadow: edge ? `inset 0 -6px 0 ${v(`${name}-shadow`)}` : undefined }} />
      <div className="p-3">
        <p className="font-extrabold">{name}</p>
        <p className="text-xs font-semibold text-muted">{role}</p>
      </div>
    </div>
  );
}

export default function DesignPage() {
  const { settings } = useProgress();
  const word = WORDS[0];
  return (
    <div className="min-h-dvh bg-card">
      <header className="sticky top-0 z-30 border-b-2 border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <span className="sm:hidden">
            <Logo compact />
          </span>
          <span className="hidden sm:block">
            <Logo />
          </span>
          <span className="chip hidden whitespace-nowrap bg-firuze-soft text-firuze-ink sm:inline-flex">UI kit</span>
          <span className="flex-1" />
          <Segmented<Theme>
            label="Theme"
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "system", label: "Auto" },
            ]}
          />
        </div>
        <nav aria-label="Sections" className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {SECTIONS.map((s) => (
            <a key={s} href={`#${slug(s)}`} className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-muted hover:bg-paper hover:text-ink">
              {s}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 pb-24 pt-8">
        <div className="space-y-4">
          <PageHeader title="Farsi Pen UI kit" subtitle="Tokens, components and patterns, drawn with the app's own code. Switch the theme above to see both." />
          <div className="flex flex-wrap gap-3">
            <a href={asset("/present/system-design.html")} className="btn-primary">
              System design
            </a>
            <Link href="/app/" className="btn-secondary">
              Open the app
            </Link>
          </div>
          <p className="max-w-2xl text-sm font-semibold text-muted">
            Written specs live in <code className="font-bold text-ink">docs/ui-kit/</code> in the repository; the rules for building screens are in the
            farsi-pen-design-system skill.
          </p>
        </div>

        <Section title="Colour" note="Each hue is a family: the fill, a darker edge for depth, a soft background and readable ink. Text on a fill uses on-accent.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {HUES.map((h) => (
              <Swatch key={h.name} name={h.name} role={h.role} edge />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
            {HUES.map((h) => (
              <div key={h.name} className="rounded-2xl px-3 py-2 text-sm font-extrabold" style={{ background: v(`${h.name}-soft`), color: v(`${h.name}-ink`) }}>
                {h.name}-ink on soft
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {NEUTRALS.map((n) => (
              <Swatch key={n.name} name={n.name} role={n.role} />
            ))}
          </div>
        </Section>

        <Section title="Type" note="Nunito for Latin, Yekan Bakh for Persian. Persian is never letter-spaced or uppercased; running text uses the dotted style.">
          <div className="card divide-y-2 divide-line">
            {TYPE.map((t) => (
              <div key={t.name} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 p-4">
                <span className="w-28 shrink-0 text-xs font-extrabold text-muted">{t.name}</span>
                <span className={t.cls}>{t.sample}</span>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 p-4">
              <span className="w-28 shrink-0 text-xs font-extrabold text-muted">fa-hero / fa-body</span>
              <span lang="fa" dir="rtl" className="text-5xl font-bold leading-relaxed">سلام</span>
              <span lang="fa" dir="rtl" className="text-lg leading-loose">سلام، حالت چطوره؟</span>
            </div>
          </div>
        </Section>

        <Section title="Buttons" note="A solid fill on a darker edge; it sinks when pressed. One primary per screen. Try pressing them.">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary">Continue</button>
            <button type="button" className="btn-secondary">Skip</button>
            <button type="button" className="btn-ghost">Back</button>
            <button type="button" className="btn-primary" disabled>Check</button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-success">Continue</button>
            <button type="button" className="btn-danger">Got it</button>
            <button type="button" className="btn-sky btn-sm">Listen</button>
            <button type="button" className="btn-plum btn-sm">Start exercises</button>
            <button type="button" className="btn-primary btn-lg">Start mission</button>
            <button type="button" className="btn-sky btn-icon !size-14 !rounded-2xl" aria-label="Play audio">
              <Volume2 className="size-7" />
            </button>
            <button type="button" className="btn-ghost btn-icon" aria-label="Close">
              <X className="size-6" strokeWidth={3} />
            </button>
          </div>
        </Section>

        <Section title="Surfaces" note="Cards hold things; tiles are tapped. Tile states always pair colour with an icon or words.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-3">
              <button type="button" className="tile w-full p-4 text-left font-bold">
                <span className="mr-3 text-muted">1</span>hello
              </button>
              <button type="button" className="tile w-full p-4 text-left font-bold" data-state="selected">
                <span className="mr-3">2</span>thank you
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="tile flex items-center gap-2 p-4 font-bold" data-state="correct">
                  <Check className="size-5" strokeWidth={3} /> goodbye
                </div>
                <div className="tile flex items-center gap-2 p-4 font-bold" data-state="wrong">
                  <X className="size-5" strokeWidth={3} /> please
                </div>
              </div>
            </div>
            <div className="card space-y-3 p-5">
              <p className="eyebrow text-muted">A card</p>
              <p className="font-semibold">Static container: 2px border, no depth, no shadow.</p>
              <div className="flex flex-wrap gap-2">
                <span className="chip bg-saffron-soft text-saffron-ink">Spoken</span>
                <span className="chip bg-plum-soft text-plum-ink">Formal</span>
                <span className="chip bg-saffron-soft text-saffron-ink">NEW</span>
                <span className="chip bg-firuze-soft text-firuze-ink">A1</span>
                <span className="chip bg-paper text-muted">Not tried</span>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Forms" note="Inputs sit on paper with a field-edge border that turns sky on focus. Segmented controls switch options in place.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-3">
              <input className="input" placeholder="Type in English" aria-label="Example answer" />
              <input className="input" lang="fa" dir="rtl" defaultValue="سلام" aria-label="Example Persian answer" />
            </div>
            <div className="space-y-3">
              <Segmented label="Daily goal" value="10" onChange={() => {}} options={[{ value: "5", label: "5 words" }, { value: "10", label: "10 words" }, { value: "20", label: "20 words" }]} />
              <ProgressBar value={0.6} />
              <ProgressBar value={0.35} tone="saffron" />
              <ProgressBar value={0.8} tone="sky" size="sm" />
            </div>
          </div>
        </Section>

        <Section title="Feedback" note="Every answer gets a sheet within 200ms: pista for right, anar for wrong, with an icon, words and one Continue.">
          <div className="overflow-hidden rounded-2xl border-2 border-line">
            <div className="border-b-2 border-line bg-card p-5">
              <button type="button" className="btn-primary btn-lg w-full" disabled>
                Check
              </button>
            </div>
            <div className="flex flex-col gap-4 bg-pista-soft p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-pista-ink">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card">
                  <CheckCircle2 className="size-8" />
                </span>
                <div>
                  <p className="text-xl font-extrabold">Nicely done!</p>
                  <p className="text-sm font-semibold">salâm means hello</p>
                </div>
              </div>
              <button type="button" className="btn-success btn-lg">Continue</button>
            </div>
            <div className="flex flex-col gap-4 bg-anar-soft p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-anar-ink">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card">
                  <XCircle className="size-8" />
                </span>
                <div>
                  <p className="text-xl font-extrabold">Not quite</p>
                  <p className="text-sm font-semibold">Correct answer: merci. We&apos;ll come back to it.</p>
                </div>
              </div>
              <button type="button" className="btn-danger btn-lg">Got it</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatCard label="Total XP" value="26" tone="saffron" icon={<Star className="size-5" />} />
            <StatCard label="Accuracy" value="92%" tone="pista" />
            <StatCard label="Words" value="8" tone="sky" />
          </div>
        </Section>

        <Section title="Learning" note="The lesson path and the word card: the two things learners see most.">
          <div className="grid items-start gap-6 sm:grid-cols-2">
            <div className="card flex justify-around gap-4 px-4 pb-6 pt-16">
              <div className="flex w-20 flex-col items-center gap-3 text-center">
                <span className="grid size-[72px] place-items-center rounded-full bg-saffron text-on-accent shadow-[0_6px_0_var(--color-saffron-shadow)]">
                  <Check className="size-9" strokeWidth={4} />
                </span>
                <span className="text-sm font-extrabold">Courtesy</span>
              </div>
              <div className="flex w-20 flex-col items-center gap-3 text-center">
                <span className="relative block size-[72px]">
                  <span className="absolute bottom-full left-1/2 mb-5 animate-bob whitespace-nowrap">
                    <Bubble>Start</Bubble>
                  </span>
                  <span className="absolute -left-2.5 -top-[7px] size-[92px] rounded-full border-[6px] border-firuze-soft" aria-hidden />
                  <span className="relative grid size-[72px] place-items-center rounded-full bg-firuze text-3xl shadow-[0_6px_0_var(--color-firuze-shadow)]">👋</span>
                </span>
                <span className="text-sm font-extrabold">Greetings</span>
              </div>
              <div className="flex w-20 flex-col items-center gap-3 text-center">
                <span className="grid size-[72px] place-items-center rounded-full bg-line text-faint shadow-[0_6px_0_var(--color-line-strong)]">
                  <Lock className="size-7" strokeWidth={3} />
                </span>
                <span className="text-sm font-extrabold text-muted">Family</span>
              </div>
            </div>
            {word && <WordCard word={word} isNew />}
          </div>
        </Section>

        <Section title="Navigation" note="Proposed: five tabs with one job each, replacing today's ten-item More sheet. Labels always visible.">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="eyebrow text-muted">Today on dev</p>
              <TabRow tabs={[["Home", House], ["Lessons", Layers], ["Missions", Compass], ["Words", Bookmark], ["More", Menu]]} />
            </div>
            <div className="space-y-2">
              <p className="eyebrow text-firuze-ink">Proposed</p>
              <TabRow tabs={[["Today", House], ["Learn", Layers], ["Speak", Mic], ["Review", Bookmark], ["Me", Flame]]} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <LogoMark />
            <Logo />
          </div>
        </Section>
      </main>
    </div>
  );
}

function TabRow({ tabs }: { tabs: [string, typeof House][] }) {
  return (
    <div className="card flex justify-around gap-0.5 px-1 py-1.5">
      {tabs.map(([label, Icon], i) => (
        <span key={label} className={cx("flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-extrabold", i === 0 ? "text-sky-ink" : "text-muted")}>
          <span className={cx("grid h-9 w-12 place-items-center rounded-xl border-2", i === 0 ? "border-sky bg-sky-soft" : "border-transparent")}>
            <Icon className="size-[26px]" strokeWidth={2.5} />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}
