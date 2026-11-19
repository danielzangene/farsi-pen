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

/** Which build this is: "dev" for a test build (NEXT_PUBLIC_CHANNEL=dev), otherwise production. */
export const IS_DEV_SITE = process.env.NEXT_PUBLIC_CHANNEL === "dev";

/**
 * localStorage key for progress. A dev build gets its own key, so a test site
 * on the same origin as production never touches real progress.
 */
export const STORAGE_KEY = IS_DEV_SITE ? "farsipen:v1:dev" : "farsipen:v1";

/** Prefix a public asset path with the build's base path (empty on Vercel; set when hosted under a sub-path). */
export function asset(path: string): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;
}
