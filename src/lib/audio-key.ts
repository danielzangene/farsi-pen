// Key for a pre-recorded clip: the text, tidied the same way at build time
// (scripts/collect-audio.ts) and in the browser (speech.ts), hashed with
// 32-bit FNV-1a plus its length so keys stay short and collisions unlikely.

export function audioText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function audioKey(text: string): string {
  const t = audioText(text);
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36) + t.length.toString(36);
}
