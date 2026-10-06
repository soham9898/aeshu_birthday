import { useState, useRef } from 'react';
import { GATE_QUESTION, GATE_ANSWERS, GATE_HINTS } from '../gate.js';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// The secret entry gate 🔐 — the very first thing she sees.
// One playful question only Aeshu can answer. A right answer
// pops the lock open with a little heart-burst and a flood of
// golden light, then drifts into the countdown. Wrong answers
// only get teasing hints.
//
// Edit the question / answers / hints in src/gate.js.
// ─────────────────────────────────────────────────────

// Forgiving comparison: lowercase, strip spaces & punctuation,
// so 'Aeshu!', ' AESHU ' and 'aeshu' all count as the same answer.
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

const ANSWERS = GATE_ANSWERS.map(normalize);

// Little hearts that burst out of the lock when it opens.
const UNLOCK_BURST = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const dist = 46 + (i % 3) * 22;
  return {
    id: i,
    sx: `${Math.cos(angle) * dist}px`,
    sy: `${Math.sin(angle) * dist}px`,
    glyph: ['💛', '💗', '✨'][i % 3],
    delay: (i % 4) * 0.05,
  };
});

export default function GateScreen({ onUnlock }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const doneRef = useRef(false);

  const submit = (e) => {
    e.preventDefault();
    if (unlocked || !value.trim()) return;

    if (ANSWERS.includes(normalize(value))) {
      setUnlocked(true);
      try {
        // Remember for this visit so a refresh doesn't re-ask her.
        sessionStorage.setItem('aeshu_unlocked', '1');
      } catch {
        /* private mode — no harm done */
      }
      // Let the lock-open moment (and its light burst) breathe before moving on.
      setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onUnlock();
      }, 2000);
    } else {
      setTries((t) => t + 1);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const hint = tries > 0 ? GATE_HINTS[(tries - 1) % GATE_HINTS.length] : '';

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-14 text-center sm:px-6 sm:py-16">
      <p className="cine-rise mb-4 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
        for aeshu's eyes only 👀
      </p>

      {/* The lock — beats like a heart, then swings open + floods with light */}
      <div className="relative mb-6 sm:mb-8">
        {unlocked && <div className="flare-burst" aria-hidden="true" />}
        {unlocked && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10"
            aria-hidden="true"
          >
            {UNLOCK_BURST.map((s) => (
              <span
                key={s.id}
                className="sparkle absolute left-0 top-0 text-lg"
                style={{ animationDelay: `${s.delay}s`, '--sx': s.sx, '--sy': s.sy }}
              >
                {s.glyph}
              </span>
            ))}
          </div>
        )}
        <span
          className={`relative inline-block text-6xl transition-transform duration-500 sm:text-7xl ${
            unlocked ? 'scale-125' : 'animate-heartbeat'
          }`}
        >
          {unlocked ? '🔓' : '🔒'}
        </span>
      </div>

      <CineText
        as="h1"
        key={unlocked ? 'yes' : 'ask'}
        text={unlocked ? "omg it's rlly uuu 💛" : 'a lil secret first… 🤫'}
        delay={unlocked ? 0 : 0.4}
        className="text-glow-gold mb-3 font-serif text-[1.8rem] font-semibold leading-tight text-ivory sm:text-4xl md:text-5xl"
      />

      {!unlocked ? (
        <>
          <p
            className="cine-rise mb-9 max-w-md px-2 font-serif text-lg italic text-cream sm:mb-10 sm:text-xl"
            style={{ animationDelay: '1s' }}
          >
            {GATE_QUESTION}
          </p>

          <div
            className="cine-rise w-full max-w-xs sm:max-w-sm"
            style={{ animationDelay: '1.4s' }}
          >
            <form
              onSubmit={submit}
              className={`flex w-full flex-col items-center gap-4 ${
                shaking ? 'animate-gate-shake' : ''
              }`}
            >
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="type ur answer here…"
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Your answer"
                className="w-full rounded-full border border-blush/30 bg-white/5 px-6 py-3 text-center font-sans text-base text-ivory placeholder-cream/40 backdrop-blur-md outline-none transition-colors focus:border-gold/60"
              />
              <button
                type="submit"
                className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
              >
                unlock my surprise 🗝️✨
              </button>
            </form>
          </div>

          {/* Teasing hint after a wrong try — never a harsh error */}
          <p
            className={`mt-6 h-6 font-script text-xl text-blush transition-opacity duration-300 ${
              hint ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {hint}
          </p>
        </>
      ) : (
        <p
          className="cine-rise font-script text-2xl text-gold sm:text-3xl"
          style={{ animationDelay: '0.5s' }}
        >
          come in my luv… all this is just for u 🥹✨
        </p>
      )}
    </section>
  );
}
