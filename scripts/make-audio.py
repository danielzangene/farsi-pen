"""Pre-records every Persian string in the app with the Piper "amir" voice
(fa_IR-amir-medium: MIT code, CC0 dataset) as small MP3s in public/audio/.

  npx tsx --tsconfig tsconfig.json scripts/collect-audio.ts > /tmp/texts.json
  python3 scripts/make-audio.py /tmp/texts.json path/to/fa_IR-amir-medium.onnx

Only missing clips are recorded; clips no longer used are deleted. Needs
`pip install piper-tts` and ffmpeg.
"""
import io, json, os, subprocess, sys, wave

from piper import PiperVoice, SynthesisConfig

texts = json.load(open(sys.argv[1]))
voice = PiperVoice.load(sys.argv[2])
# A touch slower than the voice's natural pace, which is quick for learners.
config = SynthesisConfig(length_scale=1.1)
out = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(out, exist_ok=True)

made = 0
for key, text in texts.items():
    path = os.path.join(out, key + ".mp3")
    if os.path.exists(path):
        continue
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        voice.synthesize_wav(text, w, syn_config=config)
    # Mono 32 kbps MP3: plays everywhere (Safari included), a few KB per clip.
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-f", "wav", "-i", "pipe:0", "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.08", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "32k", path],
        input=buf.getvalue(), check=True,
    )
    made += 1
    if made % 100 == 0:
        print(made, "recorded", flush=True)

keep = set(texts)
removed = 0
for f in os.listdir(out):
    if f.endswith(".mp3") and f[:-4] not in keep:
        os.remove(os.path.join(out, f))
        removed += 1

with open(os.path.join(out, "index.json"), "w") as f:
    json.dump(sorted(keep), f, separators=(",", ":"))
print(f"{made} recorded, {removed} removed, {len(keep)} clips")
