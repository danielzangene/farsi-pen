"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/AuthGate";
import { LogoMark } from "@/components/AppNav";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Onboarding } from "@/components/Onboarding";
import { Fa } from "@/components/ui";
import { DEFAULT_AFTER_SIGN_IN } from "@/lib/auth-redirect";
import { useProfileReady } from "@/lib/profile-sync";
import { useHydrated, useProgress } from "@/lib/store";

/**
 * The step between signing up and Home: two questions (why you're learning, whether you read Persian script).
 * The answers go to the Supabase profile; answering or skipping opens Home, and they're never asked again.
 */
export default function WelcomePage() {
  return (
    <AuthGate skipWelcome>
      <Welcome />
    </AuthGate>
  );
}

function Welcome() {
  const router = useRouter();
  const { settings } = useProgress();
  const hydrated = useHydrated();
  const profileReady = useProfileReady();
  const answered = hydrated && profileReady && settings.onboarded;

  // Answered just now (or earlier, here or on another device): on to Home.
  useEffect(() => {
    if (answered) router.replace(DEFAULT_AFTER_SIGN_IN);
  }, [answered, router]);

  if (!hydrated || !profileReady || answered) return <LoadingScreen label="Loading…" />;

  const firstName = settings.name.trim().split(/\s+/)[0];
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-10">
      <LogoMark className="mx-auto size-14 rounded-2xl" />
      <p className="mt-5 text-center text-muted">
        <Fa>سلام</Fa> · salâm{firstName ? `, ${firstName}` : ""}!
      </p>
      <h1 className="mt-1 text-center text-3xl font-extrabold">Welcome to Farsi Pen</h1>
      <p className="mt-2 text-center text-muted">Two quick questions so your first lessons fit you.</p>
      <div className="mt-6">
        <Onboarding />
      </div>
    </main>
  );
}
