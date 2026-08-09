import { useMemo } from 'react';

// Subtle romantic hearts that drift up from the bottom of the screen forever.
// Pure CSS animation (see `.floating-heart` / `@keyframes float-up` in index.css).
// A few of them can gently spell her name instead of a heart (see `names` prop).

const HEART_GLYPHS = ['♥', '♡', '❥', '♥', '❤'];
const HEART_COLORS = ['#f2a0b0', '#f5c842', '#ff8fab', '#ffd479', '#e8899b'];

export default function FloatingHearts({ count = 18, names = [] }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Sprinkle a name in every ~6th heart (only if names were provided)
        const isName = names.length > 0 && i % 6 === 2;
        return {
          id: i,
          isName,
          text: isName
            ? names[Math.floor(i / 6) % names.length]
            : HEART_GLYPHS[i % HEART_GLYPHS.length],
          left: Math.random() * 100, // horizontal start position (%)
          size: isName ? 18 + Math.random() * 10 : 12 + Math.random() * 26, // px
          duration: 9 + Math.random() * 12, // s (float speed)
          delay: Math.random() * 12, // s (stagger)
          drift: `${(Math.random() - 0.5) * 120}px`, // sideways wander
          opacity: isName ? 0.28 + Math.random() * 0.22 : 0.35 + Math.random() * 0.45,
          color: isName ? '#f5c842' : HEART_COLORS[i % HEART_COLORS.length],
        };
      }),
    [count, names]
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className={`floating-heart ${h.isName ? 'font-script font-semibold' : ''}`}
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            color: h.color,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--heart-drift': h.drift,
            '--heart-opacity': h.opacity,
          }}
        >
          {h.text}
        </span>
      ))}
    </div>
  );
}
