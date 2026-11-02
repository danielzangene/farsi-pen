import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui";

// Free resources worth a learner's time (from the awesome-persian list and
// beyond), and credits for every open source Farsi Pen is built on.

const GROUPS: { title: string; items: { name: string; url: string; what: string }[] }[] = [
  {
    title: "Read and listen",
    items: [
      { name: "Storybooks Canada — Persian", url: "https://storybookscanada.ca/stories/fa/", what: "Free illustrated children's stories in Persian with audio, side by side with English. Perfect after Level 2." },
      { name: "Ganjoor", url: "https://ganjoor.net", what: "The home of Persian poetry: every major poet, with recitations you can follow line by line." },
      { name: "Chai and Conversation", url: "https://www.chaiandconversation.com/", what: "A thoughtful audio course in spoken, everyday Persian." },
      { name: "Cafe Denj (YouTube)", url: "https://www.youtube.com/channel/UCu941rRDF-SY0z8fh2RT5pg", what: "Short videos in natural Persian on everyday topics." },
    ],
  },
  {
    title: "Grammar and reference",
    items: [
      { name: "Persian Online (UT Austin)", url: "https://sites.la.utexas.edu/persian_online_resources/", what: "University lessons with grammar notes and recordings." },
      { name: "Jahanshiri.ir", url: "http://www.jahanshiri.ir/", what: "A detailed Persian grammar and a verb conjugator." },
      { name: "Wiktionary — Persian", url: "https://en.wiktionary.org/wiki/Category:Persian_lemmas", what: "Definitions, pronunciation and etymology for thousands of words." },
      { name: "Vajehdan", url: "https://vajehdan.ir/", what: "Persian synonyms and antonyms, for when you start writing." },
    ],
  },
  {
    title: "Practise with people",
    items: [{ name: "r/farsi", url: "https://www.reddit.com/r/farsi/", what: "A friendly community that answers learners' questions." }],
  },
];

const CREDITS: { name: string; url: string; use: string; license: string }[] = [
  { name: "ganjoor-data", url: "https://github.com/ganjoor/ganjoor-data", use: "Poems, vowel marks and modern-Persian explanations in Poetry", license: "Open data from Ganjoor; the classical poems are in the public domain" },
  { name: "EnglishToPersianDictionaries (VahidN)", url: "https://github.com/VahidN/EnglishToPersianDictionaries", use: "The look-up dictionary and its example sentences", license: "Apache-2.0" },
  { name: "Persian-Words-Database (shahind)", url: "https://github.com/shahind/Persian-Words-Database", use: "The list of Persian words behind “Did you mean…?”", license: "Published word list" },
  { name: "Persian-Spell-Corrector (shahind), after Peter Norvig", url: "https://github.com/shahind/Persian-Spell-Corrector-PHP", use: "The spelling-correction method, re-implemented for learners", license: "MIT" },
  { name: "Piper", url: "https://github.com/rhasspy/piper", use: "The natural Persian voice", license: "MIT" },
  { name: "Whisper via transformers.js", url: "https://github.com/huggingface/transformers.js", use: "On-device speech recognition", license: "Apache-2.0 / MIT" },
  { name: "YouGlish", url: "https://youglish.com", use: "Real-video pronunciation", license: "Embedded widget" },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Beyond the app" subtitle="Free places to read, listen and talk once you're ready for more." />
      {GROUPS.map((g) => (
        <section key={g.title}>
          <h2 className="mb-3 text-lg font-extrabold">{g.title}</h2>
          <ul className="space-y-3">
            {g.items.map((it) => (
              <li key={it.url}>
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="tile flex items-start gap-3 p-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">{it.name}</span>
                    <span className="block text-sm font-semibold text-muted">{it.what}</span>
                  </span>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-faint" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="card p-5">
        <h2 className="text-lg font-extrabold">Built with open sources</h2>
        <p className="mt-1 text-sm font-semibold text-muted">Thank you to everyone who made these freely available.</p>
        <ul className="mt-4 space-y-3">
          {CREDITS.map((c) => (
            <li key={c.url} className="text-sm">
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-extrabold text-sky-ink underline-offset-2 hover:underline">
                {c.name}
              </a>
              <span className="block font-semibold text-muted">
                {c.use} · {c.license}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
