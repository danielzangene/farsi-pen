"use client";
import { updateSettings, useProgress } from "@/lib/store";
import { Segmented } from "./ui";

/** Direction and script toggles shown above lessons and practice. */
export function CardControls({ showDirection = true }: { showDirection?: boolean }) {
  const { settings } = useProgress();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showDirection && (
        <Segmented
          label="Direction"
          value={settings.direction}
          onChange={(direction) => updateSettings({ direction })}
          options={[
            { value: "fa-en", label: "FA → EN" },
            { value: "en-fa", label: "EN → FA" },
          ]}
        />
      )}
      <Segmented
        label="Script"
        value={settings.scriptOnly ? "only" : settings.script}
        onChange={(v) => updateSettings(v === "only" ? { scriptOnly: true } : { script: v, scriptOnly: false })}
        options={[
          { value: "latin", label: "Latin first" },
          { value: "farsi", label: "فارسی first" },
          { value: "only", label: "Script only" },
        ]}
      />
    </div>
  );
}
