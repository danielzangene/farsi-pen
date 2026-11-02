"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CheckCircle2, Download, Loader2, Trash2 } from "lucide-react";
import { updateSettings, useProgress } from "@/lib/store";
import { browserSttSupported, loadWhisper, micSupported, whisperLoaded, WHISPER_SIZE_MB, type EnginePref } from "@/lib/stt";
import { downloadVoice, onVoiceStatus, PIPER_VOICES, refreshVoice, removeVoice, voiceStatus, type PiperVoiceId } from "@/lib/tts";
import { speak } from "@/lib/speech";
import { ProgressBar, Segmented } from "./ui";

export function useVoiceStatus() {
  return useSyncExternalStore(onVoiceStatus, voiceStatus, voiceStatus);
}

/** Download / switch / remove the natural Persian voice. */
export function VoiceSetup({ compact }: { compact?: boolean }) {
  const { settings } = useProgress();
  const st = useVoiceStatus();
  useEffect(() => {
    void refreshVoice(settings.voice);
  }, [settings.voice]);
  const size = PIPER_VOICES.find((v) => v.id === settings.voice)?.sizeMb ?? 60;

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold">Natural Persian voice</span>
          <Segmented<PiperVoiceId>
            label="Voice"
            value={settings.voice}
            onChange={(voice) => updateSettings({ voice })}
            options={PIPER_VOICES.map((v) => ({ value: v.id, label: v.label }))}
          />
        </div>
      )}
      {st.state === "ready" ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-pista-ink">
            <CheckCircle2 className="size-5" /> Voice ready — works offline
          </p>
          <span className="flex gap-1">
            <button type="button" className="btn-secondary btn-sm" onClick={() => void speak("سلام، حال شما چطور است؟")}>
              Test
            </button>
            {!compact && (
              <button type="button" className="btn-ghost btn-sm" onClick={() => void removeVoice(settings.voice)}>
                <Trash2 className="size-4" /> Remove
              </button>
            )}
          </span>
        </div>
      ) : st.state === "downloading" ? (
        <div className="space-y-2" role="status">
          <p className="flex items-center gap-2 text-sm font-bold text-muted">
            <Loader2 className="size-4 animate-spin" /> Downloading voice… {Math.round(st.progress * 100)}%
          </p>
          <ProgressBar value={st.progress} tone="sky" size="sm" />
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted">
            A free, open-source neural voice (Piper) that runs in your browser. One-time download of about {size} MB, then it works offline.
          </p>
          {st.state === "error" && <p className="text-sm font-bold text-anar-ink">Download failed — check your connection and try again.</p>}
          <button type="button" className="btn-sky btn-sm" onClick={() => void downloadVoice(settings.voice)}>
            <Download className="size-4" /> Download voice
          </button>
        </div>
      )}
    </div>
  );
}

/** Choose the speech recognition engine; optionally pre-download Whisper. */
export function RecognitionSetup() {
  const { settings } = useProgress();
  const [browserOk, setBrowserOk] = useState(true);
  const [micOk, setMicOk] = useState(true);
  const [whisper, setWhisper] = useState<{ state: "idle" | "loading" | "ready" | "error"; p: number }>({ state: "idle", p: 0 });
  useEffect(() => {
    setBrowserOk(browserSttSupported());
    setMicOk(micSupported());
    if (whisperLoaded()) setWhisper({ state: "ready", p: 1 });
  }, []);

  const options: { value: EnginePref; label: string }[] = [
    { value: "auto", label: "Auto" },
    { value: "browser", label: "Browser" },
    { value: "whisper", label: "Whisper" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-bold">Speech recognition</span>
        <Segmented label="Speech recognition" value={settings.speechEngine} onChange={(speechEngine) => updateSettings({ speechEngine })} options={options} />
      </div>
      <p className="text-sm font-semibold text-muted">
        <strong className="font-extrabold text-ink">Browser</strong> uses your browser&apos;s free built-in recogniser
        {browserOk ? "" : " (not available in this browser)"}. <strong className="font-extrabold text-ink">Whisper</strong> is an open AI model that runs on
        your device — about {WHISPER_SIZE_MB} MB once, then offline{micOk ? "" : " (needs microphone access, not available here)"}. Auto picks Browser when it
        can.
      </p>
      {settings.speechEngine !== "browser" && micOk && (
        whisper.state === "ready" ? (
          <p className="flex items-center gap-2 text-sm font-bold text-pista-ink">
            <CheckCircle2 className="size-5" /> Whisper loaded
          </p>
        ) : whisper.state === "loading" ? (
          <div className="space-y-2" role="status">
            <p className="flex items-center gap-2 text-sm font-bold text-muted">
              <Loader2 className="size-4 animate-spin" /> Downloading Whisper… {Math.round(whisper.p * 100)}%
            </p>
            <ProgressBar value={whisper.p} tone="sky" size="sm" />
          </div>
        ) : (
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => {
              setWhisper({ state: "loading", p: 0 });
              loadWhisper((p) => setWhisper({ state: "loading", p }))
                .then(() => setWhisper({ state: "ready", p: 1 }))
                .catch(() => setWhisper({ state: "error", p: 0 }));
            }}
          >
            <Download className="size-4" /> {whisper.state === "error" ? "Retry Whisper download" : "Download Whisper now"}
          </button>
        )
      )}
    </div>
  );
}
