// ─────────────────────────────────────────────────────
// Cinematic text 🎬 — a heading that appears word by word,
// each word drifting up out of a soft blur into focus.
//
//   <CineText as="h1" text="hello my luv" delay={0.3} />
//
//   • as    : which tag to render (h1, h2, p, span…)
//   • delay : seconds before the first word appears
//   • step  : seconds between one word and the next
//
// Give it a new `key` whenever the text changes so the
// reveal plays again for the new words.
// ─────────────────────────────────────────────────────

export default function CineText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  step = 0.09,
}) {
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span
            className="cine-word"
            style={{ animationDelay: `${delay + i * step}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
