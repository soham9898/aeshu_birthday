import { useState, useEffect, useRef } from 'react';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// Aeshu's birthday 👇 (the site unlocks at this exact moment)
// Format: new Date('YYYY-MM-DDTHH:MM:SS')  (24-hour clock, local time)
const BIRTHDAY_DATE = new Date('2027-01-18T00:00:00');
// ─────────────────────────────────────────────────────

const LOVE_NOTES = [
  'every sec brings me closer to celebrating u 💛',
  'the wait is sooo worth it… 🥹',
  'u make every moment golden ✨',
];

// The last few seconds take over the whole screen 🎬
const FINAL_SECONDS = 10;

function getTimeLeft() {
  const diff = BIRTHDAY_DATE.getTime() - Date.now();
  const clamped = Math.max(0, diff);
  return {
    total: diff,
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

// Used by App to skip the countdown once the big day is already here.
export function birthdayHasArrived() {
  return getTimeLeft().total <= 0;
}

export default function CountdownScreen({ onComplete }) {
  const [time, setTime] = useState(getTimeLeft);
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      onComplete();
    };

    // Already the big day? Unlock the celebration right away.
    if (getTimeLeft().total <= 0) {
      finish();
      return;
    }

    const id = setInterval(() => {
      const next = getTimeLeft();
      setTime(next);
      if (next.total <= 0) {
        clearInterval(id);
        // Let the "0" and the white flash land before the curtain falls.
        setTimeout(finish, 900);
      }
    }, 1000);

    return () => clearInterval(id);
    // onComplete is stable (memoized in App); safe to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = [
    { label: 'days', value: time.days },
    { label: 'hrs', value: time.hours },
    { label: 'mins', value: time.minutes },
    { label: 'secs', value: time.seconds },
  ];

  // Whole seconds left — drives the dramatic final countdown.
  const secsLeft = Math.ceil(Math.max(0, time.total) / 1000);
  const finale = time.total > -1000 && secsLeft <= FINAL_SECONDS;

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-14 text-center sm:px-6 sm:py-16">
      <p className="cine-rise mb-4 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
        for the luv of my lyf… aeshuuu ❤️❤️
      </p>

      <CineText
        as="h1"
        text="counting down to uuu ⏳"
        delay={0.3}
        className="text-glow-gold mb-3 font-serif text-[2rem] font-semibold leading-tight text-ivory sm:text-5xl md:text-6xl"
      />

      <p
        className="cine-rise mb-9 max-w-md px-2 font-sans text-sm text-cream/80 sm:mb-10 sm:text-base"
        style={{ animationDelay: '0.9s' }}
      >
        {LOVE_NOTES[0]}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
        {units.map((u, i) => (
          <div
            key={u.label}
            className="cine-rise relative w-fit"
            style={{ animationDelay: `${1.1 + i * 0.15}s` }}
          >
            {/* The card's soft pulsing glow */}
            <span
              className="animate-card-glow pointer-events-none absolute inset-0 rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex w-[6.5rem] flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-md sm:w-28 sm:px-4 sm:py-5 md:w-32">
              {/* New key every tick → the number rolls in fresh */}
              <span
                key={u.value}
                className="digit-roll font-serif text-4xl font-bold text-gold sm:text-5xl"
              >
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-cream/70 sm:text-xs">
                {u.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="cine-rise mt-10 space-y-2 sm:mt-12"
        style={{ animationDelay: '1.9s' }}
      >
        <p className="font-serif text-base italic text-blush sm:text-lg">
          {LOVE_NOTES[1]}
        </p>
        <p className="font-sans text-sm text-cream/70">{LOVE_NOTES[2]}</p>
      </div>

      {/* 🎬 The final ten seconds: lights dim, giant numbers, heartbeat */}
      {finale && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050204]/90 backdrop-blur-sm">
          <p className="animate-heartbeat mb-6 font-sans text-xs uppercase tracking-[0.4em] text-blush/90">
            omg omg… get ready 🙈
          </p>
          <span
            key={secsLeft}
            className="final-count text-glow-gold font-serif text-[9rem] font-bold leading-none text-gold sm:text-[12rem]"
          >
            {secsLeft}
          </span>
          {secsLeft === 0 && (
            <div className="flash-burst pointer-events-none absolute inset-0" />
          )}
        </div>
      )}
    </section>
  );
}
