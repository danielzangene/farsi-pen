"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Volume2 } from "lucide-react";
import { advice, buildRound, levelFrom, PASS, ROUNDS, type PlacementItem } from "@/lib/placement";
import { speak } from "@/lib/speech";
import { savePlacement, useHydrated, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { Fa, SessionHeader } from "@/components/ui";

const LEVEL_NAME = { A0: "Beginner", A1: "A1 · Basic", A2: "A2 · Elementary", B1: "B1 · Intermediate", B2: "B2 · Upper intermediate" } as const;

export default function PlacementPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [phase, setPhase] = useState<"intro" | "test" | "done">("intro");
  const [round, setRound] = useState(0);
  const [items, setItems] = useState<PlacementItem[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const [passed, setPassed] = useState<(typeof ROUNDS)[number][]>([]);
  const [totals, setTotals] = useState({ correct: 0, total: 0 });
  const [xp, setXp] = useState(0);

  const item = items[i];
  useEffect(() => {
    if (phase === "test" && item?.kind === "listen" && item.fa) void speak(item.fa);
  }, [phase, item]);

  if (!hydrated) return null;

  const start = () => {
    setRound(0);
    setItems(buildRound(ROUNDS[0]));
    setI(0);
    setRight(0);
    setPassed([]);
    setTotals({ correct: 0, total: 0 });
    setPicked(null);
    setPhase("test");
  };

  const next = () => {
    if (!item || picked === null) return;
    const ok = picked === item.answer;
    const r = right + (ok ? 1 : 0);
    const t = { correct: totals.correct + (ok ? 1 : 0), total: totals.total + 1 };
    setTotals(t);
    setPicked(null);
    if (i + 1 < items.length) {
      setRight(r);
      setI(i + 1);
      return;
    }
    // End of a round: move up, or finish.
    const level = ROUNDS[round];
    const nowPassed = r >= PASS ? [...passed, level] : passed;
    setPassed(nowPassed);
    if (r >= PASS && round + 1 < ROUNDS.length) {
      setRound(round + 1);
      setItems(buildRound(ROUNDS[round + 1]));
      setI(0);
      setRight(0);
    } else {
      setXp(savePlacement(levelFrom(nowPassed), t.correct, t.total));
      setPhase("done");
    }
  };

  if (phase === "intro")
    return (
      <div className="mx-auto max-w-xl pt-4 sm:pt-10">
        <h1 className="text-3xl font-extrabold">Find your level</h1>
        <p className="mt-3 font-semibold text-muted">
          A few short rounds of words, grammar and listening, from A1 up to B2. Each round is five questions; get four right and you move up. It takes three to six minutes, and you can't fail.
        </p>
        {s.placement && (
          <p className="mt-4 rounded-2xl bg-paper p-4 font-semibold">
            Last time you placed at <strong className="font-extrabold">{LEVEL_NAME[s.placement.level]}</strong>. Taking it again replaces that.
          </p>
        )}
        <ul className="mt-6 space-y-2 font-semibold">
          <li>• Turn your sound on: some questions are listening.</li>
          <li>• Guessing is fine, but &quot;I don&apos;t know&quot; is better than a wild guess.</li>
          <li>• Lessons below your level become optional, so Today starts where you are.</li>
        </ul>
        <button type="button" className="btn-primary btn-lg mt-8 w-full" onClick={start}>
          Start the test
        </button>
        <Link href="/app/" className="btn-ghost mt-3 w-full">
          Not now
        </Link>
      </div>
    );

  if (phase === "done") {
    const level = levelFrom(passed);
    const a = advice(level);
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center pt-6 text-center sm:pt-12">
        <p className="text-sm font-extrabold text-muted">Your level</p>
        <p className="mt-1 text-6xl font-extrabold text-firuze-ink">{level === "A0" ? "A0" : level}</p>
        <p className="mt-1 text-lg font-bold">{LEVEL_NAME[level]}</p>
        <p className="mt-2 text-sm font-semibold text-muted">
          {totals.correct} of {totals.total} right · +{xp} XP
        </p>
        <div className="card mt-6 w-full p-5 text-start">
          <h2 className="text-xl font-extrabold">{a.title}</h2>
          <p className="mt-1 font-semibold text-muted">{a.text}</p>
        </div>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <Link href={a.href} className="btn-primary btn-lg" autoFocus>
            {a.cta}
          </Link>
          <Link href="/app/" className="btn-secondary btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const progress = (round * 5 + i) / (ROUNDS.length * 5);
  return (
    <div>
      <SessionHeader exitHref="/app/" progress={progress} right={<span className="eyebrow text-muted">{ROUNDS[round]}</span>} />
      <h1 className="text-2xl font-extrabold">{item.prompt}</h1>
      <div className="mt-8 flex justify-center">
        {item.kind === "word" && <Fa className="text-5xl font-bold">{item.fa}</Fa>}
        {item.kind === "listen" && (
          <button type="button" className="btn-sky btn-icon !size-20 !rounded-2xl" onClick={() => item.fa && void speak(item.fa)} aria-label="Play again">
            <Volume2 className="size-9" />
          </button>
        )}
      </div>
      <div className="mx-auto mt-8 grid max-w-xl gap-3">
        {[...item.options, "I don't know"].map((o) => (
          <button
            key={o}
            type="button"
            className={cx("tile p-4 text-start font-bold", o === "I don't know" && "text-muted")}
            data-state={picked === o ? "selected" : undefined}
            aria-pressed={picked === o}
            onClick={() => setPicked(o)}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="h-32" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-3xl justify-end px-4 py-4">
          <button type="button" className="btn-primary btn-lg w-full sm:w-auto sm:min-w-44" disabled={picked === null} onClick={next}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
