"use client";
import { useRef, useState } from "react";
import { Check, Info } from "lucide-react";
import { LETTERS, letterForms, type Letter } from "@/content/alphabet";
import { recordTrace, TRACE_PASS, useProgress } from "@/lib/store";
import { cx } from "@/lib/util";
import { TraceCanvas } from "@/components/TraceCanvas";
import { AudioButtons, Fa, PageHeader, ProgressBar, Segmented } from "@/components/ui";

type FormName = "isolated" | "initial" | "medial" | "final";
const FORM_LABELS: Record<FormName, string> = { isolated: "Alone", initial: "Start", medial: "Middle", final: "End" };

export default function AlphabetPage() {
  const s = useProgress();
  const [filter, setFilter] = useState<"all" | "persian">("all");
  const [selected, setSelected] = useState<Letter>(LETTERS[1]);
  const detailRef = useRef<HTMLDivElement>(null);
  const traced = LETTERS.filter((l) => (s.traced[l.id] ?? 0) >= TRACE_PASS).length;
  const shown = filter === "all" ? LETTERS : LETTERS.filter((l) => l.persianOnly);

  return (
    <div>
      <PageHeader title="Alphabet" subtitle={<>32 letters, written right to left. Tap one to see its forms — then trace it.</>}>
        <Segmented
          label="Filter"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All 32" },
            { value: "persian", label: "Unique to Persian (4)" },
          ]}
        />
      </PageHeader>

      <div className="mb-6 flex items-center gap-3 text-sm text-muted">
        <span className="whitespace-nowrap">
          Traced {traced}/{LETTERS.length}
        </span>
        <ProgressBar value={traced / LETTERS.length} className="flex-1" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div ref={detailRef} className="scroll-mt-20 lg:order-2">
          <LetterDetail key={selected.id} letter={selected} />
        </div>
        <div className="grid grid-cols-4 gap-2 self-start sm:grid-cols-6 lg:order-1 lg:grid-cols-6" dir="rtl">
          {shown.map((l) => {
            const done = (s.traced[l.id] ?? 0) >= TRACE_PASS;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setSelected(l);
                  if (window.innerWidth < 1024) detailRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cx(
                  "card relative flex aspect-square flex-col items-center justify-center transition hover:border-firuze",
                  selected.id === l.id && "!border-firuze !bg-firuze-soft",
                )}
                aria-label={`${l.name}, sounds like ${l.sound}`}
                aria-pressed={selected.id === l.id}
              >
                <Fa className="text-3xl leading-none">{l.char}</Fa>
                <span className="mt-1 text-[11px] text-muted" dir="ltr">
                  {l.name}
                </span>
                {done && <Check className="absolute left-1.5 top-1.5 size-3.5 text-firuze" />}
                {l.persianOnly && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-saffron" title="Unique to Persian" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LetterDetail({ letter }: { letter: Letter }) {
  const s = useProgress();
  const forms = letterForms(letter);
  const [form, setForm] = useState<FormName>("isolated");
  const [xpMsg, setXpMsg] = useState<string | null>(null);
  const best = s.traced[letter.id] ?? 0;

  return (
    <div className="card p-5 lg:sticky lg:top-20">
      <div className="flex items-start gap-4">
        <Fa className="grid size-20 shrink-0 place-items-center rounded-2xl bg-firuze-soft text-5xl text-firuze">{letter.char}</Fa>
        <div>
          <h2 className="font-display text-2xl font-semibold">{letter.name}</h2>
          <p className="text-muted">
            Sound: <strong className="text-ink">{letter.sound}</strong>
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {letter.persianOnly && <span className="chip bg-saffron-soft text-saffron">Unique to Persian</span>}
            {!letter.connects && <span className="chip bg-paper text-muted">Doesn’t join to the next letter</span>}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {(Object.keys(FORM_LABELS) as FormName[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setForm(f)}
            className={cx("rounded-xl border p-2 text-center transition", form === f ? "border-firuze bg-firuze-soft" : "border-line hover:border-firuze")}
            aria-pressed={form === f}
          >
            <Fa className="block text-3xl leading-[1.6]">{forms[f]}</Fa>
            <span className="text-[11px] text-muted">{FORM_LABELS[f]}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-paper p-3">
        <div>
          <Fa className="text-2xl">{letter.example.fa}</Fa>
          <p className="text-sm">
            <span className="font-semibold">{letter.example.tr}</span> <span className="text-muted">· {letter.example.en}</span>
          </p>
        </div>
        <AudioButtons text={letter.example.fa} compact />
      </div>
      {letter.note && (
        <p className="mt-2 flex gap-1.5 text-xs text-muted">
          <Info className="size-3.5 shrink-0" /> {letter.note}
        </p>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">
            Trace it <span className="text-sm font-normal text-muted">({FORM_LABELS[form].toLowerCase()} form)</span>
          </h3>
          {best > 0 && <span className={cx("chip", best >= TRACE_PASS ? "bg-firuze-soft text-firuze" : "bg-paper text-muted")}>Best {best}</span>}
        </div>
        <TraceCanvas
          key={form}
          text={forms[form]}
          passMark={TRACE_PASS}
          onScore={(score) => {
            const xp = recordTrace(letter.id, score);
            setXpMsg(xp ? `+${xp} XP` : null);
          }}
        />
        {xpMsg && <p className="mt-2 text-center text-sm font-semibold text-saffron">{xpMsg}</p>}
        <p className="mt-3 text-center text-xs text-muted">Write right to left, and don’t forget the dots. Stroke-order hints are coming next.</p>
      </div>
    </div>
  );
}
