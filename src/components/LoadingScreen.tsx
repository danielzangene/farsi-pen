import { Loader2 } from "lucide-react";

/** A full-screen spinner while a page waits on sign-in or the profile; `label` is read out to screen readers. */
export function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="grid min-h-dvh place-items-center" role="status">
      <Loader2 className="size-7 animate-spin text-muted" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}
