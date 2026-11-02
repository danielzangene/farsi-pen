"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, MonitorPlay, VideoOff, X } from "lucide-react";
import { loadYouglish, YOUGLISH_LANG, type YGWidget } from "@/lib/youglish";
import { Fa } from "./ui";

type Status = "loading" | "ready" | "empty" | "error";

/**
 * Real-world pronunciation: YouTube clips (via the YouGlish widget) where
 * native speakers say `query`, each cued to the moment it is spoken.
 */
export function YouglishPlayer({ query }: { query: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const [status, setStatus] = useState<Status>("loading");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    const q = query.trim();
    if (!host || !q) return;
    let cancelled = false;
    let widget: YGWidget | null = null;
    setStatus("loading");

    // The widget swaps out its target element, so give it one React doesn't own.
    const id = `yg-${rawId.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now()}`;
    const target = document.createElement("div");
    target.id = id;
    host.appendChild(target);

    loadYouglish()
      .then((YG) => {
        if (cancelled) return;
        widget = new YG.Widget(id, {
          width: Math.min(host.clientWidth || 640, 960),
          autoStart: 1,
          events: {
            onFetchDone: (e) => {
              if (cancelled) return;
              const n = e.totalResult ?? 0;
              setTotal(n);
              setStatus(n > 0 ? "ready" : "empty");
            },
            onError: () => !cancelled && setStatus("error"),
          },
        });
        widget.fetch(q, YOUGLISH_LANG);
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      try {
        widget?.close?.();
      } catch {}
      host.replaceChildren();
    };
  }, [query, rawId]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border-2 border-line bg-paper">
        <div ref={hostRef} className={status === "ready" ? "" : "pointer-events-none h-0 overflow-hidden opacity-0"} />
        {status === "loading" && (
          <p role="status" className="flex items-center justify-center gap-2 px-4 py-10 font-bold text-muted">
            <Loader2 className="size-5 animate-spin" /> Finding videos…
          </p>
        )}
        {(status === "empty" || status === "error") && (
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-card text-faint">
              <VideoOff className="size-7" strokeWidth={2.5} />
            </span>
            <p className="mt-3 text-lg font-extrabold">
              {status === "empty" ? (
                <>
                  No clips for <Fa>{query.trim()}</Fa> yet
                </>
              ) : (
                "Videos couldn't load"
              )}
            </p>
            <p className="mt-1 font-semibold text-muted">
              {status === "empty" ? "Try a shorter or more common word." : "Check your connection and try again."}
            </p>
          </div>
        )}
      </div>
      {/* YouGlish asks that "Powered by YouGlish.com" stays visible next to the widget. */}
      <p className="text-sm font-semibold text-muted">
        {status === "ready" && `${total.toLocaleString()} clip${total === 1 ? "" : "s"} · `}
        Powered by YouGlish.com
      </p>
    </div>
  );
}

/** Icon button that opens the YouGlish player for one word in a dialog. */
export function YouglishButton({ query, label }: { query: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn-ghost btn-icon !text-sky-ink" onClick={() => setOpen(true)} aria-label={`Hear “${label ?? query}” in real videos`} title="Hear it in real videos">
        <MonitorPlay className="size-5" />
      </button>
      {open && <YouglishDialog query={query} label={label} onClose={() => setOpen(false)} />}
    </>
  );
}

export function YouglishDialog({ query, label, onClose }: { query: string; label?: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="card m-auto w-[min(48rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] animate-pop overflow-y-auto p-0 text-ink backdrop:bg-black/50"
      aria-label="Hear it in real videos"
    >
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-sky-ink">Hear it in real videos</p>
            <p className="mt-1 text-2xl font-extrabold">
              <Fa>{query}</Fa>
              {label && label !== query && <span className="ml-2 text-lg font-bold text-muted">{label}</span>}
            </p>
          </div>
          <button type="button" className="btn-ghost btn-icon shrink-0" onClick={onClose} aria-label="Close" autoFocus>
            <X className="size-6" />
          </button>
        </div>
        <YouglishPlayer query={query} />
      </div>
    </dialog>,
    document.body,
  );
}
