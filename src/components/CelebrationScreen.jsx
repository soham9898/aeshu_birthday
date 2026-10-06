import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { startMusic } from './MusicPlayer.jsx';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// The celebration 🎂 — played like a movie scene:
//   1. Lights off. Only the candles glow. "make a wish…"
//   2. She blows (for real, into the mic — or with a tap).
//   3. A flash of light, the room lights up, the big
//      "Happy Birthday" lands, and the confetti starts.
// ─────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  '#f5c842',
  '#f2a0b0',
  '#ff8fab',
  '#fdf6f0',
  '#c792ea',
  '#ffd479',
];
const CANDLES = [0, 1, 2, 3, 4];

// ── Microphone "blow" tuning ──────────────────────────
// She can blow into her phone for real 🎤 — the mic listens for a
// sustained rush of air and puts the candles out one by one.
const BLOW_THRESHOLD = 0.18; // loudness (RMS 0–1) that counts as blowing
const BLOW_MS_PER_CANDLE = 240; // sustained blow time to douse each candle

// Little decorative sprinkles ("jimmies") scattered on the cake tiers.
const TOP_SPRINKLES = [
  { l: '24%', t: '46%', c: '#f5c842', r: 35 },
  { l: '50%', t: '34%', c: '#c792ea', r: -20 },
  { l: '72%', t: '52%', c: '#ff8fab', r: 60 },
];
const BOTTOM_SPRINKLES = [
  { l: '14%', t: '34%', c: '#f5c842', r: 20 },
  { l: '30%', t: '62%', c: '#ff8fab', r: -40 },
  { l: '58%', t: '38%', c: '#c792ea', r: 70 },
  { l: '70%', t: '66%', c: '#7fd1c1', r: -15 },
  { l: '84%', t: '42%', c: '#f5c842', r: 45 },
];

const FROSTING = {
  background: '#fff4e6',
  boxShadow: '0 3px 0 rgba(255,233,214,0.9)',
};

function Sprinkle({ l, t, c, r }) {
  return (
    <span
      className="absolute h-2.5 w-1 rounded-full sm:h-3 sm:w-1.5"
      style={{ left: l, top: t, background: c, transform: `rotate(${r}deg)` }}
    />
  );
}

export default function CelebrationScreen({ onNext }) {
  // How many candles are out (left to right). All out = blown.
  const [outCount, setOutCount] = useState(0);
  // 'idle' → 'listening' (mic live) → or 'failed' (denied / unsupported)
  const [micState, setMicState] = useState('idle');
  const blown = outCount >= CANDLES.length;

  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(0);

  const stopMic = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  // Never leave the mic running if she moves on mid-listen.
  useEffect(() => stopMic, [stopMic]);

  // Fallback: one tap puts them all out at once.
  const blowByTap = () => {
    stopMic();
    startMusic(); // inside the tap, so the browser allows sound
    setOutCount(CANDLES.length);
  };

  // The real magic: listen to the mic and douse candles as she blows.
  const blowByBreath = async () => {
    startMusic(); // start her song on this tap too
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setMicState('failed');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // Raw-ish audio: a rush of breath must reach us un-"cleaned".
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      await ctx.resume();

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);

      setMicState('listening');

      let blowMs = 0; // how long she has been blowing (decays when she stops)
      let last = performance.now();

      const tick = (now) => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          const v = (samples[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / samples.length);

        const dt = now - last;
        last = now;
        blowMs = rms > BLOW_THRESHOLD ? blowMs + dt : Math.max(0, blowMs - dt * 2);

        const shouldBeOut = Math.min(
          CANDLES.length,
          Math.floor(blowMs / BLOW_MS_PER_CANDLE)
        );
        // Candles only ever go out — a pause never relights them.
        if (shouldBeOut > 0) setOutCount((c) => Math.max(c, shouldBeOut));

        if (shouldBeOut >= CANDLES.length) {
          stopMic();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // Permission denied or no mic — the tap button still works.
      stopMic();
      setMicState('failed');
    }
  };

  // 34 pieces of pure-CSS confetti, each with its own colour / speed / drift.
  const confetti = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: 0.6 + Math.random() * 5,
        duration: 4 + Math.random() * 4,
        size: 6 + Math.random() * 9,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: Math.random() > 0.55,
      })),
    []
  );

  // A one-time confetti cannon from the centre the moment the lights come on.
  const cannon = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        bx: `${(Math.random() - 0.5) * 95}vw`,
        by: `${(Math.random() - 0.65) * 90}vh`,
        br: `${(Math.random() - 0.5) * 900}deg`,
        size: 6 + Math.random() * 9,
        delay: 0.15 + Math.random() * 0.2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: Math.random() > 0.55,
      })),
    []
  );

  // Sparkles + hearts that burst outward when the candles are blown out.
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const dist = 55 + Math.random() * 85;
        return {
          id: i,
          sx: `${Math.cos(angle) * dist}px`,
          sy: `${Math.sin(angle) * dist}px`,
          glyph: ['✨', '💛', '💗', '⭐'][i % 4],
          size: 13 + Math.random() * 11,
          delay: Math.random() * 0.15,
        };
      }),
    []
  );

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-14 text-center sm:px-6 sm:py-16">
      {/* 🌑 Lights off — the room is dark until the candles are blown out */}
      <div
        className={`room-dark pointer-events-none absolute inset-0 z-[1] ${
          blown ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* ⚡ The flash as the lights come back on */}
      {blown && (
        <div
          className="flash-burst pointer-events-none absolute inset-0 z-20"
          aria-hidden="true"
        />
      )}

      {/* Confetti rain + cannon — only once the wish is made */}
      {blown && (
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          {confetti.map((c) => (
            <span
              key={c.id}
              className="confetti-piece"
              style={{
                left: `${c.left}%`,
                width: `${c.size}px`,
                height: `${c.size * (c.round ? 1 : 1.6)}px`,
                backgroundColor: c.color,
                borderRadius: c.round ? '9999px' : '2px',
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
          {cannon.map((c) => (
            <span
              key={`cannon-${c.id}`}
              className="confetti-burst-piece"
              style={{
                width: `${c.size}px`,
                height: `${c.size * (c.round ? 1 : 1.6)}px`,
                backgroundColor: c.color,
                borderRadius: c.round ? '9999px' : '2px',
                animationDelay: `${c.delay}s`,
                '--bx': c.bx,
                '--by': c.by,
                '--br': c.br,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex w-full flex-col items-center">
        {/* The headline waits for the wish… then lands with a bang */}
        {blown ? (
          <>
            <h1 className="title-slam text-glow-gold mb-2 font-serif text-[2rem] font-bold leading-tight text-ivory sm:text-5xl md:text-6xl">
              Happyyy Birthday My Dear Wife…! 🎂🥳
            </h1>
            <p
              className="cine-rise mb-8 max-w-md font-sans text-sm text-cream/80 sm:mb-10 sm:text-base"
              style={{ animationDelay: '0.6s' }}
            >
              2day my world is xtra bright bcoz ur in it ✨
            </p>
          </>
        ) : (
          <>
            <p className="cine-rise mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
              psst… lights off 🤫
            </p>
            <CineText
              as="h1"
              text="make a wish first, my jaan 🕯️"
              delay={0.4}
              className="text-glow-gold mb-2 font-serif text-[2rem] font-bold leading-tight text-ivory sm:text-5xl md:text-6xl"
            />
            <p
              className="cine-rise mb-8 max-w-md font-sans text-sm text-cream/80 sm:mb-10 sm:text-base"
              style={{ animationDelay: '1.2s' }}
            >
              close ur eyes, wish for anything ur heart wants… then blow 🌬️
            </p>
          </>
        )}

        {/* ── The cake (scales down slightly on small phones) ── */}
        <div className="cine-rise" style={{ animationDelay: '0.2s' }}>
          <div className="relative mb-6 flex scale-[0.9] flex-col items-center sm:mb-8 sm:scale-100">
            {/* Warm candlelight glowing in the dark room */}
            {!blown && (
              <div
                className="candle-glow pointer-events-none absolute -top-24 left-1/2 h-64 w-64 rounded-full"
                aria-hidden="true"
              />
            )}

            {/* Sparkle / heart burst once every candle is out */}
            {blown && (
              <div
                className="pointer-events-none absolute left-1/2 top-6 z-30 -translate-x-1/2"
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
            )}

            {/* Candles — each goes dark (with a wisp of smoke) as she blows */}
            <div className="relative z-30 mb-[-6px] flex gap-4 sm:gap-5">
              {CANDLES.map((c) => (
                <div key={c} className="relative flex flex-col items-center">
                  {c >= outCount ? (
                    <span
                      className="candle-flame absolute -top-[18px] left-1/2 h-4 w-2.5 rounded-full"
                      style={{
                        transform: 'translateX(-50%)',
                        transformOrigin: 'center bottom',
                        background:
                          'radial-gradient(ellipse at 50% 70%, #fff2c0 0%, #ffd166 45%, #ff8c42 85%)',
                        boxShadow: '0 0 12px 4px rgba(255,180,80,0.7)',
                      }}
                    />
                  ) : (
                    <span
                      className="smoke absolute -top-[18px] left-1/2 h-4 w-2 rounded-full"
                      style={{
                        transform: 'translateX(-50%)',
                        background: 'rgba(210,210,210,0.5)',
                        filter: 'blur(2px)',
                      }}
                    />
                  )}
                  {/* Wax stick */}
                  <div
                    className="h-9 w-2.5 rounded-sm"
                    style={{
                      background:
                        'repeating-linear-gradient(45deg,#f2a0b0 0 6px,#fbd4dd 6px 12px)',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Top tier (wrapper sizes the tier; frosting rim overflows it) */}
            <div className="relative z-20 w-44 sm:w-52 md:w-56">
              <div className="absolute -top-2 -inset-x-1 z-10 h-4 rounded-full" style={FROSTING} />
              <div
                className="relative overflow-hidden rounded-t-xl"
                style={{ height: '62px', background: 'linear-gradient(180deg,#fbe3c0,#f3b7c6)' }}
              >
                {TOP_SPRINKLES.map((s, i) => (
                  <Sprinkle key={i} {...s} />
                ))}
              </div>
            </div>

            {/* Bottom tier */}
            <div className="relative z-10 -mt-1 w-60 sm:w-64 md:w-72">
              <div className="absolute -top-2 -inset-x-1 z-10 h-4 rounded-full" style={FROSTING} />
              <div
                className="relative overflow-hidden rounded-b-2xl rounded-t-md"
                style={{ height: '84px', background: 'linear-gradient(180deg,#f3b7c6,#e07a97)' }}
              >
                {/* Piped frosting heart, centre-front */}
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl"
                  style={{ color: '#fff4e6', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
                >
                  ♥
                </span>
                {BOTTOM_SPRINKLES.map((s, i) => (
                  <Sprinkle key={i} {...s} />
                ))}
              </div>
            </div>

            {/* Plate */}
            <div className="mt-[-2px] h-3 w-72 rounded-full bg-white/15 backdrop-blur-sm sm:w-80" />
          </div>
        </div>

        {/* ── Interaction ── */}
        {blown ? (
          <div className="flex flex-col items-center gap-5">
            {/* Two-line message below the cake —
                TODO: Replace these two lines with your own message to Aeshu */}
            <p
              className="cine-rise font-script max-w-xs text-2xl leading-snug text-gold/95 sm:max-w-md sm:text-3xl"
              style={{ animationDelay: '1.1s' }}
            >
              another year of u = another year of us 🫶
              <br />
              n i'd choose u again n again n againnn 💛
            </p>
            <p
              className="cine-rise font-serif text-base italic text-blush sm:text-lg"
              style={{ animationDelay: '1.8s' }}
            >
              u deserve all the luv in this universe 🌌
            </p>
            <div className="cine-rise" style={{ animationDelay: '2.4s' }}>
              <button
                onClick={onNext}
                className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
              >
                see our memories →
              </button>
            </div>
          </div>
        ) : micState === 'listening' ? (
          <div className="animate-fade-in flex flex-col items-center gap-3">
            <p className="mic-listening flex items-center gap-3 rounded-full border border-blush/40 bg-blush/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-blush">
              <span className="text-lg">🎤</span> i'm listening… blowww! 🌬️
            </p>
            <p className="font-sans text-xs text-cream/60">
              hold ur phone close n blow like it's a real cake 🎂
            </p>
            <button
              onClick={blowByTap}
              className="font-sans text-xs text-cream/50 underline decoration-cream/30 underline-offset-4 transition-colors hover:text-cream/80"
            >
              or just tap to blow em out 👆
            </button>
          </div>
        ) : (
          <div
            className="cine-rise flex flex-col items-center gap-4"
            style={{ animationDelay: '1.6s' }}
          >
            <button
              onClick={blowByBreath}
              disabled={micState === 'failed'}
              className={`rounded-full border px-7 py-3 font-sans text-base font-semibold tracking-wide transition-transform duration-300 ${
                micState === 'failed'
                  ? 'hidden'
                  : 'animate-soft-glow border-gold/40 bg-gold/10 text-gold hover:scale-105 hover:bg-gold/20 active:scale-95'
              }`}
            >
              blow into ur phone — for real 🎤
            </button>
            {micState === 'failed' && (
              <p className="font-sans text-xs text-cream/60">
                (ur mic is shy 2day 🙈 a tap works just as well 💛)
              </p>
            )}
            <button
              onClick={blowByTap}
              className="rounded-full border border-blush/40 bg-blush/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-blush transition-transform duration-300 hover:scale-105 hover:bg-blush/20 active:scale-95"
            >
              blow the candles 🕯️
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
