// Pure rules for the sign-in flow, kept apart from the Supabase client so they can be unit-tested.

/** Where people land after signing in when nothing else was asked for. */
export const DEFAULT_AFTER_SIGN_IN = "/app/";

/** Pages under /app that stay open without signing in. Google requires a public privacy policy. */
const PUBLIC_APP_PATHS = ["/app/privacy/"];

/** Whether a path under /app needs a signed-in user (`pathname` as usePathname gives it: no base path). */
export function needsSignIn(pathname: string): boolean {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return !PUBLIC_APP_PATHS.some((p) => path.startsWith(p));
}

/**
 * The page to open after signing in. Only same-site paths inside /app are accepted, so a crafted
 * ?next= can't send someone to another site (no scheme, no "//host", no backslashes, no "..").
 */
export function safeNext(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_AFTER_SIGN_IN;
  const ok = (raw === "/app" || raw.startsWith("/app/")) && !raw.includes("\\") && !raw.includes("..") && !/[\u0000-\u001f]/.test(raw);
  return ok ? raw : DEFAULT_AFTER_SIGN_IN;
}
