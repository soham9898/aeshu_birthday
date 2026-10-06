import { useState, useRef, useEffect } from 'react';
import reasons from '../reasons.js';
import CineText from './CineText.jsx';

// She reveals the reasons one at a time by tapping the button.
// Each new reason gently fades in below the previous ones.
export default function ReasonsScreen({ onNext }) {
  const total = reasons.length;
  const [count, setCount] = useState(total > 0 ? 1 : 0);
  const endRef = useRef(null);

  const allShown = count >= total;

  // Keep the newest reason in view as they stack up.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [count]);

  const reveal = () => {
    if (allShown) {
      onNext();
      return;
    }
    setCount((c) => Math.min(c + 1, total));
  };

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-16">
      <CineText
        as="h2"
        text="reasons i luv u 💛"
        delay={0.2}
        className="text-glow-gold mb-2 font-serif text-3xl font-semibold text-ivory sm:text-5xl"
      />
      <p
        className="cine-rise mb-8 max-w-md px-2 font-sans text-sm text-cream/80 sm:text-base"
        style={{ animationDelay: '0.7s' }}
      >
        just in case u ever forget, even for a sec… 🥺
      </p>

      <div className="flex w-full max-w-md flex-col gap-4">
        {reasons.slice(0, count).map((reason, i) => (
          <div
            key={i}
            className="cine-card flex items-start gap-4 rounded-2xl border border-blush/20 bg-white/5 px-5 py-4 text-left backdrop-blur-md"
            style={{ animationDelay: i === 0 ? '1.1s' : '0s' }}
          >
            <span className="text-glow-gold font-serif text-2xl font-bold leading-none text-gold sm:text-3xl">
              {i + 1}
            </span>
            <p className="font-serif text-base italic leading-relaxed text-cream sm:text-lg">
              {reason}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {total > 0 && (
        <button
          onClick={reveal}
          className={`mt-9 rounded-full border px-7 py-3 font-sans text-base font-semibold tracking-wide transition-transform duration-300 hover:scale-105 active:scale-95 ${
            allShown
              ? 'animate-soft-glow border-gold/40 bg-gold/10 text-gold hover:bg-gold/20'
              : 'border-blush/40 bg-blush/10 text-blush hover:bg-blush/20'
          }`}
        >
          {allShown ? 'i made u some promises 🤞 →' : 'one more reason 👉💛'}
        </button>
      )}

      {total === 0 && (
        <button
          onClick={onNext}
          className="animate-soft-glow mt-4 rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold text-gold active:scale-95"
        >
          i made u some promises 🤞 →
        </button>
      )}

      {total > 0 && (
        <p className="mt-4 font-sans text-xs tracking-[0.2em] text-cream/50">
          {Math.min(count, total)} / {total}
        </p>
      )}
    </section>
  );
}
