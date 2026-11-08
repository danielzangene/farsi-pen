// Side view of the mouth (facing left) showing where a Persian sound is made:
// tongue position, lips, jaw, the contact point and the air path.
import type { Mouth } from "@/content/sounds";
import { cx } from "@/lib/util";

const PLACE_TEXT: Record<Mouth["place"], string> = {
  lips: "lips and teeth",
  teeth: "tongue tip on the top teeth",
  ridge: "tongue tip on the ridge behind the top teeth",
  palate: "tongue raised to the hard roof of the mouth",
  velum: "back of the tongue raised to the soft palate",
  uvula: "back of the tongue near the uvula",
  glottis: "in the throat",
  open: "mouth open, tongue low",
};
const MANNER_TEXT: Record<Mouth["manner"], string> = {
  friction: "air rubs through a narrow gap",
  stop: "air stops, then releases",
  tap: "one quick tap",
  vowel: "air flows freely",
  nasal: "air through the nose",
};

export function mouthCaption(m: Mouth): string {
  const lips = m.lips === "rounded" ? "lips rounded" : m.lips === "spread" ? "lips spread" : "";
  return [PLACE_TEXT[m.place], MANNER_TEXT[m.manner], lips, m.voiced ? "voice on" : "voice off"].filter(Boolean).join(" · ");
}

export function MouthDiagram({ mouth, className }: { mouth: Mouth; className?: string }) {
  const dy = mouth.jaw === "open" ? 12 : mouth.jaw === "mid" ? 5 : 0;
  const lx = mouth.lips === "rounded" ? 33 : mouth.lips === "spread" ? 43 : 39;
  const vowelLift = mouth.manner === "vowel" ? 8 : 0;
  const rest = { x: 62, y: 86 + dy };
  const shape: Record<Mouth["place"], { t: { x: number; y: number }; h: { x: number; y: number } }> = {
    lips: { t: rest, h: { x: 104, y: 72 + dy } },
    teeth: { t: { x: 58, y: 67 }, h: { x: 100, y: 76 + dy } },
    ridge: { t: { x: 64, y: 55 }, h: { x: 100, y: 76 + dy } },
    palate: { t: { x: 62, y: 82 + dy }, h: { x: 96, y: 54 + vowelLift } },
    velum: { t: rest, h: { x: 130, y: 55 + vowelLift } },
    uvula: { t: rest, h: { x: 145, y: 68 } },
    glottis: { t: rest, h: { x: 108, y: 72 + dy } },
    open: { t: { x: 62, y: 90 + dy }, h: { x: mouth.lips === "rounded" ? 122 : 100, y: 80 + dy } },
  };
  const { t, h } = shape[mouth.place];
  const tongue = `M ${t.x} ${t.y} Q ${(t.x + h.x) / 2} ${Math.min(t.y, h.y) - 6} ${h.x} ${h.y} Q ${h.x + 16} ${h.y + 2} 152 118 L 150 146 L 72 ${106 + dy} Q 60 ${100 + dy} ${t.x} ${t.y} Z`;
  const contact: Record<Mouth["place"], [number, number] | null> = {
    lips: [50, 72],
    teeth: [58, 67],
    ridge: [64, 55],
    palate: [96, 51],
    velum: [133, 51],
    uvula: [150, 70],
    glottis: [158, 146],
    open: null,
  };
  const c = contact[mouth.place];
  // Air rises up the throat, passes over the tongue (under the roof) and out of the lips.
  const over = { x: Math.min(h.x, 140), y: Math.max(h.y - 4, 50) };
  const tipUp = mouth.place === "teeth" || mouth.place === "ridge";
  const exitY = tipUp ? t.y - 3 : 70 + dy / 3;
  const air = `M157 162 L155 ${Math.min(over.y + 24, 100)} Q ${over.x + 8} ${over.y - 2} ${over.x - 24} ${over.y + 6} Q 84 ${Math.min(t.y - 6, 64)} ${tipUp ? t.x + 4 : 64} ${exitY} L 26 ${exitY}`;
  const lowerLipEnd = mouth.place === "lips" ? "54 72" : `${lx + 1} ${76 + dy}`;
  const caption = mouthCaption(mouth);
  return (
    <figure className={cx("m-0", className)}>
      <svg viewBox="20 0 160 170" role="img" aria-label={`Mouth position: ${caption}`} className="mx-auto block h-auto w-full max-w-60">
        {/* face outline: forehead, nose, upper lip */}
        <path d="M74 4 C 62 18, 46 32, 36 44 C 34 47, 38 50, 48 52" className="fill-none stroke-muted" strokeWidth="2.5" strokeLinecap="round" />
        <path d={`M48 53 Q ${lx - 3} 57 ${lx} 66 L 52 64`} className="fill-anar-soft stroke-anar" strokeWidth="2.5" strokeLinejoin="round" />
        {/* lower lip and chin, moving with the jaw */}
        <path d={`M ${lowerLipEnd} Q ${lx - 4} ${84 + dy} 50 ${90 + dy} C 46 104, 52 ${118 + dy}, 66 ${124 + dy} C 84 136, 112 146, 136 160`} className="fill-none stroke-muted" strokeWidth="2.5" strokeLinecap="round" />
        <path d={`M ${lowerLipEnd} Q ${lx - 4} ${84 + dy} 50 ${90 + dy} L 56 ${86 + dy} Z`} className="fill-anar-soft stroke-anar" strokeWidth="2.5" strokeLinejoin="round" />
        {/* teeth */}
        <rect x="53" y="62" width="6" height="9" rx="2" className="fill-card stroke-line-strong" strokeWidth="2" />
        <rect x="55" y={78 + dy} width="6" height="9" rx="2" className="fill-card stroke-line-strong" strokeWidth="2" />
        {/* roof of the mouth: ridge, hard palate, soft palate, uvula */}
        <path d="M59 62 C 63 55, 70 50, 82 47 C 102 43, 122 43, 136 49 C 146 54, 150 61, 151 69 Q 152 76 148 78" className="fill-none stroke-ink" strokeWidth="2.5" strokeLinecap="round" />
        {/* back of the throat */}
        <path d="M156 30 C 160 60, 163 110, 163 166" className="fill-none stroke-ink" strokeWidth="2.5" strokeLinecap="round" />
        {/* tongue */}
        <path d={tongue} className="fill-firuze-soft stroke-firuze" strokeWidth="2.5" strokeLinejoin="round" />
        {/* air path */}
        {mouth.manner !== "nasal" && (
          <path d={air} className="fill-none stroke-sky" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" markerEnd="url(#mouth-arrow)" />
        )}
        <defs>
          <marker id="mouth-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 10 0 L 0 5 L 10 10 z" className="fill-sky" />
          </marker>
        </defs>
        {/* voice box */}
        {mouth.voiced ? (
          <path d="M150 152 l4 -4 l4 4 l4 -4 l4 4" className="fill-none stroke-plum" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M150 150 h16" className="fill-none stroke-line-strong" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {c && (
          <g>
            <circle cx={c[0]} cy={c[1]} r="9" className="animate-pulse fill-saffron/30" />
            <circle cx={c[0]} cy={c[1]} r="4.5" className="fill-saffron stroke-saffron-shadow" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      <figcaption className="mt-1 text-center text-sm font-semibold text-muted">{caption}</figcaption>
    </figure>
  );
}
