// Lists every Persian string the app can play, for scripts/make-audio.py.
// Run: npx tsx --tsconfig tsconfig.json scripts/collect-audio.ts > texts.json
import { collectAudioTexts } from "@/lib/audio-texts";

process.stdout.write(JSON.stringify(collectAudioTexts()));
