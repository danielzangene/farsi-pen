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
  {
    id: "train",
    number: 4,
    level: "B1",
    question: { en: "Would you rather travel by train or by plane?", fa: "سفر با قطار را ترجیح می‌دهید یا هواپیما؟" },
    topic: "Travelling by train",
    keyWords: [
      { fa: "راه‌آهن", tr: "râh-âhan", en: "railway" },
      { fa: "سراسری", tr: "sarâsari", en: "nationwide" },
      { fa: "وصل کردن", tr: "vasl kardan", en: "to connect" },
      { fa: "تونل", tr: "tunel", en: "tunnel" },
      { fa: "بلیت", tr: "belit", en: "ticket" },
      { fa: "ارزان", tr: "arzân", en: "cheap" },
      { fa: "شبانه", tr: "shabâne", en: "overnight" },
      { fa: "مسافر", tr: "mosâfer", en: "passenger" },
      { fa: "کوپه", tr: "kupe", en: "compartment" },
      { fa: "مقصد", tr: "maghsad", en: "destination" },
    ],
    text: [
      [
        { fa: "اولین راه‌آهن سراسری ایران حدود نود سال پیش ساخته شد و شمال کشور را به جنوب وصل کرد.", en: "Iran's first nationwide railway was built about ninety years ago and connected the north of the country to the south." },
        { fa: "این راه‌آهن از کوه‌های البرز و زاگرس می‌گذرد و صدها پل و تونل دارد.", en: "It runs through the Alborz and Zagros mountains and has hundreds of bridges and tunnels." },
        { fa: "امروز این مسیر در فهرست میراث جهانی یونسکو ثبت شده است.", en: "Today the line is on UNESCO's World Heritage list." },
      ],
      [
        { fa: "بسیاری از ایرانیان برای سفرهای طولانی قطار را ترجیح می‌دهند.", en: "Many Iranians prefer the train for long journeys." },
        { fa: "بلیت قطار معمولاً از بلیت هواپیما ارزان‌تر است.", en: "A train ticket is usually cheaper than a plane ticket." },
        { fa: "در قطارهای شبانه، مسافران در کوپه می‌خوابند و صبح به مقصد می‌رسند.", en: "On overnight trains, passengers sleep in a compartment and reach their destination in the morning." },
      ],
      [
        { fa: "علی هر ماه با قطار از تهران به مشهد می‌رود.", en: "Every month Ali takes the train from Tehran to Mashhad." },
        { fa: "او می‌گوید: «سفر با هواپیما سریع‌تر است، ولی در قطار می‌توانم کتاب بخوانم و با مسافرهای دیگر حرف بزنم.»", en: "He says: “Flying is faster, but on the train I can read and talk to the other passengers.”" },
        { fa: "به نظر او، سفر با قطار بخشی از خود سفر است.", en: "For him, the train ride is part of the trip itself." },
      ],
    ],
    check: [
      { prompt: "What did Iran's first nationwide railway connect?", options: ["The north and the south", "Tehran and Mashhad only", "Iran and Turkey"], answer: "The north and the south" },
      { prompt: "What does the line run through?", options: ["The Alborz and Zagros mountains", "Only the desert", "The Caspian Sea"], answer: "The Alborz and Zagros mountains" },
      { prompt: "Why do many Iranians take the train on long journeys?", options: ["Tickets are usually cheaper", "It's faster than flying", "There are no flights"], answer: "Tickets are usually cheaper" },
      { prompt: "What does Ali like about the train?", options: ["He can read and talk to other passengers", "It's the fastest way", "The food on board"], answer: "He can read and talk to other passengers" },
    ],
    spoken: [
      { fa: "بلیت قطار ارزان‌تر است.", spoken: "بلیت قطار ارزون‌تره.", en: "Train tickets are cheaper." },
      { fa: "مسافران در کوپه می‌خوابند.", spoken: "مسافرا تو کوپه می‌خوابن.", en: "Passengers sleep in the compartment." },
      { fa: "می‌توانم کتاب بخوانم.", spoken: "می‌تونم کتاب بخونم.", en: "I can read a book." },
      { fa: "صبح به مقصد می‌رسند.", spoken: "صبح می‌رسن مقصد.", en: "They get there in the morning." },
    ],
    spokenNote: "â before n turns to u again: ارزان → arzun, می‌توانم → mitunam, بخوانم → bekhunam. The plural -ân becomes -â (مسافرا), and the destination moves after the verb with «به» dropped.",
    grammar: {
      conceptId: "compound-nouns",
      note: "Look at how the transport words are built: راه‌آهن is road + iron, and هواپیما is air + measure (a thing that crosses the air). The last part tells you what kind of thing it is.",
      examples: ["اولین راه‌آهن سراسری ایران حدود نود سال پیش ساخته شد و شمال کشور را به جنوب وصل کرد.", "بلیت قطار معمولاً از بلیت هواپیما ارزان‌تر است."],
    },
    news: {
      topic: "Transport",
      words: [
        { fa: "ایستگاه", tr: "istgâh", en: "station" },
        { fa: "تأخیر", tr: "ta'khir", en: "delay" },
        { fa: "لغو", tr: "laghv", en: "cancellation" },
        { fa: "قطار سریع‌السیر", tr: "ghatâr-e sari'osseyr", en: "high-speed train" },
        { fa: "حمل و نقل ریلی", tr: "haml o naghl-e reyli", en: "rail transport" },
      ],
      headlines: [
        { fa: "قطار تهران به مشهد با دو ساعت تأخیر حرکت کرد", en: "Tehran–Mashhad train leaves two hours late" },
        { fa: "فروش بلیت قطارهای نوروزی از امروز آغاز می‌شود", en: "Nowruz train tickets go on sale today" },
      ],
    },
    culture: {
      title: "Mashhad",
      fa: "مشهد",
      text: "Mashhad, in the north-east, is Iran's second-largest city and home to the shrine of Imam Reza, which millions of pilgrims visit every year. For many families the overnight train from Tehran is part of the journey: tea, a shared compartment and the desert going by at dawn.",
      words: [
        { fa: "حرم", tr: "haram", en: "shrine" },
        { fa: "زائر", tr: "zâ'er", en: "pilgrim" },
        { fa: "زیارت", tr: "ziyârat", en: "pilgrimage" },
      ],
    },
    task: {
      prompt: "Your turn: how would you rather travel on a long journey, and why?",
      phrases: [
        { fa: "ترجیح می‌دهم", tr: "tarjih midaham", en: "I prefer" },
        { fa: "راحت‌تر", tr: "râhat-tar", en: "more comfortable" },
        { fa: "سریع‌تر", tr: "sari'-tar", en: "faster" },
        { fa: "ارزان‌تر", tr: "arzân-tar", en: "cheaper" },
      ],
      model: [
        { fa: "من سفر با قطار را ترجیح می‌دهم.", en: "I prefer travelling by train." },
        { fa: "چون راحت‌تر و ارزان‌تر است.", en: "Because it's more comfortable and cheaper." },
        { fa: "ولی برای سفرهای خیلی دور، هواپیما سریع‌تر است.", en: "But for very long trips, the plane is faster." },
      ],
    },
  },
  {
    id: "bazaar",
    number: 5,
    level: "B1",
    question: { en: "Where do you like to shop: in a mall or at a market?", fa: "کجا خرید کردن را دوست دارید: مرکز خرید یا بازار؟" },
    topic: "In the bazaar",
    keyWords: [
      { fa: "سرپوشیده", tr: "sarpushide", en: "covered, roofed" },
      { fa: "راسته", tr: "râste", en: "row of shops (one trade)" },
      { fa: "کالا", tr: "kâlâ", en: "goods" },
      { fa: "ادویه", tr: "adviye", en: "spices" },
      { fa: "پارچه", tr: "pârche", en: "fabric" },
      { fa: "ثابت", tr: "sâbet", en: "fixed" },
      { fa: "چانه زدن", tr: "châne zadan", en: "to haggle" },
      { fa: "مشتری", tr: "moshtari", en: "customer" },
      { fa: "روسری", tr: "rusari", en: "headscarf" },
      { fa: "ابریشمی", tr: "abrishami", en: "silk (adj.)" },
    ],
    text: [
      [
        { fa: "بازار بزرگ تهران یکی از قدیمی‌ترین و بزرگ‌ترین بازارهای سرپوشیده‌ی ایران است.", en: "Tehran's Grand Bazaar is one of the oldest and largest covered markets in Iran." },
        { fa: "بازار از راسته‌های زیادی درست شده و هر راسته مخصوص یک کالاست.", en: "It is made up of many rows, and each row is for one kind of goods." },
        { fa: "در یک راسته فرش می‌فروشند و در راسته‌ی دیگر ادویه، طلا یا پارچه.", en: "In one row they sell carpets, in another spices, gold or fabric." },
      ],
      [
        { fa: "خرید در بازار با خرید در مرکز خرید فرق دارد.", en: "Shopping in the bazaar is different from shopping in a mall." },
        { fa: "در بازار قیمت‌ها همیشه ثابت نیستند و می‌شود چانه زد.", en: "In the bazaar prices aren't always fixed, and you can haggle." },
        { fa: "فروشنده‌ها معمولاً با مشتری چای می‌خورند و گپ می‌زنند.", en: "Shopkeepers often have tea and a chat with their customers." },
      ],
      [
        { fa: "سارا برای مادرش یک روسری ابریشمی خرید.", en: "Sara bought a silk headscarf for her mother." },
        { fa: "فروشنده اول گفت «قابل ندارد» و سارا خندید.", en: "First the shopkeeper said “it's nothing, take it”, and Sara laughed." },
        { fa: "بعد کمی چانه زدند و سارا روسری را ارزان‌تر خرید.", en: "Then they haggled a little and Sara got the scarf for less." },
        { fa: "سارا گفت: «چه بازار شلوغی! ولی چقدر قشنگ است!»", en: "Sara said: “What a busy bazaar! But how beautiful it is!”" },
      ],
    ],
    check: [
      { prompt: "What is a râste?", options: ["A row of shops for one kind of goods", "A kind of carpet", "A tea house"], answer: "A row of shops for one kind of goods" },
      { prompt: "What can you usually do in the bazaar but not in a mall?", options: ["Haggle over the price", "Pay by card", "Buy food"], answer: "Haggle over the price" },
      { prompt: "What did Sara buy?", options: ["A silk headscarf for her mother", "A carpet", "Saffron and spices"], answer: "A silk headscarf for her mother" },
      { prompt: "What did Sara think of the bazaar?", options: ["Busy but beautiful", "Too expensive", "Quiet and boring"], answer: "Busy but beautiful" },
    ],
    spoken: [
      { fa: "می‌شود چانه زد.", spoken: "می‌شه چونه زد.", en: "You can haggle." },
      { fa: "قیمت‌ها ثابت نیستند.", spoken: "قیمتا ثابت نیستن.", en: "Prices aren't fixed." },
      { fa: "فروشنده‌ها با مشتری چای می‌خورند.", spoken: "فروشنده‌ها با مشتری چایی می‌خورن.", en: "Shopkeepers have tea with customers." },
      { fa: "سارا روسری را ارزان‌تر خرید.", spoken: "سارا روسری رو ارزون‌تر خرید.", en: "Sara got the scarf cheaper." },
    ],
    spokenNote: "«را» becomes «رو», چانه → chune and ارزان → arzun (â before n), «می‌شود» is «می‌شه», and tea is often «چایی» in speech.",
    grammar: {
      conceptId: "exclamations",
      note: "Sara reacts with two exclamations: «چه + noun + -i!» (what a …!) and «چقدر + adjective!» (how …!).",
      examples: ["چه بازار شلوغی!", "چقدر قشنگ است!"],
    },
    news: {
      topic: "Trade and the economy",
      words: [
        { fa: "صادرات", tr: "sâderât", en: "exports" },
        { fa: "واردات", tr: "vâredât", en: "imports" },
        { fa: "تورم", tr: "tavarrom", en: "inflation" },
        { fa: "نرخ ارز", tr: "nerkh-e arz", en: "exchange rate" },
        { fa: "فرش دستباف", tr: "farsh-e dastbâf", en: "hand-woven carpet" },
      ],
      headlines: [
        { fa: "صادرات فرش دستباف افزایش یافت", en: "Hand-woven carpet exports rise" },
        { fa: "تورم قیمت‌ها را در بازار بالا برد", en: "Inflation pushes up prices in the bazaar" },
      ],
    },
    culture: {
      title: "The bazaar of Tabriz",
      fa: "بازار تبریز",
      text: "The historic bazaar of Tabriz, in the north-west, was a trading centre on the Silk Road for centuries and is on UNESCO's World Heritage list. Its brick domes roof a maze of rows, caravanserais and timches, the domed halls where merchants met.",
      words: [
        { fa: "کاروانسرا", tr: "kârvânsarâ", en: "caravanserai" },
        { fa: "جاده‌ی ابریشم", tr: "jâdde-ye abrisham", en: "the Silk Road" },
        { fa: "گنبد", tr: "gonbad", en: "dome" },
      ],
    },
    task: {
      prompt: "Your turn: you're buying something in the bazaar. Ask the price, say it's too much, and ask for a better price.",
      phrases: [
        { fa: "چند است؟", tr: "chand ast?", en: "how much is it?" },
        { fa: "خیلی گران است", tr: "kheyli gerân ast", en: "it's too expensive" },
        { fa: "تخفیف می‌دهید؟", tr: "takhfif midahid?", en: "will you give a discount?" },
        { fa: "آخرش چند؟", tr: "âkharesh chand?", en: "what's your last price?" },
      ],
      model: [
        { fa: "ببخشید، این روسری چند است؟", en: "Excuse me, how much is this headscarf?" },
        { fa: "خیلی گران است. تخفیف می‌دهید؟", en: "That's too expensive. Will you give me a discount?" },
        { fa: "آخرش چند می‌دهید؟", en: "What's your final price?" },
      ],
    },
  },
  {
    id: "nowruz",
    number: 6,
    level: "B1",
    question: { en: "How do people in your country celebrate the new year?", fa: "در کشور شما سال نو را چطور جشن می‌گیرند؟" },
    topic: "Nowruz",
    keyWords: [
      { fa: "بهار", tr: "bahâr", en: "spring" },
      { fa: "خانه‌تکانی", tr: "khâne-tekâni", en: "spring cleaning" },
      { fa: "سبزه", tr: "sabze", en: "sprouted greens" },
      { fa: "هفت‌سین", tr: "haft-sin", en: "the haft-sin spread" },
      { fa: "سکه", tr: "sekke", en: "coin" },
      { fa: "دید و بازدید", tr: "did o bâzdid", en: "new-year visits" },
      { fa: "عیدی", tr: "eydi", en: "new-year gift (often money)" },
      { fa: "طبیعت", tr: "tabi'at", en: "nature, the outdoors" },
    ],
    text: [
      [
        { fa: "نوروز، جشن سال نوی ایرانی، در اولین روز بهار است.", en: "Nowruz, the Iranian new year, falls on the first day of spring." },
        { fa: "مردم پیش از نوروز خانه‌تکانی می‌کنند تا خانه برای سال نو تمیز باشد.", en: "Before Nowruz people spring-clean so the house is clean for the new year." },
        { fa: "بیشتر خانواده‌ها لباس نو می‌خرند و سبزه سبز می‌کنند.", en: "Most families buy new clothes and grow sprouted greens." },
      ],
      [
        { fa: "مهم‌ترین نماد نوروز سفره‌ی هفت‌سین است.", en: "The most important symbol of Nowruz is the haft-sin spread." },
        { fa: "روی این سفره باید هفت چیز باشد که نامشان با «س» شروع شود.", en: "On it there should be seven things whose names begin with «s»." },
        { fa: "مثلاً سیب، سبزه، سکه، سیر، سرکه، سماق و سنجد.", en: "For example apple, greens, a coin, garlic, vinegar, sumac and oleaster." },
        { fa: "بعضی‌ها یک ماهی قرمز و یک آینه هم کنار سفره می‌گذارند.", en: "Some people put a goldfish and a mirror by the spread too." },
      ],
      [
        { fa: "در روزهای نوروز مردم به دیدن خانواده و دوستان می‌روند و به این کار دید و بازدید می‌گویند.", en: "Over Nowruz people visit family and friends, which is called did o bâzdid." },
        { fa: "بزرگ‌ترها به کوچک‌ترها عیدی می‌دهند.", en: "The older ones give the younger ones eydi." },
        { fa: "روز سیزدهم، مردم به طبیعت می‌روند تا بدشانسی را از خانه دور کنند.", en: "On the thirteenth day people go out into nature to keep bad luck away from the house." },
      ],
    ],
    check: [
      { prompt: "When is Nowruz?", options: ["On the first day of spring", "On the last night of autumn", "In the middle of winter"], answer: "On the first day of spring" },
      { prompt: "Why do people spring-clean before Nowruz?", options: ["So the house is clean for the new year", "Because guests ask them to", "For Yalda"], answer: "So the house is clean for the new year" },
      { prompt: "What do the things on the haft-sin have in common?", options: ["Their names start with «س»", "They are all red", "They are all sweet"], answer: "Their names start with «س»" },
      { prompt: "What happens on the thirteenth day?", options: ["People go out into nature", "Children go back to school", "People buy new clothes"], answer: "People go out into nature" },
    ],
    spoken: [
      { fa: "مردم خانه‌تکانی می‌کنند.", spoken: "مردم خونه‌تکونی می‌کنن.", en: "People do their spring cleaning." },
      { fa: "به دیدن خانواده می‌روند.", spoken: "می‌رن دیدن فامیل.", en: "They go and see the family." },
      { fa: "بزرگ‌ترها عیدی می‌دهند.", spoken: "بزرگ‌ترا عیدی می‌دن.", en: "The grown-ups give eydi." },
      { fa: "باید هفت چیز باشد.", spoken: "باید هفت تا چیز باشه.", en: "There have to be seven things." },
    ],
    spokenNote: "The -and ending drops to -an (می‌روند → miran, می‌دهند → midan), «فامیل» (relatives) is more usual than «خانواده» in speech, and numbers take «تا» before the noun: هفت تا چیز.",
    grammar: {
      conceptId: "subjunctive",
      note: "After «تا» (so that) and «باید» (should), and in a «که» clause about what's wanted, the verb is subjunctive: باشد, شود, کنند.",
      examples: ["تا خانه برای سال نو تمیز باشد.", "که نامشان با «س» شروع شود.", "تا بدشانسی را از خانه دور کنند."],
    },
    news: {
      topic: "Holidays and travel",
      words: [
        { fa: "تعطیلات", tr: "ta'tilât", en: "holidays" },
        { fa: "سفرهای نوروزی", tr: "safarhâ-ye nowruzi", en: "Nowruz trips" },
        { fa: "گردشگر", tr: "gardeshgar", en: "tourist" },
        { fa: "اقامتگاه", tr: "eghâmatgâh", en: "accommodation" },
        { fa: "ترافیک جاده‌ای", tr: "terâfik-e jâdde'i", en: "road traffic" },
      ],
      headlines: [
        { fa: "سفرهای نوروزی از امروز آغاز شد", en: "Nowruz travel begins today" },
        { fa: "جاده‌های شمال در تعطیلات نوروز شلوغ است", en: "Roads to the north are busy over the Nowruz holiday" },
      ],
    },
    culture: {
      title: "Chaharshanbe Suri",
      fa: "چهارشنبه‌سوری",
      text: "On the evening before the last Wednesday of the year, people light small bonfires in the street and jump over them, singing «zardi-ye man az to, sorkhi-ye to az man»: my paleness to you, your red glow to me. The old year's tiredness goes into the fire.",
      words: [
        { fa: "آتش", tr: "âtash", en: "fire" },
        { fa: "پریدن", tr: "paridan", en: "to jump" },
        { fa: "سرخی", tr: "sorkhi", en: "redness, a healthy glow" },
      ],
    },
    task: {
      prompt: "Your turn: describe how you celebrate the new year: what you do before it, on the day, and after.",
      phrases: [
        { fa: "قبل از سال نو", tr: "ghabl az sâl-e now", en: "before the new year" },
        { fa: "روز اول سال", tr: "ruz-e avval-e sâl", en: "new year's day" },
        { fa: "به دیدن", tr: "be didan-e", en: "to visit (someone)" },
        { fa: "هدیه می‌دهیم", tr: "hediye midahim", en: "we give presents" },
      ],
      model: [
        { fa: "قبل از سال نو خانه را تمیز می‌کنیم.", en: "Before the new year we clean the house." },
        { fa: "شب سال نو با دوستانم بیرون می‌روم.", en: "On new year's eve I go out with my friends." },
        { fa: "روز اول سال به دیدن پدر و مادرم می‌روم.", en: "On new year's day I go to see my parents." },
      ],
    },
  },
  {
    id: "hafez",
    number: 7,
    level: "B1",
    question: { en: "Is there a poet whose lines people in your country know by heart?", fa: "در کشور شما شاعری هست که مردم شعرهایش را از حفظ بدانند؟" },
    topic: "Hafez",
    keyWords: [
      { fa: "شعر", tr: "she'r", en: "poem, poetry" },
      { fa: "غزل", tr: "ghazal", en: "ghazal (lyric poem)" },
      { fa: "دیوان", tr: "divân", en: "a poet's collected poems" },
      { fa: "محبوب", tr: "mahbub", en: "popular, beloved" },
      { fa: "فال", tr: "fâl", en: "fortune, omen" },
      { fa: "نیت کردن", tr: "niyyat kardan", en: "to make a wish" },
      { fa: "مشاور", tr: "moshâver", en: "adviser" },
      { fa: "آرامگاه", tr: "ârâmgâh", en: "tomb, resting place" },
      { fa: "بازدیدکننده", tr: "bâzdid-konande", en: "visitor" },
      { fa: "سکوت", tr: "sokut", en: "silence" },
    ],
    text: [
      [
        { fa: "حافظ بیش از ششصد سال پیش در شیراز زندگی می‌کرد.", en: "Hafez lived in Shiraz more than six hundred years ago." },
        { fa: "او بیشتر غزل می‌گفت و دیوانش یکی از محبوب‌ترین کتاب‌های فارسی است.", en: "He wrote mostly ghazals, and his Divan is one of the best-loved books in Persian." },
        { fa: "می‌گویند در بسیاری از خانه‌های ایرانی یک دیوان حافظ پیدا می‌شود.", en: "They say a copy of Hafez's Divan can be found in many Iranian homes." },
      ],
      [
        { fa: "مردم با دیوان حافظ فال می‌گیرند.", en: "People take a fâl from Hafez's Divan." },
        { fa: "اول نیت می‌کنند، بعد کتاب را باز می‌کنند و غزلی را که آمده می‌خوانند.", en: "First they make a wish, then they open the book and read the ghazal that comes up." },
        { fa: "می‌شود گفت که حافظ برای بسیاری از ایرانیان فقط یک شاعر نیست، بلکه یک دوست و مشاور است.", en: "You could say that for many Iranians Hafez is not just a poet but a friend and an adviser." },
      ],
      [
        { fa: "آرامگاه حافظ در شیراز، که به آن حافظیه می‌گویند، همیشه پر از بازدیدکننده است.", en: "Hafez's tomb in Shiraz, known as the Hafezieh, is always full of visitors." },
        { fa: "بعضی‌ها آنجا با صدای بلند شعر می‌خوانند و بعضی‌ها فقط در سکوت می‌نشینند.", en: "Some read poems aloud there, and some just sit in silence." },
      ],
    ],
    check: [
      { prompt: "Where did Hafez live?", options: ["Shiraz", "Tehran", "Isfahan"], answer: "Shiraz" },
      { prompt: "What kind of poems did he mostly write?", options: ["Ghazals", "Epics", "Riddles"], answer: "Ghazals" },
      { prompt: "What do people do before opening the Divan for a fâl?", options: ["Make a wish", "Read the first page", "Write a letter"], answer: "Make a wish" },
      { prompt: "What is the Hafezieh?", options: ["Hafez's tomb in Shiraz", "A book of his poems", "A school in Tehran"], answer: "Hafez's tomb in Shiraz" },
    ],
    spoken: [
      { fa: "مردم با دیوان حافظ فال می‌گیرند.", spoken: "مردم با دیوون حافظ فال می‌گیرن.", en: "People take a fâl from Hafez." },
      { fa: "می‌شود گفت که حافظ یک دوست است.", spoken: "می‌شه گفت حافظ یه دوسته.", en: "You could say Hafez is a friend." },
      { fa: "همیشه پر از بازدیدکننده است.", spoken: "همیشه پر از آدمه.", en: "It's always full of people." },
      { fa: "در سکوت می‌نشینند.", spoken: "ساکت می‌شینن.", en: "They sit quietly." },
    ],
    spokenNote: "دیوان becomes divun, «یک» is «یه», the «که» after گفت is often dropped, and می‌نشینند shrinks to mishinan. Everyday speech also swaps formal words for simple ones: بازدیدکننده → آدم.",
    grammar: {
      conceptId: "impersonal",
      note: "To say what people in general say or can do, the text uses forms with no one in particular: «می‌گویند» (they say), «می‌شود گفت» (one could say), «پیدا می‌شود» (can be found).",
      examples: ["می‌گویند در بسیاری از خانه‌های ایرانی یک دیوان حافظ پیدا می‌شود.", "که به آن حافظیه می‌گویند"],
    },
    news: {
      topic: "Literature and culture",
      words: [
        { fa: "شاعر", tr: "shâ'er", en: "poet" },
        { fa: "ادبیات", tr: "adabiyât", en: "literature" },
        { fa: "بزرگداشت", tr: "bozorgdâsht", en: "commemoration" },
        { fa: "شب شعر", tr: "shab-e she'r", en: "poetry evening" },
        { fa: "نمایشگاه کتاب", tr: "namâyeshgâh-e ketâb", en: "book fair" },
      ],
      headlines: [
        { fa: "مراسم روز بزرگداشت حافظ در شیراز برگزار شد", en: "Hafez Day ceremony held in Shiraz" },
        { fa: "نمایشگاه کتاب تهران فردا آغاز می‌شود", en: "Tehran Book Fair opens tomorrow" },
      ],
    },
    culture: {
      title: "Saadi",
      fa: "سعدی",
      text: "Shiraz's other great poet, Saadi, wrote the Golestan and the Bustan in the thirteenth century. His lines on all people being limbs of one body, «bani âdam a'zâ-ye yekdigarand», are quoted around the world and taught to every Iranian child.",
      words: [
        { fa: "گلستان", tr: "golestân", en: "rose garden (Saadi's book)" },
        { fa: "بنی‌آدم", tr: "bani âdam", en: "human beings" },
        { fa: "از حفظ", tr: "az hefz", en: "by heart" },
      ],
    },
    task: {
      prompt: "Your turn: talk about a poet, singer or writer you love: who they are and a line of theirs you know.",
      phrases: [
        { fa: "مورد علاقه‌ام", tr: "mowred-e alâghe-am", en: "my favourite" },
        { fa: "از حفظ بلدم", tr: "az hefz baladam", en: "I know it by heart" },
        { fa: "می‌گویند", tr: "miguyand", en: "they say" },
        { fa: "به نظر من", tr: "be nazar-e man", en: "in my opinion" },
      ],
      model: [
        { fa: "شاعر مورد علاقه‌ام سعدی است.", en: "My favourite poet is Saadi." },
        { fa: "یک بیت از گلستان را از حفظ بلدم.", en: "I know a couplet from the Golestan by heart." },
        { fa: "به نظر من شعرهایش هنوز تازه است.", en: "I think his poems still feel fresh." },
      ],
    },
  },
  {
    id: "tea",
    number: 8,
    level: "B1",
    question: { en: "Tea or coffee — what do you drink in the morning?", fa: "صبح‌ها چای می‌خورید یا قهوه؟" },
    topic: "A glass of tea",
    keyWords: [
      { fa: "نوشیدنی", tr: "nushidani", en: "drink" },
      { fa: "مزرعه", tr: "mazra'e", en: "farm, plantation" },
      { fa: "کاشته", tr: "kâshte", en: "planted" },
      { fa: "استان", tr: "ostân", en: "province" },
      { fa: "مهمان", tr: "mehmân", en: "guest" },
      { fa: "قند", tr: "ghand", en: "sugar cube" },
      { fa: "سماور", tr: "samâvar", en: "samovar" },
      { fa: "قهوه‌خانه", tr: "ghahve-khâne", en: "teahouse" },
      { fa: "رسم", tr: "rasm", en: "custom" },
    ],
    text: [
      [
        { fa: "چای محبوب‌ترین نوشیدنی ایرانیان است.", en: "Tea is Iranians' favourite drink." },
        { fa: "حدود صد و بیست سال پیش، اولین مزرعه‌های چای در شمال ایران کاشته شد.", en: "About a hundred and twenty years ago, the first tea plantations were planted in northern Iran." },
        { fa: "امروز بیشتر چای ایرانی در استان گیلان و مازندران تولید می‌شود.", en: "Today most Iranian tea is produced in the provinces of Gilan and Mazandaran." },
      ],
      [
        { fa: "در خانه‌های ایرانی، چای اولین چیزی است که به مهمان تعارف می‌شود.", en: "In Iranian homes, tea is the first thing offered to a guest." },
        { fa: "چای را معمولاً در استکان کمرباریک می‌ریزند و با قند می‌خورند.", en: "Tea is usually poured into a small narrow-waisted glass and drunk with a sugar cube." },
        { fa: "خیلی‌ها قند را در دهان می‌گذارند و چای را از روی آن می‌نوشند.", en: "Many people put the sugar cube in their mouth and drink the tea through it." },
      ],
      [
        { fa: "در گذشته در هر خانه یک سماور بود که از صبح تا شب روشن می‌ماند.", en: "In the past every home had a samovar that stayed on from morning till night." },
        { fa: "جالب است که در ایران به چایخانه‌های قدیمی «قهوه‌خانه» می‌گویند.", en: "Interestingly, in Iran old teahouses are called “coffee houses”." },
        { fa: "این اسم از زمانی مانده است که هنوز قهوه رسم بیشتری از چای داشت.", en: "The name is left over from a time when coffee was still more customary than tea." },
      ],
    ],
    check: [
      { prompt: "Where were the first tea plantations in Iran?", options: ["In the north", "In the south", "Near Tehran"], answer: "In the north" },
      { prompt: "What is the first thing a guest is offered?", options: ["Tea", "Coffee", "Fruit"], answer: "Tea" },
      { prompt: "How do many people drink tea with a sugar cube?", options: ["They hold it in their mouth and drink through it", "They stir it into the glass", "They eat it afterwards"], answer: "They hold it in their mouth and drink through it" },
      { prompt: "Why are teahouses called “coffee houses”?", options: ["Coffee was once more common than tea", "They only serve coffee", "It's a mistake on the sign"], answer: "Coffee was once more common than tea" },
    ],
    spoken: [
      { fa: "چای محبوب‌ترین نوشیدنی ایرانیان است.", spoken: "چایی محبوب‌ترین نوشیدنی ایرونیاس.", en: "Tea is Iranians' favourite drink." },
      { fa: "چای را با قند می‌خورند.", spoken: "چایی رو با قند می‌خورن.", en: "They drink tea with a sugar cube." },
      { fa: "چای اولین چیزی است که به مهمان تعارف می‌شود.", spoken: "اولین چیزی که به مهمون تعارف می‌کنن چاییه.", en: "Tea is the first thing they offer a guest." },
      { fa: "یک سماور بود.", spoken: "یه سماور بود.", en: "There was a samovar." },
    ],
    spokenNote: "In speech tea is often «چایی» (châyi). â before n turns to u (ایرانی → irun-i, مهمان → mehmun), «را» becomes «رو», and spoken Persian prefers an active «they offer» to the written passive «is offered».",
    grammar: {
      conceptId: "passive",
      note: "The text describes how things are done, not who does them, so it uses the passive: past participle + شدن. کاشته شد — was planted; تولید می‌شود — is produced; تعارف می‌شود — is offered.",
      examples: ["اولین مزرعه‌های چای در شمال ایران کاشته شد.", "بیشتر چای ایرانی در استان گیلان و مازندران تولید می‌شود."],
    },
    news: {
      topic: "Farming",
      words: [
        { fa: "برداشت", tr: "bardâsht", en: "harvest" },
        { fa: "کشاورز", tr: "keshâvarz", en: "farmer" },
        { fa: "محصول", tr: "mahsul", en: "crop, product" },
        { fa: "صادرات", tr: "sâderât", en: "exports" },
        { fa: "واردات", tr: "vâredât", en: "imports" },
      ],
      headlines: [
        { fa: "برداشت برگ سبز چای در گیلان آغاز شد", en: "Green tea leaf harvest begins in Gilan" },
        { fa: "کشاورزان شمال از کاهش باران نگران‌اند", en: "Northern farmers worried about falling rainfall" },
      ],
    },
    culture: {
      title: "Lahijan",
      fa: "لاهیجان",
      text: "Lahijan, a green town in Gilan near the Caspian, is the heart of Iranian tea country. Tea growing there began around 1900, when a diplomat brought seeds and know-how back from India; today the town has a small tea museum, and its hillsides are covered in neat rows of tea bushes.",
      words: [
        { fa: "بوته", tr: "bute", en: "bush" },
        { fa: "تپه", tr: "tappe", en: "hill" },
        { fa: "موزه", tr: "muze", en: "museum" },
      ],
    },
    task: {
      prompt: "Your turn: what do people in your country drink with guests, and how?",
      phrases: [
        { fa: "در کشور من", tr: "dar keshvar-e man", en: "in my country" },
        { fa: "معمولاً", tr: "ma'mulan", en: "usually" },
        { fa: "تعارف می‌کنند", tr: "ta'ârof mikonand", en: "they offer" },
        { fa: "به جای", tr: "be jâ-ye", en: "instead of" },
      ],
      model: [
        { fa: "در کشور من معمولاً به مهمان قهوه تعارف می‌کنند.", en: "In my country people usually offer guests coffee." },
        { fa: "قهوه را با شیر و کیک می‌خوریم.", en: "We have it with milk and cake." },
        { fa: "ولی من خودم به جای قهوه چای را ترجیح می‌دهم.", en: "But I myself prefer tea to coffee." },
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
