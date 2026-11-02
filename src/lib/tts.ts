"use client";
// Natural Persian voice, generated in the browser with Piper (open-source
// neural TTS, MIT) — free, no API key, works offline once downloaded.
// The voice model (~60 MB) downloads once and is kept in the browser's
// private file system (OPFS). Until then speech.ts falls back to the device's
// own Persian voice, if it has one.

export const PIPER_VOICES = [
  { id: "fa_IR-amir-medium", label: "Amir", sizeMb: 63 },
  { id: "fa_IR-gyro-medium", label: "Gyro", sizeMb: 63 },
] as const;
export type PiperVoiceId = (typeof PIPER_VOICES)[number]["id"];
export const DEFAULT_PIPER_VOICE: PiperVoiceId = "fa_IR-amir-medium";

// Must match the onnxruntime-web version installed (package.json pins it exactly).
const ORT_VERSION = "1.31.1";
const WASM_PATHS = {
  onnxWasm: `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`,
  piperData: "https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.data",
  piperWasm: "https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.wasm",
};

export type VoiceStatus =
  | { state: "unknown" }
  | { state: "missing" }
  | { state: "downloading"; progress: number }
  | { state: "ready" }
  | { state: "error"; message: string };

type PiperModule = typeof import("@mintplex-labs/piper-tts-web");
type Session = InstanceType<PiperModule["TtsSession"]>;

let status: VoiceStatus = { state: "unknown" };
let voiceId: PiperVoiceId = DEFAULT_PIPER_VOICE;
let session: Promise<Session> | null = null;
const listeners = new Set<() => void>();
const cache = new Map<string, string>(); // text → object URL
let current: HTMLAudioElement | null = null;

function set(next: VoiceStatus) {
  status = next;
  listeners.forEach((l) => l());
}

export function voiceStatus(): VoiceStatus {
  return status;
}

export function onVoiceStatus(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const piper = () => import("@mintplex-labs/piper-tts-web");

/** Checks whether the chosen voice is already stored in this browser. */
export async function refreshVoice(id: PiperVoiceId = voiceId): Promise<VoiceStatus> {
  if (typeof window === "undefined" || !navigator.storage?.getDirectory) {
    set({ state: "error", message: "This browser can't store the voice" });
    return status;
  }
  if (id !== voiceId) {
    voiceId = id;
    resetSession();
  }
  try {
    const stored = await (await piper()).stored();
    if (status.state !== "downloading") set(stored.includes(voiceId) ? { state: "ready" } : { state: "missing" });
  } catch {
    set({ state: "missing" });
  }
  return status;
}

function resetSession() {
  session = null;
  cache.forEach((url) => URL.revokeObjectURL(url));
  cache.clear();
  void piper().then((m) => {
    m.TtsSession._instance = null;
  });
}

async function getSession(onProgress?: (p: number) => void): Promise<Session> {
  if (!session) {
    session = (async () => {
      const m = await piper();
      m.TtsSession._instance = null;
      return m.TtsSession.create({
        voiceId,
        wasmPaths: WASM_PATHS,
        progress: (p) => {
          if (p.total && p.url.endsWith(".onnx")) onProgress?.(p.loaded / p.total);
        },
      });
    })().catch(async (e) => {
      session = null;
      (await piper()).TtsSession._instance = null;
      throw e;
    });
  }
  return session;
}

/** Downloads the voice (once) and warms up the model. */
export async function downloadVoice(id: PiperVoiceId = voiceId): Promise<boolean> {
  if (id !== voiceId) {
    voiceId = id;
    resetSession();
  }
  set({ state: "downloading", progress: 0 });
  try {
    await getSession((p) => set({ state: "downloading", progress: p }));
    set({ state: "ready" });
    return true;
  } catch (e) {
    set({ state: "error", message: e instanceof Error ? e.message : "Download failed" });
    return false;
  }
}

export async function removeVoice(id: PiperVoiceId = voiceId) {
  resetSession();
  try {
    await (await piper()).remove(id);
  } catch {}
  set({ state: "missing" });
}

/** Plays `text` with the Piper voice. Resolves when playback ends. */
export async function speakNatural(text: string, rate = 1): Promise<void> {
  const key = text.trim();
  if (!key) return;
  let url = cache.get(key);
  if (!url) {
    const s = await getSession();
    url = URL.createObjectURL(await s.predict(key));
    cache.set(key, url);
  }
  current?.pause();
  const audio = new Audio(url);
  audio.playbackRate = rate;
  // Keep pitch natural when slowed down (Safari still uses the webkit name).
  (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
  audio.preservesPitch = true;
  current = audio;
  await new Promise<void>((resolve) => {
    audio.onended = audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

export function stopNatural() {
  current?.pause();
}
