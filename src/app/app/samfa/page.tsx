"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { READINGS, type ReadingLesson } from "@/content/readings";
import { CONNECTORS, SAMFA_FACTS, SPEAKING_TASKS, WRITING_TASKS, type SpeakingTask, type WritingTask } from "@/content/samfa";
import { completeSamfaPractice, saveSamfaMock, useHydrated, useProgress, type SamfaMock } from "@/lib/store";
import { shuffle } from "@/lib/util";
import { ListeningPractice, ReadingPractice, SpeakingPractice, WritingPractice } from "@/components/samfa/Practice";
import { AudioButtons, Fa, PageHeader, ProgressBar, SessionHeader } from "@/components/ui";

type Skill = "listening" | "reading" | "writing" | "speaking";
type View =
  | { kind: "home" }
  | { kind: "pick"; skill: Skill }
  | { kind: "listening" | "reading"; lesson: ReadingLesson }
  | { kind: "writing"; task: WritingTask }
  | { kind: "speaking"; task: SpeakingTask }
  | { kind: "saved"; skill: Skill; score: number; xp: number }
  | { kind: "mock"; step: number; plan: MockPlan; scores: Partial<SamfaMock["scores"]> }
  | { kind: "mockDone"; scores: SamfaMock["scores"]; xp: number };

type MockPlan = { listening: ReadingLesson; reading: ReadingLesson; writing: WritingTask; speaking: SpeakingTask };
const MOCK_STEPS: Skill[] = ["listening", "reading", "writing", "speaking"];
const SKILL = Object.fromEntries(SAMFA_FACTS.sections.map((x) => [x.id, x])) as Record<Skill, (typeof SAMFA_FACTS.sections)[number]>;

export default function SamfaPage() {
  const s = useProgress();
  const hydrated = useHydrated();
  const [view, setView] = useState<View>({ kind: "home" });
  if (!hydrated) return null;

  const home = () => setView({ kind: "home" });
  const saved = (skill: Skill, score: number) => setView({ kind: "saved", skill, score, xp: completeSamfaPractice(skill, score) });
  const scale = (c: number, t: number) => Math.round((c / t) * 60);

  if (view.kind === "mock") {
    const skill = MOCK_STEPS[view.step];
    const nextStep = (score: number) => {
      const scores = { ...view.scores, [skill]: score };
      if (view.step + 1 < MOCK_STEPS.length) setView({ ...view, step: view.step + 1, scores });
      else {
        const full = scores as SamfaMock["scores"];
        setView({ kind: "mockDone", scores: full, xp: saveSamfaMock(full) });
      }
    };
    return (
      <div className="mx-auto max-w-3xl">
        <SessionHeader exitHref="/app/samfa/" onExit={home} progress={view.step / MOCK_STEPS.length} right={<span className="eyebrow text-muted">{view.step + 1}/4</span>} />
        <p className="text-sm font-bold text-muted">Mini mock · part {view.step + 1} of 4</p>
        <h1 className="mb-6 text-2xl font-extrabold">
          {SKILL[skill].name} <Fa className="ms-1 font-bold text-muted">{SKILL[skill].fa}</Fa>
        </h1>
        {skill === "listening" && <ListeningPractice key="l" lesson={view.plan.listening} onDone={(c, t) => nextStep(scale(c, t))} />}
        {skill === "reading" && <ReadingPractice key="r" lesson={view.plan.reading} minutes={6} onDone={(c, t) => nextStep(scale(c, t))} />}
        {skill === "writing" && <WritingPractice key="w" task={view.plan.writing} onDone={nextStep} />}
        {skill === "speaking" && <SpeakingPractice key="s" task={view.plan.speaking} onDone={nextStep} />}
      </div>
    );
  }

  if (view.kind === "mockDone") {
    const total = MOCK_STEPS.reduce((n, k) => n + view.scores[k], 0);
    return (
      <div className="mx-auto max-w-xl pt-6 text-center sm:pt-12">
        <p className="text-sm font-extrabold text-muted">Mini mock estimate</p>
        <p className="mt-1 text-6xl font-extrabold text-firuze-ink">
          {total}
          <span className="text-2xl text-muted">/240</span>
        </p>
        <p className="mt-2 font-semibold text-muted">{total >= 120 ? "Around or above the usual university bar (half the total)." : "Below the usual university bar of half the total — keep going."}</p>
        <ul className="mt-6 space-y-3 text-start">
          {MOCK_STEPS.map((k) => (
            <li key={k} className="card p-4">
              <p className="flex justify-between font-extrabold">
                <span>{SKILL[k].name}</span>
                <span>{view.scores[k]}/60</span>
              </p>
              <ProgressBar value={view.scores[k] / 60} tone={view.scores[k] >= 30 ? "pista" : "saffron"} size="sm" className="mt-2" />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-semibold text-muted">
          A short practice version with {view.xp} XP earned. Listening and reading are scored; writing and speaking are your own estimate against the model.
        </p>
        <button type="button" className="btn-primary btn-lg mt-6 w-full" onClick={home}>
          Back to SAMFA
        </button>
      </div>
    );
  }

  if (view.kind === "saved")
    return (
      <div className="mx-auto max-w-xl pt-6 text-center sm:pt-12">
        <p className="text-sm font-extrabold text-muted">{SKILL[view.skill].name}</p>
        <p className="mt-1 text-5xl font-extrabold text-firuze-ink">
          {view.score}
          <span className="text-2xl text-muted">/60</span>
        </p>
        <p className="mt-2 font-extrabold text-saffron-ink">+{view.xp} XP</p>
        <div className="mt-8 flex flex-col gap-3">
          <button type="button" className="btn-primary btn-lg" onClick={() => setView({ kind: "pick", skill: view.skill })}>
            Another {SKILL[view.skill].name.toLowerCase()} task
          </button>
          <button type="button" className="btn-secondary btn-lg" onClick={home}>
            Back to SAMFA
          </button>
        </div>
      </div>
    );

  if (view.kind === "listening" || view.kind === "reading" || view.kind === "writing" || view.kind === "speaking") {
    const skill = view.kind;
    return (
      <div className="mx-auto max-w-3xl">
        <button type="button" className="btn-ghost btn-sm -ms-3 mb-2" onClick={() => setView({ kind: "pick", skill })}>
          <ArrowLeft className="size-4" /> {SKILL[skill].name}
        </button>
        {view.kind === "listening" && <ListeningPractice lesson={view.lesson} onDone={(c, t) => saved("listening", scale(c, t))} />}
        {view.kind === "reading" && <ReadingPractice lesson={view.lesson} onDone={(c, t) => saved("reading", scale(c, t))} />}
        {view.kind === "writing" && <WritingPractice task={view.task} onDone={(n) => saved("writing", n)} />}
        {view.kind === "speaking" && <SpeakingPractice task={view.task} onDone={(n) => saved("speaking", n)} />}
      </div>
    );
  }

  if (view.kind === "pick") {
    const skill = view.skill;
    return (
      <div className="mx-auto max-w-3xl">
        <button type="button" className="btn-ghost btn-sm -ms-3 mb-2" onClick={home}>
          <ArrowLeft className="size-4" /> SAMFA
        </button>
        <h1 className="text-3xl font-extrabold">
          {SKILL[skill].name} <Fa className="ms-1 text-2xl font-bold text-muted">{SKILL[skill].fa}</Fa>
        </h1>
        <p className="mt-1 font-semibold text-muted">{SKILL[skill].detail}</p>
        <ul className="mt-6 space-y-3">
          {(skill === "listening" || skill === "reading") &&
            READINGS.map((r) => (
              <li key={r.id}>
                <button type="button" className="tile flex w-full items-center gap-3 p-4 text-start" onClick={() => setView({ kind: skill, lesson: r })}>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">{r.topic}</span>
                    <span className="block text-sm font-semibold text-muted">
                      {r.level} · {r.check.length} questions
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-muted" />
                </button>
              </li>
            ))}
          {skill === "writing" &&
            WRITING_TASKS.map((t) => (
              <li key={t.id}>
                <button type="button" className="tile flex w-full items-center gap-3 p-4 text-start" onClick={() => setView({ kind: "writing", task: t })}>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">{t.prompt.en}</span>
                    <span className="block text-sm font-semibold text-muted">
                      About {t.words} words · {t.minutes} min
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-muted" />
                </button>
              </li>
            ))}
          {skill === "speaking" &&
            SPEAKING_TASKS.map((t) => (
              <li key={t.id}>
                <button type="button" className="tile flex w-full items-center gap-3 p-4 text-start" onClick={() => setView({ kind: "speaking", task: t })}>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">{t.prompt.en}</span>
                    <span className="block text-sm font-semibold text-muted">
                      {t.prepSeconds}s to prepare · {t.speakSeconds}s to speak
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-muted" />
                </button>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  const mocks = s.samfa?.mocks ?? [];
  const last = mocks[mocks.length - 1];
  const startMock = () => {
    const [a, b] = shuffle(READINGS);
    setView({ kind: "mock", step: 0, scores: {}, plan: { listening: a, reading: b, writing: shuffle(WRITING_TASKS)[0], speaking: shuffle(SPEAKING_TASKS)[0] } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="SAMFA" subtitle={`${SAMFA_FACTS.full} (${SAMFA_FACTS.fa}) — the test you take to study at an Iranian university. Practise each part here.`} />

      <section className="card p-5 sm:p-6" aria-labelledby="about-heading">
        <h2 id="about-heading" className="text-xl font-extrabold">
          The test at a glance
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {SAMFA_FACTS.sections.map((x) => (
            <li key={x.id} className="rounded-2xl bg-paper p-4">
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-extrabold">
                  {x.name} <Fa className="ms-1 text-sm font-bold text-muted">{x.fa}</Fa>
                </span>
                <span className="text-sm font-extrabold text-firuze-ink">{x.points} pts</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">{x.detail}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-2 text-sm font-semibold">
          {SAMFA_FACTS.notes.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-saffron-soft p-3 text-sm font-bold text-saffron-ink">{SAMFA_FACTS.checkOfficial}</p>
      </section>

      <section aria-labelledby="mock-heading" className="card p-5 sm:p-6">
        <h2 id="mock-heading" className="text-xl font-extrabold">
          Mini mock test
        </h2>
        <p className="mt-1 font-semibold text-muted">All four parts in a short version (about 25 minutes), scored out of 240 like the real thing.</p>
        {last && (
          <p className="mt-2 text-sm font-bold">
            Last mock: {last.total}/240 on {last.at}
            {mocks.length > 1 && ` · ${mocks.length} taken`}
          </p>
        )}
        <button type="button" className="btn-primary btn-lg mt-4 w-full sm:w-auto sm:min-w-56" onClick={startMock}>
          Start the mini mock
        </button>
      </section>

      <section aria-labelledby="practise-heading">
        <h2 id="practise-heading" className="mb-3 text-xl font-extrabold">
          Practise one part
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {MOCK_STEPS.map((k) => (
            <li key={k}>
              <button type="button" className="tile flex h-full w-full items-start gap-3 p-4 text-start" onClick={() => setView({ kind: "pick", skill: k })}>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold">
                    {SKILL[k].name} <Fa className="ms-1 text-sm font-bold text-muted">{SKILL[k].fa}</Fa>
                  </span>
                  <span className="block text-sm font-semibold text-muted">{SKILL[k].detail}</span>
                  <span className="mt-1 block text-xs font-bold text-muted">{s.samfa?.practised[k] ?? 0} done</span>
                </span>
                <ChevronRight className="mt-1 size-5 shrink-0 text-muted" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-heading" className="space-y-4">
        <h2 id="tools-heading" className="text-xl font-extrabold">
          Your toolkit
        </h2>
        <div className="card p-5">
          <p className="font-extrabold">Linking words for writing and speaking</p>
          <ul className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {CONNECTORS.map((c) => (
              <li key={c.fa} className="flex items-center gap-2">
                <Fa className="font-bold">{c.fa}</Fa>
                <span className="min-w-0 flex-1 text-sm font-semibold text-muted">{c.en}</span>
                <AudioButtons text={c.fa} compact />
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/app/reading/" className="tile p-4">
            <span className="block font-extrabold">Reading lessons</span>
            <span className="block text-sm font-semibold text-muted">Texts in written Persian with news vocabulary</span>
          </Link>
          <Link href="/app/grammar/spoken-persian/" className="tile p-4">
            <span className="block font-extrabold">Written vs spoken</span>
            <span className="block text-sm font-semibold text-muted">Write in kitâbi Persian, not the way you speak</span>
          </Link>
          <Link href="/app/grammar/" className="tile p-4">
            <span className="block font-extrabold">B1–B2 grammar</span>
            <span className="block text-sm font-semibold text-muted">Passive, conditionals, reported speech…</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
