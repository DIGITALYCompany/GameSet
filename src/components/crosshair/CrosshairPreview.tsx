import { useState } from 'react';
import { cn } from '@/utils/cn';
import type { CrosshairShape } from '@/lib/crosshairCodes';

const SCENES = [
  { id: 'range', label: 'Range', bg: 'linear-gradient(180deg,#2a2d33 0%,#1b1d21 55%,#14161a 100%)' },
  { id: 'sky', label: 'Sky', bg: 'linear-gradient(180deg,#9cc8ec 0%,#cfe4f3 55%,#b9a98c 56%,#8e7f66 100%)' },
  { id: 'desert', label: 'Desert', bg: 'linear-gradient(180deg,#e8d3a6 0%,#d6b87c 50%,#b08a52 100%)' },
  { id: 'foliage', label: 'Foliage', bg: 'linear-gradient(180deg,#5b7a3a 0%,#3f5a29 50%,#2a3d1c 100%)' },
  { id: 'snow', label: 'Snow', bg: 'linear-gradient(180deg,#f4f7fa 0%,#dfe7ee 55%,#c3ced8 100%)' },
] as const;

const ZOOMS = [1, 2, 4] as const;
const SIZE = 240;
const C = SIZE / 2;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function pieces(s: CrosshairShape): Rect[] {
  const out: Rect[] = [];
  const t = s.thickness;
  const half = t / 2;
  if (s.length > 0 && t > 0) {
    if (!s.tShape) out.push({ x: C - half, y: C - s.gap - s.length - half, w: t, h: s.length });
    out.push({ x: C - half, y: C + s.gap + half, w: t, h: s.length });
    out.push({ x: C - s.gap - s.length - half, y: C - half, w: s.length, h: t });
    out.push({ x: C + s.gap + half, y: C - half, w: s.length, h: t });
  }
  if (s.dot && s.dotSize > 0) {
    out.push({ x: C - s.dotSize / 2, y: C - s.dotSize / 2, w: s.dotSize, h: s.dotSize });
  }
  return out;
}

export function CrosshairPreview({ shape, caption }: { shape: CrosshairShape; caption: string }) {
  const [scene, setScene] = useState<(typeof SCENES)[number]['id']>('range');
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(2);
  const rects = pieces(shape);
  const o = shape.outline ? shape.outlineThickness : 0;
  const bg = SCENES.find((s) => s.id === scene)!.bg;

  const svg = (view: number, px: number) => (
    <svg
      width={px}
      height={px}
      viewBox={`${C - view / 2} ${C - view / 2} ${view} ${view}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {o > 0 &&
        rects.map((r, i) => (
          <rect key={`o${i}`} x={r.x - o} y={r.y - o} width={r.w + o * 2} height={r.h + o * 2} fill="#000" />
        ))}
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={shape.hex} />
      ))}
    </svg>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-base-surface shadow-card">
      <div className="relative flex h-[340px] items-center justify-center transition-[background] duration-500" style={{ background: bg }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.6) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative">{svg(SIZE / zoom, SIZE)}</div>

        <div className="absolute left-3 top-3 flex gap-1 rounded-lg bg-black/55 p-1 backdrop-blur-md">
          {ZOOMS.map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={cn(
                'rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition-colors focus-ring',
                zoom === z ? 'bg-white text-black' : 'text-white/70 hover:text-white'
              )}
            >
              {z}x
            </button>
          ))}
        </div>

        <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/55 p-2 backdrop-blur-md">
          <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-wider text-white/60">Actual</p>
          <div className="h-16 w-16 overflow-hidden rounded-md" style={{ background: bg }}>
            {svg(64, 64)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-dim">{caption}</p>
        <div className="flex flex-wrap gap-1.5">
          {SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => setScene(s.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 focus-ring',
                scene === s.id ? 'border-white/30 bg-white/10 text-ink' : 'border-border text-ink-muted hover:border-white/15 hover:text-ink'
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/20" style={{ background: s.bg }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
