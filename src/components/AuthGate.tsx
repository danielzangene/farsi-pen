"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AUTH_ENABLED, isSigningOut, useAuth } from "@/lib/auth";
import { needsSignIn, needsWelcome, WELCOME_PATH } from "@/lib/auth-redirect";
import { startProfileSync, useProfileReady } from "@/lib/profile-sync";
import { useHydrated, useProgress } from "@/lib/store";

/**
 * Keeps /app behind Google sign-in: signed-out visitors go to /login/ and come back to the page they asked for.
 * Pages in PUBLIC_APP_PATHS (the privacy policy) stay open, and so does everything when the build has no Supabase project.
 *
 * It also starts the profile sync and, unless `skipWelcome` is set, sends learners who haven't answered the welcome
 * questions to /welcome/ first, once their profile has loaded (so answers from another device count).
 */
export function AuthGate({ children, skipWelcome = false }: { children: React.ReactNode; skipWelcome?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const { settings } = useProgress();
  const hydrated = useHydrated();
  const profileReady = useProfileReady();

  const gated = AUTH_ENABLED && needsSignIn(pathname);
  const signedIn = !gated || status === "signed-in";
  const toWelcome = !skipWelcome && signedIn && hydrated && needsWelcome(pathname, settings.onboarded);

  useEffect(() => startProfileSync(), []);

  useEffect(() => {
    // A deliberate sign-out heads to the landing page instead (see signOut).
    if (gated && status === "signed-out" && !isSigningOut()) router.replace(`/login/?next=${encodeURIComponent(pathname)}`);
  }, [gated, status, pathname, router]);

  useEffect(() => {
    if (toWelcome && profileReady) router.replace(WELCOME_PATH);
  }, [toWelcome, profileReady, router]);

  if (signedIn && !toWelcome) return children;
  return <LoadingScreen label={signedIn ? "Loading your profile…" : "Checking sign-in…"} />;
}
