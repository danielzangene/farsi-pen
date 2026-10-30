import Link from "next/link";
import { ArrowRight, BookOpen, Keyboard, PenLine, Puzzle, Repeat, SpellCheck } from "lucide-react";
import { Logo } from "@/components/AppNav";
import { LESSONS } from "@/content/lessons";
import { WORDS } from "@/content/words";

const FEATURES = [
  { icon: BookOpen, title: "Bite-size lessons", text: "Preview, study, then two quiz rounds: pick the answer, then type it from memory." },
  { icon: Repeat, title: "Spaced repetition", text: "Daily Practice brings back each word right before you'd forget it (FSRS)." },
  { icon: PenLine, title: "Write the letters", text: "Trace all 32 letters in every form — the “pen” in Farsi Pen." },
  { icon: SpellCheck, title: "Forgiving grading", text: "“good nite” counts. Small typos get a spelling tip, not a red cross." },
  { icon: Keyboard, title: "Built-in Persian keyboard", text: "Type in Farsi script without changing your phone or computer settings." },
  { icon: Puzzle, title: "Grammar that clicks", text: "Short explanations, tables and exercises with hints." },
];

const LETTER_STRIP = "ا ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن و ه ی".split(" ");

export default function Home() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Logo />
        <Link href="/app/" className="btn-primary !py-2">
          Open app
        </Link>
      </header>

      <section className="tile-bg">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <span className="chip bg-saffron-soft text-saffron">MVP demo · free · no sign-up</span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Learn to read, write and speak <span className="text-firuze">Farsi</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Five-minute lessons, smart review, and a pen for practising the alphabet. Everyday spoken Persian, with formal forms clearly labelled.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app/lessons/greetings/" className="btn-primary !px-6 !py-3 !text-base">
                Start lesson 1 <ArrowRight className="size-5" />
              </Link>
              <Link href="/app/alphabet/" className="btn-secondary !px-6 !py-3 !text-base">
                Trace the alphabet
              </Link>
            </div>
          </div>
          <div className="card relative mx-auto w-full max-w-sm rotate-1 p-6 shadow-[0_20px_50px_-20px_rgb(28_36_51_/_0.35)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Lesson 1 · Greetings</p>
            <p className="mt-6 text-center font-display text-4xl font-semibold">salâm</p>
            <p lang="fa" dir="rtl" className="mt-1 text-center text-3xl text-muted">
              سلام
            </p>
            <p className="mt-2 text-center text-sm text-muted">sounds like “sa-LAAM”</p>
            <div className="mt-6 rounded-xl bg-paper p-3 text-center">
              <p className="font-semibold">hello</p>
              <p lang="fa" dir="rtl" className="mt-1">
                سلام، حالت چطوره؟
              </p>
              <p className="text-sm text-muted">Hello, how are you?</p>
            </div>
            <span className="chip absolute -left-3 -top-3 -rotate-6 bg-firuze px-3 py-1 text-white shadow">+2 XP</span>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-line bg-card py-3" aria-hidden>
        <p lang="fa" dir="rtl" className="whitespace-nowrap text-center text-2xl tracking-[0.5em] text-firuze/70">
          {LETTER_STRIP.join(" ")}
        </p>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-display text-3xl font-semibold">What’s in the demo</h2>
        <p className="mt-2 text-muted">
          {LESSONS.length} lessons and {WORDS.length} words from Level 1, the full alphabet, and the first grammar concepts — all written for Farsi Pen.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <f.icon className="size-6 text-firuze" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="card flex flex-col items-start justify-between gap-4 bg-firuze p-8 text-white md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold">Ready for your first word?</h2>
            <p className="mt-1 text-white/80">Progress is saved in your browser. Install it to your home screen to use it like an app.</p>
          </div>
          <Link href="/app/" className="btn bg-white !px-6 !py-3 text-firuze hover:bg-paper">
            Start learning <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        Farsi Pen · MVP demo · Content drafted for native-speaker review
      </footer>
    </div>
  );
}
