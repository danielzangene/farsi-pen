// Builds public/data/fa-words.txt: a compact list of valid Persian words used
// for spelling suggestions ("Did you mean …?").
//
// Source: Persian-Words-Database by shahind (https://github.com/shahind/Persian-Words-Database),
// a word list compiled from the Moein dictionary, Persian Wikipedia and poetry.
// Only bare words are taken (no definitions or groupings), in the source's order.
//
// Usage: node scripts/build-lexicon.mjs <path to distinct_words.txt> [limit]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const [src, limitArg] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/build-lexicon.mjs <distinct_words.txt> [limit]");
  process.exit(2);
}
const limit = Number(limitArg ?? 60000);
const PERSIAN = /^[آا-غف-يپچژکگی‌]+$/;
const seen = new Set();
const out = [];
for (const raw of readFileSync(src, "utf8").replace(/^﻿/, "").split(/\r?\n/)) {
  const w = raw.trim().replace(/ك/g, "ک").replace(/[يى]/g, "ی");
  if (w.length < 2 || w.length > 16 || !PERSIAN.test(w) || w.startsWith("‌") || w.endsWith("‌") || seen.has(w)) continue;
  seen.add(w);
  out.push(w);
  if (out.length >= limit) break;
}
mkdirSync("public/data", { recursive: true });
writeFileSync("public/data/fa-words.txt", out.join("\n") + "\n");
console.log(`wrote ${out.length} words to public/data/fa-words.txt`);
