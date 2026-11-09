// Mission: ask for directions — original Farsi Pen content (DRAFT, pending native review).
import type { Mission } from "./types";

const where = ["kojâ", "koja", "kojast", "کجا", "کجاست"];
const left = ["chap", "چپ"];

export const DIRECTIONS: Mission = {
  id: "directions",
  title: "Ask for directions",
  titleFa: "آدرس پرسیدن",
  emoji: "🧭",
  level: "A1",
  world: "Getting around",
  scene: "You've just come out of a shop in a part of the city you don't know. You need the metro, so you stop a passer-by.",
  npc: { name: "Âghâ-ye Karimi", role: "passer-by" },
  skills: [
    { id: "dir-where", canDo: "Ask where a place is" },
    { id: "dir-follow", canDo: "Repeat directions back to check them" },
    { id: "dir-distance", canDo: "Ask how far it is" },
  ],
  dialogue: [
    { who: "you", fa: "ببخشید آقا، ایستگاه مترو کجاست؟", tr: "bebakhshid âghâ, istgâh-e metro kojâst?", en: "Excuse me, sir — where is the metro station?" },
    { who: "npc", fa: "مستقیم برید، بعد بپیچید چپ.", tr: "mostaghim berid, ba'd bepichid chap.", en: "Go straight, then turn left.", register: "colloquial" },
    { who: "you", fa: "مستقیم برم، بعد بپیچم چپ؟", tr: "mostaghim beram, ba'd bepicham chap?", en: "Go straight, then turn left?", register: "colloquial" },
    { who: "npc", fa: "بله. ایستگاه کنار پارکه.", tr: "bale. istgâh kenâr-e pârke.", en: "Yes. The station is next to the park.", register: "colloquial" },
    { who: "you", fa: "دوره؟", tr: "dure?", en: "Is it far?", register: "colloquial" },
    { who: "npc", fa: "نه، نزدیکه. پیاده پنج دقیقه است.", tr: "na, nazdike. piyâde panj daghighe ast.", en: "No, it's close. It's five minutes on foot.", register: "colloquial" },
    { who: "you", fa: "خیلی ممنون.", tr: "kheyli mamnun.", en: "Thank you very much." },
    { who: "npc", fa: "خواهش می‌کنم. موفق باشید.", tr: "khâhesh mikonam. movaffagh bâshid.", en: "You're welcome. Good luck." },
  ],
  questions: [
    { prompt: "What is the visitor looking for?", options: ["The metro station", "A bank", "A hospital", "A taxi"], answer: "The metro station" },
    { prompt: "Which way should they go?", options: ["Straight, then left", "Straight, then right", "Left, then right", "Back the way they came"], answer: "Straight, then left" },
    { prompt: "How far is it?", options: ["Five minutes on foot", "Fifteen minutes on foot", "Very far", "Two stops by bus"], answer: "Five minutes on foot" },
  ],
  phrases: [
    { skill: "dir-where", fa: "ببخشید، ایستگاه مترو کجاست؟", tr: "bebakhshid, istgâh-e metro kojâst?", en: "Excuse me, where is the metro station?", note: "Start with bebakhshid to get someone's attention politely." },
    { skill: "dir-where", fa: "بانک کجاست؟", tr: "bânk kojâst?", en: "Where is the bank?", note: "Place + kojâst? works for anywhere." },
    { skill: "dir-follow", fa: "مستقیم برم، بعد بپیچم چپ؟", tr: "mostaghim beram, ba'd bepicham chap?", en: "Go straight, then turn left?", register: "colloquial", note: "Repeating directions back is the easiest way to check you understood." },
    { skill: "dir-follow", fa: "تا چهارراه برم، بعد راست؟", tr: "tâ chahârrâh beram, ba'd râst?", en: "Up to the crossroads, then right?", register: "colloquial" },
    { skill: "dir-distance", fa: "دوره؟", tr: "dure?", en: "Is it far?", register: "colloquial", note: "Spoken: dure = dur ast. The answer is often nazdike — it's close." },
    { skill: "dir-distance", fa: "پیاده چقدر راهه؟", tr: "piyâde cheghadr râhe?", en: "How far is it on foot?", register: "colloquial" },
  ],
  grammar: {
    points: [
      "Directions are given in the polite imperative: berid (go), bepichid (turn). The verb usually comes last: mostaghim berid.",
      "To check, repeat them with the subjunctive \"I\" form: beram? bepicham? — should I go? should I turn?",
      "kojâst = kojâ + ast (where is). In speech, ast after a word often shrinks to -e: dure, nazdike, pârke.",
      "Ordinal numbers add -om: dovvom (second), sevvom (third) — khiyâbun-e dovvom, the second street.",
    ],
    table: {
      columns: ["Persian", "Meaning", "Example"],
      rows: [
        ["mostaghim", "straight", "mostaghim berid"],
        ["chap", "left", "bepichid chap"],
        ["râst", "right", "dast-e râst"],
        ["nazdik / dur", "near / far", "nazdike? dure?"],
      ],
    },
    concepts: ["imperative", "questions", "numbers"],
  },
  wordIds: ["mostaghim", "chap", "rast", "nazdik", "dur", "khiyaban", "meydan", "koja", "bebakhshid", "mamnun"],
  culture:
    "People in Iran are usually happy to help with directions, and some will walk part of the way with you. Directions are often given by landmarks — a square, a mosque, a bakery — more than by street names.",
  tasks: [
    // Ask where
    {
      skill: "dir-where",
      stage: "practice",
      prompt: "Ask: Excuse me, where is the metro station?",
      must: [["metro", "مترو"], where],
      model: { fa: "ببخشید، ایستگاه مترو کجاست؟", tr: "bebakhshid, istgâh-e metro kojâst?", en: "Excuse me, where is the metro station?" },
      hint: "bebakhshid, … metro kojâst?",
    },
    {
      skill: "dir-where",
      stage: "roleplay",
      cue: { fa: "بله؟ بفرمایید.", tr: "bale? befarmâyid.", en: "Yes? Go ahead." },
      prompt: "Ask him where the metro station is.",
      must: [["metro", "مترو"], where],
      model: { fa: "ایستگاه مترو کجاست؟", tr: "istgâh-e metro kojâst?", en: "Where is the metro station?" },
    },
    {
      skill: "dir-where",
      stage: "check",
      cue: { fa: "کمک می‌خواید؟", tr: "komak mikhâyd?", en: "Do you need help?", register: "colloquial" },
      prompt: "Ask where the bank is.",
      must: [["bânk", "bank", "بانک"], where],
      model: { fa: "ببخشید، بانک کجاست؟", tr: "bebakhshid, bânk kojâst?", en: "Excuse me, where is the bank?" },
    },
    {
      skill: "dir-where",
      stage: "recheck",
      cue: { fa: "دنبال چی می‌گردید؟", tr: "donbâl-e chi migardid?", en: "What are you looking for?", register: "colloquial" },
      prompt: "Ask where the hospital (bimârestân) is.",
      must: [["bimârestân", "bimarestan", "بیمارستان"], where],
      model: { fa: "بیمارستان کجاست؟", tr: "bimârestân kojâst?", en: "Where is the hospital?" },
    },
    // Repeat back
    {
      skill: "dir-follow",
      stage: "practice",
      prompt: "Check: Go straight, then turn left?",
      must: [["mostaghim", "mostaqim", "مستقیم"], left],
      model: { fa: "مستقیم برم، بعد بپیچم چپ؟", tr: "mostaghim beram, ba'd bepicham chap?", en: "Go straight, then turn left?" },
      hint: "mostaghim beram, ba'd … chap?",
    },
    {
      skill: "dir-follow",
      stage: "roleplay",
      cue: { fa: "مستقیم برید، بعد بپیچید چپ.", tr: "mostaghim berid, ba'd bepichid chap.", en: "Go straight, then turn left.", register: "colloquial" },
      prompt: "Repeat the directions back to check.",
      must: [["mostaghim", "mostaqim", "مستقیم"], left],
      model: { fa: "مستقیم برم، بعد بپیچم چپ؟", tr: "mostaghim beram, ba'd bepicham chap?", en: "Go straight, then turn left?" },
    },
    {
      skill: "dir-follow",
      stage: "check",
      cue: { fa: "تا چهارراه برید، بعد بپیچید راست.", tr: "tâ chahârrâh berid, ba'd bepichid râst.", en: "Go to the crossroads, then turn right.", register: "colloquial" },
      prompt: "Check: to the crossroads, then right?",
      must: [["chahârrâh", "chaharrah", "chaharah", "چهارراه"], ["râst", "rast", "راست"]],
      model: { fa: "تا چهارراه برم، بعد راست؟", tr: "tâ chahârrâh beram, ba'd râst?", en: "Up to the crossroads, then right?" },
    },
    {
      skill: "dir-follow",
      stage: "recheck",
      cue: { fa: "خیابون دوم، سمت چپ.", tr: "khiyâbun-e dovvom, samt-e chap.", en: "The second street, on the left.", register: "colloquial" },
      prompt: "Check: the second street on the left?",
      must: [["dovvom", "dovom", "دوم"], left],
      model: { fa: "خیابون دوم سمت چپ؟", tr: "khiyâbun-e dovvom samt-e chap?", en: "The second street on the left?" },
    },
    // How far
    {
      skill: "dir-distance",
      stage: "practice",
      prompt: "Ask: How far is it on foot?",
      must: [["piyâde", "piyade", "piade", "پیاده"], ["cheghadr", "chegadr", "chand", "چقدر", "چند"]],
      model: { fa: "پیاده چقدر راهه؟", tr: "piyâde cheghadr râhe?", en: "How far is it on foot?" },
      hint: "piyâde cheghadr …?",
    },
    {
      skill: "dir-distance",
      stage: "roleplay",
      cue: { fa: "ایستگاه کنار پارکه.", tr: "istgâh kenâr-e pârke.", en: "The station is next to the park.", register: "colloquial" },
      prompt: "Ask how far it is on foot.",
      must: [["piyâde", "piyade", "piade", "پیاده"], ["cheghadr", "chegadr", "chand", "چقدر", "چند"]],
      model: { fa: "پیاده چقدر راهه؟", tr: "piyâde cheghadr râhe?", en: "How far is it on foot?" },
    },
    {
      skill: "dir-distance",
      stage: "check",
      cue: { fa: "بانک اون طرف میدونه.", tr: "bânk un taraf-e meydune.", en: "The bank is on the other side of the square.", register: "colloquial" },
      prompt: "Ask if it's far (dur).",
      must: [["dur", "دور"]],
      model: { fa: "دوره؟", tr: "dure?", en: "Is it far?" },
    },
    {
      skill: "dir-distance",
      stage: "recheck",
      cue: { fa: "بیمارستان پشت این خیابونه.", tr: "bimârestân posht-e in khiyâbune.", en: "The hospital is behind this street.", register: "colloquial" },
      prompt: "Ask how many minutes (daghighe) it is on foot.",
      must: [["daghighe", "daqiqe", "دقیقه"], ["chand", "چند"]],
      model: { fa: "پیاده چند دقیقه است؟", tr: "piyâde chand daghighe ast?", en: "How many minutes is it on foot?" },
    },
  ],
};
