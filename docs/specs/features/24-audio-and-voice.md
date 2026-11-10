# F24 · Audio and voice: recorded clips, natural voice and real-world videos

**Product line:** 2. Script and sound (cross-cutting: every feature that plays Persian) · **Priority:** P0 · **Prototype status:** ✅ Live (native-speaker recordings 🔜)

## 1. Summary

Every Persian string in the course plays instantly from a **pre-recorded clip** (2,169 MP3s). Anything else (dictionary words, the learner's own sentences, tutor replies) uses a **natural neural voice running in the browser** (Piper), or the device's Persian voice. Native speakers' recordings take priority as they're collected. **Real-world videos** (YouGlish) let learners hear any word said by real people on YouTube.

## 2. Why it matters

- Audio is non-negotiable for a language app. Silent buttons destroy trust.
- Google's free online voice stopped serving Persian, and many devices have no Persian voice. Pre-recording fixed silent audio on every device.

## 3. User stories

- *As a learner,* I want every word and line to play instantly on any device.
- *As a learner,* I want a natural voice, and to hear real people too.
- *As a learner,* I want slow playback for hard words.

## 4. How it works in the prototype

### 4.1 Playback order (`speech.ts`)

1. **Native recording** (`public/audio/human/`, from the review tool, F23) if one exists.
2. **Recorded clip** (`public/audio/<key>.mp3`): every course string, recorded with the open Piper **fa_IR "amir"** voice (CC0 data) by `scripts/make-audio.py`.
   - Clips are keyed by **audioKey** (FNV-1a hash of the tidied text + its length), so the same text maps to the same file at build time and in the browser.
3. **Natural voice in the browser** (`tts.ts`): Piper **Amir** or **Gyro** (MIT), ~60 MB, downloaded once into the browser's private file system (OPFS), then offline. Supports slow playback with natural pitch.
4. **Device Persian voice** if the system has one.

- **One shared audio element** is unlocked on the first tap, so phones allow follow-on lines (scenes, hands-free).
- A new clip settles the previous one, so callers never wait forever.
- **English** uses the device voice (hands-free English prompts).

### 4.2 Coverage guard

`audio-texts.ts` collects every Persian string (words, examples, letters, grammar, missions, scenes, sounds, poems, readings, SAMFA). `audio.test.ts` **fails the build if any string has no clip**.

### 4.3 Real-world videos (`youglish.ts`)

- The YouGlish widget plays YouTube clips where the word is spoken, cued to the moment it's said.
- Loaded only when "Hear it in real videos" is tapped (a privacy choice).
- "Powered by YouGlish.com" stays visible as plain text, as YouGlish requires. There are no outbound links.

## 5. Data stored

- `settings.voice`.
- The Piper model in OPFS.
- Clips are static files cached by the browser.

## 6. Edge cases

- **Autoplay rules on iOS and Android:** handled by the unlocked shared element.
- **Some engines never fire "end":** a safety timeout resolves playback.
- **Hash collisions:** unlikely (32-bit + length); a test would catch a missing clip.
- **Storage:** about 2,169 clips (MB-scale). Fine for the web; size matters for an offline native app.

## 7. MVP requirements

| # | Requirement | Acceptance criteria |
|---|---|---|
| 1 | 100% of course text recorded | `audio.test.ts` passes |
| 2 | Instant playback on iOS, Android and desktop | Manual QA matrix |
| 3 | Natural voice download for everything else | Download, remove and switch voice work |
| 4 | Videos on demand only | Nothing loads from YouGlish or YouTube until tapped |
| 5 | **Native-speaker recordings for A1 words and missions** *(launch goal)* | Recorded through the review tool |

## 8. Real application

- **Professional native recordings** for all course content (male and female, Tehran accent), plus different voices per scene character.
- **Audio CDN** with caching headers. **Offline packs** in a native app.
- **Server TTS** for dynamic text (tutor replies), with a consistent voice.
- **Slow and normal speeds** for recorded clips. Syllable-by-syllable playback.

## 9. Code references

`src/lib/speech.ts` · `src/lib/tts.ts` · `src/lib/audio-key.ts` · `src/lib/audio-texts.ts` · `scripts/collect-audio.ts` · `scripts/make-audio.py` · `src/lib/youglish.ts` · `src/components/YouglishPlayer.tsx` · `public/audio/` · tests: `audio.test.ts`, `youglish.test.ts`
