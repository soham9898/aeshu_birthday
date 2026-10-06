import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { GIFT_CLUE, GIFT_NOTE, GIFT_PHOTO } from '../gift.js';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// One lil secret 🎁🤫 — the screen turns into something real.
// A golden scratch card: she rubs it with her finger, like a
// lottery ticket, and underneath is where her REAL gift is
// hiding. Once about half of the gold is gone, the rest
// dissolves away in a burst of light and sparkles.
// ("just show me 🙈" reveals it in one tap, just in case.)
//
// Edit the clue in src/gift.js.
// ─────────────────────────────────────────────────────

const BRUSH = 42; // finger width, in CSS pixels
const REVEAL_AT = 0.55; // share of the gold scratched off before the rest melts away
const CHECK_MS = 140; // how often to measure the scratched share while she rubs

// Little nudges under the card as the gold comes off.
const NUDGES = [
  [0, 'rub the gold with ur finger 👆'],
  [0.12, 'keep going… 👀'],
  [0.32, 'almost thereee 🤭'],
];

// The golden foil: a shiny gradient, tiny glints and the "scratch me" label.
function paintFoil(ctx, w, h, dpr) {
  const gold = ctx.createLinearGradient(0, 0, w, h);
  gold.addColorStop(0, '#a8741f');
  gold.addColorStop(0.28, '#f5c842');
  gold.addColorStop(0.5, '#fff1b8');
  gold.addColorStop(0.72, '#f5c842');
  gold.addColorStop(1, '#a8741f');
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, (0.6 + Math.random() * 1.4) * dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(92, 56, 10, 0.85)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 600 ${24 * dpr}px "Playfair Display", Georgia, serif`;
  ctx.fillText('scratch me ✨', w / 2, h / 2 - 12 * dpr);
  ctx.font = `700 ${10 * dpr}px Lato, system-ui, sans-serif`;
  ctx.letterSpacing = `${3 * dpr}px`; // (browsers without it just skip the spacing)
  ctx.fillText('RUB GENTLY WITH UR FINGER', w / 2, h / 2 + 20 * dpr);
}

export default function GiftRevealScreen({ onNext }) {
  const [touched, setTouched] = useState(false);
  const [scratched, setScratched] = useState(0); // 0–1
  const [revealed, setRevealed] = useState(false);
  const [photoOk, setPhotoOk] = useState(Boolean(GIFT_PHOTO));

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lastPt = useRef(null); // where her finger was (null = not pressing)
  const lastCheck = useRef(0);

  // Lay the gold over the card before the first paint, so the clue
  // underneath never flashes on screen.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    paintFoil(ctx, canvas.width, canvas.height, dpr);

    // From now on every stroke erases the gold instead of painting.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = BRUSH * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  // Screen position → canvas pixels (the card may be scaled by an animation).
  const toCanvas = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height),
    };
  };

  const scratchTo = (p) => {
    const ctx = ctxRef.current;
    const from = lastPt.current;
    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    } else {
      ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPt.current = p;
  };

  // How much of the gold is gone (sampling every 7th pixel is plenty).
  const measure = () => {
    const { width, height } = canvasRef.current;
    const data = ctxRef.current.getImageData(0, 0, width, height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 7) {
      total++;
      if (data[i] < 128) clear++;
    }
    const share = clear / total;
    setScratched(share);
    if (share >= REVEAL_AT) setRevealed(true);
  };

  const onDown = (e) => {
    if (revealed) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setTouched(true);
    lastPt.current = null;
    scratchTo(toCanvas(e));
  };

  const onMove = (e) => {
    if (revealed || !lastPt.current) return;
    scratchTo(toCanvas(e));
    const now = performance.now();
    if (now - lastCheck.current > CHECK_MS) {
      lastCheck.current = now;
      measure();
    }
  };

  const onUp = () => {
    if (!lastPt.current) return;
    lastPt.current = null;
    if (!revealed) measure();
  };

  // Sparkles that burst out of the card the moment the gold melts away.
  const sparkles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const dist = 110 + Math.random() * 70;
        return {
          id: i,
          sx: `${Math.cos(angle) * dist}px`,
          sy: `${Math.sin(angle) * dist * 0.7}px`,
          glyph: ['✨', '💛', '🎁', '⭐'][i % 4],
          size: 14 + Math.random() * 12,
          delay: Math.random() * 0.15,
        };
      }),
    []
  );

  const nudge = NUDGES.filter(([from]) => scratched >= from).pop()[1];

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-14 text-center sm:px-6 sm:py-16">
      <div className="flex w-full max-w-md flex-col items-center">
        <p className="cine-rise mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
          psst… come closer 🤫
        </p>
        <CineText
          as="h2"
          text="ur gift isn't on this screen 🎁"
          delay={0.3}
          className="text-glow-gold mb-3 font-serif text-3xl font-semibold text-ivory sm:text-5xl"
        />
        <p
          className="cine-rise mb-8 max-w-sm font-sans text-sm text-cream/80"
          style={{ animationDelay: '1s' }}
        >
          it's hiding somewhere real 👀 scratch the gold card to find out where…
        </p>

        {/* ── The scratch card ── */}
        <div className="cine-rise relative w-full max-w-sm" style={{ animationDelay: '1.4s' }}>
          <div className="scratch-card aspect-[8/5] w-full">
            {/* Underneath: where the real gift is */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6">
              <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.3em] text-blush/70">
                ur gift is waiting… 🎁
              </p>
              <p
                className={`font-serif text-2xl italic leading-snug text-ivory sm:text-3xl ${
                  revealed ? 'text-glow-gold' : ''
                }`}
              >
                {GIFT_CLUE}
              </p>
            </div>

            {/* On top: the gold she rubs away */}
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="a golden scratch card, rub it to reveal ur gift"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              className={`scratch-foil ${revealed ? 'scratch-foil--gone' : ''}`}
            />
            {!touched && !revealed && <span className="scratch-sheen" aria-hidden="true" />}
          </div>

          {/* ✨ The gold melts away in a flash of light */}
          {revealed && (
            <>
              <div className="flare-burst z-10" aria-hidden="true" />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-20"
                aria-hidden="true"
              >
                {sparkles.map((s) => (
                  <span
                    key={s.id}
                    className="sparkle absolute left-0 top-0"
                    style={{
                      fontSize: `${s.size}px`,
                      animationDelay: `${s.delay}s`,
                      '--sx': s.sx,
                      '--sy': s.sy,
                    }}
                  >
                    {s.glyph}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {revealed ? (
          <div className="mt-8 flex flex-col items-center gap-5">
            <p
              className="cine-rise font-script max-w-xs text-2xl leading-snug text-blush sm:max-w-sm sm:text-3xl"
              style={{ animationDelay: '0.9s' }}
            >
              {GIFT_NOTE}
            </p>

            {/* Optional hint photo, as a little polaroid */}
            {photoOk && (
              <div className="cine-rise" style={{ animationDelay: '1.4s' }}>
                <div className="polaroid w-44 -rotate-3">
                  <div className="polaroid__frame">
                    <img src={GIFT_PHOTO} alt="a lil hint" onError={() => setPhotoOk(false)} />
                  </div>
                  <p className="polaroid__caption" style={{ fontSize: '1.2rem' }}>
                    a lil hint 👀
                  </p>
                </div>
              </div>
            )}

            <div className="cine-rise" style={{ animationDelay: '2.2s' }}>
              <button
                onClick={onNext}
                className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
              >
                found it? 🥹 →
              </button>
            </div>
          </div>
        ) : (
          <div
            className="cine-rise mt-6 flex flex-col items-center gap-4"
            style={{ animationDelay: '1.8s' }}
          >
            <p key={nudge} className="animate-fade-in font-sans text-sm text-cream/70">
              {nudge}
            </p>
            <button
              onClick={() => setRevealed(true)}
              className="cine-rise font-sans text-xs text-cream/50 underline decoration-cream/30 underline-offset-4 transition-colors hover:text-cream/80"
              style={{ animationDelay: '4.5s' }}
            >
              or… just show me 🙈
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
