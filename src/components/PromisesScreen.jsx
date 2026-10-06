import { useState, useRef, useEffect } from 'react';
import vows, { VOWS_CLOSING } from '../vows.js';
import CineText from './CineText.jsx';
import HeartbeatHold from './HeartbeatHold.jsx';

// ─────────────────────────────────────────────────────
// My Promises to You 💍 — the saat vachan.
// A sacred fire (agni) burns in the middle of the screen and
// she takes the 7 pheras with you, one tap at a time: the two
// of you (💑) walk once around the fire, a lamp lights up, and
// one wedding vow appears. After the 7th, a heart she presses
// n holds to feel it beat 💓, then all 7 vows together.
//
// Edit the vows in src/vows.js.
// ─────────────────────────────────────────────────────

const PHERA_MS = 1800; // one walk around the agni

// One wedding vow: the phera, its Saptapadi line, and the promise.
function VowCard({ vow, compact = false, delay = 0 }) {
  return (
    <div
      className={`cine-card w-full rounded-2xl border border-gold/25 bg-white/5 text-left backdrop-blur-md ${
        compact ? 'px-4 py-3' : 'px-5 py-4'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">
        {vow.phera}
      </p>
      <p className="mb-2 mt-0.5 font-serif text-xs italic text-blush/70">
        “{vow.mantra}”
      </p>
      <p
        className={`font-serif italic leading-relaxed text-cream ${
          compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
        }`}
      >
        {vow.promise}
      </p>
    </div>
  );
}

// The sacred fire, with 7 lamps around it that light up one by one
// as the two of them (💑) walk each phera.
function Agni({ taken, walking }) {
  return (
    <div className="agni mx-auto" aria-hidden="true">
      <div className="agni__glow" style={{ opacity: 0.55 + taken * 0.065 }} />
      <div className="agni__ring" />
      {vows.map((_, i) => (
        <span
          key={i}
          className={`agni__dot ${i < taken ? 'agni__dot--lit' : ''}`}
          style={{ '--a': `${(i * 360) / vows.length}deg` }}
        />
      ))}
      <div className="agni__kund" />
      <div className="agni__fire">
        <span className="flame flame--outer" />
        <span className="flame flame--mid" />
        <span className="flame flame--core" />
        {[-14, 6, -4, 12, 0].map((dx, i) => (
          <span
            key={i}
            className="ember"
            style={{ left: `${dx}px`, '--dx': `${dx * 1.6}px`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
      {/* New key per phera → the walk around the fire plays again */}
      <div key={taken} className={`agni__orbit ${walking ? 'agni__orbit--go' : ''}`}>
        <span className="agni__walker">💑</span>
      </div>
    </div>
  );
}

export default function PromisesScreen({ onNext }) {
  const [taken, setTaken] = useState(0);
  const [walking, setWalking] = useState(false);
  const allTaken = taken >= vows.length;

  const stageRef = useRef(null);
  const closingRef = useRef(null);

  // Walk once around the agni, then the vow appears.
  const takePhera = () => {
    if (walking || allTaken) return;
    // Make sure the fire is in view so she sees the walk.
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setWalking(true);
    setTimeout(() => {
      setTaken((t) => t + 1);
      setWalking(false);
    }, PHERA_MS);
  };

  // After the 7th vow has had a moment to land, glide on to the ending.
  useEffect(() => {
    if (!allTaken) return;
    const id = setTimeout(
      () => closingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      2600
    );
    return () => clearTimeout(id);
  }, [allTaken]);

  // Graceful fallback if every vow was removed from src/vows.js.
  if (vows.length === 0) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="text-glow-gold mb-4 font-serif text-3xl font-semibold text-ivory sm:text-5xl">
          my promises to u 💍
        </h2>
        <p className="mb-10 max-w-sm font-sans text-sm text-cream/80">
          add ur vows in <code className="text-gold">src/vows.js</code> to see em here.
        </p>
        <button
          onClick={onNext}
          className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold text-gold active:scale-95"
        >
          one last surprise 🤭 →
        </button>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
      <div className="flex w-full max-w-md flex-col items-center">
        <p className="cine-rise mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
          saat fere, saat vachan 🔥
        </p>
        <CineText
          as="h2"
          text="my promises to u 💍"
          delay={0.3}
          className="text-glow-gold mb-3 font-serif text-3xl font-semibold text-ivory sm:text-5xl"
        />
        <p
          className="cine-rise mb-8 max-w-sm font-sans text-sm text-cream/80"
          style={{ animationDelay: '1s' }}
        >
          the same 7 vows every indian wedding is made of… i'm just making
          them to u a lil early 🙈 tap to take each phera with me
        </p>

        {/* The stage: fire + the vow just taken + the next step.
            Sized to fit one phone screen so the walk is never missed. */}
        <div ref={stageRef} className="flex w-full flex-col items-center">
          <div className="cine-rise mb-7" style={{ animationDelay: '1.3s' }}>
            <Agni taken={taken} walking={walking} />
          </div>

          <div className="flex min-h-[9.5rem] w-full items-start">
            {taken > 0 && <VowCard key={taken} vow={vows[taken - 1]} />}
          </div>

          {!allTaken && (
            <div className="cine-rise flex flex-col items-center" style={{ animationDelay: '1.7s' }}>
              <button
                onClick={takePhera}
                disabled={walking}
                className={`mt-5 rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95 disabled:opacity-60 ${
                  walking ? '' : 'animate-soft-glow'
                }`}
              >
                {walking
                  ? 'walking around the agni… 🪔'
                  : `take phera ${taken + 1} with me 🔥`}
              </button>
              <p className="mt-3 font-sans text-xs tracking-[0.2em] text-cream/50">
                {taken} / {vows.length} pheras
              </p>
            </div>
          )}
        </div>

        {allTaken && (
          <div className="mt-10 flex w-full flex-col items-center gap-4">
            <div ref={closingRef} className="flex flex-col items-center gap-4">
              <CineText
                as="p"
                text={VOWS_CLOSING.title}
                delay={1}
                className="text-glow-gold font-serif text-2xl italic leading-snug text-gold sm:text-3xl"
              />
              <p
                className="cine-rise max-w-sm font-script text-xl leading-snug text-blush sm:text-2xl"
                style={{ animationDelay: '2s' }}
              >
                {VOWS_CLOSING.note}
              </p>

              {/* 💓 Press n hold — feel how my heart beats for u */}
              <div className="cine-rise mt-6" style={{ animationDelay: '2.8s' }}>
                <HeartbeatHold />
              </div>

              <div className="cine-rise" style={{ animationDelay: '3.6s' }}>
                <button
                  onClick={onNext}
                  className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
                >
                  one last surprise 🤭 →
                </button>
              </div>
            </div>

            {/* All 7 together — a keepsake to screenshot */}
            <p
              className="cine-rise mt-10 font-sans text-xs uppercase tracking-[0.3em] text-cream/50"
              style={{ animationDelay: '4s' }}
            >
              all 7, in one place — screenshot it 📸
            </p>
            <div className="flex w-full flex-col gap-3">
              {vows.map((v, i) => (
                <VowCard key={i} vow={v} compact delay={4.2 + i * 0.15} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
