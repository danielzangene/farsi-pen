import Link from "next/link";
import {
  BookOpen,
  Check,
  Compass,
  Layers,
  Mic,
  MonitorPlay,
  PenLine,
  Puzzle,
  SpellCheck,
  Star,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/AppNav";
import { Bubble, Fa } from "@/components/ui";
import { LESSONS } from "@/content/lessons";
import { WORDS } from "@/content/words";
import { MISSIONS } from "@/content/missions";
import { GRAMMAR } from "@/content/grammar";

// Literal tone classes (same values as TONE in ui.tsx): this is a server
// component, and a plain object exported from a "use client" module can't be read here.
const FEATURES = [
  {
    icon: Compass,
    tone: "bg-firuze-soft text-firuze-ink",
    title: "Real-world missions",
    text: "Take a taxi, order at a café, bargain at the bazaar, handle ta'ârof — and finish each with something you can really do.",
  },
  {
    icon: Layers,
    tone: "bg-sky-soft text-sky-ink",
    title: "Smart flashcards",
    text: "See the word, guess, flip, hear it, see it in a sentence. Spaced repetition (FSRS) brings it back right before you'd forget.",
  },
  {
    icon: Mic,
    tone: "bg-anar-soft text-anar-ink",
    title: "Speak and get scored",
    text: "Say a word or answer a character out loud. Free speech recognition tells you how close it sounded.",
  },
  {
    icon: Puzzle,
    tone: "bg-plum-soft text-plum-ink",
    title: "Grammar A1 → B2",
    text: "A full course of short explanations, tables and exercises — or just the bit a situation needs.",
  },
  {
    icon: PenLine,
    tone: "bg-saffron-soft text-saffron-ink",
    title: "Write the letters",
    text: "Every letter plus آ and ء, vowel signs, and tracing in every form — the “pen” in Farsi Pen.",
  },
  {
    icon: BookOpen,
    tone: "bg-pista-soft text-pista-ink",
    title: "Bite-size lessons",
    text: "Preview, study, then two quiz rounds: pick the answer, then type it from memory.",
  },
  {
    icon: MonitorPlay,
    tone: "bg-sky-soft text-sky-ink",
    title: "Real people, real videos",
    text: "Hear any word in YouTube clips of native speakers, cued to the moment it's said.",
  },
  {
    icon: SpellCheck,
    tone: "bg-firuze-soft text-firuze-ink",
    title: "Finglish or فارسی",
    text: "Answer in transliteration, Persian script or by voice. Small typos get a tip, not a red cross.",
  },
  {
    icon: Star,
    tone: "bg-saffron-soft text-saffron-ink",
    title: "Progress that means something",
    text: "XP for skills you prove, not clicks. When you've mastered something, the app says so and moves on.",
  },
];

const LETTER_STRIP =
  "آ ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی".split(
    " ",
  );

const QUIZ_OPTIONS = ["hello", "goodbye", "thank you", "please"];

/** Decorative hero: a stack of the app's own UI (quiz card, path node, XP chip). */
function HeroVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-sm pb-6 pt-12 sm:pt-14"
      aria-hidden
    >
      <div className="card relative rotate-1 p-5">
        <div className="pe-16">
          <p className="eyebrow text-muted">Lesson 1 · Greetings</p>
          <p className="mt-2 text-xl font-extrabold">
            Select the correct meaning
          </p>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <Fa className="text-4xl font-bold leading-relaxed">سلام</Fa>
          <span className="font-semibold text-muted">salâm</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {QUIZ_OPTIONS.map((o, i) => (
            <div
              key={o}
              className="tile flex items-center gap-2 px-3 py-2.5 text-sm font-bold"
              data-state={i === 0 ? "correct" : undefined}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-lg border border-current text-xs font-extrabold opacity-70">
                {i === 0 ? (
                  <Check className="size-3.5" strokeWidth={4} />
                ) : (
                  i + 1
                )}
              </span>
              {o}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-1 top-0 flex rotate-6 flex-col items-center sm:-right-6">
        <Bubble>Start</Bubble>
        <span className="mt-3 grid size-16 place-items-center rounded-full bg-firuze text-3xl">
          👋
        </span>
      </div>

      <span className="absolute -left-2 bottom-0 flex -rotate-6 items-center gap-1 rounded-2xl border border-saffron bg-saffron-soft px-3 py-1.5 text-base font-extrabold text-saffron-ink sm:-left-6">
        <Star className="size-5 fill-saffron text-saffron-shadow" /> +2 XP
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh bg-card">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Logo />
          <Link href="/app/" className="btn-secondary btn-sm">
            Open app
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div>
            <span className="chip bg-saffron-soft text-saffron-ink">
              MVP demo · free · no sign-up
            </span>
            <h1 className="mt-4 text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Learn to read, write and speak{" "}
              <span className="text-firuze-ink">Farsi</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg font-semibold text-muted">
              Five-minute lessons, smart review, and a pen for practising the
              alphabet. Everyday spoken Persian, with formal forms clearly
              labelled.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/app/lessons/greetings/"
                className="btn-primary btn-lg"
              >
                Get started
              </Link>
              <Link href="/app/" className="btn-secondary btn-lg">
                I already have progress
              </Link>
            </div>
          </div>
          <HeroVisual />
        </section>

        <div
          className="overflow-hidden border-y border-line bg-paper py-3"
          aria-hidden
        >
          <p
            lang="fa"
            dir="rtl"
            className="whitespace-nowrap text-center text-2xl tracking-[0.5em] text-firuze-ink/60"
          >
            {LETTER_STRIP.join(" ")}
          </p>
        </div>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">
            What’s in the demo
          </h2>
          <p className="mt-2 font-semibold text-muted">
            {MISSIONS.length} real-world missions, {LESSONS.length} lessons and{" "}
            {WORDS.length} words, {GRAMMAR.length} grammar concepts from A1 to
            B2, and the full alphabet — all written for Farsi Pen.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-5">
                <span
                  className={`grid size-12 place-items-center rounded-full ${f.tone}`}
                >
                  <f.icon className="size-6" strokeWidth={2.5} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{f.title}</h3>
                <p className="mt-1 text-sm font-semibold text-muted">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-firuze p-8 text-on-accent md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold">
                Ready for your first word?
              </h2>
              <p className="mt-1 text-base font-bold">
                Progress is saved in your browser. Install it to your home
                screen to use it like an app.
              </p>
            </div>
            <Link
              href="/app/"
              className="btn btn-lg w-full shrink-0 [--btn-bg:rgb(0_0_0/0.2)] [--btn-fg:var(--color-on-accent)] md:w-auto"
            >
              Start learning
            </Link>
          </div>
        </section>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-line px-4 py-6 text-center text-sm font-semibold text-muted">
        <LogoMark className="size-7 rounded-lg" />
        Farsi Pen · free, no sign-up · Spotted a mistake? Every word and
        exercise has a report button.
      </footer>
    </div>
  );
}
