export function shuffle<T>(items: readonly T[], rand: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** The preview branch this build is for ("dev", "dev-ui"…); empty for production. */
export const CHANNEL = process.env.NEXT_PUBLIC_CHANNEL && process.env.NEXT_PUBLIC_CHANNEL !== "main" ? process.env.NEXT_PUBLIC_CHANNEL : "";

/** True on a preview-branch site (…/farsi-pen/<branch>/), false in production. */
export const IS_DEV_SITE = CHANNEL !== "";

/**
 * localStorage key for progress. Preview sites live on the same origin as
 * production (…/farsi-pen/dev/), so each gets its own key and never touches
 * real progress.
 */
export const STORAGE_KEY = IS_DEV_SITE ? `farsipen:v1:${CHANNEL}` : "farsipen:v1";

/** Prefix a public asset path with the deploy base path (GitHub Pages). */
export function asset(path: string): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;
}
