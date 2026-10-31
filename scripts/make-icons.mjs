// Renders Farsi Pen's brand icons from the "FA" monogram into public/.
// Run after changing the mark:  node scripts/make-icons.mjs
// (with a global Playwright: NODE_PATH=$(npm root -g) node scripts/make-icons.mjs)
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
// Same paths as the header logo in src/components/AppNav.tsx (64×64 box).
const MARK = "M14 46V18h14M14 31h11M34 46l8-28 8 28M37 37h10";

/** The mark on a teal tile. `inset` shrinks the letters (maskable safe zone); `rx` rounds the tile. */
const tile = ({ rx = 14, inset = 0 } = {}) => {
  const s = 1 - inset * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${rx}" fill="${TEAL}"/><path transform="translate(${64 * inset} ${64 * inset}) scale(${s})" d="${MARK}" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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

const browser = await chromium.launch();
const page = await browser.newPage();
const png = async (svg, size, file) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: pub(file), omitBackground: true });
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
