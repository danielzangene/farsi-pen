// Builds the look-up dictionary in public/data/dict/ from VahidN's
// English-to-Persian dictionaries (https://github.com/VahidN/EnglishToPersianDictionaries,
// Apache-2.0). Three of them are used:
//   essential-english-words — short, clean meanings for common words (ranked first)
//   generic-1              — a larger general dictionary, filtered and trimmed
//   learn-english          — example sentences with translations
// Output (all lazy-loaded by the app):
//   dict/en/<a-z>.json  { word: { m: [meanings], s?: [sentence ids] } }
//   dict/fa/<letter>.json { persianMeaning: [english words] }   (reverse look-up)
//   dict/sentences.json [[english, persian], …]
//
// Usage: node scripts/build-dictionary.mjs <folder with the three dictionary folders>
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("usage: node scripts/build-dictionary.mjs <dicts folder>");
  process.exit(2);
}

const read = (dir) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => JSON.parse(readFileSync(join(root, dir, f), "utf8").replace(/^﻿/, "")).Words ?? []);

const cleanFa = (s) =>
  s
    .replace(/ك/g, "ک")
    .replace(/[يى]/g, "ی")
    .replace(/دالء/g, "دلا")
    .replace(/‌+$/g, "")
    .replace(/^‌+/g, "")
    .replace(/\s+/g, " ")
    .trim();
const PERSIAN = /[؀-ۿ]/;
const LATIN = /[A-Za-z]/;

// Old digital dictionaries often drop the madde: اب for آب, اهن for آهن. When the
// آ-form of a word ranks clearly higher in the Persian word list (public/data/fa-words.txt,
// see build-lexicon.mjs), restore it.
let lexRank = new Map();
try {
  lexRank = new Map(readFileSync("public/data/fa-words.txt", "utf8").split("\n").map((w, i) => [w, i]));
} catch {}
const fixMadde = (phrase) =>
  phrase
    .split(" ")
    .map((tok) => {
      if (!tok.startsWith("ا")) return tok;
      const withMadde = "آ" + tok.slice(1);
      const a = lexRank.get(withMadde);
      const plain = lexRank.get(tok);
      return a !== undefined && (plain === undefined || a < plain) ? withMadde : tok;
    })
    .join(" ");

// Between two spellings of one meaning ("دریا" / "در یا", "تخم‌مرغ" / "تخم مرغ"),
// prefer the one the word list knows, then the one without a plain space.
const dupKey = (x) => x.replace(/[\s\u200c]/g, "");
const better = (a, b) => {
  const ka = lexRank.has(a) ? 0 : 1;
  const kb = lexRank.has(b) ? 0 : 1;
  if (ka !== kb) return ka < kb ? a : b;
  return (a.match(/ /g)?.length ?? 0) <= (b.match(/ /g)?.length ?? 0) ? a : b;
};
const pushUnique = (arr, m, max) => {
  const i = arr.findIndex((o) => dupKey(o) === dupKey(m));
  if (i >= 0) arr[i] = better(arr[i], m);
  else if (arr.length < max) arr.push(m);
};

function meanings(list, maxEach, maxCount) {
  const out = [];
  for (const raw of list ?? []) {
    for (const part of String(raw).split(/[،,;؛]/)) {
      const m = fixMadde(cleanFa(part));
      if (!m || !PERSIAN.test(m) || LATIN.test(m) || m.length > maxEach) continue;
      pushUnique(out, m, maxCount);
    }
  }
  return out;
}

const en = new Map(); // word -> { m: [], s: [] }
const add = (word, ms) => {
  const k = word.toLowerCase().trim();
  if (!/^[a-z][a-z' -]{0,24}$/.test(k) || k.split(" ").length > 3 || !ms.length) return;
  const e = en.get(k) ?? { m: [] };
  for (const m of ms) pushUnique(e.m, m, 5);
  en.set(k, e);
};

for (const w of read("essential-english-words")) add(w.EnglishWord, meanings(w.Meanings, 40, 4));
for (const w of read("generic-1")) add(w.EnglishWord, meanings(w.Meanings, 32, 3));

// Sentences: index each by its content words.
const STOP = new Set("a an the to of in on at is are am be was were i you he she it we they my your his her our their and or but for with this that do does did not no yes".split(" "));
const sentences = [];
for (const w of read("learn-english")) {
  const e = String(w.EnglishWord ?? "").trim();
  const f = meanings(w.Meanings, 160, 1)[0];
  if (!e || !f || e.length > 120 || e.split(" ").length < 2) continue;
  const id = sentences.push([e, f]) - 1;
  for (const tok of new Set(e.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/))) {
    if (tok.length < 3 || STOP.has(tok) || !en.has(tok)) continue;
    const entry = en.get(tok);
    entry.s = entry.s ?? [];
    if (entry.s.length < 2) entry.s.push(id);
  }
}

// Rank each entry's meanings: everyday words first. A meaning that appears in the
// modern example sentences (or in the app's course vocabulary file, if present)
// beats an older or more literary synonym listed earlier, e.g. فیل over پیل.
const modern = sentences.map(([, f]) => f).join(" ");
let course = "";
try {
  course = readFileSync("src/content/words.ts", "utf8") + readdirSync("src/content/words").map((f) => readFileSync(join("src/content/words", f), "utf8")).join(" ");
} catch {}
const familiarity = (m) => {
  const re = new RegExp(`(^|[\\s،.؟!«»"'])${m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[\\s،.؟!«»"'])`, "g");
  return (course.match(re)?.length ?? 0) * 5 + (modern.match(re)?.length ?? 0);
};
for (const e of en.values()) {
  const score = new Map(e.m.map((m, i) => [m, familiarity(m) * 10 - i]));
  e.m.sort((a, b) => score.get(b) - score.get(a));
}

// Reverse index: short Persian meanings -> English words (essential words first, as inserted).
const fa = new Map();
for (const [word, e] of en) {
  for (const m of e.m) {
    if (m.split(" ").length > 3) continue;
    const list = fa.get(m) ?? [];
    if (list.length < 4 && !list.includes(word)) list.push(word);
    fa.set(m, list);
  }
}

const out = "public/data/dict";
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "en"), { recursive: true });
mkdirSync(join(out, "fa"), { recursive: true });
const shard = (map, keyOf) => {
  const shards = new Map();
  for (const [k, v] of map) {
    const s = keyOf(k);
    if (!shards.has(s)) shards.set(s, {});
    shards.get(s)[k] = v;
  }
  return shards;
};
let enFiles = 0;
for (const [letter, obj] of shard(en, (k) => k[0])) {
  writeFileSync(join(out, "en", `${letter}.json`), JSON.stringify(obj));
  enFiles++;
}
const faKey = (k) => k[0].codePointAt(0).toString(16);
let faFiles = 0;
for (const [letter, obj] of shard(fa, faKey)) {
  writeFileSync(join(out, "fa", `${letter}.json`), JSON.stringify(obj));
  faFiles++;
}
writeFileSync(join(out, "sentences.json"), JSON.stringify(sentences));
console.log(`en entries ${en.size} in ${enFiles} files · fa keys ${fa.size} in ${faFiles} files · sentences ${sentences.length}`);
