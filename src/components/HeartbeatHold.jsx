import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// Heartbeat hold 💓 — a big heart she presses and holds.
// While she holds it, the phone buzzes in a lub-dub
// heartbeat and the heart (n the edges of the screen) pulse
// with it — a lil faster with every beat, like a heart that
// starts racing when the one it loves comes near.
//
// The buzz works on Android phones (her Moto 💛). iPhones
// don't let websites vibrate, so there it's just the pulse.
// ─────────────────────────────────────────────────────

// TODO (optional): the line that appears once she's felt it.
const HEART_LINE = 'this is how my heart beats when ur near 🫀';

const LUB_DUB = [70, 110, 100]; // buzz · pause · buzz (ms) = one heartbeat
const SLOWEST_MS = 1000; // the first beat: ~60 bpm, calm
const FASTEST_MS = 520; // racing: ~115 bpm
const SPEED_UP_MS = 60; // each beat comes this much sooner than the last
const FELT_AFTER = 4; // beats before the line appears

const canBuzz = typeof navigator !== 'undefined' && 'vibrate' in navigator;

function buzz(pattern) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // no vibration motor here — the pulse still plays
  }
}

export default function HeartbeatHold() {
  const [holding, setHolding] = useState(false);
  const [beat, setBeat] = useState(0); // every beat she's felt (restarts the pulse)
  const [bpm, setBpm] = useState(60);
  const felt = beat >= FELT_AFTER;

  const holdingRef = useRef(false);
  const timer = useRef(0);
  const period = useRef(SLOWEST_MS);

  // One heartbeat: buzz + pulse, then the next one comes a lil sooner.
  const thump = () => {
    buzz(LUB_DUB);
    setBeat((b) => b + 1);
    setBpm(Math.round(60000 / period.current));
    timer.current = setTimeout(thump, period.current);
    period.current = Math.max(FASTEST_MS, period.current - SPEED_UP_MS);
  };

  const start = () => {
    if (holdingRef.current) return;
    holdingRef.current = true;
    period.current = SLOWEST_MS;
    setHolding(true);
    thump();
  };

  // She let go — the heart calms down again.
  const stop = () => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    clearTimeout(timer.current);
    buzz(0);
    setHolding(false);
  };

  // Never leave the phone buzzing if she moves on mid-hold.
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (holdingRef.current) buzz(0);
    },
    []
  );

  const label = holding
    ? `♥ ${bpm} bpm… keep holding 💓`
    : felt
      ? 'hold it again, anytime 💗'
      : canBuzz
        ? 'press n hold my heart… n feel it 📳'
        : 'press n hold my heart 👆';

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-label="press and hold my heart"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') stop();
        }}
        className={`hb-heart ${holding ? 'hb-heart--held' : ''}`}
      >
        <span className="hb-glow" style={{ opacity: holding ? 1 : 0.45 }} />
        {holding && <span key={`ring-${beat}`} className="hb-ring" />}
        {/* New key per beat → the lub-dub pulse plays again */}
        <span
          key={holding ? beat : 'idle'}
          className={`block h-full w-full ${holding ? 'hb-pulse' : 'animate-heartbeat'}`}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="hb-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff8fab" />
                <stop offset="100%" stopColor="#c2334f" />
              </linearGradient>
            </defs>
            <path
              fill="url(#hb-fill)"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </span>
      </button>

      {/* The whole screen pulses with her heart, from the edges in */}
      {holding &&
        createPortal(<span key={beat} className="hb-screen" aria-hidden="true" />, document.body)}

      <p className="mt-4 min-h-[1.25rem] font-sans text-xs tracking-[0.15em] text-cream/60">
        {label}
      </p>

      <div className="mt-3 flex min-h-[4rem] items-start justify-center">
        {felt && (
          <CineText
            as="p"
            text={HEART_LINE}
            delay={0.2}
            className="max-w-xs font-script text-2xl leading-snug text-blush sm:text-3xl"
          />
        )}
      </div>
    </div>
  );
}
