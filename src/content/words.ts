// Level 1 vocabulary — original Farsi Pen content (DRAFT, pending native review).
//
// Transliteration style (proposed in the V1 spec):
//   â = long a (ا/آ)   a = short a   e = short e   o = short o
//   u = long u (و)     i = long i (ی)
//   kh = خ   gh = غ/ق   sh = ش   zh = ژ   ch = چ   ' = ع/ء
// "\u200c" is the zero-width non-joiner (half-space), e.g. می\u200cبینمت.

export type Register = "colloquial" | "formal" | "both";
export type Pos = "noun" | "verb" | "adjective" | "phrase" | "number" | "pronoun" | "interjection";

export interface Example {
  fa: string;
  tr: string;
  en: string;
}

export interface Word {
  id: string;
  fa: string;
  tr: string;
  en: string;
  /** Other English meanings accepted when typing. */
  alt?: string[];
  /** Other transliterations accepted when typing (spelling variants). */
  altTr?: string[];
  pos: Pos;
  register: Register;
  soundsLike: string;
  example: Example;
  note?: string;
}

const ZW = "\u200c";

export const WORDS: Word[] = [
  // ── Lesson 1: Greetings ────────────────────────────────────────────────
  {
    id: "salam", fa: "سلام", tr: "salâm", en: "hello", alt: ["hi"], pos: "interjection", register: "both",
    soundsLike: "sa-LAAM",
    example: { fa: "سلام، حالت چطوره؟", tr: "salâm, hâlet chetore?", en: "Hello, how are you?" },
  },
  {
    id: "khodahafez", fa: "خداحافظ", tr: "khodâhâfez", en: "goodbye", alt: ["bye"], pos: "interjection", register: "both",
    soundsLike: "kho-DAA-haa-fez",
    example: { fa: `خداحافظ، فردا می${ZW}بینمت.`, tr: "khodâhâfez, fardâ mibinamet.", en: "Goodbye, see you tomorrow." },
  },
  {
    id: "sobh-bekheyr", fa: "صبح بخیر", tr: "sobh bekheyr", en: "good morning", pos: "phrase", register: "both",
    soundsLike: "SOBH be-KHEYR",
    example: { fa: "صبح بخیر مامان!", tr: "sobh bekheyr mâmân!", en: "Good morning, Mom!" },
  },
  {
    id: "shab-bekheyr", fa: "شب بخیر", tr: "shab bekheyr", en: "good night", pos: "phrase", register: "both",
    soundsLike: "SHAB be-KHEYR",
    example: { fa: "شب بخیر، خوب بخوابی.", tr: "shab bekheyr, khub bekhâbi.", en: "Good night, sleep well." },
  },
  {
    id: "khosh-amadid", fa: "خوش آمدید", tr: "khosh âmadid", en: "welcome", pos: "phrase", register: "formal",
    soundsLike: "KHOSH aa-ma-DEED",
    example: { fa: "به خانهٔ ما خوش آمدید.", tr: "be khâne-ye mâ khosh âmadid.", en: "Welcome to our home." },
    note: "In everyday speech you will often hear khosh omadin.",
  },
  {
    id: "halet-chetore", fa: "حالت چطوره؟", tr: "hâlet chetore?", en: "how are you?", alt: ["how are you doing"],
    pos: "phrase", register: "colloquial",
    soundsLike: "haa-LET che-to-REH",
    example: { fa: "سلام علی، حالت چطوره؟", tr: "salâm Ali, hâlet chetore?", en: "Hi Ali, how are you?" },
    note: "Formal version: hâl-e shomâ chetor ast?",
  },
  {
    id: "khubam", fa: "خوبم", tr: "khubam", en: "I'm fine", alt: ["i am fine", "i'm good", "i am good", "i'm well"],
    pos: "phrase", register: "colloquial",
    soundsLike: "KHOO-bam",
    example: { fa: "خوبم، مرسی.", tr: "khubam, mersi.", en: "I'm fine, thanks." },
  },
  {
    id: "esmet-chiye", fa: "اسمت چیه؟", tr: "esmet chiye?", en: "what's your name?", alt: ["what is your name"],
    pos: "phrase", register: "colloquial",
    soundsLike: "es-MET chi-YEH",
    example: { fa: "سلام! اسمت چیه؟", tr: "salâm! esmet chiye?", en: "Hi! What's your name?" },
    note: "Formal version: esm-e shomâ chist?",
  },

  // ── Lesson 2: Courtesy ─────────────────────────────────────────────────
  {
    id: "mersi", fa: "مرسی", tr: "mersi", en: "thanks", alt: ["thank you"], pos: "interjection", register: "colloquial",
    soundsLike: "MER-see",
    example: { fa: "مرسی، خیلی لطف داری.", tr: "mersi, kheyli lotf dâri.", en: "Thanks, that's very kind of you." },
  },
  {
    id: "mamnun", fa: "ممنون", tr: "mamnun", en: "thank you", alt: ["thanks", "grateful"], pos: "interjection", register: "both",
    soundsLike: "mam-NOON",
    example: { fa: "ممنون از کمکت.", tr: "mamnun az komakat.", en: "Thanks for your help." },
  },
  {
    id: "lotfan", fa: "لطفاً", tr: "lotfan", en: "please", pos: "interjection", register: "both",
    soundsLike: "LOT-fan",
    example: { fa: "یک چای، لطفاً.", tr: "yek chây, lotfan.", en: "A tea, please." },
  },
  {
    id: "bebakhshid", fa: "ببخشید", tr: "bebakhshid", en: "excuse me", alt: ["sorry"], pos: "interjection", register: "both",
    soundsLike: "be-bakh-SHEED",
    example: { fa: "ببخشید، ساعت چنده؟", tr: "bebakhshid, sâ'at chande?", en: "Excuse me, what time is it?" },
  },
  {
    id: "bale", fa: "بله", tr: "bale", en: "yes", pos: "interjection", register: "both",
    soundsLike: "BA-leh",
    example: { fa: "بله، درسته.", tr: "bale, doroste.", en: "Yes, that's right." },
  },
  {
    id: "are", fa: "آره", tr: "âre", en: "yeah", pos: "interjection", register: "colloquial",
    soundsLike: "AA-reh",
    example: { fa: `آره، می${ZW}دونم.`, tr: "âre, midunam.", en: "Yeah, I know." },
  },
  {
    id: "na", fa: "نه", tr: "na", en: "no", pos: "interjection", register: "both",
    soundsLike: "NAH",
    example: { fa: "نه، مرسی.", tr: "na, mersi.", en: "No, thanks." },
    note: "Same spelling as noh (nine) — context tells them apart.",
  },
  {
    id: "khahesh-mikonam", fa: `خواهش می${ZW}کنم`, tr: "khâhesh mikonam", en: "you're welcome", alt: ["you are welcome"],
    pos: "phrase", register: "both",
    soundsLike: "khaa-HESH mi-ko-NAM",
    example: { fa: `ممنون! — خواهش می${ZW}کنم.`, tr: "mamnun! — khâhesh mikonam.", en: "Thanks! — You're welcome." },
    note: "Also used to mean \"please\" when asking for something politely.",
  },

  // ── Lesson 3: Family ───────────────────────────────────────────────────
  {
    id: "pedar", fa: "پدر", tr: "pedar", en: "father", alt: ["dad"], pos: "noun", register: "both",
    soundsLike: "pe-DAR",
    example: { fa: "پدرم معلم است.", tr: "pedaram mo'allem ast.", en: "My father is a teacher." },
  },
  {
    id: "madar", fa: "مادر", tr: "mâdar", en: "mother", alt: ["mom", "mum"], pos: "noun", register: "both",
    soundsLike: "MAA-dar",
    example: { fa: `مادرم در تهران زندگی می${ZW}کند.`, tr: "mâdaram dar tehrân zendegi mikonad.", en: "My mother lives in Tehran." },
  },
  {
    id: "baradar", fa: "برادر", tr: "barâdar", en: "brother", pos: "noun", register: "both",
    soundsLike: "ba-RAA-dar",
    example: { fa: "برادرم بیست سال دارد.", tr: "barâdaram bist sâl dârad.", en: "My brother is twenty years old." },
  },
  {
    id: "khahar", fa: "خواهر", tr: "khâhar", en: "sister", pos: "noun", register: "both",
    soundsLike: "KHAA-har",
    example: { fa: "خواهرم دانشجو است.", tr: "khâharam dâneshju ast.", en: "My sister is a university student." },
    note: "The و in خوا is silent.",
  },
  {
    id: "pesar", fa: "پسر", tr: "pesar", en: "son", alt: ["boy"], pos: "noun", register: "both",
    soundsLike: "pe-SAR",
    example: { fa: "این پسر من است.", tr: "in pesar-e man ast.", en: "This is my son." },
  },
  {
    id: "dokhtar", fa: "دختر", tr: "dokhtar", en: "daughter", alt: ["girl"], pos: "noun", register: "both",
    soundsLike: "dokh-TAR",
    example: { fa: "دخترش خیلی باهوش است.", tr: "dokhtarash kheyli bâhush ast.", en: "Their daughter is very smart." },
  },
  {
    id: "pedarbozorg", fa: "پدربزرگ", tr: "pedarbozorg", en: "grandfather", alt: ["grandpa"], pos: "noun", register: "both",
    soundsLike: "pe-dar-bo-ZORG",
    example: { fa: `پدربزرگم قصه می${ZW}گوید.`, tr: "pedarbozorgam ghesse miguyad.", en: "My grandfather tells stories." },
    note: "Literally \"big father\".",
  },
  {
    id: "khanevade", fa: "خانواده", tr: "khânevâde", en: "family", pos: "noun", register: "both",
    soundsLike: "khaa-ne-vaa-DEH",
    example: { fa: `خانواده${ZW}ام بزرگ است.`, tr: "khânevâde-am bozorg ast.", en: "My family is big." },
  },

  // ── Lesson 4: Numbers 1–10 ─────────────────────────────────────────────
  {
    id: "yek", fa: "یک", tr: "yek", en: "one", alt: ["1"], pos: "number", register: "both",
    soundsLike: "YEK",
    example: { fa: "یک سیب", tr: "yek sib", en: "one apple" },
  },
  {
    id: "do", fa: "دو", tr: "do", en: "two", alt: ["2"], pos: "number", register: "both",
    soundsLike: "DOH",
    example: { fa: "دو تا بچه", tr: "do tâ bache", en: "two children" },
  },
  {
    id: "se", fa: "سه", tr: "se", en: "three", alt: ["3"], pos: "number", register: "both",
    soundsLike: "SEH",
    example: { fa: "سه روز", tr: "se ruz", en: "three days" },
  },
  {
    id: "chahar", fa: "چهار", tr: "chahâr", en: "four", alt: ["4"], altTr: ["châr"], pos: "number", register: "both",
    soundsLike: "cha-HAAR",
    example: { fa: "چهار فصل", tr: "chahâr fasl", en: "four seasons" },
    note: "Often shortened to châr in speech.",
  },
  {
    id: "panj", fa: "پنج", tr: "panj", en: "five", alt: ["5"], pos: "number", register: "both",
    soundsLike: "PANJ",
    example: { fa: "پنج دقیقه", tr: "panj daghighe", en: "five minutes" },
  },
  {
    id: "shesh", fa: "شش", tr: "shesh", en: "six", alt: ["6"], pos: "number", register: "both",
    soundsLike: "SHESH",
    example: { fa: "ساعت شش", tr: "sâ'at-e shesh", en: "six o'clock" },
  },
  {
    id: "haft", fa: "هفت", tr: "haft", en: "seven", alt: ["7"], pos: "number", register: "both",
    soundsLike: "HAFT",
    example: { fa: "هفت روز هفته", tr: "haft ruz-e hafte", en: "the seven days of the week" },
  },
  {
    id: "hasht", fa: "هشت", tr: "hasht", en: "eight", alt: ["8"], pos: "number", register: "both",
    soundsLike: "HASHT",
    example: { fa: "هشت نفر", tr: "hasht nafar", en: "eight people" },
  },
  {
    id: "noh", fa: "نه", tr: "noh", en: "nine", alt: ["9"], pos: "number", register: "both",
    soundsLike: "NOH",
    example: { fa: "نه سال", tr: "noh sâl", en: "nine years" },
    note: "Same spelling as na (no) — context tells them apart.",
  },
  {
    id: "dah", fa: "ده", tr: "dah", en: "ten", alt: ["10"], pos: "number", register: "both",
    soundsLike: "DAH",
    example: { fa: "ده تومان", tr: "dah toman", en: "ten tomans" },
  },

  // ── Lesson 5: Food & drink ─────────────────────────────────────────────
  {
    id: "ab", fa: "آب", tr: "âb", en: "water", pos: "noun", register: "both",
    soundsLike: "AAB",
    example: { fa: "یک لیوان آب، لطفاً.", tr: "yek livân âb, lotfan.", en: "A glass of water, please." },
  },
  {
    id: "chay", fa: "چای", tr: "chây", en: "tea", pos: "noun", register: "both",
    soundsLike: "CHAAY",
    example: { fa: `چای می${ZW}خوری؟`, tr: "chây mikhori?", en: "Would you like some tea?" },
  },
  {
    id: "nan", fa: "نان", tr: "nân", en: "bread", pos: "noun", register: "both",
    soundsLike: "NAAN",
    example: { fa: "نان تازه خریدم.", tr: "nân-e tâze kharidam.", en: "I bought fresh bread." },
  },
  {
    id: "ghaza", fa: "غذا", tr: "ghazâ", en: "food", alt: ["meal"], pos: "noun", register: "both",
    soundsLike: "gha-ZAA",
    example: { fa: "غذا خیلی خوشمزه است.", tr: "ghazâ kheyli khoshmaze ast.", en: "The food is very tasty." },
  },
  {
    id: "sib", fa: "سیب", tr: "sib", en: "apple", pos: "noun", register: "both",
    soundsLike: "SEEB",
    example: { fa: "این سیب قرمز است.", tr: "in sib ghermez ast.", en: "This apple is red." },
  },
  {
    id: "berenj", fa: "برنج", tr: "berenj", en: "rice", pos: "noun", register: "both",
    soundsLike: "be-RENJ",
    example: { fa: `ایرانی${ZW}ها برنج زیاد می${ZW}خورند.`, tr: "irâni-hâ berenj ziyâd mikhorand.", en: "Iranians eat a lot of rice." },
  },
  {
    id: "panir", fa: "پنیر", tr: "panir", en: "cheese", pos: "noun", register: "both",
    soundsLike: "pa-NEER",
    example: { fa: "نان و پنیر صبحانهٔ من است.", tr: "nân o panir sobhâne-ye man ast.", en: "Bread and cheese is my breakfast." },
  },
  {
    id: "ghahve", fa: "قهوه", tr: "ghahve", en: "coffee", pos: "noun", register: "both",
    soundsLike: "GHAH-veh",
    example: { fa: "قهوه تلخ است.", tr: "ghahve talkh ast.", en: "The coffee is bitter." },
  },

  // ── Lesson 6: Everyday words ───────────────────────────────────────────
  {
    id: "khane", fa: "خانه", tr: "khâne", en: "house", alt: ["home"], pos: "noun", register: "formal",
    soundsLike: "khaa-NEH",
    example: { fa: `خانه${ZW}ام نزدیک است.`, tr: "khâne-am nazdik ast.", en: "My home is close." },
    note: "In speech this is usually khune.",
  },
  {
    id: "ketab", fa: "کتاب", tr: "ketâb", en: "book", pos: "noun", register: "both",
    soundsLike: "ke-TAAB",
    example: { fa: "این کتاب جالب است.", tr: "in ketâb jâleb ast.", en: "This book is interesting." },
  },
  {
    id: "dust", fa: "دوست", tr: "dust", en: "friend", pos: "noun", register: "both",
    soundsLike: "DOOST",
    example: { fa: "او دوست خوب من است.", tr: "u dust-e khub-e man ast.", en: "They are my good friend." },
  },
  {
    id: "kar", fa: "کار", tr: "kâr", en: "work", alt: ["job"], pos: "noun", register: "both",
    soundsLike: "KAAR",
    example: { fa: "امروز کار زیاد دارم.", tr: "emruz kâr-e ziyâd dâram.", en: "I have a lot of work today." },
  },
  {
    id: "ruz", fa: "روز", tr: "ruz", en: "day", pos: "noun", register: "both",
    soundsLike: "ROOZ",
    example: { fa: "روز خوبی داشته باشی!", tr: "ruz-e khubi dâshte bâshi!", en: "Have a nice day!" },
  },
  {
    id: "shab", fa: "شب", tr: "shab", en: "night", pos: "noun", register: "both",
    soundsLike: "SHAB",
    example: { fa: `شب${ZW}ها هوا سرد است.`, tr: "shab-hâ havâ sard ast.", en: "The nights are cold." },
  },
  {
    id: "emruz", fa: "امروز", tr: "emruz", en: "today", pos: "noun", register: "both",
    soundsLike: "em-ROOZ",
    example: { fa: "امروز جمعه است.", tr: "emruz jom'e ast.", en: "Today is Friday." },
  },
  {
    id: "farda", fa: "فردا", tr: "fardâ", en: "tomorrow", pos: "noun", register: "both",
    soundsLike: "far-DAA",
    example: { fa: `فردا می${ZW}بینمت.`, tr: "fardâ mibinamet.", en: "See you tomorrow." },
  },
];

export const WORD_BY_ID: Record<string, Word> = Object.fromEntries(WORDS.map((w) => [w.id, w]));
