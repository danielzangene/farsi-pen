"use client";
// Living style guide: Farsi Pen's foundations, components and patterns,
// rendered with the app's own code. Structure follows the five systems we
// benchmarked (see "Benchmarks" below). Written specs: docs/ui-kit/;
// building rules: the farsi-pen-design-system skill.
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, Compass, Flame, House, Layers, Lock, Menu, Mic, Play, Star, Volume2, X, XCircle } from "lucide-react";
import { Logo, LogoMark } from "@/components/AppNav";
import { WordCard } from "@/components/WordCard";
import { Bubble, Fa, ProgressBar, Segmented, StatCard } from "@/components/ui";
import { WORDS } from "@/content/words";
import { updateSettings, useProgress, type Theme } from "@/lib/store";
import { asset, cx } from "@/lib/util";
import { COLOR, COLORS, DoDont, Example, Group, pair, RADIUS, RatioBadge, SIZES, SOURCE, SPACING, Spec, TokenChip, Topic, TYPE_GROUPS, UseWhen, type ThemeId } from "./kit";

const NAV = [
  { id: "overview", label: "Overview", items: [["benchmarks", "Benchmarks"], ["principles", "Principles"]] },
  {
    id: "foundations",
    label: "Foundations",
    items: [["colour", "Colour"], ["type", "Typography"], ["shape", "Shape & depth"], ["spacing", "Spacing & size"], ["motion", "Motion"], ["bidi", "Persian & RTL"], ["voice", "Voice & tone"]],
  },
  {
    id: "components",
    label: "Components",
    items: [["button", "Button"], ["tile", "Tile"], ["chip", "Chip"], ["input", "Input"], ["segmented", "Segmented"], ["progress", "Progress"], ["feedback", "Feedback sheet"], ["stat", "Stat card"], ["path", "Path node"], ["word", "Word card"], ["nav", "Navigation"]],
  },
  { id: "patterns", label: "Patterns", items: [["session", "Session screen"], ["empty", "Empty state"]] },
  { id: "accessibility", label: "Accessibility", items: [["contrast", "Contrast report"], ["checklist", "Checklist"]] },
] as const;

const BENCHMARKS = [
  { name: "Duolingo brand guidelines", why: "The closest product: playful, gamified language learning.", took: "Personality first: big colour blocks up top, and voice shown through real copy, not adjectives.", note: "Pattern only. We never use its owl, green or fonts.", url: "https://blog.duolingo.com/hub/design/" },
  { name: "Khan Academy Wonder Blocks", why: "Education product that cut 50+ button styles down to one small, accessible set.", took: "Few tokens, each with one job, and accessibility written into every component's contract.", url: "https://github.com/Khan/wonder-blocks" },
  { name: "Shopify Polaris", why: "The reference for usable component docs and content guidelines.", took: "Do / Don't pairs with a reason, “Use it for / Not for”, and tokens you can copy.", url: "https://polaris.shopify.com/" },
  { name: "Atlassian Design System", why: "Clear information architecture and practical, real examples.", took: "Overview → Foundations → Components → Patterns, a persistent sidebar, and patterns annotated part by part.", url: "https://atlassian.design/" },
  { name: "Wikimedia Codex", why: "Open-source system that treats Persian and other RTL scripts as first-class.", took: "A bidirectionality foundation: what mirrors, what doesn't, and mixed-script text.", url: "https://doc.wikimedia.org/codex/latest/style-guide/bidirectionality.html" },
];

const PRINCIPLES = [
  { title: "One thing to do", body: "Each screen has one primary button. Everything else steps back.", tone: "firuze" },
  { title: "Instant, kind feedback", body: "Every answer gets a coloured sheet within 200ms, with words and an icon, never colour alone.", tone: "pista" },
  { title: "Spoken first, formal shown", body: "Teach everyday Tehrani Persian; label the formal form when it differs.", tone: "saffron" },
  { title: "The pen", body: "Reading and writing are the promise: script, tracing and script-only mode get first-class space.", tone: "sky" },
] as const;

const HUES = ["firuze", "pista", "anar", "saffron", "sky", "plum"] as const;
const NEUTRALS = ["card", "paper", "line", "line-strong", "field-edge", "faint", "muted", "ink", "on-accent"];
const v = (n: string) => `var(--color-${n})`;

export default function DesignPage() {
  const { settings } = useProgress();
  const [anim, setAnim] = useState<{ cls: string; n: number }>({ cls: "", n: 0 });
  const play = (cls: string) => setAnim((a) => ({ cls, n: a.n + 1 }));
  const word = WORDS[0];

  return (
    <div className="min-h-dvh bg-card">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b-2 border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <span className="sm:hidden">
            <Logo compact />
          </span>
          <span className="hidden sm:block">
            <Logo />
          </span>
          <span className="chip hidden whitespace-nowrap bg-firuze-soft text-firuze-ink sm:inline-flex">Design system</span>
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
        {/* Phone section chips */}
        <nav aria-label="Sections" className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
          {NAV.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="shrink-0 rounded-xl border-2 border-line px-3 py-1.5 text-xs font-extrabold text-muted hover:bg-paper hover:text-ink">
              {g.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <nav aria-label="Contents" className="sticky top-20 max-h-[calc(100dvh-6rem)] space-y-5 overflow-y-auto py-8 pr-2">
            {NAV.map((g) => (
              <div key={g.id}>
                <a href={`#${g.id}`} className="eyebrow block px-2 text-muted hover:text-ink">
                  {g.label}
                </a>
                <ul className="mt-1.5 space-y-0.5">
                  {g.items.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`} className="block rounded-xl px-2 py-1.5 text-sm font-bold hover:bg-paper">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="px-2 text-xs font-semibold text-muted">
              Built from <code className="font-bold">{SOURCE.ref}</code>
            </p>
          </nav>
        </aside>

        <main className="min-w-0 space-y-16 pb-28 pt-8">
          {/* ── Overview ─────────────────────────────────────────── */}
          <section id="overview" aria-labelledby="overview-h" className="scroll-mt-28 space-y-10 lg:scroll-mt-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-line">
              <div className="grid gap-0 md:grid-cols-[1.3fr_1fr]">
                <div className="space-y-5 p-6 sm:p-10">
                  <p className="eyebrow text-firuze-ink">Farsi Pen design system · v1</p>
                  <h1 id="overview-h" className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                    Bright, kind and in <span className="text-firuze-ink">Persian</span>.
                  </h1>
                  <p className="max-w-lg text-lg font-semibold text-muted">
                    The tokens, components and patterns behind every Farsi Pen screen, drawn here with the app&apos;s own code. Switch the theme to see Dark (the default) and
                    Light.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="#components" className="btn-primary">
                      Browse components
                    </a>
                    <a href={asset("/present/system-design.html")} className="btn-secondary">
                      System design
                    </a>
                    <Link href="/app/" className="btn-ghost">
                      Open the app
                    </Link>
                  </div>
                </div>
                {/* Colour blocks with the lesson path cut out */}
                <div className="relative hidden min-h-64 md:block" aria-hidden>
                  <div className="absolute inset-y-0 left-0 w-[45%] bg-firuze">
                    <span className="absolute left-1/2 top-10 size-16 -translate-x-1/2 rounded-full bg-card shadow-[0_6px_0_var(--color-firuze-shadow)]" />
                    <span className="absolute left-[62%] top-36 size-[84px] -translate-x-1/2 rounded-full border-[6px] border-firuze-soft" />
                    <span className="absolute left-[62%] top-[152px] size-16 -translate-x-1/2 rounded-full bg-card shadow-[0_6px_0_var(--color-firuze-shadow)]" />
                  </div>
                  <div className="absolute right-0 top-0 h-[42%] w-[52%] rounded-bl-2xl bg-saffron" />
                  <div className="absolute bottom-0 right-[26%] h-[52%] w-[24%] rounded-t-2xl bg-anar" />
                  <div className="absolute bottom-0 right-0 h-[52%] w-[24%] rounded-tl-2xl bg-sky" />
                  <span className="absolute bottom-6 left-[52%] text-6xl font-bold text-ink">
                    <Fa>ف</Fa>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["33", "colour tokens, Dark and Light"],
                ["14", "text styles, Latin and Persian"],
                ["11", "documented components"],
                ["2", "themes, Dark by default"],
              ].map(([n, l]) => (
                <div key={l} className="card p-4">
                  <p className="text-3xl font-extrabold tabular-nums text-firuze-ink">{n}</p>
                  <p className="text-sm font-semibold text-muted">{l}</p>
                </div>
              ))}
            </div>

            <Topic id="benchmarks" title="Benchmarks" summary="We studied the strongest design systems on the web and took one idea from each of the five that best match a playful, Persian-first learning app.">
              <ol className="grid gap-3 md:grid-cols-2">
                {BENCHMARKS.map((b, i) => (
                  <li key={b.name} className={cx("card flex gap-4 p-4", i === 0 && "md:col-span-2")}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-firuze-soft text-lg font-extrabold text-firuze-ink">{i + 1}</span>
                    <div className="min-w-0 space-y-1">
                      <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-extrabold text-sky-ink hover:underline">
                        {b.name}
                      </a>
                      <p className="text-sm font-semibold text-muted">{b.why}</p>
                      <p className="text-sm font-semibold">
                        <span className="font-extrabold text-firuze-ink">We took: </span>
                        {b.took}
                      </p>
                      {b.note && <p className="text-xs font-bold text-anar-ink">{b.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Topic>

            <Topic id="principles" title="Principles">
              <div className="grid gap-3 sm:grid-cols-2">
                {PRINCIPLES.map((p) => (
                  <div key={p.title} className="rounded-2xl p-5" style={{ background: v(`${p.tone}-soft`), color: v(`${p.tone}-ink`) }}>
                    <p className="text-xl font-extrabold">{p.title}</p>
                    <p className="mt-1 font-semibold">{p.body}</p>
                  </div>
                ))}
              </div>
            </Topic>
          </section>

          {/* ── Foundations ──────────────────────────────────────── */}
          <Group id="foundations" eyebrow="Foundations" title="The building materials" intro="Colour, type, shape, space, motion, script and voice. Every value on this page is read from docs/ui-kit/tokens.json.">
            <Topic id="colour" title="Colour" summary="Six hues, each a family of four: the fill, its darker 3D edge, a soft background and readable ink. Tap a token to copy it.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {HUES.map((h) => (
                  <div key={h} className="card overflow-hidden">
                    <div className="flex h-20 items-end p-3" style={{ background: v(h), boxShadow: `inset 0 -8px 0 ${v(`${h}-shadow`)}` }}>
                      <span className="eyebrow pb-2 text-on-accent">{h}</span>
                    </div>
                    <div className="px-3 py-2 text-sm font-extrabold" style={{ background: v(`${h}-soft`), color: v(`${h}-ink`) }}>
                      {h}-ink on {h}-soft
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="text-xs font-semibold text-muted">{COLOR[h].usage}</p>
                      <div className="flex flex-wrap gap-1">
                        {[h, `${h}-shadow`, `${h}-soft`, `${h}-ink`].map((n) => (
                          <TokenChip key={n} name={n} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto rounded-2xl border-2 border-line">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-paper">
                    <tr className="eyebrow text-muted">
                      <th className="px-4 py-2">Neutral</th>
                      <th className="px-4 py-2">Dark</th>
                      <th className="px-4 py-2">Light</th>
                      <th className="px-4 py-2">Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-line">
                    {NEUTRALS.map((n) => (
                      <tr key={n}>
                        <td className="px-4 py-2">
                          <TokenChip name={n} />
                        </td>
                        {(["dark", "light"] as ThemeId[]).map((t) => (
                          <td key={t} className="px-4 py-2">
                            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold">
                              <span className="size-5 rounded-md border-2 border-line" style={{ background: COLOR[n].value[t] }} />
                              {COLOR[n].value[t]}
                            </span>
                          </td>
                        ))}
                        <td className="px-4 py-2 text-xs font-semibold text-muted">{COLOR[n].usage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Topic>

            <Topic id="type" title="Typography" summary="Nunito for Latin, Yekan Bakh for Persian. Headings are heavy and rounded; running text stays at 500–600.">
              {TYPE_GROUPS.map((g) => (
                <div key={g.name} className="overflow-hidden rounded-2xl border-2 border-line">
                  <p className="eyebrow border-b-2 border-line bg-paper px-4 py-2 text-muted">{g.name}</p>
                  <div className="divide-y-2 divide-line">
                    {g.styles.map((s) => (
                      <div key={s.name} className="grid gap-2 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-baseline">
                        <div>
                          <p className="text-sm font-extrabold">{s.name}</p>
                          <p className="font-mono text-xs text-muted">
                            {s.fontSize} / {s.lineHeight} · {s.fontWeight}
                          </p>
                        </div>
                        <p
                          lang={g.family === "fa" ? "fa" : undefined}
                          dir={g.family === "fa" ? "rtl" : undefined}
                          className={cx("min-w-0 break-words", g.family !== "fa" && (s.name === "button" || s.name === "eyebrow") && "uppercase")}
                          style={{ fontSize: `min(${s.fontSize}, 9vw)`, lineHeight: s.lineHeight, fontWeight: s.fontWeight, letterSpacing: g.family === "fa" ? 0 : s.letterSpacing }}
                        >
                          {s.sample}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Topic>

            <Topic id="shape" title="Shape & depth" summary="No soft shadows. Depth is a solid edge in the fill's darker colour; pressing removes the edge and moves the element down by the same amount.">
              <Example label="Radius · tap a button to feel the depth" center>
                {RADIUS.map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <span className="size-16 border-2 border-firuze bg-firuze-soft" style={{ borderRadius: r.value === "9999px" ? "9999px" : r.value }} />
                    <span className="text-xs font-extrabold">{r.name}</span>
                    <span className="font-mono text-xs text-muted">{r.value}</span>
                  </div>
                ))}
                <button type="button" className="btn-primary">
                  4px edge
                </button>
                <button type="button" className="btn-secondary btn-sm">
                  3px edge
                </button>
                <span className="grid size-[72px] place-items-center rounded-full bg-saffron text-on-accent shadow-[0_6px_0_var(--color-saffron-shadow)]">
                  <Check className="size-8" strokeWidth={4} />
                </span>
              </Example>
            </Topic>

            <Topic id="spacing" title="Spacing & size" summary="A 4px scale. Gutter 16px on phones, 24px between sections; hit targets at least 44px.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card min-w-0 space-y-2 p-4">
                  {SPACING.map((s) => (
                    <div key={s.name} className="grid grid-cols-[72px_1fr_44px] items-center gap-3 text-xs">
                      <span className="font-extrabold">{s.name}</span>
                      <span className="h-3 rounded-full bg-sky" style={{ width: s.value }} />
                      <span className="font-mono text-muted">{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="card min-w-0 divide-y-2 divide-line">
                  {SIZES.map((s) => (
                    <div key={s.name} className="flex items-baseline justify-between gap-3 px-4 py-2 text-xs">
                      <span className="font-extrabold">{s.name}</span>
                      <span className="flex-1 truncate text-muted">{s.usage}</span>
                      <span className="font-mono font-bold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Topic>

            <Topic id="motion" title="Motion" summary="Short and springy: get to the payoff fast. All of it switches off under reduced motion.">
              <Example label="Play each one" center>
                {[
                  ["animate-pop", "Pop · 250ms", "Icons and results arriving"],
                  ["animate-shake", "Shake · 350ms", "A wrong answer"],
                  ["animate-slide-up", "Slide up · 220ms", "The feedback sheet"],
                ].map(([cls, label, use]) => (
                  <div key={cls} className="flex w-44 flex-col items-center gap-3 text-center">
                    <span key={anim.cls === cls ? anim.n : 0} className={cx("grid size-14 place-items-center rounded-2xl bg-firuze text-on-accent shadow-[0_4px_0_var(--color-firuze-shadow)]", anim.cls === cls && cls)}>
                      <Star className="size-6" />
                    </span>
                    <button type="button" className="btn-secondary btn-sm" onClick={() => play(cls)}>
                      {label}
                    </button>
                    <span className="text-xs font-semibold text-muted">{use}</span>
                  </div>
                ))}
              </Example>
              <p className="text-sm font-semibold text-muted">Press 100ms · progress bars ease over 500ms · the START bubble bobs on a 1.6s loop.</p>
            </Topic>

            <Topic id="bidi" title="Persian & right-to-left" summary="The app's layout reads left to right; Persian inside it reads right to left. Wrap every Persian string in <Fa> so it gets the language, direction and font.">
              <div className="grid gap-4 md:grid-cols-2">
                <Example label="Mixed text">
                  <p className="text-lg font-semibold">
                    The word <Fa className="text-xl font-bold">کتاب</Fa> (ketâb) means book.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-muted">
                    Persian digits come from the font: <Fa className="text-base font-bold text-ink">درس 12 از 36</Fa>
                  </p>
                </Example>
                <Example label="What mirrors">
                  <div className="space-y-3 text-sm font-semibold">
                    <p className="flex items-center gap-2">
                      <ArrowLeft className="size-5" /> Back in an English screen
                    </p>
                    <p dir="rtl" className="flex items-center gap-2">
                      <ArrowRight className="size-5" /> <Fa>بازگشت</Fa> in a Persian screen: arrows flip
                    </p>
                    <p className="flex items-center gap-2">
                      <Play className="size-5" /> Play, audio and time never flip
                    </p>
                  </div>
                </Example>
              </div>
              <DoDont
                doItem={<Fa className="text-4xl font-bold">سلام</Fa>}
                dont={
                  // ZWNJs force the letters apart: what tracking does to joined script in browsers that apply it.
                  <Fa className="text-4xl font-bold tracking-[0.3em]">{"س‌ل‌ا‌م"}</Fa>
                }
                doNote="Set Persian with <Fa>: letters join, no tracking, no uppercase, dotted style in running text."
                dontNote="Tracking pulls the letters out of their joined forms and the word stops reading as one word. Eyebrow and button styles must never reach Persian."
              />
            </Topic>

            <Topic id="voice" title="Voice & tone" summary="Second person, short and warm. One exclamation mark at most. Buttons are verbs.">
              <DoDont
                doItem={<p className="text-lg font-extrabold text-pista-ink">Almost! Watch the spelling.</p>}
                dont={<p className="text-lg font-extrabold text-anar-ink">Incorrect answer. Try harder!!</p>}
                doNote="Kind, specific, and tells the learner what to do next."
                dontNote="Scolding, vague and shouty. Learners quit apps that make them feel bad."
              />
              <DoDont
                doItem={
                  <button type="button" className="btn-primary">
                    Start mission
                  </button>
                }
                dont={
                  <button type="button" className="btn-primary">
                    Mission
                  </button>
                }
                doNote="A verb plus the thing: the button says what will happen."
                dontNote="A noun on its own leaves people guessing."
              />
            </Topic>
          </Group>

          {/* ── Components ───────────────────────────────────────── */}
          <Group id="components" eyebrow="Components" title="The pieces screens are built from" intro="Each entry: a live example, when to use it, a Do / Don't, its accessibility contract and the tokens it reads.">
            <Topic id="button" title="Button" summary="A solid fill on a darker edge that sinks when pressed. One primary per screen.">
              <Example label="Variants · press them">
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" className="btn-primary">Continue</button>
                  <button type="button" className="btn-secondary">Skip</button>
                  <button type="button" className="btn-ghost">Back</button>
                  <button type="button" className="btn-primary" disabled>Check</button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button type="button" className="btn-success">Continue</button>
                  <button type="button" className="btn-danger">Got it</button>
                  <button type="button" className="btn-sky btn-sm">Listen</button>
                  <button type="button" className="btn-plum btn-sm">Start exercises</button>
                  <button type="button" className="btn-sky btn-icon !size-14 !rounded-2xl" aria-label="Play audio">
                    <Volume2 className="size-7" />
                  </button>
                  <button type="button" className="btn-ghost btn-icon" aria-label="Close">
                    <X className="size-6" strokeWidth={3} />
                  </button>
                </div>
              </Example>
              <UseWhen
                use={["Primary: the one main action (Start, Check, Continue)", "Secondary: the alternative next to it", "Ghost: back, close and icon actions", "Success / Danger: Continue in the feedback sheet only"]}
                avoid={["Navigation between pages (use a link or tile)", "Two primaries on one screen", "Colours or shadows invented per screen"]}
              />
              <DoDont
                doItem={
                  <div className="flex w-full max-w-xs flex-col gap-2">
                    <button type="button" className="btn-primary w-full">Start</button>
                    <button type="button" className="btn-secondary w-full">Skip to quiz</button>
                  </div>
                }
                dont={
                  <div className="flex w-full max-w-xs flex-col gap-2">
                    <button type="button" className="btn-primary w-full">Start</button>
                    <button type="button" className="btn-sky w-full">Skip to quiz</button>
                  </div>
                }
                doNote="One primary, one quiet alternative."
                dontNote="Two loud buttons compete; the learner has to stop and think."
              />
              <Spec
                a11y={["At least 48px tall (44px minimum hit area); icon-only buttons need an aria-label", "Disabled until the action is valid, with a muted (readable) label", "Don't autofocus on page load: the focus ring then reads as “selected”"]}
                uses={["firuze", "firuze-shadow", "on-accent", "line", "muted", "sky"]}
                source="src/app/globals.css · btn*"
              />
            </Topic>

            <Topic id="tile" title="Tile" summary="A bordered surface with a 4px bottom edge, for anything tapped that isn't a button.">
              <Example>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" className="tile p-4 text-left font-bold"><span className="mr-3 text-muted">1</span>hello</button>
                  <button type="button" className="tile p-4 text-left font-bold" data-state="selected"><span className="mr-3">2</span>thank you</button>
                  <div className="tile flex items-center gap-2 p-4 font-bold" data-state="correct"><Check className="size-5" strokeWidth={3} /> goodbye</div>
                  <div className="tile flex items-center gap-2 p-4 font-bold" data-state="wrong"><X className="size-5" strokeWidth={3} /> please</div>
                </div>
              </Example>
              <DoDont
                doItem={<div className="tile flex items-center gap-2 p-4 font-bold" data-state="wrong"><X className="size-5" strokeWidth={3} /> please</div>}
                dont={<div className="tile p-4 font-bold" data-state="wrong">please</div>}
                doNote="State shown with colour, an icon and the sheet's words."
                dontNote="Colour alone fails colour-blind learners."
              />
              <Spec a11y={["Number keys 1–4 (and A–D) pick options; show the number on the tile", "Selected state uses aria-pressed or a radio role"]} uses={["line", "paper", "sky", "sky-soft", "pista-soft", "anar-soft"]} source="src/app/globals.css · tile" />
            </Topic>

            <Topic id="chip" title="Chip" summary="Small pill labels for register, level and status. Not tappable.">
              <Example center>
                <span className="chip bg-saffron-soft text-saffron-ink">Spoken</span>
                <span className="chip bg-plum-soft text-plum-ink">Formal</span>
                <span className="chip bg-saffron-soft text-saffron-ink">NEW</span>
                <span className="chip bg-firuze-soft text-firuze-ink">A1</span>
                <span className="chip bg-paper text-muted">Not tried</span>
              </Example>
              <Spec a11y={["Text is the -ink of the tone on its -soft (4.6:1 or more)", "Never the only way to tell states apart"]} uses={["saffron-soft", "saffron-ink", "plum-soft", "plum-ink"]} source="src/app/globals.css · chip" />
            </Topic>

            <Topic id="input" title="Input" summary="Paper fill, field-edge border that turns sky on focus. Persian answers get lang and dir.">
              <Example>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="input" placeholder="Type in English" aria-label="Example answer" />
                  <input className="input" lang="fa" dir="rtl" defaultValue="سلام" aria-label="Example Persian answer" />
                </div>
              </Example>
              <Spec a11y={["Border is field-edge: 3:1 or better on card in both themes", "Placeholder says what to type; never the only label"]} uses={["paper", "field-edge", "sky", "faint"]} source="src/app/globals.css · input" />
            </Topic>

            <Topic id="segmented" title="Segmented control" summary="Switch between two to four options in place.">
              <Example center>
                <Segmented label="Daily goal" value="10" onChange={() => {}} options={[{ value: "5", label: "5 words" }, { value: "10", label: "10 words" }, { value: "20", label: "20 words" }]} />
                <Segmented label="Script" value="fa" onChange={() => {}} options={[{ value: "la", label: "Latin first" }, { value: "fa", label: "Farsi first" }, { value: "so", label: "Script only" }]} />
              </Example>
              <Spec a11y={["radiogroup with a label; each option a radio, at least 40px tall"]} uses={["paper", "card", "sky-ink", "line"]} source="src/components/ui.tsx · Segmented" />
            </Topic>

            <Topic id="progress" title="Progress bar" summary="Thick rounded bar with a sheen. Session progress, daily goal, small meters.">
              <Example>
                <div className="space-y-3">
                  <ProgressBar value={0.6} />
                  <ProgressBar value={0.35} tone="saffron" />
                  <ProgressBar value={0.8} tone="sky" size="sm" />
                </div>
              </Example>
              <Spec a11y={["role=progressbar with aria-valuenow", "A non-zero value always shows a visible nub"]} uses={["line", "firuze", "saffron", "sky"]} source="src/components/ui.tsx · ProgressBar" />
            </Topic>

            <Topic id="feedback" title="Feedback sheet" summary="The bottom of every session: Check while answering, then a green or red sheet with one Continue.">
              <div className="overflow-hidden rounded-2xl border-2 border-line">
                <div className="border-b-2 border-line bg-card p-5">
                  <button type="button" className="btn-primary btn-lg w-full" disabled>
                    Check
                  </button>
                </div>
                <div className="flex flex-col gap-4 bg-pista-soft p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 text-pista-ink">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><CheckCircle2 className="size-8" /></span>
                    <div><p className="text-xl font-extrabold">Nicely done!</p><p className="text-sm font-semibold">salâm means hello</p></div>
                  </div>
                  <button type="button" className="btn-success btn-lg">Continue</button>
                </div>
                <div className="flex flex-col gap-4 bg-anar-soft p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 text-anar-ink">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card"><XCircle className="size-8" /></span>
                    <div><p className="text-xl font-extrabold">Not quite</p><p className="text-sm font-semibold">Correct answer: merci. We&apos;ll come back to it.</p></div>
                  </div>
                  <button type="button" className="btn-danger btn-lg">Got it</button>
                </div>
              </div>
              <Spec a11y={["role=status so screen readers hear the result", "Continue takes focus so Enter moves on (the one place autofocus belongs)"]} uses={["pista-soft", "pista-ink", "anar-soft", "anar-ink"]} source="src/components/ui.tsx · FeedbackSheet" />
            </Topic>

            <Topic id="stat" title="Stat card" summary="Result tiles after a session: a coloured label strip over the value.">
              <Example center>
                <StatCard label="Total XP" value="26" tone="saffron" icon={<Star className="size-5" />} />
                <StatCard label="Accuracy" value="92%" tone="pista" />
                <StatCard label="Words" value="8" tone="sky" />
              </Example>
              <Spec
                a11y={[
                  `Light theme gap: the strip label on saffron is ${pair("on-accent", "saffron", "light").toFixed(1)}:1 (fails). Dark passes at ${pair("on-accent", "saffron", "dark").toFixed(1)}:1. Fix before launch.`,
                ]}
                uses={["saffron", "on-accent", "card", "saffron-ink"]}
                source="src/components/ui.tsx · StatCard"
              />
            </Topic>

            <Topic id="path" title="Path node" summary="72px lesson nodes with a 6px edge, in a gentle zig-zag. Done, current (ringed, with a bobbing bubble) and locked.">
              <Example>
                <div className="flex justify-around gap-4 pt-12">
                  <div className="flex w-20 flex-col items-center gap-3 text-center">
                    <span className="grid size-[72px] place-items-center rounded-full bg-saffron text-on-accent shadow-[0_6px_0_var(--color-saffron-shadow)]"><Check className="size-9" strokeWidth={4} /></span>
                    <span className="text-sm font-extrabold">Courtesy</span>
                  </div>
                  <div className="flex w-20 flex-col items-center gap-3 text-center">
                    <span className="relative block size-[72px]">
                      <span className="absolute bottom-full left-1/2 mb-5 animate-bob whitespace-nowrap"><Bubble>Start</Bubble></span>
                      <span className="absolute -left-2.5 -top-[7px] size-[92px] rounded-full border-[6px] border-firuze-soft" aria-hidden />
                      <span className="relative grid size-[72px] place-items-center rounded-full bg-firuze text-3xl shadow-[0_6px_0_var(--color-firuze-shadow)]">👋</span>
                    </span>
                    <span className="text-sm font-extrabold">Greetings</span>
                  </div>
                  <div className="flex w-20 flex-col items-center gap-3 text-center">
                    <span className="grid size-[72px] place-items-center rounded-full bg-line text-faint shadow-[0_6px_0_var(--color-line-strong)]"><Lock className="size-7" strokeWidth={3} /></span>
                    <span className="text-sm font-extrabold text-muted">Family</span>
                  </div>
                </div>
              </Example>
              <Spec a11y={["Each node is a link with a full label (“3. Family: not started, you can still open it”)", "Locked nodes still open"]} uses={["saffron", "firuze", "firuze-soft", "line", "faint"]} source="src/app/app/lessons/page.tsx" />
            </Topic>

            <Topic id="word" title="Word card" summary="One word: script order from the learner's setting, sound hint, meaning, example and actions.">
              <div className="max-w-md">{word && <WordCard word={word} isNew />}</div>
              <Spec a11y={["Every icon button is labelled", "Persian through <Fa>; transliteration hidden in script-only mode"]} uses={["card", "paper", "sky-ink", "saffron-soft"]} source="src/components/WordCard.tsx" />
            </Topic>

            <Topic id="nav" title="Navigation" summary="Five labelled tabs on phones, a sidebar on desktop. Proposed: one job per tab, replacing today's ten-item More sheet.">
              <div className="grid gap-4 md:grid-cols-2">
                <Example label="Today on dev">
                  <TabRow tabs={[["Home", House], ["Lessons", Layers], ["Missions", Compass], ["Words", Bookmark], ["More", Menu]]} />
                </Example>
                <Example label="Proposed">
                  <TabRow tabs={[["Today", House], ["Learn", Layers], ["Speak", Mic], ["Review", Bookmark], ["Me", Flame]]} />
                </Example>
              </div>
              <Example label="Brand mark" center>
                <LogoMark />
                <Logo />
              </Example>
            </Topic>
          </Group>

          {/* ── Patterns ─────────────────────────────────────────── */}
          <Group id="patterns" eyebrow="Patterns" title="How the pieces combine" intro="Screen-level recipes, annotated part by part.">
            <Topic id="session" title="Session screen" summary="Lessons, practice, grammar and missions all share this layout. No app navigation while it's open.">
              <div className="grid items-start gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
                <div className="overflow-hidden rounded-[28px] border-2 border-line bg-card">
                  <div className="flex items-center gap-3 border-b-2 border-line p-3">
                    <Marker n={1} />
                    <X className="size-5 text-muted" strokeWidth={3} />
                    <ProgressBar value={0.4} className="flex-1" size="sm" />
                    <span className="text-xs font-extrabold text-muted">3/8</span>
                  </div>
                  <div className="space-y-4 p-4">
                    <p className="flex items-center gap-2 text-lg font-extrabold"><Marker n={2} />Select the correct meaning</p>
                    <div className="flex flex-col items-center gap-1 py-2"><Marker n={3} /><span className="text-2xl font-extrabold">salâm</span><Fa className="text-xl text-muted">سلام</Fa></div>
                    <div className="space-y-2">
                      <div className="flex justify-center"><Marker n={4} /></div>
                      <div className="tile p-3 text-sm font-bold">1&nbsp; hello</div>
                      <div className="tile p-3 text-sm font-bold" data-state="selected">2&nbsp; thank you</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t-2 border-line p-3">
                    <Marker n={5} />
                    <button type="button" className="btn-primary btn-sm flex-1">Check</button>
                  </div>
                </div>
                <ol className="space-y-3">
                  {[
                    ["Session header", "Close, progress bar and counter. Mounting it hides the app navigation."],
                    ["Instruction", "One line in the prompt style that says what to do."],
                    ["Prompt", "The word in the learner's script order, or the big sky speaker for listening."],
                    ["Answer area", "Numbered option tiles, a typed input with the Persian keyboard, or the mic."],
                    ["Feedback sheet", "Check stays disabled until there's an answer, then turns green or red with Continue."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-3">
                      <Marker n={i + 1} />
                      <div><p className="font-extrabold">{t}</p><p className="text-sm font-semibold text-muted">{d}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            </Topic>

            <Topic id="empty" title="Empty state" summary="A round tinted icon, one title, one sentence saying how to fill it, one button.">
              <Example center>
                <div className="flex max-w-xs flex-col items-center gap-3 py-4 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-saffron-soft text-saffron-ink"><Bookmark className="size-7" /></span>
                  <p className="text-xl font-extrabold">No cards saved yet</p>
                  <p className="text-sm font-semibold text-muted">Tap the bookmark on any word to collect it here.</p>
                  <button type="button" className="btn-secondary">Go to flashcards</button>
                </div>
              </Example>
            </Topic>
          </Group>

          {/* ── Accessibility ────────────────────────────────────── */}
          <Group id="accessibility" eyebrow="Accessibility" title="Readable by everyone, in both themes" intro="Ratios below are computed from the token values, so this report updates when a colour changes.">
            <Topic id="contrast" title="Contrast report" summary="WCAG 2: 4.5:1 for text, 3:1 for large text, borders and icons.">
              <div className="overflow-x-auto rounded-2xl border-2 border-line">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-paper">
                    <tr className="eyebrow text-muted">
                      <th className="px-4 py-2">Pair</th>
                      <th className="px-4 py-2">Dark (default)</th>
                      <th className="px-4 py-2">Light</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-line">
                    {[
                      ["ink", "card", false],
                      ["muted", "card", false],
                      ["field-edge", "card", true],
                      ...HUES.map((h) => [`${h}-ink`, `${h}-soft`, false] as const),
                      ...HUES.map((h) => ["on-accent", h, false] as const),
                    ].map(([fg, bg, large]) => (
                      <tr key={`${fg}-${bg}`}>
                        <td className="px-4 py-2 font-bold">
                          <span className="inline-flex items-center gap-2">
                            <span className="grid h-7 w-10 place-items-center rounded-lg text-xs font-extrabold" style={{ background: v(bg as string), color: v(fg as string) }}>
                              Aa
                            </span>
                            {fg} on {bg}
                          </span>
                        </td>
                        {(["dark", "light"] as ThemeId[]).map((t) => (
                          <td key={t} className="px-4 py-2">
                            <RatioBadge ratio={pair(fg as string, bg as string, t)} large={large as boolean} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm font-semibold text-muted">
                Known gap: white labels on fills in Light (and 2.0:1 on saffron). Dark passes everywhere. The fix is tracked in docs/ui-kit/Review-checklist.md.
              </p>
            </Topic>
            <Topic id="checklist" title="Review checklist" summary="Run it on every pull request that touches UI.">
              <ol className="grid gap-2 sm:grid-cols-2">
                {[
                  "Built from these components and tokens; nothing invented",
                  "One primary button, disabled until valid",
                  "Sessions use the session header and feedback sheet",
                  "All Persian through <Fa>; script setting respected",
                  "Empty, loading, success, error and disabled states",
                  "Works at 320px with no sideways scrolling",
                  "Checked in Dark and Light",
                  "Icon-only buttons labelled; targets 44px or more",
                  "No autofocus on page load",
                  "No other product's brand assets",
                ].map((c, i) => (
                  <li key={c} className="card flex items-start gap-3 p-3 text-sm font-semibold">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-firuze-soft text-xs font-extrabold text-firuze-ink">{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ol>
            </Topic>
          </Group>

          <footer className="border-t-2 border-line pt-6 text-sm font-semibold text-muted">
            Farsi Pen design system · built from {SOURCE.repo} {SOURCE.ref} · {COLORS.length} colour tokens · written specs in docs/ui-kit/
          </footer>
        </main>
      </div>
    </div>
  );
}

function Marker({ n }: { n: number }) {
  return <span className="grid size-6 shrink-0 place-items-center rounded-full bg-anar text-xs font-extrabold text-on-accent">{n}</span>;
}

function TabRow({ tabs }: { tabs: [string, typeof House][] }) {
  return (
    <div className="flex justify-around gap-0.5 rounded-2xl border-2 border-line bg-card px-1 py-1.5">
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
