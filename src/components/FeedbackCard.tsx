"use client";
import { useState } from "react";
import { hasBackend, sendFeedback } from "@/lib/backend";
import { cx } from "@/lib/util";

const FACES = ["😞", "😕", "😐", "🙂", "😍"];

/** Profile: tell us what's working and what isn't. */
export function FeedbackCard() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  if (!hasBackend) return null;

  const send = async () => {
    setState("sending");
    try {
      await sendFeedback({
        kind: "general",
        text,
        rating: rating ?? undefined,
        page: window.location.pathname,
      });
      setState("sent");
      setText("");
      setRating(null);
    } catch {
      setState("error");
    }
  };

  return (
    <section className="card p-5" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading" className="eyebrow text-muted">
        Send feedback
      </h2>
      {state === "sent" ? (
        <p role="status" className="mt-2 font-semibold text-pista-ink">
          Thank you — we read every message.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            How is Farsi Pen working for you? Ideas, bugs and wishes all help.
          </p>
          <div
            className="mt-3 flex gap-1"
            role="radiogroup"
            aria-label="How do you like it?"
          >
            {FACES.map((f, i) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={rating === i + 1}
                aria-label={`${i + 1} of 5`}
                onClick={() => setRating(i + 1)}
                className={cx(
                  "grid size-11 place-items-center rounded-full text-2xl transition-transform active:scale-90",
                  rating === i + 1 ? "bg-sky-soft" : "opacity-60",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <textarea
            className="input mt-3 resize-none"
            rows={3}
            aria-label="Your feedback"
            placeholder="What should we improve?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={state === "sending" || (!text.trim() && !rating)}
              onClick={send}
            >
              {state === "sending" ? "Sending…" : "Send"}
            </button>
            {state === "error" && (
              <p role="status" className="text-sm font-semibold text-anar-ink">
                Couldn&apos;t send. Try again.
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-muted">
            Only your message and rating are sent — no name or email.
          </p>
        </>
      )}
    </section>
  );
}
