import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { primeMusic, startMusic } from './MusicPlayer.jsx';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// The celebration 🎂 — played like a movie scene:
//   1. Lights off. Only the candles glow. "make a wish…"
//   2. She blows (for real, into the mic — or with a tap).
//      The flames bend n shrink with her breath, then go
//      out one by one, each with a wisp of smoke.
//   3. A flash of light, the room lights up, her song
//      starts, the big "Happy Birthday" lands, and the
//      confetti starts.
// ─────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  '#f5c842',
  '#f2a0b0',
  '#ff8fab',
  '#fdf6f0',
  '#c792ea',
  '#ffd479',
];

// 🎂 Her age, as number candles — one wax numeral per digit ("2" "2"),
// each with its own flame. Change this if you reuse the site next year.
const HER_AGE = 22;
const CANDLES = String(HER_AGE).split('');

// ── Microphone "blow" tuning ──────────────────────────
// She can blow into her phone for real 🎤 — the mic listens for a
// sustained rush of air and puts the candles out one by one.
// The bar rises on its own in a noisy room (a party, music in the
// background…) so only a real blow counts — never just chatter.
const BLOW_THRESHOLD = 0.18; // loudness (RMS 0–1) that counts as blowing in a quiet room
const MAX_THRESHOLD = 0.32; // the highest a noisy room can push that bar
const BLOW_MS_TOTAL = 1200; // sustained blow time to douse every candle
const BLOW_MS_PER_CANDLE = BLOW_MS_TOTAL / CANDLES.length;
const TIP_AFTER_MS = 7000; // still no proper blow? show her where the mic is
const TAP_WHOOSH_MS = 200; // tap fallback: flames bend away first…
const TAP_STAGGER_MS = 110; // …then go out one after another

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
  // 'idle' → 'asking' (permission prompt up) → 'listening' (mic live)
  //   → or 'failed' (denied / unsupported)
  const [micState, setMicState] = useState('idle');
  const [showTip, setShowTip] = useState(false);
  const blown = outCount >= CANDLES.length;

  const cakeRef = useRef(null); // carries --blow (0–1) down to the flames
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(0);
  const micSession = useRef(0); // bumps on every stop → cancels a pending mic request
  const tapTimers = useRef([]);
  const tapped = useRef(false);

  const setBlow = (level) => cakeRef.current?.style.setProperty('--blow', level);

  const stopMic = useCallback(() => {
    micSession.current += 1;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  // Never leave the mic (or a half-finished whoosh) running if she moves on.
  useEffect(
    () => () => {
      stopMic();
      tapTimers.current.forEach(clearTimeout);
    },
    [stopMic]
  );

  // The moment the last candle goes out: lights on, n her song begins 🎵
  useEffect(() => {
    if (blown) startMusic();
  }, [blown]);

  // Fallback: one tap is a big "whoosh" — the flames bend away,
  // then go out one after another.
  const blowByTap = () => {
    if (tapped.current) return;
    tapped.current = true;
    stopMic();
    primeMusic(); // inside the tap, so the browser allows sound later
    setBlow(1);
    CANDLES.forEach((_, i) => {
      tapTimers.current.push(
        setTimeout(
          () => setOutCount((c) => Math.max(c, i + 1)),
          TAP_WHOOSH_MS + i * TAP_STAGGER_MS
        )
      );
    });
  };

  // The real magic: listen to the mic, bend the flames with her
  // breath, and douse the candles one by one as she keeps blowing.
  const blowByBreath = async () => {
    if (micState !== 'idle' || tapped.current) return;
    // Her song waits for the candles to go out (so the speaker can't
    // "blow" them for her) — warm it up now, while we have her tap.
    primeMusic();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioCtx) {
      setMicState('failed');
      return;
    }
    setMicState('asking');
    const session = micSession.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // Raw-ish audio: a rush of breath must reach us un-"cleaned".
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      // She tapped instead (or left) while the permission prompt was up.
      if (session !== micSession.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      await ctx.resume();
      if (session !== micSession.current) return;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);

      setMicState('listening');

      let floor = 0.02; // the room's own background noise, learned as we listen
      let blowMs = 0; // how long she has been blowing (decays when she stops)
      let level = 0; // smoothed breath strength 0–1 → how far the flames bend
      let out = 0;
      let tipShown = false;
      const startedAt = performance.now();
      let last = startedAt;

      const tick = (now) => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          const v = (samples[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / samples.length);

        const dt = Math.min(now - last, 100);
        last = now;

        const threshold = Math.min(MAX_THRESHOLD, Math.max(BLOW_THRESHOLD, floor * 3));
        const blowing = rms > threshold;
        if (!blowing) floor += (rms - floor) * 0.02; // slowly learn the room
        blowMs = blowing ? blowMs + dt : Math.max(0, blowMs - dt * 2);

        // Flames answer every breath — even a soft one bends them a lil.
        const target = Math.min(
          1,
          Math.max(0, (rms - floor * 1.5) / Math.max(0.05, threshold * 1.4 - floor * 1.5))
        );
        level += (target - level) * (target > level ? 0.45 : 0.12);
        setBlow(level.toFixed(3));

        // Candles only ever go out — a pause never relights them.
        const shouldBeOut = Math.min(
          CANDLES.length,
          Math.floor(blowMs / BLOW_MS_PER_CANDLE)
        );
        if (shouldBeOut > out) {
          out = shouldBeOut;
          setOutCount((c) => Math.max(c, out));
        }
        if (out >= CANDLES.length) {
          stopMic();
          return;
        }

        if (!tipShown && now - startedAt > TIP_AFTER_MS) {
          tipShown = true;
          setShowTip(true);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // Permission denied or no mic — the tap button still works.
      if (session !== micSession.current) return;
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
          <div
            ref={cakeRef}
            className="relative mb-6 flex scale-[0.9] flex-col items-center sm:mb-8 sm:scale-100"
          >
            {/* Warm candlelight glowing in the dark room —
                it flickers with her breath n fades as each candle goes out */}
            {!blown && (
              <div
                className="candle-glow pointer-events-none absolute -top-24 left-1/2 h-64 w-64 rounded-full"
                style={{ '--lit': (CANDLES.length - outCount) / CANDLES.length }}
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

            {/* Number candles (her age) — the flames bend with her breath,
                then each goes dark (with a wisp of smoke) as she keeps blowing */}
            <div className="relative z-30 mb-[-8px] flex items-end gap-1.5">
              {CANDLES.map((digit, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {i >= outCount ? (
                    <span
                      className="flame-lean"
                      style={{ '--lean': `${26 + ((i * 7) % 12)}deg` }}
                    >
                      <span
                        className="candle-flame block h-full w-full rounded-full"
                        style={{
                          background:
                            'radial-gradient(ellipse at 50% 70%, #fff2c0 0%, #ffd166 45%, #ff8c42 85%)',
                          boxShadow: '0 0 12px 4px rgba(255,180,80,0.7)',
                        }}
                      />
                    </span>
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
                  {/* Wick + the wax numeral */}
                  <span className="h-1.5 w-[2px] rounded-full bg-[#5a4636]" />
                  <span className="number-candle">{digit}</span>
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
            {/* Two-line message below the cake */}
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
            {/* After a while with no real blow, a lil tip on where to aim */}
            <p
              key={showTip ? 'tip' : 'ask'}
              className="animate-fade-in max-w-xs font-sans text-xs text-cream/60"
            >
              {showTip
                ? 'psst… the mic is at the bottom of ur phone — blow right there 😉'
                : "hold ur phone close n blow like it's a real cake 🎂"}
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
              disabled={micState !== 'idle'}
              className={`rounded-full border px-7 py-3 font-sans text-base font-semibold tracking-wide transition-transform duration-300 ${
                micState === 'failed'
                  ? 'hidden'
                  : micState === 'asking'
                  ? 'border-gold/30 bg-gold/5 text-gold/70'
                  : 'animate-soft-glow border-gold/40 bg-gold/10 text-gold hover:scale-105 hover:bg-gold/20 active:scale-95'
              }`}
            >
              {micState === 'asking'
                ? 'tap "allow" so i can hear u 🎤'
                : 'blow into ur phone — for real 🎤'}
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
