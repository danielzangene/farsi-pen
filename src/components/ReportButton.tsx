"use client";
import { useState } from "react";
import { CheckCircle2, Flag } from "lucide-react";

const KEY = "farsipen:reports";

/**
 * "Report incorrect content". Reports are kept in this browser until the
 * backend (reports table) exists.
 */
export function ReportButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      list.push({ itemId, note, at: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
      setNote("");
    }, 1400);
  };

  return (
    <span className="relative">
      <button type="button" className="btn-ghost btn-icon" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Report a problem">
        <Flag className="size-5" />
      </button>
      {open && (
        <div className="card absolute bottom-full right-0 z-20 mb-2 w-72 max-w-[calc(100vw-2rem)] animate-pop p-4 shadow-lg">
          {sent ? (
            <p role="status" className="flex items-center gap-2 font-bold text-pista-ink">
              <CheckCircle2 className="size-5" /> Thanks — we&apos;ll take a look.
            </p>
          ) : (
            <>
              <p className="mb-2 font-extrabold">Report incorrect content</p>
              <textarea
                className="input resize-none !py-2 !text-base"
                rows={3}
                placeholder="What's wrong? (optional)"
                aria-label="What's wrong? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button type="button" className="btn-primary mt-3 w-full" onClick={submit}>
                Submit report
              </button>
            </>
          )}
        </div>
      )}
    </span>
  );
}
