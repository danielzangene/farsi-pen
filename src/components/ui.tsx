"use client";
// Shared UI primitives. Screens compose these plus the utility classes in
// globals.css (btn-*, tile, card, chip, input, eyebrow). See the
// farsi-pen-design-system skill for when to use which.
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, Snail, Volume2, X, XCircle } from "lucide-react";
import type { Word } from "@/content/words";
import { canSpeak, onVoicesChanged, speak } from "@/lib/speech";
import { toggleBookmark, useProgress, type Settings } from "@/lib/store";
import { cx } from "@/lib/util";

export type Tone = "firuze" | "pista" | "anar" | "saffron" | "sky" | "plum";

/** Static class names per tone (Tailwind needs literal class strings). */
export const TONE = {
  firuze: { bg: "bg-firuze", soft: "bg-firuze-soft", ink: "text-firuze-ink", border: "border-firuze", btn: "btn-primary" },
  pista: { bg: "bg-pista", soft: "bg-pista-soft", ink: "text-pista-ink", border: "border-pista", btn: "btn-success" },
  anar: { bg: "bg-anar", soft: "bg-anar-soft", ink: "text-anar-ink", border: "border-anar", btn: "btn-danger" },
  saffron: { bg: "bg-saffron", soft: "bg-saffron-soft", ink: "text-saffron-ink", border: "border-saffron", btn: "btn-primary" },
  sky: { bg: "bg-sky", soft: "bg-sky-soft", ink: "text-sky-ink", border: "border-sky", btn: "btn-sky" },
  plum: { bg: "bg-plum", soft: "bg-plum-soft", ink: "text-plum-ink", border: "border-plum", btn: "btn-plum" },
} satisfies Record<Tone, Record<string, string>>;

export function Fa({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span lang="fa" dir="rtl" className={className}>
      {children}
    </span>
  );
}

/** Thick rounded bar with a highlight sheen on the fill. */
export function ProgressBar({ value, tone = "firuze", size = "md", className }: { value: number; tone?: Tone; size?: "sm" | "md"; className?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx("relative overflow-hidden rounded-full bg-line", size === "sm" ? "h-2.5" : "h-4", className)}
    >
      <div className={cx("relative h-full rounded-full transition-[width] duration-500 ease-out", TONE[tone].bg)} style={{ width: `${pct}%`, minWidth: pct ? (size === "sm" ? "0.625rem" : "1rem") : 0 }}>
        {size === "md" && pct > 0 && <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/30" />}
      </div>
    </div>
  );
}

/** Farsi word shown according to the script settings. */
export function FaWord({ word, settings, size = "lg" }: { word: Pick<Word, "fa" | "tr">; settings: Settings; size?: "md" | "lg" | "xl" }) {
  const big = { md: "text-xl", lg: "text-3xl", xl: "text-4xl sm:text-5xl" }[size];
  const small = size === "md" ? "text-sm" : "text-base";
  if (settings.scriptOnly) return <Fa className={cx(big, "font-bold leading-relaxed")}>{word.fa}</Fa>;
  if (settings.script === "farsi")
    return (
      <span className="flex flex-col items-center gap-1">
        <Fa className={cx(big, "font-bold leading-relaxed")}>{word.fa}</Fa>
        <span className={cx(small, "font-semibold text-muted")}>{word.tr}</span>
      </span>
    );
  return (
    <span className="flex flex-col items-center gap-1">
      <span className={cx(big, "font-extrabold")}>{word.tr}</span>
      <Fa className={cx(size === "md" ? "text-lg" : "text-2xl", "text-muted")}>{word.fa}</Fa>
    </span>
  );
}

export function RegisterTag({ register }: { register: Word["register"] }) {
  if (register === "both") return null;
  return (
    <span className={cx("chip", register === "colloquial" ? "bg-saffron-soft text-saffron-ink" : "bg-plum-soft text-plum-ink")}>
      {register === "colloquial" ? "Spoken" : "Formal"}
    </span>
  );
}

function useCanSpeak() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(canSpeak());
    return onVoicesChanged(() => setOk(canSpeak()));
  }, []);
  return ok;
}

/** Audio controls. `big` renders the prominent sky speaker button used on prompts. */
export function AudioButtons({ text, compact, big }: { text: string; compact?: boolean; big?: boolean }) {
  const ok = useCanSpeak();
  const title = ok ? undefined : "No Persian voice on this device yet — recorded audio is coming";
  if (big)
    return (
      <span className="inline-flex items-center gap-2" title={title}>
        <button type="button" className="btn-sky btn-icon !size-14 !rounded-2xl" disabled={!ok} onClick={() => speak(text)} aria-label="Play audio">
          <Volume2 className="size-7" />
        </button>
        {!compact && (
          <button type="button" className="btn-sky btn-icon !size-11" disabled={!ok} onClick={() => speak(text, true)} aria-label="Play slowly">
            <Snail className="size-5" />
          </button>
        )}
      </span>
    );
  return (
    <span className="inline-flex items-center" title={title}>
      <button type="button" className="btn-ghost btn-icon !text-sky-ink disabled:!text-line-strong" disabled={!ok} onClick={() => speak(text)} aria-label="Play audio">
        <Volume2 className="size-5" />
      </button>
      {!compact && (
        <button type="button" className="btn-ghost btn-icon !text-sky-ink disabled:!text-line-strong" disabled={!ok} onClick={() => speak(text, true)} aria-label="Play slowly">
          <Snail className="size-5" />
        </button>
      )}
    </span>
  );
}

export function BookmarkButton({ wordId }: { wordId: string }) {
  const { bookmarks } = useProgress();
  const on = bookmarks.includes(wordId);
  return (
    <button
      type="button"
      className={cx("btn-ghost btn-icon", on && "!text-saffron")}
      onClick={() => toggleBookmark(wordId)}
      aria-pressed={on}
      aria-label={on ? "Remove bookmark" : "Bookmark this word"}
    >
      <Bookmark className={cx("size-5", on && "fill-current")} />
    </button>
  );
}

/** Pill segmented control (settings toggles, tabs). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-2xl border-2 border-line bg-paper p-1 text-xs font-extrabold">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "rounded-xl px-3 py-1.5 transition",
            value === o.value ? "bg-card text-sky-ink shadow-[0_2px_0_var(--color-line)]" : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 font-semibold text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/**
 * Hides the app's navigation while mounted, for distraction-free lesson,
 * practice and exercise sessions (AppNav reads body[data-focus]).
 */
export function FocusMode() {
  useEffect(() => {
    document.body.dataset.focus = "1";
    return () => {
      delete document.body.dataset.focus;
    };
  }, []);
  return null;
}

/** Session header: close (X), progress bar, optional right-hand slot. */
export function SessionHeader({ exitHref, progress, right }: { exitHref: string; progress: number; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 bg-card/95 px-4 py-3 backdrop-blur">
      <FocusMode />
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Link href={exitHref} className="btn-ghost btn-icon -ml-2" aria-label="Quit session">
          <X className="size-6" strokeWidth={3} />
        </Link>
        <ProgressBar value={progress} className="flex-1" />
        {right}
      </div>
    </div>
  );
}

export type FeedbackState = "idle" | "correct" | "almost" | "wrong";

/**
 * Bottom action bar for sessions. In "idle" it holds the main action
 * (children, e.g. Check). After an answer it turns green/red with a title,
 * optional detail, and a Continue button in the matching colour.
 */
export function FeedbackSheet({
  state,
  title,
  detail,
  onContinue,
  continueLabel = "Continue",
  children,
}: {
  state: FeedbackState;
  title?: string;
  detail?: React.ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  children?: React.ReactNode;
}) {
  const answered = state !== "idle";
  const good = state === "correct" || state === "almost";
  const tone: Tone = state === "wrong" ? "anar" : "pista";
  return (
    <>
      {/* Spacer so page content can scroll clear of the fixed sheet. */}
      <div className="h-40" aria-hidden />
      <div
        role={answered ? "status" : undefined}
        className={cx(
          "fixed inset-x-0 bottom-0 z-40 border-t-2 pb-[env(safe-area-inset-bottom)]",
          answered ? cx(TONE[tone].soft, "animate-slide-up border-transparent") : "border-line bg-card",
        )}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-7">
          {answered ? (
            <>
              <div className={cx("flex min-w-0 items-start gap-3", TONE[tone].ink)}>
                <span className="grid size-12 shrink-0 animate-pop place-items-center rounded-full bg-card">
                  {good ? <CheckCircle2 className="size-8" /> : <XCircle className="size-8" />}
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold">{title}</p>
                  {detail && <div className="mt-0.5 text-sm font-semibold">{detail}</div>}
                </div>
              </div>
              <button type="button" className={cx(TONE[tone].btn, "btn-lg w-full sm:w-auto sm:min-w-40")} onClick={onContinue} autoFocus>
                {continueLabel}
              </button>
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
}

/** Result card: coloured frame with an uppercase label and a white value box. */
export function StatCard({ label, value, tone = "saffron", icon }: { label: string; value: React.ReactNode; tone?: Tone; icon?: React.ReactNode }) {
  return (
    <div className={cx("animate-pop overflow-hidden rounded-2xl border-2", TONE[tone].border, TONE[tone].bg)}>
      <p className="eyebrow py-1 text-center text-white">{label}</p>
      <div className={cx("m-0.5 mt-0 flex items-center justify-center gap-1.5 rounded-[0.8rem] bg-card px-3 py-3 text-xl font-extrabold", TONE[tone].ink)}>
        {icon}
        {value}
      </div>
    </div>
  );
}

/** Small speech bubble with a pointer, e.g. "START" above the current path node. */
export function Bubble({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "eyebrow relative inline-block rounded-xl border-2 border-line bg-card px-3 py-1.5 text-firuze-ink",
        "after:absolute after:left-1/2 after:top-full after:-mt-[5px] after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:border-b-2 after:border-r-2 after:border-line after:bg-card",
        className,
      )}
    >
      {children}
    </span>
  );
}
