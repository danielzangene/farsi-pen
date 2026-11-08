"use client";
// Audio, tried in order until one works:
//  1. a recorded clip — every Persian string in the course is pre-recorded
//     with the open Piper "amir" voice (scripts/make-audio.py) and served
//     from /audio, so it plays instantly on every device;
//  2. the natural Piper voice running in the browser (tts.ts), once the
//     learner has downloaded it — for anything else (dictionary words…);
//  3. the device's own Persian voice, if it has one.
import { audioKey } from "./audio-key";
import { getSettings } from "./store";
import { onVoiceStatus, refreshVoice, speakNatural, stopNatural, voiceStatus } from "./tts";
import { asset } from "./util";
let checkedNatural = false;
function natural(): boolean {
  if (!checkedNatural && typeof window !== "undefined") {
    checkedNatural = true;
    void refreshVoice(getSettings().voice);
  }
  return voiceStatus().state === "ready";
}

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function persianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice = voices.find((v) => v.lang.toLowerCase().startsWith("fa")) ?? null;
  return cachedVoice;
}

/** Speaker buttons stay enabled: course text is recorded, and anything else can use a voice. */
export function canSpeak(): boolean {
  return natural() || persianVoice() !== null || (typeof navigator !== "undefined" && navigator.onLine !== false);
}

// ── Recorded clips ───────────────────────────────────────────────────────

let clipIndex: Promise<Set<string>> | null = null;
function clips(): Promise<Set<string>> {
  if (!clipIndex)
    clipIndex = fetch(asset("/audio/index.json"))
      .then((r) => (r.ok ? r.json() : []))
      .then((keys: string[]) => new Set(keys))
      .catch(() => {
        clipIndex = null; // try again next time (e.g. back online)
        return new Set<string>();
      });
  return clipIndex;
}

// One shared element: phones only let a page play sound on an element that
// was first started by a tap, so it is unlocked on the first touch and reused.
let player: HTMLAudioElement | null = null;
const SILENCE = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAlgAenp6enp6enp6enp6enp6enp6enp6enp6pqampqampqampqampqampqampqampqamptPT09PT09PT09PT09PT09PT09PT09PT09P/////////////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQCcQAAAAAAAAJY+/rsqgAAAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
function getPlayer(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = "auto";
  }
  return player;
}
if (typeof window !== "undefined") {
  const unlock = () => {
    const p = getPlayer();
    if (!p.src || p.src === SILENCE) {
      p.src = SILENCE;
      p.play().catch(() => {});
    }
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  };
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
}

// Settles the clip that is playing now, so a new one never leaves an earlier caller waiting.
let settle: ((ok: boolean) => void) | null = null;

function playClip(key: string, slow: boolean): Promise<boolean> {
  const p = getPlayer();
  settle?.(false);
  p.pause();
  p.src = asset(`/audio/${key}.mp3`);
  p.playbackRate = slow ? 0.75 : 1;
  (p as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
  p.preservesPitch = true;
  return new Promise((resolve) => {
    const done = (ok: boolean) => {
      if (settle !== done) return;
      settle = null;
      p.onended = p.onerror = null;
      resolve(ok);
    };
    settle = done;
    p.onended = () => done(true);
    p.onerror = () => done(false);
    p.play().catch(() => done(false));
  });
}

/** Stops whatever is playing. */
export function stopSpeaking() {
  settle?.(true);
  player?.pause();
  stopNatural();
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** True when the device itself has a Persian voice (no download needed). */
export function hasDeviceVoice(): boolean {
  return persianVoice() !== null;
}

export function onVoicesChanged(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  natural();
  const offNatural = onVoiceStatus(cb);
  if (!("speechSynthesis" in window)) return offNatural;
  const handler = () => {
    cachedVoice = undefined;
    cb();
  };
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  return () => {
    offNatural();
    window.speechSynthesis.removeEventListener("voiceschanged", handler);
  };
}

/** Speaks `text`; resolves true once it has played. */
export async function speak(text: string, slow = false): Promise<boolean> {
  const t = text.trim();
  if (!t) return false;
  const key = audioKey(t);
  if ((await clips()).has(key) && (await playClip(key, slow))) return true;
  if (natural()) {
    try {
      await speakNatural(t, slow ? 0.7 : 1);
      return true;
    } catch {
      // fall through
    }
  }
  const voice = persianVoice();
  if (voice) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = slow ? 0.6 : 0.9;
    // Resolve when it finishes (so "back to back" can follow it), with a
    // safety timeout: some engines never fire onend.
    return new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => resolve(true), 1500 + t.length * (slow ? 220 : 140));
      const done = () => {
        clearTimeout(timer);
        resolve(true);
      };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
    });
  }
  return false;
}
