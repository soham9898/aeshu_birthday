import { useState } from 'react';
import coupons from '../coupons.js';

// ─────────────────────────────────────────────────────
// Promise Coupons 🎟️ — a row of little wrapped gifts.
// She taps each one and it flips open (3D) into a coupon:
// a real promise she can redeem from you, anytime, forever.
// Once every gift is open, the way to the finale appears.
//
// Edit the promises themselves in src/coupons.js.
// ─────────────────────────────────────────────────────

// One gift card: face-down (wrapped 🎁) until tapped, then it
// flips over to reveal the promise inside.
function CouponCard({ emoji, title, note, index, opened, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={opened}
      aria-label={opened ? `Coupon: ${title}` : `Open gift number ${index + 1}`}
      className={`coupon-flip h-48 w-full text-left sm:h-52 ${
        opened ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <div className={`coupon-inner ${opened ? 'coupon-inner--flipped' : ''}`}>
        {/* Front: the wrapped gift */}
        <div className="coupon-face coupon-face--front flex flex-col items-center justify-center gap-2">
          <span className="text-4xl drop-shadow-md">🎁</span>
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.25em] text-plum/70">
            Gift no. {index + 1}
          </span>
          <span className="font-script text-xl text-plum/90">Tap to open</span>
        </div>

        {/* Back: the promise coupon */}
        <div className="coupon-face coupon-face--back flex flex-col items-center justify-center gap-1.5 px-4 text-center">
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] text-[#9a7d70]">
            Promise coupon
          </span>
          <span className="text-3xl">{emoji}</span>
          <span className="font-script text-2xl font-semibold leading-tight text-[#3a2b2f]">
            {title}
          </span>
          <span className="font-sans text-xs leading-snug text-[#7a5c50]">
            {note}
          </span>
          <span className="mt-1 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-[#b48a7a]">
            ✦ Never expires ✦
          </span>
        </div>
      </div>
    </button>
  );
}

export default function CouponsScreen({ onNext }) {
  const [opened, setOpened] = useState(() => coupons.map(() => false));
  const openedCount = opened.filter(Boolean).length;
  const allOpen = openedCount >= coupons.length;

  const open = (i) =>
    setOpened((prev) => prev.map((o, j) => (j === i ? true : o)));

  // Graceful fallback if every coupon was removed from src/coupons.js.
  if (coupons.length === 0) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="text-glow-gold mb-4 font-serif text-3xl font-semibold text-ivory sm:text-5xl">
          My Promises to You 🎟️
        </h2>
        <p className="mb-10 max-w-sm font-sans text-sm text-cream/80">
          Add your promise coupons in <code className="text-gold">src/coupons.js</code>{' '}
          to see them here.
        </p>
        <button
          onClick={onNext}
          className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold text-gold active:scale-95"
        >
          One last surprise →
        </button>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-16">
      <h2 className="text-glow-gold animate-fade-in mb-2 font-serif text-3xl font-semibold text-ivory sm:text-5xl">
        My Promises to You 🎟️
      </h2>
      <p className="animate-fade-in mb-8 max-w-md px-2 font-sans text-sm text-cream/80 sm:mb-10 sm:text-base">
        Tap each gift to open it — every one is a promise you can cash in,
        anytime you like.
      </p>

      <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-2xl sm:grid-cols-2">
        {coupons.map((c, i) => (
          <CouponCard
            key={i}
            {...c}
            index={i}
            opened={opened[i]}
            onOpen={() => open(i)}
          />
        ))}
      </div>

      <p className="mt-6 font-sans text-xs tracking-[0.2em] text-cream/50">
        {openedCount} / {coupons.length} opened
      </p>

      {/* The path onward appears once every promise is unwrapped */}
      <div
        className={`flex flex-col items-center gap-4 transition-opacity duration-700 ${
          allOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <p className="font-script mt-4 text-xl text-blush sm:text-2xl">
          Screenshot these — I'll honour every single one. 💛
        </p>
        <button
          onClick={onNext}
          tabIndex={allOpen ? 0 : -1}
          className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
        >
          One last surprise →
        </button>
      </div>
    </section>
  );
}
