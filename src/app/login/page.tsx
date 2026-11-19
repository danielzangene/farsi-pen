"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2 } from "lucide-react";
import { LogoMark } from "@/components/AppNav";
import { AUTH_ENABLED, rememberNext, signInWithGoogle, takeNext, useAuth } from "@/lib/auth";

/** Google's "G" mark in its standard colours, as its sign-in branding guidelines require. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5 shrink-0" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** What Google or Supabase sent back when sign-in didn't finish (e.g. the learner pressed Cancel). */
function callbackError(params: URLSearchParams): string | null {
  const code = params.get("error");
  if (!code) return null;
  if (code === "access_denied") return "Sign-in was cancelled. You can try again whenever you're ready.";
  return params.get("error_description") ?? "Google sign-in didn't finish. Please try again.";
}

/**
 * Sign in to use the app. One action: continue with Google. Coming back from Google, the Supabase client
 * finishes the sign-in from the URL and this page forwards to the page that was asked for.
 */
export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [returning, setReturning] = useState(false);

  // Read the URL once: ?next= from the guard, or ?code= / ?error= on the way back from Google.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) rememberNext(next);
    setReturning(params.has("code"));
    setError(callbackError(params));
  }, []);

  useEffect(() => {
    if (!AUTH_ENABLED) router.replace("/app/");
    else if (status === "signed-in") router.replace(takeNext());
    else if (status === "signed-out") setReturning(false);
  }, [status, router]);

  async function continueWithGoogle() {
    setError(null);
    setOpening(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setOpening(false);
      setError("Couldn't open Google sign-in. Check your connection and try again.");
    }
  }

  const finishing = returning || status === "signed-in";
  const busy = opening || finishing;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-4 py-10">
      <div className="card p-6 text-center sm:p-8">
        <Link href="/" aria-label="Farsi Pen home" className="mx-auto block w-fit rounded-2xl">
          <LogoMark className="size-16 rounded-2xl" />
        </Link>
        <h1 className="mt-5 text-2xl font-extrabold">Sign in to Farsi Pen</h1>
        <p className="mt-2 text-muted">Sign in to start learning. Your progress stays saved on this device.</p>

        <button type="button" className="btn-provider btn-lg mt-6 w-full" onClick={continueWithGoogle} disabled={busy || status === "loading"}>
          {busy ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <GoogleMark />}
          {opening ? "Opening Google…" : finishing ? "Signing you in…" : "Continue with Google"}
        </button>

        {error && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-anar-soft p-3 text-start text-sm font-semibold text-anar-ink">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/app/privacy/" className="font-semibold text-firuze-ink underline-offset-4 hover:underline">
          Privacy
        </Link>
        <span aria-hidden> · </span>
        <Link href="/" className="font-semibold text-firuze-ink underline-offset-4 hover:underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
