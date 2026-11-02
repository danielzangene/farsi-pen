"use client";
// Audio. Prefers the natural Piper voice (tts.ts) once the learner has
// downloaded it; otherwise plays the device's own Persian voice when it has one.
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

export function canSpeak(): boolean {
  return natural() || persianVoice() !== null;
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

/** Speaks `text`; resolves when done (immediately for the device voice). */
export async function speak(text: string, slow = false): Promise<void> {
  if (natural()) {
    try {
      return await speakNatural(text, slow ? 0.7 : 1);
    } catch {
      // fall through to the device voice
    }
  }
  const voice = persianVoice();
  if (!voice) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = slow ? 0.6 : 0.9;
  window.speechSynthesis.speak(u);
}
