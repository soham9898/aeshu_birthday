import { useState, useRef } from 'react';
import { GATE_QUESTION, GATE_ANSWERS, GATE_HINTS } from '../gate.js';

// ─────────────────────────────────────────────────────
// The secret entry gate 🔐 — the very first thing she sees.
// One playful question only Aeshu can answer. A right answer
// pops the lock open with a little heart-burst, then drifts
// into the countdown. Wrong answers only get teasing hints.
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
      // Let the lock-open moment breathe before moving on.
      setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        onUnlock();
      }, 1400);
    } else {
      setTries((t) => t + 1);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const hint = tries > 0 ? GATE_HINTS[(tries - 1) % GATE_HINTS.length] : '';

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-16">
      <p className="animate-fade-in mb-4 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
        For Aeshu's eyes only
      </p>

      {/* The lock — swings open + bursts hearts on the right answer */}
      <div className="relative mb-6 sm:mb-8">
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
          className={`inline-block text-6xl transition-transform duration-500 sm:text-7xl ${
            unlocked ? 'scale-125' : ''
          }`}
        >
          {unlocked ? '🔓' : '🔒'}
        </span>
      </div>

      <h1 className="text-glow-gold animate-fade-in mb-3 font-serif text-[1.8rem] font-semibold leading-tight text-ivory sm:text-4xl md:text-5xl">
        {unlocked ? 'It really is you 💛' : 'A little secret first…'}
      </h1>

      {!unlocked ? (
        <>
          <p className="animate-fade-in mb-9 max-w-md px-2 font-serif text-lg italic text-cream sm:mb-10 sm:text-xl">
            {GATE_QUESTION}
          </p>

          <form
            onSubmit={submit}
            className={`flex w-full max-w-xs flex-col items-center gap-4 sm:max-w-sm ${
              shaking ? 'animate-gate-shake' : ''
            }`}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Your answer…"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Your answer"
              className="w-full rounded-full border border-blush/30 bg-white/5 px-6 py-3 text-center font-sans text-base text-ivory placeholder-cream/40 backdrop-blur-md outline-none transition-colors focus:border-gold/60"
            />
            <button
              type="submit"
              className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
            >
              Unlock my surprise 🗝️
            </button>
          </form>

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
        <p className="animate-fade-in font-script text-2xl text-gold sm:text-3xl">
          Come in, my love — this is all for you…
        </p>
      )}
    </section>
  );
}
