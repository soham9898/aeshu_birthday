import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────
// TODO: Set your wife's birthday here 👇
// Format: new Date('YYYY-MM-DDTHH:MM:SS')  (24-hour clock, local time)
const BIRTHDAY_DATE = new Date('2025-12-25T00:00:00');
// const BIRTHDAY_DATE = new Date('2027-01-18T00:00:00');
// ─────────────────────────────────────────────────────

const LOVE_NOTES = [
  'Every second brings me closer to celebrating you 💛',
  'The wait is worth it…',
  'You make every moment golden.',
];

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
        finish();
      }
    }, 1000);

    return () => clearInterval(id);
    // onComplete is stable (memoized in App); safe to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-16">
      <p className="animate-fade-in mb-4 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
        For the Love of my Life....Aeshuuu ❤️❤️
      </p>

      <h1 className="text-glow-gold animate-fade-in mb-3 font-serif text-[2rem] font-semibold leading-tight text-ivory sm:text-5xl md:text-6xl">
        Counting down to you
      </h1>

      <p className="animate-fade-in mb-9 max-w-md px-2 font-sans text-sm text-cream/80 sm:mb-10 sm:text-base">
        {LOVE_NOTES[0]}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
        {units.map((u) => (
          <div
            key={u.label}
            className="animate-card-glow flex w-[6.5rem] flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-md sm:w-28 sm:px-4 sm:py-5 md:w-32"
          >
            <span className="font-serif text-4xl font-bold text-gold sm:text-5xl">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-cream/70 sm:text-xs">
              {u.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-2 sm:mt-12">
        <p className="font-serif text-base italic text-blush sm:text-lg">
          {LOVE_NOTES[1]}
        </p>
        <p className="font-sans text-sm text-cream/70">{LOVE_NOTES[2]}</p>
      </div>
    </section>
  );
}
