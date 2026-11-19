// Renders Farsi Pen's brand icons from the "FA" monogram (Nunito Black, as outlines) into public/.
// After regenerating, bump ICON_VERSION in src/app/layout.tsx and the ?v=
// in public/manifest.webmanifest so browsers drop their cached icons.
// Run after changing the mark:  node scripts/make-icons.mjs
// (with a global Playwright: NODE_PATH=$(npm root -g) node scripts/make-icons.mjs;
//  add PLAYWRIGHT_CHANNEL=chrome to use an installed Google Chrome instead of a downloaded Chromium)
// Needs Playwright with Chromium (not a project dependency) and Python 3
// with Pillow for favicon.ico.
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// require() so a global Playwright install works too (via NODE_PATH).
const { chromium } = createRequire(import.meta.url)("playwright");

const root = fileURLToPath(new URL("..", import.meta.url));
const pub = (f) => `${root}public/${f}`;

const TEAL = "#12a594";
const DARK = "#131f24";
// Same path as LOGO_PATH in src/components/AppNav.tsx (64×64 box): "FA" in Nunito Black, outlined.
const MARK = "M15.47 43.66Q13.8 43.66 12.9 42.74Q12 41.82 12 40.09V24.23Q12 22.5 12.92 21.58Q13.83 20.66 15.57 20.66H26.02Q27.34 20.66 28.02 21.34Q28.69 22.01 28.69 23.3Q28.69 24.59 28.02 25.26Q27.34 25.94 26.02 25.94H18.91V29.48H25.28Q26.6 29.48 27.28 30.15Q27.95 30.83 27.95 32.11Q27.95 33.4 27.28 34.07Q26.6 34.75 25.28 34.75H18.91V40.09Q18.91 43.66 15.47 43.66ZM30.85 43.66Q29.69 43.66 28.9 43.11Q28.11 42.56 27.9 41.62Q27.69 40.67 28.24 39.48L35.99 23.14Q36.67 21.69 37.65 21.02Q38.63 20.34 39.91 20.34Q41.2 20.34 42.17 21.02Q43.13 21.69 43.81 23.14L51.56 39.48Q52.14 40.7 51.96 41.65Q51.78 42.6 51.03 43.13Q50.27 43.66 49.14 43.66Q47.67 43.66 46.86 42.98Q46.06 42.31 45.41 40.8L43.87 37.19L46.44 39.12H33.35L35.93 37.19L34.38 40.8Q33.74 42.31 33.03 42.98Q32.33 43.66 30.85 43.66ZM39.85 27.8 36.57 35.68 35.61 33.85H44.19L43.23 35.68L39.91 27.8H39.85Z";

/** The mark on a teal tile. `inset` shrinks the letters (maskable safe zone); `rx` rounds the tile. */
const tile = ({ rx = 14, inset = 0 } = {}) => {
  const s = 1 - inset * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${rx}" fill="${TEAL}"/><path transform="translate(${64 * inset} ${64 * inset}) scale(${s})" d="${MARK}" fill="#ffffff"/></svg>`;
};

writeFileSync(pub("icon.svg"), tile() + "\n");

// Inlined: a page made with setContent may not load file:// fonts.
const font = readFileSync(`${root}node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2`).toString("base64");
const og = `<!doctype html><html><head><style>
@font-face{font-family:Nunito;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:200 1000}
*{margin:0}body{width:1200px;height:630px;background:${DARK};font-family:Nunito;color:#f1f7fb;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box;
background-image:radial-gradient(circle at 1px 1px,rgb(44 197 177 / .16) 1px,transparent 0);background-size:24px 24px}
.row{display:flex;align-items:center;gap:36px}.mark{width:168px;height:168px;border-radius:40px;box-shadow:0 12px 0 #0c7f72;overflow:hidden}
h1{font-size:112px;font-weight:900;letter-spacing:-.02em}p{margin-top:48px;font-size:44px;font-weight:700;color:#9db0ba}b{color:#6be3d3}
</style></head><body><div class="row"><div class="mark">${tile({ rx: 0 })}</div><h1>Farsi Pen</h1></div>
<p>Learn to read, write and speak <b>Farsi</b>.</p></body></html>`;

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const page = await browser.newPage();
const png = async (svg, size, file) => {
  // A roomy window, then crop to the icon: Chrome mis-renders when the window is exactly icon-sized.
  await page.setViewportSize({ width: Math.max(size, 800), height: Math.max(size, 800) });
  await page.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: pub(file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
};
// Home-screen / install icons are square: the OS applies its own rounding.
await png(tile({ rx: 0 }), 180, "apple-touch-icon.png");
await png(tile(), 192, "icon-192.png");
await png(tile(), 512, "icon-512.png");
await png(tile({ rx: 0, inset: 0.1 }), 512, "icon-maskable-512.png");
await png(tile(), 48, "favicon-48.png");

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(og, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: pub("og.png") });
await browser.close();

// favicon.ico with 16, 32 and 48px sizes, for browsers that ask for /favicon.ico.
execFileSync("python3", [
  "-c",
  "import sys;from PIL import Image;Image.open(sys.argv[1]).save(sys.argv[2],sizes=[(16,16),(32,32),(48,48)])",
  pub("favicon-48.png"),
  pub("favicon.ico"),
]);
execFileSync("rm", [pub("favicon-48.png")]);
console.log("Icons written to public/");
