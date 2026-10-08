import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ─────────────────────────────────────────────────────
// Pushpa varsha 🌸 — the flower shower at the end of the pheras.
// Rose petals n marigolds rain down over the whole screen for a
// few seconds, swaying gently as they fall, then clear away.
//
// Rendered straight into <body> so the shower stays put over
// her screen even while the scene scrolls or fades out.
// ─────────────────────────────────────────────────────

const SHOWER_S = 4; // new petals keep starting to fall for this long
const FALL_MIN_S = 8; // …and each one takes 8–11s to drift down
const FALL_MAX_S = 11;
const COUNT = 42;

// Rose + marigold petal colours (lit from the top-left)
const PETAL_COLORS = [
  'radial-gradient(circle at 30% 25%, #ffd6df, #e8506e 75%)',
  'radial-gradient(circle at 30% 25%, #ffc2cf, #c9304f 80%)',
  'radial-gradient(circle at 30% 25%, #ffe3ea, #f2a0b0 70%)',
  'radial-gradient(circle at 30% 25%, #ffe28a, #ff9f1c 75%)',
  'radial-gradient(circle at 30% 25%, #fff0b3, #f5a623 75%)',
];
// Every few pieces is a whole lil flower instead of a petal
const FLOWERS = ['🌸', '🌼'];

const rand = (min, max) => min + Math.random() * (max - min);

export default function FlowerShower() {
  const [done, setDone] = useState(false);

  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const size = rand(9, 15);
        return {
          id: i,
          left: rand(-2, 98),
          delay: rand(0, SHOWER_S),
          duration: rand(FALL_MIN_S, FALL_MAX_S),
          drift: `${rand(-45, 45)}px`,
          sway: `${rand(12, 34)}px`,
          swayDuration: rand(1.8, 3.2),
          swayDelay: -rand(0, 3),
          tilt: rand(0, 360),
          flower: i % 4 === 0 ? FLOWERS[(i / 4) % FLOWERS.length] : null,
          size,
          color: PETAL_COLORS[i % PETAL_COLORS.length],
        };
      }),
    []
  );

  // Once the last petal has landed, clear the shower away.
  useEffect(() => {
    const id = setTimeout(() => setDone(true), (SHOWER_S + FALL_MAX_S) * 1000 + 500);
    return () => clearTimeout(id);
  }, []);

  if (done) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece petal-fall"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': p.drift,
          }}
        >
          <span
            className="petal-sway"
            style={{
              '--sway': p.sway,
              animationDuration: `${p.swayDuration}s`,
              animationDelay: `${p.swayDelay}s`,
            }}
          >
            {p.flower ? (
              <span className="block" style={{ fontSize: `${p.size + 7}px`, transform: `rotate(${p.tilt}deg)` }}>
                {p.flower}
              </span>
            ) : (
              <span
                className="block"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size * 1.3}px`,
                  background: p.color,
                  borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
                  transform: `rotate(${p.tilt}deg)`,
                }}
              />
            )}
          </span>
        </span>
      ))}
    </div>,
    document.body
  );
}
