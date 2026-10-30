import Link from "next/link";
import { BookOpen, Check, Keyboard, PenLine, Puzzle, Repeat, SpellCheck, Star } from "lucide-react";
import { Logo } from "@/components/AppNav";
import { Bubble, Fa } from "@/components/ui";
import { LESSONS } from "@/content/lessons";
import { WORDS } from "@/content/words";

// Literal tone classes (same values as TONE in ui.tsx): this is a server
// component, and a plain object exported from a "use client" module can't be read here.
const FEATURES = [
  { icon: BookOpen, tone: "bg-firuze-soft text-firuze-ink", title: "Bite-size lessons", text: "Preview, study, then two quiz rounds: pick the answer, then type it from memory." },
  { icon: Repeat, tone: "bg-sky-soft text-sky-ink", title: "Spaced repetition", text: "Daily Practice brings back each word right before you'd forget it (FSRS)." },
  { icon: PenLine, tone: "bg-saffron-soft text-saffron-ink", title: "Write the letters", text: "Trace all 32 letters in every form — the “pen” in Farsi Pen." },
  { icon: SpellCheck, tone: "bg-pista-soft text-pista-ink", title: "Forgiving grading", text: "“good nite” counts. Small typos get a spelling tip, not a red cross." },
  { icon: Keyboard, tone: "bg-anar-soft text-anar-ink", title: "Built-in Persian keyboard", text: "Type in Farsi script without changing your phone or computer settings." },
  { icon: Puzzle, tone: "bg-plum-soft text-plum-ink", title: "Grammar that clicks", text: "Short explanations, tables and exercises with hints." },
];

const LETTER_STRIP = "ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی".split(" ");

const QUIZ_OPTIONS = ["hello", "goodbye", "thank you", "please"];

/** Decorative hero: a stack of the app's own UI (quiz card, path node, XP chip). */
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm pb-6 pt-12 sm:pt-14" aria-hidden>
      <div className="card relative rotate-1 p-5">
        <div className="pe-16">
          <p className="eyebrow text-muted">Lesson 1 · Greetings</p>
          <p className="mt-2 text-xl font-extrabold">Select the correct meaning</p>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <Fa className="text-4xl font-bold leading-relaxed">سلام</Fa>
          <span className="font-semibold text-muted">salâm</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {QUIZ_OPTIONS.map((o, i) => (
            <div key={o} className="tile flex items-center gap-2 px-3 py-2.5 text-sm font-bold" data-state={i === 0 ? "correct" : undefined}>
              <span className="grid size-6 shrink-0 place-items-center rounded-lg border-2 border-current text-xs font-extrabold opacity-70">
                {i === 0 ? <Check className="size-3.5" strokeWidth={4} /> : i + 1}
              </span>
              {o}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-1 top-0 flex rotate-6 flex-col items-center sm:-right-6">
        <Bubble>Start</Bubble>
        <span className="mt-3 grid size-16 place-items-center rounded-full bg-firuze text-3xl shadow-[0_6px_0_var(--color-firuze-shadow)]">👋</span>
      </div>

      <span className="absolute -left-2 bottom-0 flex -rotate-6 items-center gap-1 rounded-2xl border-2 border-saffron bg-saffron-soft px-3 py-1.5 text-base font-extrabold text-saffron-ink sm:-left-6">
        <Star className="size-5 fill-saffron text-saffron-shadow" /> +2 XP
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh bg-card">
      <header className="border-b-2 border-line">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Logo />
          <Link href="/app/" className="btn-secondary btn-sm">
            Open app
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div>
          <span className="chip bg-saffron-soft text-saffron-ink">MVP demo · free · no sign-up</span>
          <h1 className="mt-4 text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
            Learn to read, write and speak <span className="text-firuze-ink">Farsi</span>.
          </h1>
          <p className="mt-5 max-w-lg text-lg font-semibold text-muted">
            Five-minute lessons, smart review, and a pen for practising the alphabet. Everyday spoken Persian, with formal forms clearly labelled.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/app/lessons/greetings/" className="btn-primary btn-lg">
              Get started
            </Link>
            <Link href="/app/" className="btn-secondary btn-lg">
              I already have progress
            </Link>
          </div>
        </div>
        <HeroVisual />
      </section>

      <div className="overflow-hidden border-y-2 border-line bg-paper py-3" aria-hidden>
        <p lang="fa" dir="rtl" className="whitespace-nowrap text-center text-2xl tracking-[0.5em] text-firuze-ink/60">
          {LETTER_STRIP.join(" ")}
        </p>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight">What’s in the demo</h2>
        <p className="mt-2 font-semibold text-muted">
          {LESSONS.length} lessons and {WORDS.length} words from Level 1, the full alphabet, and the first grammar concepts — all written for Farsi Pen.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <span className={`grid size-12 place-items-center rounded-full ${f.tone}`}>
                <f.icon className="size-6" strokeWidth={2.5} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{f.title}</h3>
              <p className="mt-1 text-sm font-semibold text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-firuze p-8 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold">Ready for your first word?</h2>
            <p className="mt-1 text-base font-bold">Progress is saved in your browser. Install it to your home screen to use it like an app.</p>
          </div>
          <Link href="/app/" className="btn-secondary btn-lg w-full shrink-0 md:w-auto">
            Start learning
          </Link>
        </div>
      </section>

      <footer className="border-t-2 border-line py-6 text-center text-sm font-semibold text-muted">Farsi Pen · MVP demo · Content drafted for native-speaker review</footer>
    </div>
  );
}
