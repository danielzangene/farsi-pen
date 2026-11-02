"use client";
import { useState } from "react";
import { ExternalLink, Flag } from "lucide-react";
import { cx } from "@/lib/util";

const KEY = "farsipen:reports";
const REPO = "https://github.com/danielzangene/farsi-pen";

/** A pre-filled GitHub issue: free, no backend, and lands where the team works. */
export function reportUrl(itemId: string, context: string, note: string): string {
  const page = typeof window !== "undefined" ? window.location.pathname : "";
  const title = `Content: ${context || itemId}`;
  const body = [
    `**Item:** \`${itemId}\``,
    context && `**What it says:** ${context}`,
    `**Page:** ${page}`,
    "",
    "**What's wrong / suggested fix:**",
    note || "_(describe the problem)_",
  ]
    .filter((x): x is string => typeof x === "string")
    .join("\n");
  return `${REPO}/issues/new?labels=content&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

/**
 * "Report a problem" on any piece of content (word, sentence, exercise). Opens
 * a pre-filled GitHub issue; a copy also stays in this browser.
 */
export function ReportButton({ itemId, context = "", className, align = "right" }: { itemId: string; context?: string; className?: string; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const send = () => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      list.push({ itemId, context, note, at: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(list.slice(-50)));
    } catch {}
    window.open(reportUrl(itemId, context, note), "_blank", "noopener");
    setOpen(false);
    setNote("");
  };

  return (
    <span className={cx("relative", className)}>
      <button type="button" className="btn-ghost btn-icon" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Report a problem with this content" title="Report a problem">
        <Flag className="size-5" />
      </button>
      {open && (
        <div className={cx("card absolute bottom-full z-20 mb-2 w-72 max-w-[calc(100vw-2rem)] animate-pop p-4 text-left shadow-lg", align === "right" ? "right-0" : "left-0")}>
          <p className="mb-1 font-extrabold">Report a problem</p>
          <p className="mb-2 text-sm font-semibold text-muted">Wrong translation, spelling or audio? Tell us — it helps everyone.</p>
          <textarea
            className="input resize-none !py-2 !text-base"
            rows={3}
            placeholder="What's wrong? (optional)"
            aria-label="What's wrong? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="button" className="btn-primary mt-3 w-full" onClick={send}>
            Send report <ExternalLink className="size-4" />
          </button>
          <p className="mt-2 text-xs font-semibold text-muted">Opens GitHub with the report filled in (a free account is needed to submit).</p>
        </div>
      )}
    </span>
  );
}
