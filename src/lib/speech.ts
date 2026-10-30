"use client";
// Audio via the browser's speech synthesis. The spec calls for pre-generated
// fa-IR neural TTS files; until a provider is chosen, this plays the device's
// own Persian voice when it has one.

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function persianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice = voices.find((v) => v.lang.toLowerCase().startsWith("fa")) ?? null;
  return cachedVoice;
}

export function canSpeak(): boolean {
  return persianVoice() !== null;
}

export function onVoicesChanged(cb: () => void): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  const handler = () => {
    cachedVoice = undefined;
    cb();
  };
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
}

export function speak(text: string, slow = false) {
  const voice = persianVoice();
  if (!voice) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = slow ? 0.6 : 0.9;
  window.speechSynthesis.speak(u);
}
