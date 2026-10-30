import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";
import { asset } from "@/lib/util";

// Runs before first paint so a saved Light/Dark choice never flashes the other theme.
// Reads the same localStorage key as src/lib/store.ts.
const themeScript = `try{var t=JSON.parse(localStorage.getItem("farsipen:v1")||"{}").settings?.theme;if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: { default: "Farsi Pen — learn to read, write and speak Persian", template: "%s · Farsi Pen" },
  description:
    "Farsi Pen is a free Persian (Farsi) course: short vocabulary lessons, spaced-repetition practice, the alphabet with letter tracing, and grammar.",
  manifest: asset("/manifest.webmanifest"),
  icons: { icon: asset("/icon.svg"), apple: asset("/icon.svg") },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#12a594" },
    { media: "(prefers-color-scheme: dark)", color: "#131f24" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
