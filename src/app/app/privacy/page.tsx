import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { hasBackend } from "@/lib/backend";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Your progress stays on your device",
    body: [
      hasBackend
        ? "Lessons, cards, streaks, scores and settings are saved in this browser's local storage. There is no account. Nothing is sent to the Farsi Pen server unless you turn on sync, use the AI tutor or send feedback (below)."
        : "Lessons, cards, streaks, scores and settings are saved in this browser's local storage. There is no account and nothing is sent to a Farsi Pen server.",
      "Clearing your browser's site data deletes your progress. Use Save backup on your Profile to keep a copy, or to move to another device.",
    ],
  },
  {
    title: "Your voice",
    body: [
      "When you tap the mic, the speech recogniser you chose in Settings hears you. With Browser, your browser sends the audio to its maker's recognition service (for example Google for Chrome, Apple for Safari) under their privacy policy. With Whisper, recognition runs entirely on your device.",
      "“My voice” recordings stay in memory for that screen only. They are never uploaded or saved.",
    ],
  },
  {
    title: "Files the app loads",
    body: [
      "The app, its recorded audio and the dictionary are served from GitHub Pages. Poems are loaded from Ganjoor's open data on jsDelivr. The optional natural voice and Whisper models download from Hugging Face and jsDelivr. These services see a normal web request (your IP address and browser), as any website does.",
      "Real-world video clips (Hear it in real videos) load YouGlish and YouTube only when you open them.",
    ],
  },
  ...(hasBackend
    ? [
        {
          title: "Sync, AI tutor and feedback",
          body: [
            "Sync across devices (off until you turn it on) stores a copy of your progress on the Farsi Pen server (Cloudflare) under a random code. There's no name or email; anyone with the code can read that copy, so keep it private. Stop syncing removes the code from this device; unused copies are deleted after about a year.",
            "The AI tutor sends the messages of the current conversation to NVIDIA's AI service to get a reply. Farsi Pen doesn't store the conversation. Don't share personal details with it.",
            "Feedback and content reports store what you write, the page you were on and your rating — nothing that identifies you.",
            "To limit misuse, the server counts requests per visitor using a scrambled form of the IP address that changes every day; the address itself isn't kept.",
          ],
        },
      ]
    : []),
  {
    title: "No tracking",
    body: [
      "Farsi Pen uses no analytics, no advertising and no cookies of its own.",
      hasBackend
        ? "Report a problem sends your note to the Farsi Pen server, as described above."
        : "Report a problem opens a pre-filled issue on GitHub, which you choose whether to send.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/app/settings/" className="btn-ghost btn-sm -ms-3">
        <ArrowLeft className="size-4" /> Profile
      </Link>
      <PageHeader
        title="Privacy"
        subtitle="What Farsi Pen keeps, where, and who else sees anything."
      />
      {SECTIONS.map((sec) => (
        <section key={sec.title} className="card space-y-2 p-5">
          <h2 className="text-lg font-extrabold">{sec.title}</h2>
          {sec.body.map((p) => (
            <p key={p} className="text-[15px] leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
