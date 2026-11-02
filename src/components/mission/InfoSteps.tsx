"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Info, Languages, Volume2, XCircle } from "lucide-react";
import type { Line, Mission } from "@/content/missions";
import { GRAMMAR_BY_ID } from "@/content/grammar";
import { speak } from "@/lib/speech";
import { useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { AudioButtons, Fa, FeedbackSheet, RegisterTag } from "../ui";

function StepTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="eyebrow text-firuze-ink">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-extrabold">{title}</h1>
      {children && <p className="mt-1 font-semibold text-muted">{children}</p>}
    </div>
  );
}

function ContinueBar({ onNext, disabled, label = "Continue", onSkip }: { onNext: () => void; disabled?: boolean; label?: string; onSkip?: () => void }) {
  return (
    <FeedbackSheet state="idle">
      {onSkip ? (
        <button type="button" className="btn-ghost w-full sm:w-auto" onClick={onSkip}>
          I know this — skip
        </button>
      ) : (
        <span />
      )}
      <button type="button" className="btn-primary btn-lg w-full sm:w-auto sm:min-w-40" onClick={onNext} disabled={disabled}>
        {label}
      </button>
    </FeedbackSheet>
  );
}

/** A speech bubble for one line of dialogue. */
export function Bubble({ line, name, showEn, compact }: { line: Omit<Line, "who"> & { who?: Line["who"] }; name?: string; showEn: boolean; compact?: boolean }) {
  const { settings } = useProgress();
  const you = line.who === "you";
  return (
    <div className={cx("flex", you ? "justify-end" : "justify-start")}>
      <div className={cx("max-w-[85%] rounded-2xl border-2 p-3.5", you ? "border-firuze bg-firuze-soft" : "border-line bg-card")}>
        <div className="mb-1 flex items-center gap-2">
          <span className={cx("eyebrow", you ? "text-firuze-ink" : "text-muted")}>{you ? "You" : (name ?? "")}</span>
          <RegisterTag register={line.register ?? "both"} />
        </div>
        <div className="flex items-start gap-1">
          <Fa className={cx("block flex-1 font-bold leading-relaxed", compact ? "text-xl" : "text-2xl")}>{line.fa}</Fa>
          <button type="button" className="btn-ghost btn-icon -my-1 shrink-0 !text-sky-ink" onClick={() => void speak(line.fa)} aria-label="Play this line">
            <Volume2 className="size-5" />
          </button>
        </div>
        {!settings.scriptOnly && <p className="font-semibold text-muted">{line.tr}</p>}
        {showEn && <p className="mt-0.5 text-sm font-semibold">{line.en}</p>}
      </div>
    </div>
  );
}

export function ListenStep({ mission, onNext }: { mission: Mission; onNext: () => void }) {
  const [showEn, setShowEn] = useState(false);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const allAnswered = mission.questions.every((_, i) => picked[i]);

  return (
    <div>
      <StepTitle eyebrow="Listen" title="What's happening?">
        {mission.scene}
      </StepTitle>
      <div className="mb-4 flex justify-end">
        <button type="button" className="btn-ghost btn-sm" onClick={() => setShowEn(!showEn)} aria-pressed={showEn}>
          <Languages className="size-4" /> {showEn ? "Hide English" : "Show English"}
        </button>
      </div>
      <div className="space-y-3">
        {mission.dialogue.map((l, i) => (
          <Bubble key={i} line={l} name={mission.npc.name} showEn={showEn} />
        ))}
      </div>

      <h2 className="mt-10 text-xl font-extrabold">Did you get it?</h2>
      <div className="mt-4 space-y-6">
        {mission.questions.map((q, i) => (
          <fieldset key={i}>
            <legend className="mb-2 font-bold">{q.prompt}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((o) => {
                const chosen = picked[i];
                const state = chosen ? (o === q.answer ? "correct" : o === chosen ? "wrong" : undefined) : undefined;
                return (
                  <button
                    key={o}
                    type="button"
                    className="tile flex items-center justify-between gap-2 p-3 text-left font-bold"
                    data-state={state}
                    disabled={!!chosen}
                    onClick={() => setPicked((p) => ({ ...p, [i]: o }))}
                  >
                    {o}
                    {state === "correct" && <CheckCircle2 className="size-5 shrink-0 text-pista-ink" aria-label="Correct" />}
                    {state === "wrong" && <XCircle className="size-5 shrink-0 text-anar-ink" aria-label="Wrong" />}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <ContinueBar onNext={onNext} disabled={!allAnswered} onSkip={onNext} />
    </div>
  );
}

export function PhrasesStep({ mission, skills, onNext }: { mission: Mission; skills: string[]; onNext: () => void }) {
  const { settings } = useProgress();
  const groups = mission.skills.filter((s) => skills.includes(s.id));
  return (
    <div>
      <StepTitle eyebrow="Key phrases" title="What you'll need to say">
        Tap the speaker to hear each one, then say it out loud.
      </StepTitle>
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.id}>
            <h2 className="eyebrow mb-3 text-muted">{g.canDo}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {mission.phrases
                .filter((p) => p.skill === g.id)
                .map((p) => (
                  <div key={p.fa} className="card flex flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Fa className="block text-2xl font-bold leading-relaxed">{p.fa}</Fa>
                      <RegisterTag register={p.register ?? "both"} />
                    </div>
                    {!settings.scriptOnly && <p className="font-bold text-muted">{p.tr}</p>}
                    <p className="mt-1 font-extrabold">{p.en}</p>
                    {p.note && <p className="mt-2 rounded-xl bg-paper p-2.5 text-sm font-semibold text-muted">{p.note}</p>}
                    <div className="-mx-2 -mb-2 mt-auto pt-2">
                      <AudioButtons text={p.fa} />
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
      <ContinueBar onNext={onNext} />
    </div>
  );
}

export function GrammarStep({ mission, onNext }: { mission: Mission; onNext: () => void }) {
  const g = mission.grammar;
  return (
    <div>
      <StepTitle eyebrow="Grammar on demand" title="Why it's said this way">
        Only what this situation needs. The full lessons are linked below.
      </StepTitle>
      <ul className="space-y-3">
        {g.points.map((p) => (
          <li key={p} className="flex gap-3 font-semibold">
            <span className="mt-2 size-2 shrink-0 rounded-full bg-plum" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
      {g.table && (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper">
              <tr>
                {g.table.columns.map((c) => (
                  <th key={c} className="eyebrow px-4 py-3 text-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.table.rows.map((r) => (
                <tr key={r.join()} className="border-t-2 border-line">
                  {r.map((c, i) => (
                    <td key={i} className={cx("px-4 py-3", i === 0 ? "font-extrabold text-plum-ink" : "font-semibold")}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {mission.culture && (
        <p className="mt-6 flex gap-2.5 rounded-2xl bg-saffron-soft p-4 font-semibold text-saffron-ink">
          <Info className="size-5 shrink-0 translate-y-0.5" strokeWidth={2.5} />
          <span>
            <strong className="font-extrabold">Culture note. </strong>
            {mission.culture}
          </span>
        </p>
      )}
      <h2 className="eyebrow mt-8 text-muted">Learn more</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {g.concepts.map((id) => {
          const c = GRAMMAR_BY_ID[id];
          return (
            c && (
              <Link key={id} href={`/app/grammar/${id}/`} target="_blank" className="btn-secondary btn-sm">
                {c.title} <ExternalLink className="size-3.5" />
              </Link>
            )
          );
        })}
      </div>
      <ContinueBar onNext={onNext} />
    </div>
  );
}
