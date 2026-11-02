"use client";
// Audio, tried in order until one works:
//  1. the natural Piper voice (tts.ts), once the learner has downloaded it;
//  2. the device's own Persian voice, if it has one;
//  3. an online Persian voice (Google Translate's free TTS endpoint) — so the
//     speaker buttons work out of the box on every device.
import { getSettings } from "./store";
import { onVoiceStatus, refreshVoice, speakNatural, voiceStatus } from "./tts";

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

/** Speaker buttons stay enabled: there's always the online voice to fall back on. */
export function canSpeak(): boolean {
  return natural() || persianVoice() !== null || (typeof navigator !== "undefined" && navigator.onLine !== false);
}

const ONLINE_TTS = "https://translate.google.com/translate_tts?ie=UTF-8&tl=fa&client=tw-ob&q=";
let onlineAudio: HTMLAudioElement | null = null;

/** Plays `text` with the online Persian voice. Resolves true when playback finished. */
function speakOnline(text: string, slow: boolean): Promise<boolean> {
  onlineAudio?.pause();
  const audio = new Audio(ONLINE_TTS + encodeURIComponent(text.slice(0, 200)));
  audio.playbackRate = slow ? 0.7 : 1;
  audio.preservesPitch = true;
  onlineAudio = audio;
  return new Promise((resolve) => {
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.play().catch(() => resolve(false));
  });
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

/** Speaks `text`; resolves true if it played (when done for recorded voices, at start for the device voice). */
export async function speak(text: string, slow = false): Promise<boolean> {
  const t = text.trim();
  if (!t) return false;
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
    window.speechSynthesis.speak(u);
    return true;
  }
  return speakOnline(t, slow);
}
