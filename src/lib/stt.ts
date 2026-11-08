"use client";
// Speech recognition for Persian, two free engines:
//  1. "browser" — the Web Speech API (Chrome, Edge, Safari, Samsung Internet).
//     Free, no key; the browser vendor's cloud recogniser does the work.
//  2. "whisper" — OpenAI's open Whisper model running in the page through
//     transformers.js (ONNX, WebGPU or WASM). Works in any modern browser and
//     offline after a one-time ~80 MB download, kept in the browser cache.

export type Engine = "browser" | "whisper";
export type EnginePref = "auto" | Engine;

export const WHISPER_MODEL = "onnx-community/whisper-base";
export const WHISPER_SIZE_MB = 80;

export class SttError extends Error {
  constructor(
    public code: "no-speech" | "not-allowed" | "network" | "unsupported" | "aborted" | "failed",
    message: string,
  ) {
    super(message);
  }
}

type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function recognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function browserSttSupported(): boolean {
  return recognitionCtor() !== null;
}

export function micSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
}

export function resolveEngine(pref: EnginePref): Engine | null {
  if (pref === "browser") return browserSttSupported() ? "browser" : null;
  if (pref === "whisper") return micSupported() ? "whisper" : null;
  return browserSttSupported() ? "browser" : micSupported() ? "whisper" : null;
}

/** A running listen: `stop()` ends recording early, `result` resolves with transcripts (best first). */
export interface Listening {
  stop: () => void;
  cancel: () => void;
  result: Promise<string[]>;
  /** The learner's own recording, for "My voice" — null where it can't be kept. */
  audio: Promise<Blob | null>;
}

/**
 * Phones' recognisers often lose the mic if the page records at the same
 * time, so with the browser engine we only keep a copy on desktop.
 */
export function canRecordAlongside(): boolean {
  if (!micSupported()) return false;
  try {
    if (localStorage.getItem("farsipen:noParallelRec")) return false;
  } catch {}
  return !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) && !(navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
}

/** Records the mic until `stop()`; `blob` resolves with the take (null if refused). */
function sideRecorder(): { stop: () => void; blob: Promise<Blob | null> } {
  let stopped = false;
  let rec: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  const end = () => {
    if (rec && rec.state !== "inactive") rec.stop();
    stream?.getTracks().forEach((t) => t.stop());
  };
  const blob = (async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      return null;
    }
    if (stopped) {
      stream.getTracks().forEach((t) => t.stop());
      return null;
    }
    const chunks: Blob[] = [];
    rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<void>((r) => rec!.addEventListener("stop", () => r()));
    rec.start();
    await done;
    return chunks.length ? new Blob(chunks, { type: rec.mimeType }) : null;
  })();
  return {
    stop: () => {
      stopped = true;
      end();
    },
    blob,
  };
}

// ── Web Speech API ────────────────────────────────────────────────────────

function listenBrowser(record: boolean): Listening {
  const Ctor = recognitionCtor();
  if (!Ctor) throw new SttError("unsupported", "Speech recognition isn't available in this browser");
  const rec = new Ctor();
  rec.lang = "fa-IR";
  rec.interimResults = false;
  rec.continuous = false;
  rec.maxAlternatives = 5;
  let cancelled = false;
  const side = record ? sideRecorder() : null;
  const result = new Promise<string[]>((resolve, reject) => {
    const heard: string[] = [];
    rec.onresult = (e) => {
      for (let i = 0; i < e.results.length; i++) {
        const alts = e.results[i];
        for (let j = 0; j < alts.length; j++) if (alts[j].transcript.trim()) heard.push(alts[j].transcript.trim());
      }
    };
    rec.onerror = (e) => {
      const map: Record<string, SttError["code"]> = {
        "no-speech": "no-speech",
        "audio-capture": "not-allowed",
        "not-allowed": "not-allowed",
        "service-not-allowed": "not-allowed",
        network: "network",
        "language-not-supported": "unsupported",
        aborted: "aborted",
      };
      // The recogniser lost the mic to our recording: don't record alongside again.
      if (side && e.error === "audio-capture") {
        try {
          localStorage.setItem("farsipen:noParallelRec", "1");
        } catch {}
      }
      reject(new SttError(map[e.error] ?? "failed", e.error));
    };
    rec.onend = () => {
      side?.stop();
      if (cancelled) reject(new SttError("aborted", "cancelled"));
      else if (heard.length) resolve(heard);
      else reject(new SttError("no-speech", "Nothing heard"));
    };
  });
  rec.start();
  return {
    stop: () => rec.stop(),
    cancel: () => {
      cancelled = true;
      side?.stop();
      rec.abort();
    },
    result,
    audio: side ? side.blob : Promise.resolve(null),
  };
}

// ── Whisper (in-browser) ──────────────────────────────────────────────────

type Transcriber = (audio: Float32Array, opts: Record<string, unknown>) => Promise<{ text: string } | { text: string }[]>;
let whisper: Promise<Transcriber> | null = null;
let whisperReady = false;

export function whisperLoaded(): boolean {
  return whisperReady;
}

/** Loads the Whisper model (downloads it the first time). `onProgress` gets 0–1. */
export function loadWhisper(onProgress?: (p: number) => void): Promise<Transcriber> {
  if (!whisper) {
    whisper = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      const files = new Map<string, { loaded: number; total: number }>();
      const webgpu = typeof navigator !== "undefined" && "gpu" in navigator;
      const asr = await pipeline("automatic-speech-recognition", WHISPER_MODEL, {
        device: webgpu ? "webgpu" : "wasm",
        dtype: webgpu ? { encoder_model: "fp32", decoder_model_merged: "q4" } : "q8",
        progress_callback: (p: { status: string; file?: string; loaded?: number; total?: number }) => {
          if (p.status !== "progress" || !p.file || !p.total) return;
          files.set(p.file, { loaded: p.loaded ?? 0, total: p.total });
          let loaded = 0;
          let total = 0;
          files.forEach((f) => {
            loaded += f.loaded;
            total += f.total;
          });
          onProgress?.(total ? loaded / total : 0);
        },
      });
      whisperReady = true;
      return asr as unknown as Transcriber;
    })().catch((e) => {
      whisper = null;
      throw e;
    });
  }
  return whisper;
}

async function toMono16k(blob: Blob): Promise<Float32Array> {
  const buf = await blob.arrayBuffer();
  const ctx = new AudioContext({ sampleRate: 16000 });
  try {
    const audio = await ctx.decodeAudioData(buf);
    if (audio.numberOfChannels === 1) return audio.getChannelData(0);
    const a = audio.getChannelData(0);
    const b = audio.getChannelData(1);
    const out = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) out[i] = (a[i] + b[i]) / 2;
    return out;
  } finally {
    void ctx.close();
  }
}

function listenWhisper(maxMs: number): Listening {
  let recorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  let cancelled = false;
  let stopRequested = false;
  let keep: (b: Blob | null) => void = () => {};
  const audio = new Promise<Blob | null>((r) => (keep = r));
  const stopAll = () => {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    stream?.getTracks().forEach((t) => t.stop());
  };
  const result = (async () => {
    const model = loadWhisper();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    } catch {
      throw new SttError("not-allowed", "Microphone permission was denied");
    }
    const chunks: Blob[] = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise<void>((r) => recorder!.addEventListener("stop", () => r()));
    recorder.start();
    if (stopRequested) stopAll();
    const timer = setTimeout(stopAll, maxMs);
    await done;
    clearTimeout(timer);
    stream.getTracks().forEach((t) => t.stop());
    if (cancelled) throw new SttError("aborted", "cancelled");
    const blob = new Blob(chunks, { type: recorder.mimeType });
    keep(blob);
    const pcm = await toMono16k(blob);
    if (pcm.length < 16000 * 0.3) throw new SttError("no-speech", "Recording too short");
    const asr = await model;
    const out = await asr(pcm, { language: "persian", task: "transcribe" });
    const text = (Array.isArray(out) ? out[0]?.text : out.text)?.trim() ?? "";
    if (!text) throw new SttError("no-speech", "Nothing heard");
    return [text];
  })();
  result.catch(() => keep(null));
  return {
    stop: () => {
      stopRequested = true;
      stopAll();
    },
    cancel: () => {
      cancelled = true;
      stopRequested = true;
      stopAll();
    },
    result,
    audio,
  };
}

/** Starts listening for one Persian utterance. */
export function listen(engine: Engine, maxMs = 5000, opts: { record?: boolean } = {}): Listening {
  return engine === "browser" ? listenBrowser(!!opts.record && canRecordAlongside()) : listenWhisper(maxMs);
}
