export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Prefix a public asset path with the deploy base path (GitHub Pages). */
export function asset(path: string): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;
}
