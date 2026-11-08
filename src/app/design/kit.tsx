"use client";
// Building blocks for the /design style guide: section shells, example
// frames, Do/Don't pairs, token chips and contrast maths. Values come from
// docs/ui-kit/tokens.json so the guide and the written kit can't drift.
import { useState } from "react";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import tokens from "../../../docs/ui-kit/tokens.json";
import { cx } from "@/lib/util";

export type ThemeId = "dark" | "light";
export type ColorToken = { name: string; value: Record<ThemeId, string>; usage: string };
export type TypeStyle = { name: string; fontSize: string; lineHeight: string; fontWeight: number; letterSpacing?: string; sample?: string; usage?: string };
export type PlainToken = { name: string; value: string; usage: string };

export const COLORS = tokens.color.tokens as ColorToken[];
export const COLOR = Object.fromEntries(COLORS.map((c) => [c.name, c])) as Record<string, ColorToken>;
export const TYPE_GROUPS = tokens.type.groups as { name: string; family: string; styles: TypeStyle[] }[];
export const SPACING = tokens.spacing.tokens as PlainToken[];
export const RADIUS = tokens.radius.tokens as PlainToken[];
export const SIZES = tokens.size.tokens as PlainToken[];
export const SOURCE = tokens.meta;

// ── WCAG contrast ──────────────────────────────────────────────────────
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** Ratio of two tokens in one theme. */
export const pair = (fg: string, bg: string, theme: ThemeId) => contrast(COLOR[fg].value[theme], COLOR[bg].value[theme]);

export function RatioBadge({ ratio, large }: { ratio: number; large?: boolean }) {
  const pass = ratio >= 4.5 ? "AA" : ratio >= 3 ? (large ? "AA" : "AA large") : "Fail";
  const tone = pass === "AA" ? "bg-pista-soft text-pista-ink" : pass === "AA large" ? "bg-saffron-soft text-saffron-ink" : "bg-anar-soft text-anar-ink";
  return (
    <span className={cx("chip tabular-nums", tone)}>
      {ratio.toFixed(1)}:1 · {pass}
    </span>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────
export function Group({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 space-y-8 border-t-2 border-line pt-12 lg:scroll-mt-8">
      <div className="space-y-2">
        <p className="eyebrow text-firuze-ink">{eyebrow}</p>
        <h2 id={`${id}-h`} className="text-3xl font-extrabold tracking-tight">
          {title}
        </h2>
        <p className="max-w-2xl text-lg font-semibold text-muted">{intro}</p>
      </div>
      {children}
    </section>
  );
}

export function Topic({ id, title, summary, children }: { id: string; title: string; summary?: string; children: React.ReactNode }) {
  return (
    <article id={id} className="scroll-mt-28 space-y-4 lg:scroll-mt-8">
      <div>
        <h3 className="text-2xl font-extrabold">{title}</h3>
        {summary && <p className="mt-1 max-w-2xl font-semibold text-muted">{summary}</p>}
      </div>
      {children}
    </article>
  );
}

/** A framed live example on the paper ground, labelled like a specimen. */
export function Example({ label = "Example", children, className, center }: { label?: string; children: React.ReactNode; className?: string; center?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-2xl border-2 border-line">
      <figcaption className="eyebrow border-b-2 border-line bg-card px-4 py-2 text-muted">{label}</figcaption>
      <div className={cx("bg-paper p-5", center && "flex flex-wrap items-center justify-center gap-4", className)}>{children}</div>
    </figure>
  );
}

export function DoDont({ doItem, dont, doNote, dontNote }: { doItem: React.ReactNode; dont: React.ReactNode; doNote: string; dontNote: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { ok: true, body: doItem, note: doNote },
        { ok: false, body: dont, note: dontNote },
      ].map(({ ok, body, note }) => (
        <figure key={String(ok)} className="overflow-hidden rounded-2xl border-2 border-line">
          <div className="flex min-h-28 flex-wrap items-center justify-center gap-3 bg-paper p-5">{body}</div>
          <figcaption className={cx("border-t-4 px-4 py-3", ok ? "border-pista" : "border-anar")}>
            <span className={cx("flex items-center gap-1.5 text-sm font-extrabold", ok ? "text-pista-ink" : "text-anar-ink")}>
              {ok ? <ThumbsUp className="size-4" strokeWidth={2.5} /> : <ThumbsDown className="size-4" strokeWidth={2.5} />}
              {ok ? "Do" : "Don't"}
            </span>
            <span className="mt-1 block text-sm font-semibold">{note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Two-column usage guidance: when to reach for it, when not to. */
export function UseWhen({ use, avoid }: { use: string[]; avoid: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card p-4">
        <p className="eyebrow text-pista-ink">Use it for</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold">
          {use.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
      <div className="card p-4">
        <p className="eyebrow text-anar-ink">Not for</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold">
          {avoid.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Footer of a component entry: accessibility contract, tokens used, source. */
export function Spec({ a11y, uses, source }: { a11y: string[]; uses: string[]; source: string }) {
  return (
    <div className="grid gap-4 rounded-2xl border-2 border-line p-4 sm:grid-cols-[1fr_auto]">
      <div>
        <p className="eyebrow text-sky-ink">Accessibility</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold">
          {a11y.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2 sm:max-w-64">
        <p className="eyebrow text-muted">Tokens</p>
        <div className="flex flex-wrap gap-1.5">
          {uses.map((u) => (
            <TokenChip key={u} name={u} />
          ))}
        </div>
        <p className="pt-1 text-xs font-semibold text-muted">
          Source: <code className="font-bold text-ink">{source}</code>
        </p>
      </div>
    </div>
  );
}

/** A token name you can copy, with a colour dot when it is a colour. */
export function TokenChip({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  const isColor = !!COLOR[name];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(isColor ? `var(--color-${name})` : name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard blocked: the name is still visible to select by hand.
    }
  };
  return (
    <button type="button" onClick={copy} title={isColor ? `Copy var(--color-${name})` : `Copy ${name}`} className="chip border-2 border-line bg-card font-bold text-ink hover:bg-paper">
      {isColor && <span className="size-2.5 rounded-full border border-line" style={{ background: `var(--color-${name})` }} aria-hidden />}
      {name}
      {copied ? <Check className="size-3 text-pista-ink" strokeWidth={3} /> : <Copy className="size-3 text-muted" strokeWidth={2.5} />}
    </button>
  );
}
