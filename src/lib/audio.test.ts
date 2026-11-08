import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { audioKey } from "./audio-key";
import { collectAudioTexts } from "./audio-texts";

describe("recorded audio", () => {
  it("has a clip for every Persian string in the course", () => {
    const index = new Set<string>(JSON.parse(readFileSync("public/audio/index.json", "utf8")));
    const missing = Object.entries(collectAudioTexts()).filter(([k]) => !index.has(k)).map(([, t]) => t);
    // Fix: npx tsx --tsconfig tsconfig.json scripts/collect-audio.ts > /tmp/t.json && python3 scripts/make-audio.py /tmp/t.json <voice.onnx>
    expect(missing, `${missing.length} strings have no recording`).toEqual([]);
  });
  it("keys text the same however it is spaced", () => {
    expect(audioKey(" سلام  دنیا ")).toBe(audioKey("سلام دنیا"));
    expect(audioKey("سلام")).not.toBe(audioKey("سلام!"));
  });
});
