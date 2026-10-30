"use client";
import { Delete } from "lucide-react";
import { cx } from "@/lib/util";

// Standard Persian layout (ISIRI 9147), laid out left to right like the
// physical keys (ض sits on Q), so learners who later switch to a real
// keyboard find letters in the same places.
const ROWS = [
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ"],
  ["ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ"],
  ["ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و", "ژ", "آ"],
];

// Tile-style key: 2px border plus a 3px bottom edge it sinks into when pressed.
const KEY =
  "flex h-11 min-w-0 flex-1 touch-manipulation items-center justify-center rounded-xl border-2 border-line bg-card text-xl font-bold text-ink shadow-[0_3px_0_var(--color-line)] transition-transform duration-75 hover:bg-paper active:translate-y-[3px] active:shadow-none";

export function PersianKeyboard({ onKey, onBackspace }: { onKey: (s: string) => void; onBackspace: () => void }) {
  return (
    <div lang="fa" dir="ltr" className="select-none space-y-2 rounded-2xl bg-paper p-2 pb-3" aria-label="Persian keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1" style={{ paddingInline: `${i * 4}%` }}>
          {row.map((ch) => (
            <button key={ch} type="button" className={KEY} onClick={() => onKey(ch)} tabIndex={-1}>
              {ch}
            </button>
          ))}
        </div>
      ))}
      <div className="flex gap-1">
        <button type="button" className={cx(KEY, "!flex-[0.7] !text-xs")} onClick={() => onKey("\u200c")} tabIndex={-1} title="Half-space (ZWNJ)">
          {"نیم\u200cفاصله"}
        </button>
        <button type="button" className={cx(KEY, "!flex-[3] !text-sm !text-muted")} onClick={() => onKey(" ")} tabIndex={-1}>
          فاصله
        </button>
        <button type="button" className={cx(KEY, "!flex-[0.7]")} onClick={onBackspace} tabIndex={-1} aria-label="Backspace">
          <Delete className="size-5" />
        </button>
      </div>
    </div>
  );
}
