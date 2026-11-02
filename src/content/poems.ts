// Classical Persian poetry for learners. The Persian text of each couplet is
// exactly as published by Ganjoor (https://ganjoor.net, via the open
// ganjoor-data repository); the poems themselves are centuries old and in the
// public domain. Transliterations, English renderings, omen readings and word
// notes are Farsi Pen's own (free translations, written for learners).

export interface PoemWord {
  fa: string;
  tr: string;
  en: string;
}

export interface Couplet {
  id: string;
  poet: "hafez" | "saadi" | "khayyam";
  /** Path on ganjoor.net and in ganjoor-data, e.g. "/hafez/ghazal/sh255". */
  path: string;
  /** Hemistichs (half-lines), as on Ganjoor. */
  lines: string[];
  tr: string[];
  en: string;
  /** For Fal-e Hafez: what the omen tells you, in plain words. */
  omen?: string;
  words: PoemWord[];
}

export const POETS: Record<Couplet["poet"], { name: string; fa: string; dates: string; about: string }> = {
  hafez: { name: "Hafez", fa: "حافظ", dates: "c. 1315–1390, Shiraz", about: "The most loved Persian poet. Almost every Iranian home has his Divan, and people open it at random for guidance — the fâl-e hâfez." },
  saadi: { name: "Saadi", fa: "سعدی", dates: "c. 1210–1292, Shiraz", about: "Poet of the Golestân (Rose Garden), a book of short stories, wisdom and humour still quoted every day." },
  khayyam: { name: "Khayyam", fa: "خیام", dates: "1048–1131, Nishapur", about: "Mathematician and astronomer, famous worldwide for his robâ'iyât (quatrains) about living in the moment." },
};

/** Ganjoor's open data, pinned to one commit so the app never breaks on an upstream change. */
export const GANJOOR_DATA = "https://cdn.jsdelivr.net/gh/ganjoor/ganjoor-data@34f4ab3e463903f9399d7ca208b9333911389f94";

/** Hafez ghazals for the fâl: famous, clear, and kind when read as an omen. */
export const FAL: Couplet[] = [
  {
    id: "hafez-255", poet: "hafez", path: "/hafez/ghazal/sh255",
    lines: ["یوسفِ گم‌گشته بازآید به کنعان، غم مخور", "کلبهٔ احزان شَوَد روزی گلستان، غم مخور"],
    tr: ["yusof-e gomgashte bâz âyad be kan'ân, gham makhor", "kolbe-ye ahzân shavad ruzi golestân, gham makhor"],
    en: "Lost Joseph will come home to Canaan — don't grieve. This hut of sorrows will one day be a rose garden — don't grieve.",
    omen: "What you've lost will come back to you, and a sad time will turn into a happy one. Be patient.",
    words: [
      { fa: "غم مخور", tr: "gham makhor", en: "don't grieve / don't worry" },
      { fa: "روزی", tr: "ruzi", en: "one day" },
      { fa: "گلستان", tr: "golestân", en: "rose garden" },
    ],
  },
  {
    id: "hafez-374", poet: "hafez", path: "/hafez/ghazal/sh374",
    lines: ["بیا تا گل برافشانیم و می در ساغر اندازیم", "فلک را سقف بشکافیم و طرحی نو دراندازیم"],
    tr: ["biyâ tâ gol barafshânim-o mey dar sâghar andâzim", "falak râ saghf beshkâfim-o tarhi now darandâzim"],
    en: "Come, let us scatter roses and pour wine into the cup; let us split the roof of the sky and lay out something new.",
    omen: "It's time for a fresh start. Be bold and change what isn't working.",
    words: [
      { fa: "بیا", tr: "biyâ", en: "come!" },
      { fa: "گل", tr: "gol", en: "flower, rose" },
      { fa: "نو", tr: "now", en: "new" },
    ],
  },
  {
    id: "hafez-392", poet: "hafez", path: "/hafez/ghazal/sh392",
    lines: ["دانی که چیست دولت؟ دیدار یار دیدن", "در کوی او گدایی، بر خسروی گزیدن"],
    tr: ["dâni ke chist dowlat? didâr-e yâr didan", "dar kuy-e u gedâyi, bar khosravi gozidan"],
    en: "Do you know what real fortune is? Seeing the face of the one you love — and choosing to be a beggar in their street over being a king.",
    omen: "Your happiness lies with the people you love, not in money or status.",
    words: [
      { fa: "دولت", tr: "dowlat", en: "fortune (today also: government)" },
      { fa: "یار", tr: "yâr", en: "beloved, friend" },
      { fa: "دیدن", tr: "didan", en: "to see" },
    ],
  },
  {
    id: "hafez-174", poet: "hafez", path: "/hafez/ghazal/sh174",
    lines: ["مژده ای دل که دگر بادِ صبا بازآمد", "هدهد خوش‌خبر از طَرْفِ سبا بازآمد"],
    tr: ["mozhde ey del ke degar bâd-e sabâ bâz âmad", "hodhod-e khoshkhabar az taraf-e sabâ bâz âmad"],
    en: "Good news, my heart — the morning breeze has come back at last; the hoopoe with happy tidings has returned from Sheba.",
    omen: "Good news is on its way. The message you're waiting for will come.",
    words: [
      { fa: "مژده", tr: "mozhde", en: "good news" },
      { fa: "دل", tr: "del", en: "heart" },
      { fa: "باد", tr: "bâd", en: "wind, breeze" },
    ],
  },
  {
    id: "hafez-3", poet: "hafez", path: "/hafez/ghazal/sh3",
    lines: ["اگر آن تُرکِ شیرازی به‌‌ دست‌ آرَد دلِ ما را", "به خال هِندویَش بَخشَم سَمَرقند و بُخارا را"],
    tr: ["agar ân tork-e shirâzi be dast ârad del-e mâ râ", "be khâl-e henduyash bakhsham samarghand-o bokhârâ râ"],
    en: "If that beauty from Shiraz would take my heart in her hand, for the dark mole on her cheek I'd give away Samarkand and Bukhara.",
    omen: "Love is worth more than any treasure. Follow your heart.",
    words: [
      { fa: "اگر", tr: "agar", en: "if" },
      { fa: "دل", tr: "del", en: "heart" },
      { fa: "بخشیدن", tr: "bakhshidan", en: "to give away, to forgive" },
    ],
  },
  {
    id: "hafez-5", poet: "hafez", path: "/hafez/ghazal/sh5",
    lines: ["دل می‌رود ز دستم صاحب‌دلان خدا را", "دردا که راز پنهان خواهد شد آشکارا"],
    tr: ["del miravad ze dastam, sâhebdelân khodâ râ", "dardâ ke râz-e penhân khâhad shod âshkârâ"],
    en: "My heart is slipping from my hands — wise hearts, for God's sake, help! Alas, the hidden secret is about to come out.",
    omen: "Your feelings won't stay hidden for long. Be honest about them.",
    words: [
      { fa: "دست", tr: "dast", en: "hand" },
      { fa: "راز", tr: "râz", en: "secret" },
      { fa: "آشکار", tr: "âshkâr", en: "obvious, revealed" },
    ],
  },
  {
    id: "hafez-279", poet: "hafez", path: "/hafez/ghazal/sh279",
    lines: ["خوشا شیراز و وضعِ بی‌مثالش", "خداوندا نگه دار از زَوالش"],
    tr: ["khoshâ shirâz-o vaz'-e bimesâlash", "khodâvandâ negah dâr az zavâlash"],
    en: "How lovely is Shiraz and its matchless ways — O Lord, protect it from ever fading.",
    omen: "Cherish your home and the people who make it home.",
    words: [
      { fa: "خوشا", tr: "khoshâ", en: "how lovely!" },
      { fa: "نگه داشتن", tr: "negah dâshtan", en: "to keep, to protect" },
    ],
  },
  {
    id: "hafez-143", poet: "hafez", path: "/hafez/ghazal/sh143",
    lines: ["سال‌ها دل طلبِ جامِ جم از ما می‌کرد", "وآنچه خود داشت ز بیگانه تمنّا می‌کرد"],
    tr: ["sâlhâ del talab-e jâm-e jam az mâ mikard", "v-ânche khod dâsht ze bigâne tamannâ mikard"],
    en: "For years my heart begged me for Jamshid's magic cup, asking strangers for what it already had inside.",
    omen: "What you're searching for is already within you.",
    words: [
      { fa: "سال‌ها", tr: "sâlhâ", en: "for years" },
      { fa: "خود", tr: "khod", en: "self, itself" },
      { fa: "بیگانه", tr: "bigâne", en: "stranger" },
    ],
  },
  {
    id: "hafez-103", poet: "hafez", path: "/hafez/ghazal/sh103",
    lines: ["روز وصلِ دوستداران یاد باد", "یاد باد آن روزگاران، یاد باد"],
    tr: ["ruz-e vasl-e dustdârân yâd bâd", "yâd bâd ân ruzegârân, yâd bâd"],
    en: "Remember the days when friends were together — remember those times, remember!",
    omen: "Reach out to an old friend. The good times can come back.",
    words: [
      { fa: "روز", tr: "ruz", en: "day" },
      { fa: "یاد", tr: "yâd", en: "memory" },
      { fa: "دوست", tr: "dust", en: "friend" },
    ],
  },
  {
    id: "hafez-1", poet: "hafez", path: "/hafez/ghazal/sh1",
    lines: ["اَلا یا اَیُّهَا السّاقی اَدِرْ کَأساً و ناوِلْها", "که عشق آسان نمود اوّل ولی افتاد مشکل‌ها"],
    tr: ["alâ yâ ayyohas-sâghi, ader ka'san va nâvelhâ", "ke 'eshgh âsân nemud avval vali oftâd moshkelhâ"],
    en: "O cupbearer, pass the cup around and hand it to me — love looked easy at first, but then the troubles came.",
    omen: "The beginning was easy; the hard part now is normal. Keep going.",
    words: [
      { fa: "عشق", tr: "'eshgh", en: "love" },
      { fa: "آسان", tr: "âsân", en: "easy" },
      { fa: "مشکل", tr: "moshkel", en: "problem, difficulty" },
    ],
  },
  {
    id: "hafez-184", poet: "hafez", path: "/hafez/ghazal/sh184",
    lines: ["دوش دیدم که ملائک درِ میخانه زدند", "گِلِ آدم بسرشتَند و به پیمانه زدند"],
    tr: ["dush didam ke malâ'ek dar-e meykhâne zadand", "gel-e âdam besereshtand-o be peymâne zadand"],
    en: "Last night I saw the angels knocking at the tavern door; they kneaded the clay of Adam and shaped it into a cup.",
    omen: "You were made for love and joy. Something meaningful is taking shape.",
    words: [
      { fa: "دوش", tr: "dush", en: "last night (poetic)" },
      { fa: "دیدم", tr: "didam", en: "I saw" },
      { fa: "در", tr: "dar", en: "door" },
    ],
  },
  {
    id: "hafez-37", poet: "hafez", path: "/hafez/ghazal/sh37",
    lines: ["بیا که قصرِ اَمَل سخت سست‌بنیادست", "بیار باده که بنیادِ عمر بر بادست"],
    tr: ["biyâ ke ghasr-e amal sakht sost-bonyâd ast", "biyâr bâde ke bonyâd-e 'omr bar bâd ast"],
    en: "Come — the palace of hope stands on weak foundations. Bring wine, for life itself is built on the wind.",
    omen: "Don't wait for a perfect plan. Enjoy today and the people in it.",
    words: [
      { fa: "سخت", tr: "sakht", en: "very; hard" },
      { fa: "عمر", tr: "'omr", en: "lifetime" },
      { fa: "باد", tr: "bâd", en: "wind" },
    ],
  },
];

/** A few more couplets and quatrains for "poem of the day". */
export const MORE: Couplet[] = [
  {
    id: "saadi-bani-adam", poet: "saadi", path: "/saadi/golestan/gbab1/sh10",
    lines: ["بنی آدم اعضایِ یکدیگرند", "که در آفرینش ز یک گوهرند", "چو عضوی به درد آورد روزگار", "دگر عضوها را نماند قرار"],
    tr: ["bani âdam a'zâ-ye yekdigarand", "ke dar âfarinesh ze yek gowharand", "cho 'ozvi be dard âvarad ruzegâr", "degar 'ozvhâ râ namânad gharâr"],
    en: "Human beings are limbs of one body, made from one essence. When life brings pain to one limb, the others cannot rest.",
    words: [
      { fa: "یکدیگر", tr: "yekdigar", en: "each other" },
      { fa: "درد", tr: "dard", en: "pain" },
      { fa: "روزگار", tr: "ruzegâr", en: "time, life, the world" },
    ],
  },
  {
    id: "khayyam-136", poet: "khayyam", path: "/khayyam/robaee/sh136",
    lines: ["از دی که گذشت هیچ از او یاد مکن", "فردا که نیامده‌ست فریاد مکن", "بر نامده و گذشته بنیاد مکن", "حالی خوش باش و عمر بر باد مکن"],
    tr: ["az di ke gozasht hich az u yâd makon", "fardâ ke nayâmadast faryâd makon", "bar nâmade-o gozashte bonyâd makon", "hâli khosh bâsh-o 'omr bar bâd makon"],
    en: "Don't dwell on yesterday, which is gone; don't cry out about tomorrow, which hasn't come. Build nothing on either — be happy now, and don't throw your life to the wind.",
    words: [
      { fa: "فردا", tr: "fardâ", en: "tomorrow" },
      { fa: "خوش باش", tr: "khosh bâsh", en: "be happy, enjoy" },
      { fa: "دی", tr: "di", en: "yesterday (poetic; today diruz)" },
    ],
  },
  {
    id: "khayyam-19", poet: "khayyam", path: "/khayyam/robaee/sh19",
    lines: ["بر چهرۀ گل نسیم نوروز خوش است", "در صحن چمن روی دل‌افروز خوش است", "از دی که گذشت هر چه گویی خوش نیست", "خوش باش و ز دی مگو که امروز خوش است"],
    tr: ["bar chehre-ye gol nasim-e nowruz khosh ast", "dar sahn-e chaman ruy-e delafruz khosh ast", "az di ke gozasht har che guyi khosh nist", "khosh bâsh-o ze di magu ke emruz khosh ast"],
    en: "The Nowruz breeze on the face of a rose is sweet, and a radiant face in the meadow is sweet. Nothing you say about yesterday is sweet — be happy, and don't talk of yesterday, for today is sweet.",
    words: [
      { fa: "نوروز", tr: "nowruz", en: "Persian New Year" },
      { fa: "امروز", tr: "emruz", en: "today" },
      { fa: "خوش است", tr: "khosh ast", en: "is pleasant" },
    ],
  },
  {
    id: "khayyam-66", poet: "khayyam", path: "/khayyam/robaee/sh66",
    lines: ["این قافلهٔ عمر عجب می‌گذرد", "دریاب دمی که با طرب می‌گذرد", "ساقی غم فردای حریفان چه خوری", "پیش آر پیاله را که شب می‌گذرد"],
    tr: ["in ghâfele-ye 'omr 'ajab migozarad", "daryâb dami ke bâ tarab migozarad", "sâghi gham-e fardâ-ye harifân che khori", "pish âr piyâle râ ke shab migozarad"],
    en: "How strangely fast this caravan of life goes by — seize the moment that passes in joy. Why worry about your friends' tomorrow? Bring the cup, the night is passing.",
    words: [
      { fa: "عمر", tr: "'omr", en: "lifetime" },
      { fa: "می‌گذرد", tr: "migozarad", en: "passes" },
      { fa: "شب", tr: "shab", en: "night" },
    ],
  },
];

export const ALL_POEMS: Couplet[] = [...FAL, ...MORE];

/** Same poem every day for everyone, changing at midnight. */
export function poemOfTheDay(date = new Date()): Couplet {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ALL_POEMS[day % ALL_POEMS.length];
}
