"use client";
import { useState } from "react";
import { Flag } from "lucide-react";

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
      <button type="button" className="btn-ghost !p-2" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Report a problem">
        <Flag className="size-5" />
      </button>
      {open && (
        <div className="card absolute bottom-full right-0 z-20 mb-2 w-64 p-3 shadow-lg">
          {sent ? (
            <p className="text-sm font-medium text-firuze">Thanks — we&apos;ll take a look.</p>
          ) : (
            <>
              <p className="mb-2 text-sm font-semibold">Report incorrect content</p>
              <textarea
                className="input !py-2 !text-sm"
                rows={3}
                placeholder="What's wrong? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button type="button" className="btn-primary mt-2 w-full" onClick={submit}>
                Submit report
              </button>
            </>
          )}
        </div>
      )}
    </span>
  );
}
