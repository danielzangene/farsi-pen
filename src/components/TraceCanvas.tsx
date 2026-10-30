"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Check } from "lucide-react";
import { cx } from "@/lib/util";

const SIZE = 300; // CSS pixels
const GRID = 60; // scoring resolution: 5px cells
const REACH = 2; // cells of slack around strokes (~10px)
const FONT = '"Yekan Bakh", Tahoma, sans-serif';

function drawGlyph(ctx: CanvasRenderingContext2D, text: string, size: number, color: string) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `200px ${FONT}`;
  const m = ctx.measureText(text);
  const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const scale = Math.min((size * 0.72) / Math.max(w, 1), (size * 0.72) / Math.max(h, 1), (size / SIZE) * 1.3);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.fillText(text, -(m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2, (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
  ctx.restore();
}

function mask(source: CanvasImageSource | ((ctx: CanvasRenderingContext2D) => void)): Uint8Array {
  const c = document.createElement("canvas");
  c.width = c.height = GRID;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  if (typeof source === "function") source(ctx);
  else ctx.drawImage(source, 0, 0, GRID, GRID);
  const data = ctx.getImageData(0, 0, GRID, GRID).data;
  const out = new Uint8Array(GRID * GRID);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] > 40 ? 1 : 0;
  return out;
}

function dilate(m: Uint8Array, r: number): Uint8Array {
  const out = new Uint8Array(m.length);
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      if (!m[y * GRID + x]) continue;
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < GRID && ny < GRID) out[ny * GRID + nx] = 1;
        }
    }
  return out;
}

/**
 * Score a tracing 0–100: how much of the letter the ink covers, times how
 * much of the ink stays on the letter. Scribbling over everything scores low.
 */
function score(guide: Uint8Array, ink: Uint8Array): number {
  const inkNear = dilate(ink, REACH);
  const guideNear = dilate(guide, REACH);
  let g = 0, covered = 0, inkCount = 0, onLetter = 0;
  for (let i = 0; i < guide.length; i++) {
    if (guide[i]) {
      g++;
      if (inkNear[i]) covered++;
    }
    if (ink[i]) {
      inkCount++;
      if (guideNear[i]) onLetter++;
    }
  }
  if (!g || !inkCount) return 0;
  return Math.round(100 * (covered / g) * (onLetter / inkCount));
}

export function TraceCanvas({ text, onScore, passMark }: { text: string; onScore: (score: number) => void; passMark: number }) {
  const guideRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const setup = useCallback(async () => {
    const dpr = window.devicePixelRatio || 1;
    for (const c of [guideRef.current, inkRef.current]) {
      if (!c) continue;
      c.width = c.height = SIZE * dpr;
      c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    try {
      await document.fonts.load(`200px ${FONT}`, text);
    } catch {}
    const g = guideRef.current?.getContext("2d");
    if (g) drawGlyph(g, text, SIZE, "#dcdcdc");
    inkRef.current?.getContext("2d")?.clearRect(0, 0, SIZE, SIZE);
    setHasInk(false);
    setResult(null);
  }, [text]);

  useEffect(() => {
    setup();
  }, [setup]);

  const point = (e: React.PointerEvent) => {
    const r = inkRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = inkRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#12a594";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const check = () => {
    const guide = mask((ctx) => drawGlyph(ctx, text, GRID, "#000"));
    const ink = mask(inkRef.current!);
    const s = score(guide, ink);
    setResult(s);
    onScore(s);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="card relative aspect-square overflow-hidden" style={{ width: SIZE, maxWidth: "100%" }}>
        {/* writing guide lines, like ruled paper */}
        <div className="pointer-events-none absolute inset-x-3 top-1/4 border-t border-line" aria-hidden />
        <div className="pointer-events-none absolute inset-x-3 top-1/2 border-t-2 border-dashed border-line" aria-hidden />
        <div className="pointer-events-none absolute inset-x-3 top-3/4 border-t border-line" aria-hidden />
        <canvas ref={guideRef} className="absolute inset-0 size-full" aria-hidden />
        <canvas
          ref={inkRef}
          className="absolute inset-0 size-full cursor-crosshair touch-none"
          aria-label={`Trace the letter ${text}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            const p = point(e);
            last.current = p;
            stroke(p, { x: p.x + 0.01, y: p.y });
            setHasInk(true);
            setResult(null);
          }}
          onPointerMove={(e) => {
            if (!drawing.current || !last.current) return;
            const p = point(e);
            stroke(last.current, p);
            last.current = p;
          }}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" className="btn-secondary" onClick={setup} disabled={!hasInk}>
          <Eraser className="size-4" strokeWidth={2.5} /> Clear
        </button>
        <button type="button" className="btn-primary" onClick={check} disabled={!hasInk}>
          <Check className="size-4" strokeWidth={3} /> Check
        </button>
      </div>
      {result !== null && (
        <p
          role="status"
          className={cx(
            "mt-4 animate-pop rounded-full px-4 py-2 text-center text-sm font-extrabold",
            result >= passMark ? "bg-pista-soft text-pista-ink" : "bg-saffron-soft text-saffron-ink",
          )}
        >
          {result >= 85 ? `Beautiful! ${result}/100` : result >= passMark ? `Nice — passed with ${result}/100` : `${result}/100 — try to cover the whole letter and stay on it`}
        </p>
      )}
    </div>
  );
}
