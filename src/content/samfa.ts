// SAMFA (سامفا, the standard Persian language proficiency test) preparation.
// The facts below are the published outline as reported by universities and
// news sources; the official announcement for each round is the authority.
// All practice items are original Farsi Pen content (DRAFT, pending review).

export const SAMFA_FACTS = {
  name: "SAMFA",
  fa: "سامفا",
  full: "Standard Persian Language Proficiency Test",
  fullFa: "آزمون استاندارد مهارت‌های زبان فارسی",
  sections: [
    { id: "listening", name: "Listening", fa: "شنیدن", points: 60, detail: "About 30 questions on recorded conversations and talks." },
    { id: "reading", name: "Reading", fa: "خواندن", points: 60, detail: "About 30 questions on written texts." },
    { id: "writing", name: "Writing", fa: "نوشتن", points: 60, detail: "Two writing topics." },
    { id: "speaking", name: "Speaking", fa: "صحبت کردن", points: 60, detail: "A short interview, about 15 minutes." },
  ],
  notes: [
    "Four skills, 60 points each: 240 in total.",
    "There is a General version and an Academic version (the Academic one is set by field: basic sciences and engineering, humanities, medical sciences, social sciences).",
    "Iranian universities usually ask for at least half the total score; some courses set their own bar.",
    "It's run by Iran's Ministry of Science, Research and Technology, a few times a year, on computer in Iran and on paper abroad. Certificates are valid for two years.",
  ],
  checkOfficial: "Dates, fees and exact timings change from round to round, so always check the current official announcement before you book.",
};

export interface WritingTask {
  id: string;
  prompt: { en: string; fa: string };
  /** Suggested length in words. */
  words: number;
  minutes: number;
  plan: string[];
  model: string[];
}

export const WRITING_TASKS: WritingTask[] = [
  {
    id: "city",
    prompt: { en: "Write about the advantages and disadvantages of living in a big city.", fa: "درباره‌ی مزایا و معایب زندگی در شهرهای بزرگ بنویسید." },
    words: 150,
    minutes: 20,
    plan: ["Open with one sentence on why the question matters.", "Two advantages, each with an example.", "Two disadvantages, each with an example.", "Finish with your own view."],
    model: [
      "امروزه بسیاری از مردم در شهرهای بزرگ زندگی می‌کنند.",
      "زندگی در شهر بزرگ مزایای زیادی دارد؛ برای مثال، فرصت‌های شغلی و تحصیلی بیشتر است و دسترسی به بیمارستان و دانشگاه آسان‌تر است.",
      "علاوه بر این، امکانات فرهنگی مانند سینما، تئاتر و موزه هم در شهرهای بزرگ بیشتر است.",
      "از طرف دیگر، زندگی در شهر بزرگ معایبی هم دارد.",
      "ترافیک سنگین و آلودگی هوا سلامت مردم را تهدید می‌کند و هزینه‌ی مسکن هم بسیار بالاست.",
      "به نظر من، شهر بزرگ برای جوانان مناسب‌تر است، اما بسیاری از خانواده‌ها آرامش شهرهای کوچک را ترجیح می‌دهند.",
    ],
  },
  {
    id: "language",
    prompt: { en: "What are the benefits of learning a foreign language? Give reasons and examples.", fa: "به نظر شما یادگیری زبان خارجی چه فایده‌هایی دارد؟ با دلیل و مثال بنویسید." },
    words: 150,
    minutes: 20,
    plan: ["State your opinion in the first sentence.", "Reason one: work or study, with an example.", "Reason two: travel or culture, with an example.", "Sum up with «در نتیجه» or «به طور خلاصه»."],
    model: [
      "به نظر من یادگیری زبان خارجی یکی از مفیدترین کارهایی است که می‌توان انجام داد.",
      "اولاً، کسی که زبان دیگری بلد است فرصت‌های شغلی بیشتری دارد و می‌تواند در کشورهای دیگر درس بخواند.",
      "ثانیاً، زبان پنجره‌ای به فرهنگ دیگران است؛ مثلاً کسی که فارسی می‌داند می‌تواند شعر حافظ را به زبان اصلی بخواند.",
      "علاوه بر این، یادگیری زبان ذهن را فعال نگه می‌دارد.",
      "در نتیجه، هر چند یادگیری زبان وقت و حوصله می‌خواهد، فایده‌های آن بسیار بیشتر از سختی‌هایش است.",
    ],
  },
  {
    id: "tradition",
    prompt: { en: "Describe an important celebration or tradition in your country.", fa: "یک جشن یا سنت مهم در کشور خودتان را توصیف کنید." },
    words: 120,
    minutes: 15,
    plan: ["Name it and say when it happens.", "What people do, in order.", "Food, clothes or objects that belong to it.", "What it means to you."],
    model: [
      "یکی از مهم‌ترین جشن‌های کشور من جشن سال نو است که در شب آخر سال برگزار می‌شود.",
      "در این شب، خانواده‌ها و دوستان دور هم جمع می‌شوند و شام مخصوصی می‌خورند.",
      "نزدیک نیمه‌شب، همه با هم ثانیه‌ها را می‌شمارند و سال نو را به یکدیگر تبریک می‌گویند.",
      "برای من این جشن فرصتی است تا به سال گذشته فکر کنم و برای سال آینده برنامه بریزم.",
    ],
  },
  {
    id: "letter",
    prompt: { en: "Write a letter to a friend about a recent trip.", fa: "نامه‌ای به یک دوست بنویسید و سفر اخیرتان را برایش تعریف کنید." },
    words: 120,
    minutes: 15,
    plan: ["Greeting and a friendly opening line.", "Where you went, when and with whom (simple past).", "One thing that went well and one that surprised you.", "A warm closing."],
    model: [
      "دوست عزیزم، سلام!",
      "امیدوارم حالت خوب باشد.",
      "هفته‌ی گذشته با خانواده‌ام به اصفهان رفتیم و سه روز آنجا ماندیم.",
      "میدان نقش جهان از چیزی که فکر می‌کردم زیباتر بود و غروب کنار سی‌وسه‌پل را هرگز فراموش نمی‌کنم.",
      "فقط هوا خیلی سردتر از انتظارم بود!",
      "دلم برایت تنگ شده؛ امیدوارم دفعه‌ی بعد با هم سفر کنیم.",
      "قربانت، سارا",
    ],
  },
];

export interface SpeakingTask {
  id: string;
  prompt: { en: string; fa: string };
  prepSeconds: number;
  speakSeconds: number;
  phrases: { fa: string; en: string }[];
  model: string[];
}

export const SPEAKING_TASKS: SpeakingTask[] = [
  {
    id: "intro",
    prompt: { en: "Introduce yourself: where you're from, what you do and why you're learning Persian.", fa: "خودتان را معرفی کنید: اهل کجا هستید، چه کار می‌کنید و چرا فارسی یاد می‌گیرید؟" },
    prepSeconds: 30,
    speakSeconds: 60,
    phrases: [
      { fa: "اهل … هستم", en: "I'm from …" },
      { fa: "دانشجوی … هستم", en: "I'm a student of …" },
      { fa: "دوست دارم", en: "I'd like to" },
      { fa: "به همین دلیل", en: "that's why" },
    ],
    model: ["سلام، اسم من سارا است و اهل کانادا هستم.", "دانشجوی مهندسی هستم و دوست دارم ادامه‌ی تحصیلم را در ایران بگذرانم.", "به همین دلیل فارسی یاد می‌گیرم."],
  },
  {
    id: "neighbourhood",
    prompt: { en: "Describe the city or neighbourhood you live in.", fa: "شهر یا محله‌ای را که در آن زندگی می‌کنید توصیف کنید." },
    prepSeconds: 30,
    speakSeconds: 60,
    phrases: [
      { fa: "در … زندگی می‌کنم", en: "I live in …" },
      { fa: "نزدیک خانه‌ی ما", en: "near our home" },
      { fa: "چیزی که دوست دارم", en: "what I like" },
      { fa: "تنها مشکلش این است که", en: "the only problem is that" },
    ],
    model: ["در یک محله‌ی آرام در مرکز شهر زندگی می‌کنم.", "نزدیک خانه‌ی ما یک پارک بزرگ و چند کافه هست.", "تنها مشکلش این است که پارک کردن ماشین خیلی سخت است."],
  },
  {
    id: "day",
    prompt: { en: "Talk about a normal day in your life.", fa: "یک روز معمولی زندگی‌تان را توضیح دهید." },
    prepSeconds: 30,
    speakSeconds: 60,
    phrases: [
      { fa: "صبح‌ها", en: "in the mornings" },
      { fa: "بعد از آن", en: "after that" },
      { fa: "معمولاً", en: "usually" },
      { fa: "آخر شب", en: "late in the evening" },
    ],
    model: ["صبح‌ها ساعت هفت بیدار می‌شوم و صبحانه می‌خورم.", "بعد از آن با اتوبوس به دانشگاه می‌روم و معمولاً تا عصر کلاس دارم.", "آخر شب کمی کتاب می‌خوانم و می‌خوابم."],
  },
  {
    id: "dorm",
    prompt: { en: "Is it better for students to live in a dormitory or with their family? Why?", fa: "به نظر شما بهتر است دانشجو در خوابگاه زندگی کند یا با خانواده؟ چرا؟" },
    prepSeconds: 45,
    speakSeconds: 90,
    phrases: [
      { fa: "به نظر من", en: "in my opinion" },
      { fa: "از یک طرف", en: "on the one hand" },
      { fa: "از طرف دیگر", en: "on the other hand" },
      { fa: "در کل", en: "overall" },
    ],
    model: ["به نظر من زندگی در خوابگاه تجربه‌ی خوبی است.", "از یک طرف، دانشجو مستقل می‌شود و دوستان جدیدی پیدا می‌کند.", "از طرف دیگر، زندگی با خانواده ارزان‌تر و راحت‌تر است.", "در کل، اگر امکانش باشد، خوابگاه را ترجیح می‌دهم."],
  },
  {
    id: "trip",
    prompt: { en: "Tell us about a memorable trip.", fa: "از یک سفر به‌یادماندنی تعریف کنید." },
    prepSeconds: 30,
    speakSeconds: 90,
    phrases: [
      { fa: "چند سال پیش", en: "a few years ago" },
      { fa: "اول", en: "first" },
      { fa: "بعد", en: "then" },
      { fa: "هیچ‌وقت فراموش نمی‌کنم", en: "I'll never forget" },
    ],
    model: ["چند سال پیش با دوستانم به شمال ایران رفتیم.", "اول به رشت رفتیم و غذاهای محلی خوردیم، بعد به روستای ماسوله رفتیم.", "مه صبح ماسوله را هیچ‌وقت فراموش نمی‌کنم."],
  },
  {
    id: "major",
    prompt: { en: "If you studied in Iran, which subject would you choose, and why?", fa: "اگر در ایران درس بخوانید، چه رشته‌ای را انتخاب می‌کنید و چرا؟" },
    prepSeconds: 45,
    speakSeconds: 90,
    phrases: [
      { fa: "اگر … بخوانم", en: "if I study …" },
      { fa: "رشته‌ی", en: "the subject of" },
      { fa: "چون", en: "because" },
      { fa: "در آینده", en: "in the future" },
    ],
    model: ["اگر در ایران درس بخوانم، رشته‌ی معماری را انتخاب می‌کنم.", "چون معماری سنتی ایران، مثل بادگیرها و خانه‌های حیاط‌دار، برایم خیلی جالب است.", "در آینده دوست دارم این ایده‌ها را در ساختمان‌های امروزی به کار ببرم."],
  },
];

/** Linking words for SAMFA writing and speaking. */
export const CONNECTORS = [
  { fa: "اولاً", tr: "avvalan", en: "firstly" },
  { fa: "ثانیاً", tr: "sâniyan", en: "secondly" },
  { fa: "علاوه بر این", tr: "alâve bar in", en: "in addition" },
  { fa: "از طرف دیگر", tr: "az taraf-e digar", en: "on the other hand" },
  { fa: "با این حال", tr: "bâ in hâl", en: "however" },
  { fa: "برای مثال", tr: "barâ-ye mesâl", en: "for example" },
  { fa: "بنابراین", tr: "banâbar-in", en: "therefore" },
  { fa: "در نتیجه", tr: "dar natije", en: "as a result" },
  { fa: "به طور خلاصه", tr: "be towr-e kholâse", en: "in short" },
  { fa: "به نظر من", tr: "be nazar-e man", en: "in my opinion" },
];

/** Self-check criteria for writing and speaking (0–3 each, scaled to 60). */
export const RUBRIC = [
  { id: "task", label: "Answered the question fully" },
  { id: "organise", label: "Clear order, with linking words" },
  { id: "range", label: "Varied words and grammar" },
  { id: "accuracy", label: "Few mistakes" },
];

export function rubricScore(marks: Record<string, number>): number {
  const total = RUBRIC.reduce((n, r) => n + (marks[r.id] ?? 0), 0);
  return Math.round((total / (RUBRIC.length * 3)) * 60);
}
