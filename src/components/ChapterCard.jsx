// ─────────────────────────────────────────────────────
// Chapter title card 🎬 — the black "movie" screen shown
// between scenes ("chapter 3 · our lil memories 📸").
// It builds a little suspense before each new moment.
// A tap anywhere skips straight to the scene.
//
// The chapter names live in App.jsx (CHAPTERS / OPENING).
// ─────────────────────────────────────────────────────

export default function ChapterCard({ kicker, title, note, duration, onSkip }) {
  return (
    <div
      onClick={onSkip}
      role="button"
      tabIndex={0}
      aria-label={`${kicker} — ${title}. Tap to continue`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSkip();
      }}
      className="chapter-card fixed inset-0 z-[70] flex cursor-pointer items-center justify-center bg-[#050204] px-6 text-center"
    >
      <div
        className="chapter-inner flex flex-col items-center"
        style={{ '--out-at': `${(duration - 550) / 1000}s` }}
      >
        <span className="chapter-kicker font-sans text-[0.7rem] uppercase tracking-[0.45em] text-blush/80 sm:text-xs">
          {kicker}
        </span>
        <span className="chapter-line my-5 h-px w-40 bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
        <h2 className="chapter-title text-glow-gold max-w-md font-serif text-[1.9rem] italic leading-tight text-ivory sm:text-5xl">
          {title}
        </h2>
        {note && (
          <p className="chapter-note font-script mt-4 text-xl text-gold/90 sm:text-2xl">
            {note}
          </p>
        )}
      </div>

      <span className="chapter-skip absolute bottom-[13vh] font-sans text-[0.6rem] uppercase tracking-[0.35em] text-cream/30">
        tap to skip
      </span>
    </div>
  );
}
