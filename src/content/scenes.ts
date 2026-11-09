// Scenes: short everyday sketches with a recurring cast, in colloquial
// Tehran Persian (DRAFT — original Farsi Pen content, pending native review).
// The learner picks a part and says that character's lines out loud; the
// others are played by the voice. Sara grew up in Toronto and is visiting
// her aunt's family in Tehran, so her lines are the ones a learner needs.

import type { Tone } from "@/components/ui";

export type CastId = "sara" | "mahin" | "arash" | "mamad" | "shirin" | "driver";

export interface Character {
  id: CastId;
  name: string;
  fa: string;
  /** Who they are, in a few words. */
  role: string;
  tone: Tone;
}

export const CAST: Record<CastId, Character> = {
  sara: { id: "sara", name: "Sara", fa: "سارا", role: "visiting from Toronto", tone: "sky" },
  mahin: { id: "mahin", name: "Khale Mahin", fa: "مهین", role: "Sara's aunt", tone: "plum" },
  arash: { id: "arash", name: "Arash", fa: "آرش", role: "her cousin", tone: "firuze" },
  mamad: { id: "mamad", name: "Agha Mamad", fa: "ممد", role: "runs the corner shop", tone: "saffron" },
  shirin: { id: "shirin", name: "Shirin", fa: "شیرین", role: "the neighbour upstairs", tone: "pista" },
  driver: { id: "driver", name: "Driver", fa: "راننده", role: "shared taxi", tone: "anar" },
};

export interface SceneLine {
  who: CastId;
  fa: string;
  tr: string;
  en: string;
  /** Culture or grammar note shown under the line. */
  note?: string;
}

export interface StageDirection {
  stage: string;
}

export type ScriptItem = SceneLine | StageDirection;

export interface Scene {
  id: string;
  episode: number;
  title: string;
  fa: string;
  /** One line that sets the scene. */
  setting: string;
  script: ScriptItem[];
}

export const isLine = (x: ScriptItem): x is SceneLine => "who" in x;

export const SCENES: Scene[] = [
  {
    id: "welcome",
    episode: 1,
    title: "Welcome home",
    fa: "خوش اومدی",
    setting: "Sara rings the bell at her aunt's flat in Tehran.",
    script: [
      { stage: "Khale Mahin opens the door." },
      { who: "mahin", fa: "وای، سارا جان! خوش اومدی عزیزم!", tr: "vây, Sârâ jân! khosh umadi azizam!", en: "Oh, Sara dear! Welcome, my dear!", note: "jân after a name is warm, like “dear”." },
      { who: "sara", fa: "سلام خاله جون! دلم براتون تنگ شده بود.", tr: "salâm khâle jun! delam barâtun tang shode bud.", en: "Hi auntie! I've missed you so much.", note: "Literally “my heart had become tight for you”." },
      { who: "mahin", fa: "منم همینطور. بیا تو، بیا تو!", tr: "manam hamintor. biyâ tu, biyâ tu!", en: "Me too. Come in, come in!" },
      { who: "sara", fa: "کفشامو کجا بذارم؟", tr: "kafshâmo kojâ bezâram?", en: "Where should I put my shoes?", note: "Shoes come off at the door in Iranian homes." },
      { who: "mahin", fa: "همونجا دم در. خسته نباشی! چای می‌خوری؟", tr: "hamunjâ dam-e dar. khaste nabâshi! chây mikhori?", en: "Right there by the door. You must be tired! Will you have tea?" },
      { who: "sara", fa: "نه، مرسی، زحمت نکشید.", tr: "na, mersi, zahmat nakeshid.", en: "No thanks, don't go to any trouble.", note: "Ta'ârof: a polite first “no”. Your host will insist." },
      { who: "mahin", fa: "چه زحمتی؟ آب جوشه. الان میارم.", tr: "che zahmati? âb jushe. alân miyâram.", en: "What trouble? The water's boiling. I'll bring it now." },
      { stage: "Arash shuffles in, still in his pyjamas." },
      { who: "arash", fa: "به‌به! دخترخاله‌ی کانادایی!", tr: "bah-bah! dokhtarkhâle-ye kânâdâyi!", en: "Well, well! My Canadian cousin!" },
      { who: "sara", fa: "سلام آرش! چه خبر؟", tr: "salâm Ârash! che khabar?", en: "Hi Arash! What's new?" },
      { who: "arash", fa: "هیچی، سلامتی. خوش اومدی.", tr: "hichi, salâmati. khosh umadi.", en: "Nothing much, all good. Welcome.", note: "salâmati — “health” — is the usual answer to che khabar?" },
    ],
  },
  {
    id: "bread",
    episode: 2,
    title: "Bread and cheese",
    fa: "نون و پنیر",
    setting: "Breakfast time. There's no bread in the house.",
    script: [
      { who: "mahin", fa: "سارا جان، می‌ری سر کوچه نون بگیری؟", tr: "Sârâ jân, miri sar-e kuche nun begiri?", en: "Sara dear, could you pop to the corner and get bread?" },
      { who: "sara", fa: "آره، حتماً. چیز دیگه‌ای هم لازم داریم؟", tr: "âre, hatman. chiz-e dige-i ham lâzem dârim?", en: "Yes, sure. Do we need anything else?" },
      { who: "mahin", fa: "یه کم پنیر هم بگیر، از آقا ممد.", tr: "ye kam panir ham begir, az âghâ Mamad.", en: "Get a bit of cheese too, from Agha Mamad." },
      { stage: "At the corner shop." },
      { who: "mamad", fa: "سلام دخترم، بفرمایید.", tr: "salâm dokhtaram, befarmâyid.", en: "Hello, my girl. What can I get you?", note: "befarmâyid is an all-purpose “please, go ahead”." },
      { who: "sara", fa: "سلام. یه نون سنگک و یه بسته پنیر می‌خواستم.", tr: "salâm. ye nun-e sangak o ye baste panir mikhâstam.", en: "Hi. I'd like a sangak bread and a pack of cheese.", note: "mikhâstam (“I wanted”) is the polite way to ask for something." },
      { who: "mamad", fa: "سنگک تموم شده. بربری داریم.", tr: "sangak tamum shode. barbari dârim.", en: "Sangak's sold out. We've got barbari." },
      { who: "sara", fa: "باشه، بربری خوبه. چقدر می‌شه؟", tr: "bâshe, barbari khube. cheghadr mishe?", en: "OK, barbari's fine. How much is it?" },
      { who: "mamad", fa: "قابل نداره.", tr: "ghâbel nadâre.", en: "It's nothing — be my guest.", note: "Ta'ârof again. He doesn't mean it: ask once more." },
      { who: "sara", fa: "خواهش می‌کنم، بفرمایید چقدر؟", tr: "khâhesh mikonam, befarmâyid cheghadr?", en: "Please — tell me how much?" },
      { who: "mamad", fa: "صد و بیست تومن.", tr: "sad o bist toman.", en: "A hundred and twenty tomans.", note: "Shopkeepers drop the thousands: this means 120,000 tomans." },
      { who: "sara", fa: "بفرمایید. مرسی، خداحافظ!", tr: "befarmâyid. mersi, khodâhâfez!", en: "Here you are. Thanks, bye!" },
    ],
  },
  {
    id: "remote",
    episode: 3,
    title: "Where's the remote?",
    fa: "کنترل کجاست؟",
    setting: "Evening. The football starts in two minutes.",
    script: [
      { who: "arash", fa: "کی کنترل رو برداشته؟", tr: "ki kontrol ro bardâshte?", en: "Who's taken the remote?" },
      { who: "mahin", fa: "من که دست نزدم.", tr: "man ke dast nazadam.", en: "Well, I haven't touched it." },
      { who: "arash", fa: "سارا، تو ندیدیش؟", tr: "Sârâ, to nadidish?", en: "Sara, haven't you seen it?" },
      { who: "sara", fa: "نه. زیر مبل رو نگاه کردی؟", tr: "na. zir-e mobl ro negâh kardi?", en: "No. Did you look under the sofa?" },
      { who: "arash", fa: "آره، نیست. بازی داره شروع می‌شه!", tr: "âre, nist. bâzi dâre shoru mishe!", en: "Yes, it's not there. The match is starting!" },
      { who: "mahin", fa: "آرش جان، تو جیبت چیه؟", tr: "Ârash jân, tu jibet chie?", en: "Arash dear, what's that in your pocket?" },
      { stage: "A long pause." },
      { who: "arash", fa: "اِ! اینجاست!", tr: "e! injâst!", en: "Oh! Here it is!" },
      { who: "sara", fa: "وای آرش! تو خیلی حواس‌پرتی!", tr: "vây Ârash! to kheyli havâsparti!", en: "Oh, Arash! You're so absent-minded!" },
      { who: "arash", fa: "هیس! گل زدن!", tr: "his! gol zadan!", en: "Shh! They've scored!" },
    ],
  },
  {
    id: "taxi",
    episode: 4,
    title: "Shared taxi to Tajrish",
    fa: "تاکسی تا تجریش",
    setting: "Valiasr Street. Arash waves down a shared taxi.",
    script: [
      { who: "arash", fa: "آقا، تجریش؟", tr: "âghâ, Tajrish?", en: "Excuse me — Tajrish?", note: "In a shared taxi you just call out where you're going." },
      { who: "driver", fa: "بفرمایید بالا. دو نفرید؟", tr: "befarmâyid bâlâ. do nafarid?", en: "Hop in. Two of you?" },
      { who: "arash", fa: "آره، دو نفریم.", tr: "âre, do nafarim.", en: "Yes, two of us." },
      { stage: "Ten minutes later. Bumper to bumper." },
      { who: "sara", fa: "آرش، چقدر ترافیکه! همیشه اینطوریه؟", tr: "Ârash, cheghadr terâfike! hamishe intoriye?", en: "Arash, so much traffic! Is it always like this?" },
      { who: "arash", fa: "نه بابا، فقط صبح و عصر… و ظهر… و شب.", tr: "na bâbâ, faghat sob o asr… o zohr… o shab.", en: "Nah — only mornings and evenings… and noon… and night." },
      { who: "driver", fa: "رسیدیم، تجریش.", tr: "residim, Tajrish.", en: "Here we are, Tajrish." },
      { who: "sara", fa: "چقدر تقدیم کنم؟", tr: "cheghadr taghdim konam?", en: "How much do I owe you?", note: "taghdim konam — “may I offer” — is the polite way to pay." },
      { who: "driver", fa: "نفری پنجاه.", tr: "nafari panjâh.", en: "Fifty each." },
      { who: "sara", fa: "بفرمایید. دستتون درد نکنه.", tr: "befarmâyid. dastetun dard nakone.", en: "Here you go. Thank you.", note: "“May your hand not hurt” — thanks for someone's effort." },
      { who: "driver", fa: "خواهش می‌کنم، به سلامت.", tr: "khâhesh mikonam, be salâmat.", en: "You're welcome. Take care." },
    ],
  },
  {
    id: "party",
    episode: 5,
    title: "Shirin's birthday",
    fa: "تولد شیرین",
    setting: "A knock at the door. It's Shirin from upstairs.",
    script: [
      { who: "shirin", fa: "سلام! ببخشید مزاحم شدم.", tr: "salâm! bebakhshid mozâhem shodam.", en: "Hi! Sorry to bother you." },
      { who: "mahin", fa: "خواهش می‌کنم، شیرین جان. بفرما تو.", tr: "khâhesh mikonam, Shirin jân. befarmâ tu.", en: "Not at all, Shirin dear. Come in." },
      { who: "shirin", fa: "نه، مرسی. اومدم دعوتتون کنم. جمعه تولدمه.", tr: "na, mersi. umadam da'vatetun konam. jom'e tavallodame.", en: "No thanks. I came to invite you. Friday's my birthday." },
      { who: "sara", fa: "وای، تولدت مبارک! حتماً میایم.", tr: "vây, tavallodet mobârak! hatman miyâym.", en: "Oh, happy birthday! We'll definitely come." },
      { who: "shirin", fa: "ساعت هفت، طبقه‌ی بالا. چیزی هم نیارید!", tr: "sâ'at-e haft, tabaghe-ye bâlâ. chizi ham nayârid!", en: "Seven o'clock, upstairs. And don't bring anything!" },
      { who: "mahin", fa: "مگه میشه؟ دست خالی که نمیایم.", tr: "mage mishe? dast-e khâli ke nemiyâym.", en: "As if! We won't come empty-handed.", note: "Guests always bring something — sweets, flowers or fruit." },
      { who: "arash", fa: "من کیک میارم!", tr: "man keyk miyâram!", en: "I'll bring a cake!" },
      { who: "sara", fa: "تو؟ تو که کنترل رو هم گم می‌کنی!", tr: "to? to ke kontrol ro ham gom mikoni!", en: "You? You can't even keep track of the remote!" },
      { who: "shirin", fa: "پس کیک با سارا!", tr: "pas keyk bâ Sârâ!", en: "Then Sara's on cake!" },
    ],
  },
  {
    id: "bazaar",
    episode: 6,
    title: "Lost in the bazaar",
    fa: "گم شدم!",
    setting: "Tehran's Grand Bazaar. Sara has wandered off on her own.",
    script: [
      { stage: "Sara calls Arash." },
      { who: "sara", fa: "الو، آرش؟ من گم شدم!", tr: "alo, Ârash? man gom shodam!", en: "Hello, Arash? I'm lost!" },
      { who: "arash", fa: "نترس. الان کجایی؟", tr: "natars. alân kojâyi?", en: "Don't panic. Where are you now?" },
      { who: "sara", fa: "نمی‌دونم. جلوی یه مغازه‌ی فرش‌فروشیم.", tr: "nemidunam. jelo-ye ye maghâze-ye farsh-forushiam.", en: "I don't know. I'm outside a carpet shop." },
      { who: "arash", fa: "سارا، اونجا صدتا فرش‌فروشی هست!", tr: "Sârâ, unjâ sad tâ farsh-forushi hast!", en: "Sara, there are a hundred carpet shops there!" },
      { who: "sara", fa: "یه مسجد هم سمت راستمه.", tr: "ye masjed ham samt-e râstame.", en: "There's a mosque on my right, too." },
      { who: "arash", fa: "خوبه. همونجا وایسا. ده دقیقه دیگه میام.", tr: "khube. hamunjâ vâysâ. dah daghighe-ye dige miyâm.", en: "Good. Stay right there. I'll be there in ten minutes." },
      { stage: "Twenty-five minutes later." },
      { who: "sara", fa: "آرش! ده دقیقه بود؟", tr: "Ârash! dah daghighe bud?", en: "Arash! That was ten minutes?" },
      { who: "arash", fa: "ده دقیقه‌ی ایرانی!", tr: "dah daghighe-ye irâni!", en: "Ten Iranian minutes!" },
    ],
  },
  {
    id: "cold",
    episode: 7,
    title: "Under the weather",
    fa: "سرماخوردگی",
    setting: "Sara wakes up with a sore throat. Shirin from upstairs drops by.",
    script: [
      { who: "mahin", fa: "سارا جان، چرا رنگت پریده؟", tr: "Sârâ jân, cherâ rangat paride?", en: "Sara dear, why are you so pale?", note: "Literally “why has your colour flown?”" },
      { who: "sara", fa: "گلوم درد می‌کنه. فکر کنم سرما خوردم.", tr: "galum dard mikone. fekr konam sarmâ khordam.", en: "My throat hurts. I think I've caught a cold.", note: "sarmâ khordan — literally “to eat the cold” — means to catch a cold." },
      { who: "mahin", fa: "وای! برو بخواب، برات سوپ درست می‌کنم.", tr: "vây! boro bekhâb, barât sup dorost mikonam.", en: "Oh no! Go and lie down, I'll make you some soup." },
      { stage: "The doorbell rings. It's Shirin." },
      { who: "shirin", fa: "سلام! شنیدم سارا مریضه. براش آش آوردم.", tr: "salâm! shenidam Sârâ marize. barâsh âsh âvordam.", en: "Hi! I heard Sara's ill. I've brought her some âsh.", note: "âsh is a thick soup — the classic thing to take to someone who's ill." },
      { who: "sara", fa: "وای، شیرین جون، دستت درد نکنه!", tr: "vây, Shirin jun, dastet dard nakone!", en: "Oh Shirin, thank you so much!" },
      { who: "shirin", fa: "قابلی نداره. تب هم داری؟", tr: "ghâbeli nadâre. tab ham dâri?", en: "It's nothing. Do you have a fever too?" },
      { who: "sara", fa: "نه، فقط یه کم سرم درد می‌کنه.", tr: "na, faghat ye kam saram dard mikone.", en: "No, just a bit of a headache." },
      { who: "shirin", fa: "داروخونه‌ی سر خیابون تا شب بازه. می‌خوای برات قرص بگیرم؟", tr: "dârukhune-ye sar-e khiyâbun tâ shab bâze. mikhâi barât ghors begiram?", en: "The pharmacy at the end of the street is open till late. Shall I get you some tablets?" },
      { who: "sara", fa: "نه، مرسی. با این آش خوب می‌شم!", tr: "na, mersi. bâ in âsh khub misham!", en: "No, thanks. This âsh will make me better!" },
      { who: "mahin", fa: "بلا دوره، عزیزم.", tr: "balâ dure, azizam.", en: "May trouble stay far from you, dear.", note: "balâ dur — said to someone who's ill or has had a scare." },
    ],
  },
  {
    id: "goodbye",
    episode: 8,
    title: "Until next time",
    fa: "تا دفعه‌ی بعد",
    setting: "Sara's last evening in Tehran. Everyone has gathered at Khale Mahin's.",
    script: [
      { who: "arash", fa: "باورم نمی‌شه فردا می‌ری!", tr: "bâvaram nemishe fardâ miri!", en: "I can't believe you're leaving tomorrow!" },
      { who: "sara", fa: "منم همینطور. خیلی زود گذشت.", tr: "manam hamintor. kheyli zud gozasht.", en: "Me neither. It went so fast." },
      { who: "mahin", fa: "اینجا خونه‌ی خودته. هر وقت خواستی بیا.", tr: "injâ khune-ye khodete. har vaght khâsti biyâ.", en: "This is your own home. Come whenever you like." },
      { who: "sara", fa: "مرسی خاله جون، خیلی بهم خوش گذشت.", tr: "mersi khâle jun, kheyli behem khosh gozasht.", en: "Thank you, auntie, I had a wonderful time.", note: "khosh gozashtan — “to pass pleasantly” — is how you say you had a good time." },
      { who: "shirin", fa: "فارسیت هم خیلی بهتر شده!", tr: "fârsit ham kheyli behtar shode!", en: "And your Persian has got so much better!" },
      { who: "sara", fa: "لطف داری. هنوز خیلی چیزا رو بلد نیستم.", tr: "lotf dâri. hanuz kheyli chizâ ro balad nistam.", en: "You're kind. There's still lots I don't know." },
      { who: "arash", fa: "عیبی نداره. دفعه‌ی بعد با هم فقط فارسی حرف می‌زنیم.", tr: "eybi nadâre. daf'e-ye ba'd bâ ham faghat fârsi harf mizanim.", en: "No problem. Next time we'll speak only Persian together." },
      { who: "mahin", fa: "به مامانت سلام برسون.", tr: "be mâmânet salâm beresun.", en: "Give my regards to your mum.", note: "salâm resundan — to pass on someone's greetings." },
      { who: "sara", fa: "حتماً. دلم براتون تنگ می‌شه.", tr: "hatman. delam barâtun tang mishe.", en: "Of course. I'll miss you all." },
      { stage: "At the door, Khale Mahin holds a copy of the Qur'an and a bowl of water." },
      { who: "mahin", fa: "به سلامت، عزیزم. پشت سرت آب می‌ریزم که زود برگردی.", tr: "be salâmat, azizam. posht-e saret âb mirizam ke zud bargardi.", en: "Go safely, dear. I'll pour water behind you so you come back soon.", note: "Pouring water behind a traveller is a custom wishing them a safe journey and a quick return." },
    ],
  },
];

export const SCENE_BY_ID: Record<string, Scene> = Object.fromEntries(SCENES.map((s) => [s.id, s]));

/** Characters with enough lines to play (two or more). */
export function playableParts(scene: Scene): CastId[] {
  const n = new Map<CastId, number>();
  for (const x of scene.script) if (isLine(x)) n.set(x.who, (n.get(x.who) ?? 0) + 1);
  return [...n.entries()].filter(([, c]) => c >= 2).map(([id]) => id);
}

export function castOf(scene: Scene): CastId[] {
  return [...new Set(scene.script.filter(isLine).map((l) => l.who))];
}

/** Same scene all day, a different one tomorrow. */
export function sceneOfTheDay(day: string): Scene {
  let h = 0;
  for (const c of day) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return SCENES[h % SCENES.length];
}
