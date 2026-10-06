import { useState, useRef } from 'react';
import photos from '../photos.js';
import CineText from './CineText.jsx';

// How many cards are visible in the stack at once (top card + peeks behind it).
const VISIBLE = 3;

// A single polaroid photo. Shows the image in its ORIGINAL aspect ratio
// (never cropped), inside a white polaroid frame with a handwritten caption.
// Every photo starts hidden behind a soft blur ("tap to reveal 👀"). Once
// she taps, it "develops" like a real polaroid — washed-out to full colour,
// with a warm light leak sweeping across — then slowly drifts (Ken Burns).
// If the image can't be found, a soft rose placeholder is shown instead.
function Polaroid({ src, caption, date, isTop, revealed }) {
  const [errored, setErrored] = useState(false);
  const shown = isTop && revealed;

  return (
    <figure className="polaroid" style={{ width: 'min(78vw, 300px)' }}>
      <div className="polaroid__frame">
        {errored ? (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center bg-gradient-to-br from-blush/40 to-gold/25 text-blush">
            <span className="text-4xl">🌹</span>
            <span className="mt-2 font-sans text-xs text-[#7a5c50]">
              pic coming soon
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={shown ? caption || 'A cherished memory' : ''}
            loading="lazy"
            draggable={false}
            onError={() => setErrored(true)}
            className={shown ? 'photo-develop' : 'photo-hidden'}
          />
        )}
        {shown && !errored && <span className="light-leak" aria-hidden="true" />}

        {/* The blur veil on the top photo — fades away when she taps */}
        {isTop && !errored && (
          <span
            className={`photo-veil ${revealed ? 'photo-veil--gone' : ''}`}
            aria-hidden="true"
          >
            <span className="text-3xl">🙈</span>
            <span className="font-script text-2xl leading-none">a lil memory…</span>
            <span className="animate-heartbeat mt-1 font-sans text-[0.7rem] font-bold uppercase tracking-[0.25em]">
              tap to reveal 👀
            </span>
          </span>
        )}
      </div>
      <figcaption
        className={`polaroid__caption ${shown ? 'caption-reveal' : 'caption-hidden'}`}
      >
        {caption || '♥'}
        {date ? <span className="polaroid__date">{date}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function PhotoGalleryScreen({ onNext }) {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const revealedAt = useRef(0);

  const total = photos.length;
  const isLastRemaining = current >= total - 1;

  // First tap on the top photo → it comes out from behind the blur.
  // Next tap → it lifts away → the next (still hidden) memory.
  // After the very last photo, drift straight into the message screen.
  const handleTap = () => {
    if (exiting) return;
    if (!revealed) {
      revealedAt.current = Date.now();
      setRevealed(true);
      return;
    }
    // A quick double tap shouldn't whisk a photo away before she sees it.
    if (Date.now() - revealedAt.current < 900) return;
    setExiting(true);
    window.setTimeout(() => {
      if (current >= total - 1) {
        onNext();
      } else {
        setCurrent((c) => c + 1);
        setRevealed(false);
        setExiting(false);
      }
    }, 750);
  };

  const hint = !revealed
    ? 'tap the pic to reveal it 👀'
    : isLastRemaining
    ? 'one last memory… then i open my heart 💛'
    : 'tap the pic for the next memory 👆💛';

  // Graceful fallback if no photos have been added yet.
  if (total === 0) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="text-glow-rose mb-4 font-serif text-3xl font-semibold text-ivory sm:text-5xl">
          our beautiful memoriesss 📸
        </h2>
        <p className="mb-10 max-w-sm font-sans text-sm text-cream/80">
          add ur pics in <code className="text-gold">src/photos.js</code> to
          see em here 📸
        </p>
        <button
          onClick={onNext}
          className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold text-gold active:scale-95"
        >
          read my heart →
        </button>
      </section>
    );
  }

  // The cards currently in the stack (top card first).
  const stack = [];
  for (let d = 0; d < VISIBLE; d++) {
    const idx = current + d;
    if (idx < total) stack.push({ idx, depth: d });
  }

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-16">
      <CineText
        as="h2"
        text="our beautiful memoriesss 📸"
        delay={0.2}
        className="text-glow-rose mb-2 font-serif text-3xl font-semibold text-ivory sm:text-5xl"
      />
      <p
        className="cine-rise mb-6 max-w-md px-2 font-sans text-sm text-cream/80 sm:mb-8 sm:text-base"
        style={{ animationDelay: '0.8s' }}
      >
        every pic = a moment i never wanna forget 🥹
      </p>

      {/* The polaroid card deck */}
      <div
        className="cine-rise relative mx-auto h-[58vh] w-full max-w-sm"
        style={{ animationDelay: '1s' }}
      >
        {stack.map(({ idx, depth }) => {
          const isTop = depth === 0;
          // A small, stable tilt per photo so the pile looks natural.
          const tilt = ((idx * 7) % 9) - 4;
          return (
            <div
              key={idx}
              className="deck-card"
              onClick={isTop ? handleTap : undefined}
              onKeyDown={
                isTop
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleTap();
                    }
                  : undefined
              }
              role={isTop ? 'button' : undefined}
              tabIndex={isTop ? 0 : undefined}
              aria-label={
                isTop
                  ? revealed
                    ? 'Show the next memory'
                    : 'Tap to reveal this memory'
                  : undefined
              }
              style={{
                zIndex: 50 - depth,
                pointerEvents: isTop ? 'auto' : 'none',
                cursor: isTop ? 'pointer' : 'default',
              }}
            >
              <div
                className="deck-depth"
                style={{
                  transform: `translateY(${depth * 10}px) scale(${
                    1 - depth * 0.04
                  }) rotate(${tilt}deg)`,
                  opacity: 1 - depth * 0.28,
                }}
              >
                <div className={isTop ? (exiting ? 'deck-exit' : 'deck-anim') : ''}>
                  <Polaroid
                    src={photos[idx].src}
                    caption={photos[idx].caption}
                    date={photos[idx].date}
                    isTop={isTop}
                    revealed={revealed}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint + progress */}
      <p
        key={hint}
        className="cine-rise font-script mt-4 text-xl text-blush sm:text-2xl"
        style={{ animationDelay: current === 0 && !revealed ? '1.6s' : '0s' }}
      >
        {hint}
      </p>

      <div className="mt-4 flex max-w-xs flex-wrap items-center justify-center gap-1.5">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 bg-gold'
                : i < current
                ? 'w-1.5 bg-gold/50'
                : 'w-1.5 bg-cream/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
