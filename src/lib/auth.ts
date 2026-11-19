"use client";
// Sign-in with Supabase Auth (Google). The site is a static export, so everything runs in the
// browser: the PKCE flow sends the learner to Google, Supabase's callback brings them back to
// /login/ with a one-time code, and the client exchanges it for a session (detectSessionInUrl).
// Progress itself still lives in localStorage (store.ts); this module only answers "who is signed in".
import { useSyncExternalStore } from "react";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { safeNext } from "./auth-redirect";
import { AUTH_ENABLED, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./backend";
import { asset, IS_DEV_SITE } from "./util";

export { AUTH_ENABLED };

let client: SupabaseClient | null = null;
function supabase(): SupabaseClient {
  if (!client)
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        // A dev-channel build on the same origin keeps its session apart from the live one, like progress.
        storageKey: IS_DEV_SITE ? "farsipen:auth:dev" : "farsipen:auth",
      },
    });
  return client;
}

export type AuthState = { status: "loading" | "signed-in" | "signed-out"; user: User | null };

const LOADING: AuthState = { status: "loading", user: null };
let state: AuthState = LOADING;
const listeners = new Set<() => void>();
let started = false;

function start() {
  if (started || !AUTH_ENABLED) return;
  started = true;
  // Fires INITIAL_SESSION once the client is ready (after finishing a Google redirect, if any), then on every change.
  supabase().auth.onAuthStateChange((_event, session) => {
    state = { status: session ? "signed-in" : "signed-out", user: session?.user ?? null };
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Who is signed in. "loading" until the session is known (always "loading" when rendered on the server). */
export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => LOADING,
  );
}

// Where to go after Google: survives the round trip in sessionStorage (it can't ride in the callback URL,
// which must match Supabase's allow list exactly).
const NEXT_KEY = IS_DEV_SITE ? "farsipen:after-sign-in:dev" : "farsipen:after-sign-in";

export function rememberNext(path: string) {
  try {
    sessionStorage.setItem(NEXT_KEY, safeNext(path));
  } catch {
    /* private mode: fall back to the dashboard */
  }
}

/** The page to open now that sign-in finished; forgets it so a later visit starts fresh. */
export function takeNext(): string {
  try {
    const next = sessionStorage.getItem(NEXT_KEY);
    sessionStorage.removeItem(NEXT_KEY);
    return safeNext(next);
  } catch {
    return safeNext(null);
  }
}

/** Sends the learner to Google. Resolves only if starting the redirect failed. */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const { error } = await supabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${asset("/login/")}` },
  });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  await supabase().auth.signOut();
}
