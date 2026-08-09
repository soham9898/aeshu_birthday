import { useState } from 'react';
import photos from '../photos.js';

// How many cards are visible in the stack at once (top card + peeks behind it).
const VISIBLE = 3;

// A single polaroid photo. Shows the image in its ORIGINAL aspect ratio
// (never cropped), inside a white polaroid frame with a handwritten caption.
// If the image can't be found, a soft rose placeholder is shown instead.
function Polaroid({ src, caption, date }) {
  const [errored, setErrored] = useState(false);

  return (
    <figure className="polaroid" style={{ width: 'min(78vw, 300px)' }}>
      <div className="polaroid__frame">
        {errored ? (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center bg-gradient-to-br from-blush/40 to-gold/25 text-blush">
            <span className="text-4xl">🌹</span>
            <span className="mt-2 font-sans text-xs text-[#7a5c50]">
              Photo coming soon
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={caption || 'A cherished memory'}
            loading="lazy"
            draggable={false}
            onError={() => setErrored(true)}
          />
        )}
      </div>
      <figcaption className="polaroid__caption">
        {caption || '♥'}
        {date ? <span className="polaroid__date">{date}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function PhotoGalleryScreen({ onNext }) {
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const total = photos.length;
  const isLastRemaining = current >= total - 1;

  // Tap the top photo → it lifts away → reveal the next one.
  // After the very last photo, drift straight into the message screen.
  const handleTap = () => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      if (current >= total - 1) {
        onNext();
      } else {
        setCurrent((c) => c + 1);
        setExiting(false);
      }
    }, 750);
  };

  // Graceful fallback if no photos have been added yet.
  if (total === 0) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="text-glow-rose mb-4 font-serif text-3xl font-semibold text-ivory sm:text-5xl">
          Our Beautiful Memories 📸
        </h2>
        <p className="mb-10 max-w-sm font-sans text-sm text-cream/80">
          Add your photos in <code className="text-gold">src/photos.js</code> to
          see them here.
        </p>
        <button
          onClick={onNext}
          className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold text-gold active:scale-95"
        >
          Read My Heart →
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
      <h2 className="text-glow-rose animate-fade-in mb-2 font-serif text-3xl font-semibold text-ivory sm:text-5xl">
        Our Beautiful Memories 📸
      </h2>
      <p className="animate-fade-in mb-6 max-w-md px-2 font-sans text-sm text-cream/80 sm:mb-8 sm:text-base">
        Every photo is a moment I never want to forget.
      </p>

      {/* The polaroid card deck */}
      <div className="relative mx-auto h-[58vh] w-full max-w-sm">
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
              aria-label={isTop ? 'Show the next memory' : undefined}
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
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint + progress */}
      <p className="font-script mt-4 text-xl text-blush sm:text-2xl">
        {isLastRemaining
          ? 'One last memory before I bare my heart 💛'
          : 'Tap the photo to unfold the next memory 💛'}
      </p>

      <div className="mt-4 flex items-center justify-center gap-1.5">
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
