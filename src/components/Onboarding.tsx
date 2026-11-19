"use client";
import { useState } from "react";
import { updateSettings, type Goal, type Reads } from "@/lib/store";

const GOALS: { value: Goal; label: string; hint: string; emoji: string }[] = [
  { value: "travel", label: "Travel", hint: "Get around, order, shop", emoji: "🧳" },
  { value: "family", label: "Family & friends", hint: "Talk with people I love", emoji: "👨‍👩‍👧" },
  { value: "heritage", label: "My heritage", hint: "I grew up hearing Persian", emoji: "🏡" },
  { value: "curious", label: "Just curious", hint: "Language, culture, poetry", emoji: "✨" },
];

const READS: { value: Reads; label: string; hint: string }[] = [
  { value: "no", label: "Not yet", hint: "Start me with the letters" },
  { value: "some", label: "A little", hint: "I know some letters" },
  { value: "yes", label: "Yes", hint: "Show me Persian script first" },
];

/** Two questions that shape the Today plan, asked once on the Welcome step after sign-up. Skippable. */
export function Onboarding() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const finish = (reads: Reads | null) =>
    updateSettings({
      goal,
      reads,
      onboarded: true,
      // Readers see Persian first; learners who can't read yet lean on transliteration.
      ...(reads === "yes" ? { script: "farsi" as const } : reads === "no" ? { script: "latin" as const } : {}),
    });

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="onboarding-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted">Question {step} of 2</p>
          <h2 id="onboarding-heading" className="mt-1 text-2xl font-extrabold">
            {step === 1 ? "Why are you learning Persian?" : "Can you read Persian script?"}
          </h2>
        </div>
        <button type="button" className="btn-ghost btn-sm -mr-2 shrink-0" onClick={() => updateSettings({ onboarded: true })}>
          Skip
        </button>
      </div>
      {step === 1 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              className="tile flex items-center gap-3 p-4 text-left"
              data-state={goal === g.value ? "selected" : undefined}
              aria-pressed={goal === g.value}
              onClick={() => {
                setGoal(g.value);
                setStep(2);
              }}
            >
              <span className="text-3xl" aria-hidden>
                {g.emoji}
              </span>
              <span>
                <span className="block font-extrabold">{g.label}</span>
                <span className="block text-sm font-semibold text-muted">{g.hint}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="mt-1 font-semibold text-muted">
            Like this: <span lang="fa" dir="rtl" className="text-lg font-bold text-ink">سلام، خوش آمدید</span>
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {READS.map((r) => (
              <button key={r.value} type="button" className="tile p-4 text-left" onClick={() => finish(r.value)}>
                <span className="block font-extrabold">{r.label}</span>
                <span className="block text-sm font-semibold text-muted">{r.hint}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-ghost btn-sm -ml-3 mt-3" onClick={() => setStep(1)}>
            Back
          </button>
        </>
      )}
    </section>
  );
}
