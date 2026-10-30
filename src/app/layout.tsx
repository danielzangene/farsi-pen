import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { asset } from "@/lib/util";

export const metadata: Metadata = {
  title: { default: "Farsi Pen — learn to read, write and speak Persian", template: "%s · Farsi Pen" },
  description:
    "Farsi Pen is a free Persian (Farsi) course: short vocabulary lessons, spaced-repetition practice, the alphabet with letter tracing, and grammar.",
  manifest: asset("/manifest.webmanifest"),
  icons: { icon: asset("/icon.svg"), apple: asset("/icon.svg") },
};

export const viewport: Viewport = {
  themeColor: "#0e7c74",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
