import { useEffect, useRef } from 'react';
import { fireworksText } from '../finale.js';

// ─────────────────────────────────────────────────────
// Fireworks 🎆 over the finale photo — a show that loops forever.
// Rockets whoosh up from the bottom of the screen and burst into:
//   • 💗 a big glowing heart, with a golden heart inside it
//   • ✨ the words in fireworksText ("I Love You"), spelled in sparks
//   • 🎇 a ring of sparks n tiny hearts
// …then the sparks twinkle, drift down and fade.
//
// It's drawn on a <canvas> so hundreds of sparks stay smooth on
// her phone. Edit the words in src/finale.js.
// ─────────────────────────────────────────────────────

// What each rocket bursts into, in turn (then it starts over).
const SHOW = fireworksText ? ['heart', 'text', 'ring'] : ['heart', 'ring'];

const FIRST_LAUNCH_MS = 1700; // first rocket rises as the heading lands
const LAUNCH_EVERY_MS = 1700; // then one more every ~1.7–2.3s
const LAUNCH_JITTER_MS = 600;
const MAX_TEXT_SPARKS = 650; // keeps the words smooth on a phone
const MAX_SPARKS = 1400; // never pile up more than this at once
const GRAVITY = 0.00012; // px/ms² — how fast spent sparks drift down
const TRAIL_KEEP = 0.7; // how much of each frame lingers as a trail (per 60fps frame)

const TEXT_FONT = '"Dancing Script", "Playfair Display", Georgia, serif';

const COLORS = {
  heart: ['#ff4d6d', '#ff8fab', '#ff6b8b'],
  heartCore: ['#f5c842', '#ffd479'],
  text: ['#f5c842', '#ffd479', '#fdf6f0', '#ffd479'],
  ring: ['#c792ea', '#ff8fab', '#f5c842', '#fdf6f0', '#7fd1c1'],
  tiny: ['#ff4d6d', '#ff8fab', '#f2a0b0'],
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const between = (a, b) => a + Math.random() * (b - a);
const easeOut = (t) => 1 - (1 - t) ** 3;

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// The classic heart curve, centred on 0,0, about 32 units wide.
function heartPoint(t) {
  return {
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - 2.75,
  };
}

// ── Pre-drawn sparks (one small image per colour, reused every frame) ──
const sprites = new Map();

function sprite(shape, color) {
  const key = `${shape}${color}`;
  if (sprites.has(key)) return sprites.get(key);

  const size = shape === 'heart' ? 40 : 32;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');

  if (shape === 'heart') {
    g.shadowColor = color;
    g.shadowBlur = 7;
    g.fillStyle = color;
    g.beginPath();
    for (let i = 0; i <= 40; i++) {
      const p = heartPoint((i / 40) * Math.PI * 2);
      g.lineTo(size / 2 + p.x * 0.8, size / 2 + p.y * 0.8);
    }
    g.fill();
  } else {
    // A white-hot core fading out through the colour into a soft glow.
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#fffdf6');
    grad.addColorStop(0.16, color);
    grad.addColorStop(0.42, rgba(color, 0.35));
    grad.addColorStop(1, rgba(color, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }

  sprites.set(key, c);
  return c;
}

// ── The words, turned into spark positions ──
// The text is drawn once on a hidden canvas, and every few pixels
// that it covers becomes one spark's place in the sky.
const textCache = { width: 0, points: null };

function textPoints(screenWidth) {
  if (textCache.width === screenWidth && textCache.points) return textCache.points;

  const c = document.createElement('canvas');
  const g = c.getContext('2d', { willReadFrequently: true });
  let fontSize = Math.round(Math.min(84, screenWidth * 0.18));
  g.font = `700 ${fontSize}px ${TEXT_FONT}`;
  const fit = (screenWidth * 0.86) / g.measureText(fireworksText).width;
  if (fit < 1) fontSize = Math.floor(fontSize * fit);

  g.font = `700 ${fontSize}px ${TEXT_FONT}`;
  c.width = Math.ceil(g.measureText(fireworksText).width) + 24;
  c.height = Math.ceil(fontSize * 1.6);
  // (resizing a canvas resets its settings, so set them again)
  g.font = `700 ${fontSize}px ${TEXT_FONT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#fff';
  g.fillText(fireworksText, c.width / 2, c.height / 2);

  const { data } = g.getImageData(0, 0, c.width, c.height);
  const step = Math.max(3, Math.round(fontSize / 22));
  let points = [];
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      if (data[(y * c.width + x) * 4 + 3] > 140) {
        points.push({
          x: x - c.width / 2 + between(-0.6, 0.6),
          y: y - c.height / 2 + between(-0.6, 0.6),
        });
      }
    }
  }
  // Too many for a phone? Keep an even, random spread of them.
  if (points.length > MAX_TEXT_SPARKS) {
    points = points
      .map((p) => [Math.random(), p])
      .sort((a, b) => a[0] - b[0])
      .slice(0, MAX_TEXT_SPARKS)
      .map(([, p]) => p);
  }

  // Only remember the result once the real font has loaded.
  if (!document.fonts || document.fonts.check(`700 20px ${TEXT_FONT}`)) {
    textCache.width = screenWidth;
    textCache.points = points;
  }
  return points;
}

export default function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Respect her phone's "reduce motion" setting — no endless show.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Get the handwriting font ready before the first words burst.
    document.fonts?.load(`700 40px ${TEXT_FONT}`).catch(() => {});

    const rockets = [];
    const sparks = [];
    const flashes = [];
    let shown = 0;
    let nextLaunch = performance.now() + FIRST_LAUNCH_MS;
    let last = performance.now();
    let raf = 0;

    // One spark: flies from the burst centre out to its place in the
    // shape, holds there (twinkling), then drifts down and fades.
    const spark = (now, cx, cy, tx, ty, o) => {
      sparks.push({
        cx,
        cy,
        tx,
        ty,
        born: now,
        bloom: o.bloom,
        hold: o.hold,
        fall: o.fall,
        img: sprite(o.shape || 'dot', o.color),
        size: o.size,
        twinkle: o.twinkle || false,
        phase: Math.random() * Math.PI * 2,
        drift: between(-0.02, 0.02),
      });
    };

    // A sprinkle of tiny hearts flying outward around a burst.
    const tinyHearts = (now, x, y, count, minR, maxR) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = between(minR, maxR);
        spark(now, x, y, x + Math.cos(a) * r, y + Math.sin(a) * r, {
          shape: 'heart',
          color: pick(COLORS.tiny),
          size: between(11, 15),
          bloom: between(700, 900),
          hold: between(150, 350),
          fall: 1400,
        });
      }
    };

    const burst = (type, x, y, now) => {
      flashes.push({ x, y, born: now, r: type === 'text' ? 120 : 80 });

      if (type === 'heart') {
        const k = (Math.min(w, h) * 0.36) / 32;
        // The outer heart in rose-red…
        for (let i = 0; i < 64; i++) {
          const p = heartPoint((i / 64) * Math.PI * 2);
          spark(now, x, y, x + p.x * k, y + p.y * k, {
            color: pick(COLORS.heart),
            size: 10,
            bloom: between(750, 900),
            hold: 650,
            fall: 1200,
            twinkle: true,
          });
        }
        // …and a golden one glowing inside it.
        for (let i = 0; i < 30; i++) {
          const p = heartPoint((i / 30) * Math.PI * 2);
          spark(now, x, y, x + p.x * k * 0.5, y + p.y * k * 0.5, {
            color: pick(COLORS.heartCore),
            size: 8,
            bloom: between(650, 800),
            hold: 750,
            fall: 1100,
            twinkle: true,
          });
        }
        tinyHearts(now, x, y, 8, 16 * k * 1.15, 16 * k * 1.5);
      } else if (type === 'text') {
        for (const p of textPoints(w)) {
          spark(now, x, y, x + p.x, y + p.y, {
            color: pick(COLORS.text),
            size: 6.5,
            bloom: between(800, 1100),
            hold: 1600,
            fall: 1300,
            twinkle: true,
          });
        }
        tinyHearts(now, x, y, 10, 60, 130);
      } else {
        const r = Math.min(w, h) * 0.24;
        for (let i = 0; i < 44; i++) {
          const a = (i / 44) * Math.PI * 2 + between(-0.05, 0.05);
          const d = r * between(0.8, 1.05);
          spark(now, x, y, x + Math.cos(a) * d, y + Math.sin(a) * d, {
            color: pick(COLORS.ring),
            size: 9,
            bloom: between(650, 800),
            hold: 100,
            fall: 1300,
          });
        }
        tinyHearts(now, x, y, 12, r * 0.35, r * 0.8);
      }
    };

    const launch = (now) => {
      const type = SHOW[shown % SHOW.length];
      shown += 1;
      // Everything bursts up in the "sky", above the heading — the words
      // high up n centred, the hearts n rings anywhere across the top.
      const text = type === 'text';
      const bx = text ? w / 2 : w * between(0.22, 0.78);
      const by = text ? Math.min(150, Math.max(64, h * 0.14)) : h * between(0.1, 0.26);
      rockets.push({
        sx: text ? bx : bx + between(-0.08, 0.08) * w,
        sy: h + 10,
        bx,
        by,
        born: now,
        rise: between(950, 1250),
        type,
      });
    };

    const frame = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;

      if (now >= nextLaunch) {
        if (sparks.length < MAX_SPARKS) launch(now);
        nextLaunch = now + LAUNCH_EVERY_MS + Math.random() * LAUNCH_JITTER_MS;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fade the last frame a little (rather than wiping it) → glowing trails.
      // The photo underneath stays untouched — only our own pixels fade.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - TRAIL_KEEP ** (dt / 16.7)})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      // Flash of light at each burst.
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const t = (now - f.born) / 380;
        if (t >= 1) {
          flashes.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = (1 - t) * 0.55;
        ctx.drawImage(sprite('dot', '#fff4dc'), f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
      }

      // Rockets rising (slowing as they climb), then bursting.
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        const t = (now - r.born) / r.rise;
        if (t >= 1) {
          rockets.splice(i, 1);
          burst(r.type, r.bx, r.by, now);
          continue;
        }
        const e = 1 - (1 - t) ** 2;
        const x = r.sx + (r.bx - r.sx) * e + Math.sin(t * 18) * 1.2;
        const y = r.sy + (r.by - r.sy) * e;
        ctx.globalAlpha = 0.9;
        ctx.drawImage(sprite('dot', '#ffd479'), x - 5, y - 5, 10, 10);
      }

      // Every spark: fly out → hold (twinkle) → drift down n fade.
      let alive = 0;
      for (let i = 0; i < sparks.length; i++) {
        const p = sparks[i];
        const age = now - p.born;
        if (age >= p.bloom + p.hold + p.fall) continue;
        sparks[alive++] = p;

        let x;
        let y;
        let alpha = 1;
        let size = p.size;
        if (age < p.bloom) {
          const e = easeOut(age / p.bloom);
          x = p.cx + (p.tx - p.cx) * e;
          y = p.cy + (p.ty - p.cy) * e;
        } else if (age < p.bloom + p.hold) {
          x = p.tx;
          y = p.ty;
          if (p.twinkle) alpha = 0.7 + 0.3 * Math.sin(age * 0.02 + p.phase);
        } else {
          const ft = age - p.bloom - p.hold;
          const k = ft / p.fall;
          x = p.tx + p.drift * ft;
          y = p.ty + 0.5 * GRAVITY * ft * ft;
          alpha = (1 - k) * (p.twinkle ? 0.7 + 0.3 * Math.sin(age * 0.02 + p.phase) : 1);
          size *= 1 - k * 0.5;
        }
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.img, x - size / 2, y - size / 2, size, size);
      }
      sparks.length = alive;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
