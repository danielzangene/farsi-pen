import { CAST, type CastId } from "@/content/scenes";
import { cx } from "@/lib/util";
import { TONE } from "../ui";

/** A cast member's badge: their colour and the first letter of their Persian name. */
export function CastAvatar({ id, size = "md", speaking, className }: { id: CastId; size?: "sm" | "md" | "lg"; speaking?: boolean; className?: string }) {
  const c = CAST[id];
  return (
    <span
      aria-hidden
      className={cx(
        "grid shrink-0 place-items-center rounded-full font-bold text-on-accent",
        TONE[c.tone].bg,
        size === "sm" ? "size-7 text-sm" : size === "lg" ? "size-14 text-2xl" : "size-10 text-lg",
        speaking && "ring-4 ring-sky/40",
        className,
      )}
    >
      <span lang="fa" className="leading-none">
        {[...c.fa][0]}
      </span>
    </span>
  );
}

export function CastStack({ ids }: { ids: CastId[] }) {
  return (
    <span className="flex -space-x-2" aria-label={`With ${ids.map((i) => CAST[i].name).join(", ")}`}>
      {ids.map((id) => (
        <CastAvatar key={id} id={id} size="sm" className="ring-2 ring-card" />
      ))}
    </span>
  );
}
