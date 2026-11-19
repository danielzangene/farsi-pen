"use client";
import { useState } from "react";
import { CircleUserRound } from "lucide-react";
import { cx } from "@/lib/util";

/** The learner's photo (their Google picture), else their initial on a firuze disc, else a person icon. */
export function Avatar({ name, src, className, iconClassName }: { name: string; src: string | null; className?: string; iconClassName?: string }) {
  // A Google photo link can expire or be blocked: fall back to the initial rather than a broken image.
  const [failed, setFailed] = useState<string | null>(null);
  const initial = (name.trim()[0] ?? "").toUpperCase();
  return (
    <span className={cx("grid shrink-0 place-items-center overflow-hidden rounded-full bg-firuze font-bold text-on-accent", className)} aria-hidden>
      {src && failed !== src ? (
        // A plain <img>: the static export has no image optimiser, and this is a small remote photo.
        <img src={src} alt="" referrerPolicy="no-referrer" className="size-full object-cover" onError={() => setFailed(src)} />
      ) : (
        initial || <CircleUserRound className={iconClassName} strokeWidth={2} />
      )}
    </span>
  );
}
