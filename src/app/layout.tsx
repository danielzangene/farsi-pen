import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";
import { asset } from "@/lib/util";

// The page is served dark (the default). This runs before first paint and
// switches to a saved Light or Auto choice, so the wrong theme never flashes.
// Reads the same localStorage key as src/lib/store.ts.
const themeScript = `try{var t=JSON.parse(localStorage.getItem("farsipen:v1")||"{}").settings?.theme,d=document.documentElement;if(t==="light")d.dataset.theme=t;else if(t==="system")delete d.dataset.theme}catch(e){}`;

/** Icon cache version; see scripts/make-icons.mjs. */
const ICON_VERSION = 2;

export const metadata: Metadata = {
  title: { default: "Farsi Pen — learn to read, write and speak Persian", template: "%s · Farsi Pen" },
  description:
    "Farsi Pen is a free Persian (Farsi) course: short vocabulary lessons, spaced-repetition practice, the alphabet with letter tracing, and grammar.",
  manifest: asset(`/manifest.webmanifest?v=${ICON_VERSION}`),
  // ?v= busts browsers' sticky favicon cache; bump it whenever the icons change.
  icons: {
    icon: [
      { url: asset(`/favicon.ico?v=${ICON_VERSION}`), sizes: "48x48" },
      { url: asset(`/icon.svg?v=${ICON_VERSION}`), type: "image/svg+xml" },
    ],
    apple: asset(`/apple-touch-icon.png?v=${ICON_VERSION}`),
  },
  // Share previews (Telegram, WhatsApp, X…) need absolute image URLs.
  metadataBase: new URL("https://danielzangene.github.io"),
  openGraph: {
    type: "website",
    siteName: "Farsi Pen",
    title: "Farsi Pen — learn to read, write and speak Persian",
    description: "Short vocabulary lessons, smart review, the alphabet with letter tracing, and grammar. Free, no sign-up.",
    images: [{ url: asset("/og.png"), width: 1200, height: 630, alt: "Farsi Pen" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#131f24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
