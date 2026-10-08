import { useState, useMemo, useRef } from 'react';
import { favoritePhoto, finaleHeading, voiceNote } from '../finale.js';
import CineText from './CineText.jsx';
import Fireworks from './Fireworks.jsx';

// ─────────────────────────────────────────────────────
// The grand finale 🎬 — the last scene of the movie:
// her favourite photo fades up out of the dark with a slow
// zoom, the words arrive one by one, confetti bursts,
// fireworks bloom into hearts n "I Love You" (on loop),
// and the end credits roll.
// ─────────────────────────────────────────────────────

const BURST_COLORS = [
  '#f5c842',
  '#f2a0b0',
  '#ff8fab',
  '#fdf6f0',
  '#c792ea',
  '#ffd479',
];

// 🎞️ The end credits — edit freely, they loop slowly.
const CREDITS = [
  ['starring', 'aeshuuu ✨ (the main character, obviously)'],
  ['written & directed by', 'soham — ur biggest fan 🎬'],
  ['filmed at', 'cafés, scooty rides, cloudy days n under that one tree 🌳'],
  ['music', 'ur fav song, on loop 🎵'],
  ['special thanks', 'destiny, for making us meet 🙏'],
  ['budget', 'unlimited luv 💸💛'],
  ['the end?', 'nahh… just the beginning 💍'],
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
        delay: 2.2 + Math.random() * 0.25,
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
      {/* Full-screen favourite photo — fades up from black with a slow zoom */}
      {photoOk && (
        <img
          src={favoritePhoto}
          alt=""
          aria-hidden="true"
          onError={() => setPhotoOk(false)}
          className="finale-photo absolute inset-0 z-0 h-full w-full object-cover"
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

      {/* Fireworks (hearts + "I Love You", on loop) + confetti burst */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
        aria-hidden="true"
      >
        <Fireworks />

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
      <div className="relative z-10 flex flex-col items-center">
        <p
          className="cine-rise mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/90 sm:text-sm"
          style={{ animationDelay: '1.2s' }}
        >
          n so, forever begins…
        </p>

        <CineText
          as="h1"
          text={`${finaleHeading} 💛`}
          delay={1.8}
          step={0.14}
          className="text-glow-gold mb-4 max-w-xl font-serif text-4xl font-bold leading-tight text-ivory sm:text-6xl"
        />

        <p
          className="cine-rise font-script mb-7 text-2xl text-gold sm:text-3xl"
          style={{ animationDelay: '3s' }}
        >
          here's to us — 2day, tmrw n always 🥂
        </p>

        {/* 🎞️ End credits, rolling slowly */}
        <div
          className="cine-rise credits-window mb-8 w-full max-w-xs"
          style={{ animationDelay: '3.6s' }}
        >
          <div className="credits-roll space-y-4">
            {CREDITS.map(([role, name]) => (
              <div key={role}>
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.35em] text-blush/70">
                  {role}
                </p>
                <p className="font-serif text-base italic text-ivory/90">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="cine-rise flex flex-col items-center"
          style={{ animationDelay: '4.2s' }}
        >
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
                {playing ? 'playing… 🎧' : 'play my voice 💛'}
              </button>
            </>
          )}

          {/* Replay */}
          <button
            onClick={onReplay}
            className="rounded-full border border-blush/40 bg-blush/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-blush transition-transform duration-300 hover:scale-105 hover:bg-blush/20 active:scale-95"
          >
            replay our day 🔁💛
          </button>
        </div>
      </div>
    </section>
  );
}
