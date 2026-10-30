"use client";
import { useEffect, useState } from "react";
import { Bookmark, Volume2, Snail } from "lucide-react";
import type { Word } from "@/content/words";
import { canSpeak, onVoicesChanged, speak } from "@/lib/speech";
import { toggleBookmark, useProgress, type Settings } from "@/lib/store";
import { cx } from "@/lib/util";

export function Fa({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span lang="fa" dir="rtl" className={className}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cx("h-2 overflow-hidden rounded-full bg-line", className)}>
      <div className="h-full rounded-full bg-firuze transition-[width] duration-500" style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }} />
    </div>
  );
}

/** Farsi word shown according to the script settings. */
export function FaWord({ word, settings, size = "lg" }: { word: Pick<Word, "fa" | "tr">; settings: Settings; size?: "md" | "lg" | "xl" }) {
  const big = { md: "text-xl", lg: "text-3xl", xl: "text-4xl sm:text-5xl" }[size];
  const small = size === "md" ? "text-sm" : "text-base";
  if (settings.scriptOnly) return <Fa className={cx(big, "font-semibold leading-relaxed")}>{word.fa}</Fa>;
  if (settings.script === "farsi")
    return (
      <span className="flex flex-col items-center gap-1">
        <Fa className={cx(big, "font-semibold leading-relaxed")}>{word.fa}</Fa>
        <span className={cx(small, "text-muted")}>{word.tr}</span>
      </span>
    );
  return (
    <span className="flex flex-col items-center gap-1">
      <span className={cx(big, "font-display font-semibold")}>{word.tr}</span>
      <Fa className={cx(size === "md" ? "text-lg" : "text-2xl", "text-muted")}>{word.fa}</Fa>
    </span>
  );
}

export function RegisterTag({ register }: { register: Word["register"] }) {
  if (register === "both") return null;
  return (
    <span className={cx("chip", register === "colloquial" ? "bg-saffron-soft text-saffron" : "bg-firuze-soft text-firuze")}>
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

export function AudioButtons({ text, compact }: { text: string; compact?: boolean }) {
  const ok = useCanSpeak();
  const title = ok ? undefined : "No Persian voice on this device yet — recorded audio is coming";
  return (
    <span className="inline-flex items-center gap-1" title={title}>
      <button type="button" className="btn-ghost !p-2" disabled={!ok} onClick={() => speak(text)} aria-label="Play audio">
        <Volume2 className="size-5" />
      </button>
      {!compact && (
        <button type="button" className="btn-ghost !p-2" disabled={!ok} onClick={() => speak(text, true)} aria-label="Play slowly">
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
      className={cx("btn-ghost !p-2", on && "!text-saffron")}
      onClick={() => toggleBookmark(wordId)}
      aria-pressed={on}
      aria-label={on ? "Remove bookmark" : "Bookmark this word"}
    >
      <Bookmark className={cx("size-5", on && "fill-current")} />
    </button>
  );
}

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
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl border border-line bg-card p-0.5 text-xs font-semibold">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx("rounded-[10px] px-2.5 py-1.5 transition", value === o.value ? "bg-firuze text-white" : "text-muted hover:text-ink")}
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
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
