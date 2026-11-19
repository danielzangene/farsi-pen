"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AUTH_ENABLED, useAuth } from "@/lib/auth";
import { needsSignIn } from "@/lib/auth-redirect";

/**
 * Keeps /app behind Google sign-in: signed-out visitors go to /login/ and come back to the page they asked for.
 * Pages in PUBLIC_APP_PATHS (the privacy policy) stay open, and so does everything when the build has no Supabase project.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const gated = AUTH_ENABLED && needsSignIn(pathname);

  useEffect(() => {
    if (gated && status === "signed-out") router.replace(`/login/?next=${encodeURIComponent(pathname)}`);
  }, [gated, status, pathname, router]);

  if (!gated || status === "signed-in") return children;
  return (
    <div className="grid min-h-dvh place-items-center" role="status">
      <Loader2 className="size-7 animate-spin text-muted" aria-hidden />
      <span className="sr-only">Checking sign-in…</span>
    </div>
  );
}
