// Applies a review file exported from /app/review:
//  - writes review-report.md listing every item marked "needs a fix", with
//    the reviewer's corrected Persian and notes, to fix in src/content;
//  - converts each recording to MP3 in public/audio/human/<key>.mp3 and
//    updates public/audio/human/index.json, so the app plays the human
//    recording instead of the synthetic voice.
// Usage: node scripts/apply-review.mjs path/to/farsi-pen-review.json   (needs ffmpeg)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Same as src/lib/audio-key.ts.
const audioText = (t) => t.replace(/\s+/g, " ").trim();
function audioKey(text) {
  const t = audioText(text);
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36) + t.length.toString(36);
}

const file = process.argv[2];
if (!file) throw new Error("Usage: node scripts/apply-review.mjs <review.json>");
const data = JSON.parse(readFileSync(file, "utf8"));
if (data.app !== "farsi-pen-review") throw new Error("Not a Farsi Pen review file");

const fixes = Object.entries(data.verdicts).filter(([, v]) => !v.ok);
const report = [
  `# Content review by ${data.reviewer || "a reviewer"} (${data.exportedAt.slice(0, 10)})`,
  "",
  `${Object.keys(data.verdicts).length} items checked, ${fixes.length} need a fix, ${Object.keys(data.recordings).length} recorded.`,
  "",
  ...fixes.map(([id, v]) => `- **${id}** — ${v.text}${v.fa ? `\n  - fix: ${v.fa}` : ""}${v.note ? `\n  - note: ${v.note}` : ""}`),
  "",
].join("\n");
writeFileSync("review-report.md", report);

const out = "public/audio/human";
mkdirSync(out, { recursive: true });
const indexPath = join(out, "index.json");
const index = new Set(existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")) : []);
let made = 0;
for (const [id, url] of Object.entries(data.recordings)) {
  const v = data.verdicts[id];
  if (!v) continue;
  // A corrected line is recorded as the corrected text.
  const key = audioKey(v.fa || v.text);
  const [, b64] = url.split(",");
  const tmp = join(tmpdir(), `rev-${key}`);
  writeFileSync(tmp, Buffer.from(b64, "base64"));
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", tmp, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "48k", join(out, `${key}.mp3`)]);
  index.add(key);
  made++;
}
writeFileSync(indexPath, JSON.stringify([...index].sort()));
console.log(`review-report.md written (${fixes.length} fixes); ${made} recordings added to ${out}`);
