import { useState, useMemo, useRef } from 'react';
import { favoritePhoto, finaleHeading, voiceNote } from '../finale.js';

const BURST_COLORS = [
  '#f5c842',
  '#f2a0b0',
  '#ff8fab',
  '#fdf6f0',
  '#c792ea',
  '#ffd479',
];

export default function FinaleScreen({ onReplay }) {
  const [photoOk, setPhotoOk] = useState(Boolean(favoritePhoto));
  const [audioOk, setAudioOk] = useState(Boolean(voiceNote));
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // One-time celebratory confetti burst from the centre.
  const burst = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        bx: `${(Math.random() - 0.5) * 90}vw`,
        by: `${20 + Math.random() * 70}vh`,
        br: `${(Math.random() - 0.5) * 900}deg`,
        size: 6 + Math.random() * 9,
        delay: Math.random() * 0.25,
        color: BURST_COLORS[i % BURST_COLORS.length],
        round: Math.random() > 0.55,
      })),
    []
  );

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      a.play().catch(() => setAudioOk(false));
    }
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      {/* Full-screen favourite photo */}
      {photoOk && (
        <img
          src={favoritePhoto}
          alt=""
          aria-hidden="true"
          onError={() => setPhotoOk(false)}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}

      {/* Romantic dark vignette so the words stay readable over any photo */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(16,10,16,0.30), rgba(13,6,8,0.82) 95%), linear-gradient(180deg, rgba(16,10,16,0.55), rgba(13,6,8,0.80))',
        }}
      />

      {/* Confetti burst */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden="true"
      >
        {burst.map((c) => (
          <span
            key={c.id}
            className="confetti-burst-piece"
            style={{
              width: `${c.size}px`,
              height: `${c.size * (c.round ? 1 : 1.6)}px`,
              backgroundColor: c.color,
              borderRadius: c.round ? '9999px' : '2px',
              animationDelay: `${c.delay}s`,
              '--bx': c.bx,
              '--by': c.by,
              '--br': c.br,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in relative z-10 flex flex-col items-center">
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/90 sm:text-sm">
          And so, forever begins
        </p>

        <h1 className="text-glow-gold mb-4 max-w-xl font-serif text-4xl font-bold leading-tight text-ivory sm:text-6xl">
          {finaleHeading} 💛
        </h1>

        <p className="font-script mb-9 text-2xl text-gold sm:text-3xl">
          Here's to us — today, and always.
        </p>

        {/* Voice note (only shown if one is configured & loads) */}
        {voiceNote && audioOk && (
          <>
            <audio
              ref={audioRef}
              src={voiceNote}
              preload="none"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onError={() => setAudioOk(false)}
            />
            <button
              onClick={toggleAudio}
              className={`mb-5 flex items-center gap-3 rounded-full border border-gold/50 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95 ${
                playing ? 'animate-soft-glow' : ''
              }`}
            >
              <span className="text-lg">{playing ? '⏸' : '▶'}</span>
              {playing ? 'Playing…' : 'Play my voice 💛'}
            </button>
          </>
        )}

        {/* Replay */}
        <button
          onClick={onReplay}
          className="rounded-full border border-blush/40 bg-blush/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-blush transition-transform duration-300 hover:scale-105 hover:bg-blush/20 active:scale-95"
        >
          Replay our day 💛
        </button>
      </div>
    </section>
  );
}
