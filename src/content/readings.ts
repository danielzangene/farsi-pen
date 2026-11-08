// Reading track (B1). Original Farsi Pen texts (DRAFT, pending native review),
// built on content- and task-based principles: every lesson opens with a real
// question, teaches language through a topic about Iran, shows the same
// sentences in written and spoken Persian, adds the vocabulary of the news,
// links the grammar the text uses, and ends with something you say yourself.

export interface FaItem {
  fa: string;
  tr: string;
  en: string;
}

export interface Sentence {
  fa: string;
  en: string;
}

export interface ReadingQuestion {
  prompt: string;
  options: string[];
  answer: string;
}

export interface ReadingLesson {
  id: string;
  number: number;
  level: "B1" | "B2";
  /** The lesson opens with a question to the learner. */
  question: { en: string; fa: string };
  topic: string;
  /** Words to know before reading (also used to gloss the text). */
  keyWords: FaItem[];
  /** Paragraphs of sentences, in written Persian. */
  text: Sentence[][];
  check: ReadingQuestion[];
  /** Sentences from the text as people say them. */
  spoken: { fa: string; spoken: string; en: string }[];
  spokenNote: string;
  grammar: { conceptId: string; note: string; examples: string[] };
  news: { topic: string; words: FaItem[]; headlines: Sentence[] };
  culture: { title: string; fa: string; text: string; words: FaItem[] };
  task: { prompt: string; phrases: FaItem[]; model: Sentence[] };
}

export const READINGS: ReadingLesson[] = [
  {
    id: "big-city",
    number: 1,
    level: "B1",
    question: { en: "Would you rather live in a big city or a small town?", fa: "زندگی در شهر بزرگ را ترجیح می‌دهید یا شهر کوچک؟" },
    topic: "Life in the capital",
    keyWords: [
      { fa: "پایتخت", tr: "pâytakht", en: "capital city" },
      { fa: "تحصیل", tr: "tahsil", en: "studying, education" },
      { fa: "فرصت", tr: "forsat", en: "opportunity" },
      { fa: "سنگین", tr: "sangin", en: "heavy" },
      { fa: "آلوده", tr: "âlude", en: "polluted" },
      { fa: "قیمت", tr: "gheymat", en: "price" },
      { fa: "آرامش", tr: "ârâmesh", en: "calm, peace" },
      { fa: "به نظر من", tr: "be nazar-e man", en: "in my opinion" },
    ],
    text: [
      [
        { fa: "تهران بزرگ‌ترین شهر ایران است و بیش از هشت میلیون نفر در آن زندگی می‌کنند.", en: "Tehran is the biggest city in Iran, and more than eight million people live there." },
        { fa: "بسیاری از جوانان برای تحصیل یا کار از شهرهای دیگر به تهران می‌آیند.", en: "Many young people come to Tehran from other cities to study or work." },
        { fa: "در تهران دانشگاه‌ها، بیمارستان‌ها و سینماهای زیادی هست و فرصت‌های شغلی هم بیشتر است.", en: "Tehran has many universities, hospitals and cinemas, and there are more job opportunities too." },
      ],
      [
        { fa: "اما زندگی در پایتخت آسان نیست.", en: "But life in the capital isn't easy." },
        { fa: "ترافیک سنگین است و هوا در زمستان اغلب آلوده است.", en: "The traffic is heavy, and in winter the air is often polluted." },
        { fa: "قیمت خانه هم در تهران از بیشتر شهرهای ایران گران‌تر است.", en: "Houses in Tehran also cost more than in most Iranian cities." },
      ],
      [
        { fa: "مریم بیست و پنج سال دارد و دو سال پیش از کاشان به تهران آمد.", en: "Maryam is twenty-five; she moved from Kashan to Tehran two years ago." },
        { fa: "او می‌گوید: «اینجا کار بهتری پیدا کردم، ولی دلم برای آرامش کاشان تنگ می‌شود.»", en: "She says: “I found a better job here, but I miss the calm of Kashan.”" },
        { fa: "آخر هفته‌ها، وقتی وقت دارد، به خانه‌ی پدر و مادرش برمی‌گردد.", en: "At weekends, when she has time, she goes back to her parents' house." },
        { fa: "به نظر او، هر شهری خوبی‌ها و بدی‌های خودش را دارد.", en: "In her view, every city has its own good and bad sides." },
      ],
    ],
    check: [
      { prompt: "Why do many young people move to Tehran?", options: ["To study or work", "Because houses are cheap", "For the clean air"], answer: "To study or work" },
      { prompt: "What is a problem in Tehran in winter?", options: ["Polluted air", "Too much snow", "No cinemas"], answer: "Polluted air" },
      { prompt: "Where is Maryam from?", options: ["Kashan", "Shiraz", "Tehran"], answer: "Kashan" },
      { prompt: "What does Maryam miss?", options: ["The calm of Kashan", "Her old job", "Tehran's traffic"], answer: "The calm of Kashan" },
    ],
    spoken: [
      { fa: "زندگی در پایتخت آسان نیست.", spoken: "زندگی تو پایتخت آسون نیست.", en: "Life in the capital isn't easy." },
      { fa: "بسیاری از جوانان به تهران می‌آیند.", spoken: "خیلی از جوونا میان تهرون.", en: "Lots of young people come to Tehran." },
      { fa: "قیمت خانه گران‌تر است.", spoken: "قیمت خونه گرون‌تره.", en: "Houses cost more." },
      { fa: "به خانه‌ی پدر و مادرش برمی‌گردد.", spoken: "برمی‌گرده خونه‌ی باباش اینا.", en: "She goes back to her parents' place." },
    ],
    spokenNote: "In speech, â before n often becomes u (آسان → âsun, خانه → khune, تهران → Tehrun), است shrinks to -e, and «به» before a place is usually dropped after verbs of going and coming.",
    grammar: {
      conceptId: "comparatives",
      note: "The text compares places with -tar (more …) and -tarin (most …). «از» means “than”.",
      examples: ["تهران بزرگ‌ترین شهر ایران است.", "قیمت خانه از بیشتر شهرها گران‌تر است.", "اینجا کار بهتری پیدا کردم."],
    },
    news: {
      topic: "City life",
      words: [
        { fa: "جمعیت", tr: "jam'iyat", en: "population" },
        { fa: "آلودگی هوا", tr: "âludegi-ye havâ", en: "air pollution" },
        { fa: "حمل و نقل عمومی", tr: "haml o naghl-e omumi", en: "public transport" },
        { fa: "مسکن", tr: "maskan", en: "housing" },
        { fa: "شهرداری", tr: "shahrdâri", en: "city council" },
        { fa: "مهاجرت", tr: "mohâjerat", en: "migration" },
      ],
      headlines: [
        { fa: "آلودگی هوا مدارس پایتخت را تعطیل کرد", en: "Air pollution closes the capital's schools" },
        { fa: "قیمت مسکن در شهرهای بزرگ بالا رفت", en: "Housing prices rise in big cities" },
      ],
    },
    culture: {
      title: "Kashan",
      fa: "کاشان",
      text: "Kashan sits on the edge of the central desert, about three hours south of Tehran. It is known for its grand old merchants' houses built around courtyards, and every spring for rosewater: in the villages nearby, families pick damask roses at dawn and distil them into golâb.",
      words: [
        { fa: "گلاب", tr: "golâb", en: "rosewater" },
        { fa: "کویر", tr: "kavir", en: "desert" },
        { fa: "حیاط", tr: "hayât", en: "courtyard" },
      ],
    },
    task: {
      prompt: "Your turn: would you rather live in a big city or a small town? Give two reasons.",
      phrases: [
        { fa: "به نظر من", tr: "be nazar-e man", en: "in my opinion" },
        { fa: "ترجیح می‌دهم", tr: "tarjih midaham", en: "I prefer" },
        { fa: "چون", tr: "chon", en: "because" },
        { fa: "ولی", tr: "vali", en: "but" },
      ],
      model: [
        { fa: "به نظر من زندگی در شهر کوچک بهتر است.", en: "In my opinion life in a small town is better." },
        { fa: "چون آرام‌تر است و هوایش تمیزتر است.", en: "Because it's calmer and the air is cleaner." },
        { fa: "ولی در شهر بزرگ کار بیشتری پیدا می‌شود.", en: "But in a big city there's more work to be found." },
      ],
    },
  },
  {
    id: "yalda",
    number: 2,
    level: "B1",
    question: { en: "Does anyone in your country celebrate the longest night of the year?", fa: "در کشور شما بلندترین شب سال را جشن می‌گیرند؟" },
    topic: "Yalda night",
    keyWords: [
      { fa: "بلندترین", tr: "bolandtarin", en: "longest" },
      { fa: "جشن گرفتن", tr: "jashn gereftan", en: "to celebrate" },
      { fa: "از قدیم", tr: "az ghadim", en: "since long ago" },
      { fa: "بیدار ماندن", tr: "bidâr mândan", en: "to stay awake" },
      { fa: "جمع شدن", tr: "jam' shodan", en: "to gather" },
      { fa: "سفره", tr: "sofre", en: "spread (cloth laid with food)" },
      { fa: "انار", tr: "anâr", en: "pomegranate" },
      { fa: "نشانه", tr: "neshâne", en: "sign, symbol" },
    ],
    text: [
      [
        { fa: "شب یلدا آخرین شب پاییز و بلندترین شب سال است.", en: "Yalda is the last night of autumn and the longest night of the year." },
        { fa: "ایرانیان از قدیم این شب را جشن می‌گرفتند.", en: "Iranians have celebrated this night since long ago." },
        { fa: "در گذشته مردم فکر می‌کردند که شب طولانی بدشانسی می‌آورد.", en: "In the past people thought the long night brought bad luck." },
        { fa: "برای همین تا صبح بیدار می‌ماندند و کنار هم بودند.", en: "So they would stay awake until morning, together." },
      ],
      [
        { fa: "امروز هم خانواده‌ها در خانه‌ی پدربزرگ و مادربزرگ جمع می‌شوند.", en: "Today, too, families gather at the grandparents' house." },
        { fa: "روی سفره انار، هندوانه و آجیل می‌گذارند.", en: "They put pomegranates, watermelon and mixed nuts on the spread." },
        { fa: "رنگ سرخ انار و هندوانه نشانه‌ی خورشید و زندگی است.", en: "The red of the pomegranate and watermelon stands for the sun and life." },
        { fa: "بزرگ‌ترها قصه می‌گویند و بعضی‌ها فال حافظ می‌گیرند.", en: "The older ones tell stories, and some people take a fâl from Hafez." },
      ],
      [
        { fa: "وقتی بچه بودم، مادربزرگم همیشه برای ما شاهنامه می‌خواند.", en: "When I was a child, my grandmother always read us the Shahnameh." },
        { fa: "از فردای یلدا، روزها کم‌کم بلندتر می‌شوند.", en: "From the day after Yalda, the days slowly get longer." },
      ],
    ],
    check: [
      { prompt: "When is Yalda?", options: ["The last night of autumn", "The first night of spring", "New Year's Eve"], answer: "The last night of autumn" },
      { prompt: "Why did people stay awake in the past?", options: ["They thought the long night brought bad luck", "To watch the stars", "To finish their work"], answer: "They thought the long night brought bad luck" },
      { prompt: "What does the red of pomegranates stand for?", options: ["The sun and life", "Winter", "Good luck in love"], answer: "The sun and life" },
      { prompt: "What did the writer's grandmother do?", options: ["Read the Shahnameh to them", "Cooked all night", "Took a fâl from Hafez"], answer: "Read the Shahnameh to them" },
    ],
    spoken: [
      { fa: "خانواده‌ها در خانه‌ی پدربزرگ جمع می‌شوند.", spoken: "خونواده‌ها خونه‌ی بابابزرگ جمع می‌شن.", en: "Families gather at grandpa's." },
      { fa: "روی سفره انار می‌گذارند.", spoken: "رو سفره انار می‌ذارن.", en: "They put pomegranates on the spread." },
      { fa: "بزرگ‌ترها قصه می‌گویند.", spoken: "بزرگ‌ترا قصه می‌گن.", en: "The grown-ups tell stories." },
      { fa: "مادربزرگم برای ما شاهنامه می‌خواند.", spoken: "مامان‌بزرگم واسه‌مون شاهنامه می‌خوند.", en: "My gran read us the Shahnameh." },
    ],
    spokenNote: "The verb ending -and (they) becomes -an: می‌شوند → mishan, می‌گویند → migan. «برای» is often «واسه», and the plural -hâ after a consonant is often just -â (بزرگ‌ترا).",
    grammar: {
      conceptId: "past-continuous",
      note: "Habits and repeated actions in the past use mi- + the past stem: «جشن می‌گرفتند» they used to celebrate, «می‌خواند» she would read.",
      examples: ["ایرانیان از قدیم این شب را جشن می‌گرفتند.", "تا صبح بیدار می‌ماندند.", "مادربزرگم همیشه برای ما شاهنامه می‌خواند."],
    },
    news: {
      topic: "Culture and festivals",
      words: [
        { fa: "جشن", tr: "jashn", en: "celebration, festival" },
        { fa: "سنت", tr: "sonnat", en: "tradition" },
        { fa: "مراسم", tr: "marâsem", en: "ceremony" },
        { fa: "میراث فرهنگی", tr: "mirâs-e farhangi", en: "cultural heritage" },
        { fa: "ثبت جهانی", tr: "sabt-e jahâni", en: "world (UNESCO) listing" },
      ],
      headlines: [
        { fa: "شب یلدا در فهرست میراث ناملموس یونسکو ثبت شد", en: "Yalda added to UNESCO's intangible heritage list" },
        { fa: "قیمت انار در آستانه‌ی یلدا بالا رفت", en: "Pomegranate prices rise ahead of Yalda" },
      ],
    },
    culture: {
      title: "Pomegranates",
      fa: "انار",
      text: "Iran is one of the world's great pomegranate growers, and the town of Saveh is famous for them. The fruit turns up everywhere: in Yalda spreads, in rob-e anâr (pomegranate molasses) for fesenjân stew, on carpets and tiles, and in poetry as a picture of a heart full of seeds.",
      words: [
        { fa: "رب انار", tr: "rob-e anâr", en: "pomegranate molasses" },
        { fa: "فسنجان", tr: "fesenjân", en: "walnut and pomegranate stew" },
        { fa: "دانه", tr: "dâne", en: "seed" },
      ],
    },
    task: {
      prompt: "Your turn: describe a celebration in your family — when it is, who comes and what you eat.",
      phrases: [
        { fa: "ما هر سال", tr: "mâ har sâl", en: "every year we" },
        { fa: "همه جمع می‌شویم", tr: "hame jam' mishavim", en: "everyone gathers" },
        { fa: "می‌خوریم", tr: "mikhorim", en: "we eat" },
        { fa: "وقتی بچه بودم", tr: "vaghti bachche budam", en: "when I was a child" },
      ],
      model: [
        { fa: "ما هر سال شب کریسمس در خانه‌ی مادربزرگم جمع می‌شویم.", en: "Every year on Christmas Eve we gather at my grandmother's." },
        { fa: "شام می‌خوریم و هدیه‌ها را باز می‌کنیم.", en: "We have dinner and open the presents." },
        { fa: "وقتی بچه بودم، تا دیروقت بیدار می‌ماندم.", en: "When I was a child, I used to stay up late." },
      ],
    },
  },
  {
    id: "windcatcher",
    number: 3,
    level: "B1",
    question: { en: "How did people keep their homes cool before air conditioning?", fa: "مردم قبل از کولر چطور خانه‌هایشان را خنک می‌کردند؟" },
    topic: "The windcatchers of Yazd",
    keyWords: [
      { fa: "کویر", tr: "kavir", en: "desert" },
      { fa: "خشک", tr: "khoshk", en: "dry" },
      { fa: "معمار", tr: "me'mâr", en: "architect" },
      { fa: "خنک کردن", tr: "khonak kardan", en: "to cool" },
      { fa: "بادگیر", tr: "bâdgir", en: "windcatcher" },
      { fa: "بام", tr: "bâm", en: "roof" },
      { fa: "دهانه", tr: "dahâne", en: "opening" },
      { fa: "حوض", tr: "howz", en: "pool (in a courtyard)" },
      { fa: "خشت", tr: "khesht", en: "mud brick" },
      { fa: "نماد", tr: "namâd", en: "symbol" },
    ],
    text: [
      [
        { fa: "یزد شهری در مرکز ایران و در کنار کویر است.", en: "Yazd is a city in the middle of Iran, on the edge of the desert." },
        { fa: "تابستان‌های یزد بسیار گرم و خشک است.", en: "Summers in Yazd are very hot and dry." },
        { fa: "صدها سال پیش، معماران ایرانی راهی برای خنک کردن خانه‌ها پیدا کردند: بادگیر.", en: "Hundreds of years ago, Iranian architects found a way to cool houses: the windcatcher." },
      ],
      [
        { fa: "بادگیر برجی بلند روی بام خانه است که چند دهانه دارد.", en: "A windcatcher is a tall tower on the roof with several openings." },
        { fa: "باد از دهانه‌ها وارد برج می‌شود و به پایین فرستاده می‌شود.", en: "The wind enters the tower through the openings and is sent down." },
        { fa: "در بعضی خانه‌ها، هوا از روی حوض آب می‌گذشت و خنک‌تر می‌شد.", en: "In some houses the air passed over a pool of water and grew cooler." },
        { fa: "هوای گرم هم از بالای برج بیرون رانده می‌شود.", en: "Hot air, meanwhile, is pushed out through the top of the tower." },
      ],
      [
        { fa: "بیشتر بادگیرها از خشت و آجر ساخته شده‌اند.", en: "Most windcatchers are built of mud brick and fired brick." },
        { fa: "امروز بسیاری از خانه‌ها کولر دارند، اما بادگیرها هنوز نماد یزد هستند.", en: "Today many homes have air conditioning, but windcatchers are still the symbol of Yazd." },
        { fa: "بافت تاریخی یزد در فهرست میراث جهانی یونسکو ثبت شده است.", en: "The historic city of Yazd is on UNESCO's World Heritage list." },
      ],
    ],
    check: [
      { prompt: "What are summers like in Yazd?", options: ["Very hot and dry", "Mild and rainy", "Cold and windy"], answer: "Very hot and dry" },
      { prompt: "Where is a windcatcher built?", options: ["On the roof", "Under the house", "In the garden"], answer: "On the roof" },
      { prompt: "How did some houses make the air even cooler?", options: ["It passed over a pool of water", "They burned wood", "They closed every window"], answer: "It passed over a pool of water" },
      { prompt: "What are most windcatchers made of?", options: ["Mud brick and brick", "Wood", "Glass and steel"], answer: "Mud brick and brick" },
    ],
    spoken: [
      { fa: "تابستان‌های یزد بسیار گرم است.", spoken: "تابستونای یزد خیلی گرمه.", en: "Summers in Yazd are really hot." },
      { fa: "باد وارد برج می‌شود.", spoken: "باد می‌ره تو برج.", en: "The wind goes into the tower." },
      { fa: "بادگیرها هنوز نماد یزد هستند.", spoken: "بادگیرا هنوزم نماد یزدن.", en: "Windcatchers are still Yazd's symbol." },
    ],
    spokenNote: "Written «بسیار» is «خیلی» in speech, and formal verbs like «وارد ... می‌شود» are replaced by everyday ones («می‌ره تو»). «هستند» shrinks to -an.",
    grammar: {
      conceptId: "passive",
      note: "Describing how something works or how it was made, the text uses the passive: past participle + شدن. «فرستاده می‌شود» is sent, «ساخته شده‌اند» have been built.",
      examples: ["باد به پایین فرستاده می‌شود.", "هوای گرم بیرون رانده می‌شود.", "بیشتر بادگیرها از خشت و آجر ساخته شده‌اند."],
    },
    news: {
      topic: "Climate and environment",
      words: [
        { fa: "گرمایش زمین", tr: "garmâyesh-e zamin", en: "global warming" },
        { fa: "خشکسالی", tr: "khoshksâli", en: "drought" },
        { fa: "کم‌آبی", tr: "kam-âbi", en: "water shortage" },
        { fa: "دما", tr: "damâ", en: "temperature" },
        { fa: "مصرف انرژی", tr: "masraf-e enerzhi", en: "energy use" },
        { fa: "انرژی پاک", tr: "enerzhi-ye pâk", en: "clean energy" },
      ],
      headlines: [
        { fa: "دمای هوای یزد به چهل و پنج درجه رسید", en: "Temperatures in Yazd reach 45 degrees" },
        { fa: "معماران به راه‌حل‌های قدیمی برای کاهش مصرف انرژی برمی‌گردند", en: "Architects turn to old solutions to cut energy use" },
      ],
    },
    culture: {
      title: "Qanats",
      fa: "قنات",
      text: "Long before pumps, people on the Iranian plateau brought water to desert towns through qanats: gently sloping tunnels dug under the ground from a mountain water table, sometimes for tens of kilometres, with a line of wells along the way. Some still flow today, and a group of them is on UNESCO's World Heritage list.",
      words: [
        { fa: "چاه", tr: "châh", en: "well" },
        { fa: "زیرزمینی", tr: "zirzamini", en: "underground" },
        { fa: "آب", tr: "âb", en: "water" },
      ],
    },
    task: {
      prompt: "Your turn: explain to a friend how a windcatcher works, in two or three sentences. Try the passive.",
      phrases: [
        { fa: "وارد می‌شود", tr: "vâred mishavad", en: "goes in" },
        { fa: "فرستاده می‌شود", tr: "ferestâde mishavad", en: "is sent" },
        { fa: "خنک می‌شود", tr: "khonak mishavad", en: "gets cool" },
        { fa: "این‌طوری", tr: "intori", en: "this way" },
      ],
      model: [
        { fa: "باد از بالای برج وارد می‌شود و به پایین فرستاده می‌شود.", en: "The wind comes in at the top of the tower and is sent down." },
        { fa: "هوای گرم از بالا بیرون رانده می‌شود.", en: "The hot air is pushed out at the top." },
        { fa: "این‌طوری خانه خنک می‌ماند.", en: "That way the house stays cool." },
      ],
    },
  },
];

export const READING_BY_ID: Record<string, ReadingLesson> = Object.fromEntries(READINGS.map((r) => [r.id, r]));

/** Glossary for tapping words in the text: key words, culture and news words. */
export function readingGlossary(r: ReadingLesson): Map<string, FaItem> {
  const m = new Map<string, FaItem>();
  for (const w of [...r.keyWords, ...r.news.words, ...r.culture.words, ...r.task.phrases]) m.set(w.fa, w);
  return m;
}
