import { useState, useRef, useEffect } from 'react';
import quiz, {
  RIGHT_REACTIONS,
  WRONG_REACTIONS,
  QUIZ_RESULTS,
  QUIZ_FINAL_NOTE,
} from '../quiz.js';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// How well do u know us? 🤓💛 — a lil pop quiz.
// One question at a time. A right answer glows gold and pops
// lil hearts; a wrong one gently shows the right answer with a
// sweet line — never a "fail". Then her score + a loving verdict.
//
// Edit the questions (and every reaction line) in src/quiz.js.
// ─────────────────────────────────────────────────────

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Little hearts that pop out of a right answer (and around her score).
const HEART_POP = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const dist = 38 + (i % 3) * 18;
  return {
    id: i,
    sx: `${Math.cos(angle) * dist}px`,
    sy: `${Math.sin(angle) * dist}px`,
    glyph: ['💛', '💗', '✨'][i % 3],
    delay: (i % 4) * 0.05,
  };
});

function HeartPop({ className = '' }) {
  return (
    <span className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {HEART_POP.map((s) => (
        <span
          key={s.id}
          className="sparkle absolute left-0 top-0 text-base"
          style={{ animationDelay: `${s.delay}s`, '--sx': s.sx, '--sy': s.sy }}
        >
          {s.glyph}
        </span>
      ))}
    </span>
  );
}

// One heart per question: gold = right, rose = wrong, beating = now.
function Progress({ results, current }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      {quiz.map((_, i) => (
        <span
          key={i}
          className={`font-serif text-lg leading-none transition-colors duration-500 ${
            i < results.length
              ? results[i]
                ? 'text-glow-gold text-gold'
                : 'text-blush/70'
              : i === current
              ? 'animate-heartbeat inline-block text-cream/70'
              : 'text-cream/25'
          }`}
        >
          {i < results.length ? '♥' : '♡'}
        </span>
      ))}
    </div>
  );
}

export default function QuizScreen({ onNext }) {
  const total = quiz.length;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null); // the option she tapped
  const [reaction, setReaction] = useState('');
  const [results, setResults] = useState([]); // true / false per answer
  const nextRef = useRef(null);
  const cardRef = useRef(null);

  const done = index >= total;
  const q = quiz[index];
  const answered = picked !== null;
  const gotIt = answered && picked === q.answer;
  const score = results.filter(Boolean).length;

  // After she answers, glide down so the reaction + next button are in view.
  useEffect(() => {
    if (answered) nextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [answered]);

  // Each new question (and the score) slides into view.
  useEffect(() => {
    if (index > 0) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [index]);

  const choose = (i) => {
    if (answered) return;
    const right = i === q.answer;
    setPicked(i);
    setResults((r) => [...r, right]);
    setReaction((right ? q.right : q.wrong) || pick(right ? RIGHT_REACTIONS : WRONG_REACTIONS));
  };

  const next = () => {
    setPicked(null);
    setReaction('');
    setIndex((i) => i + 1);
  };

  const verdict =
    score === total
      ? QUIZ_RESULTS.perfect
      : score > total / 2
      ? QUIZ_RESULTS.good
      : QUIZ_RESULTS.sweet;

  // Graceful fallback if every question was removed from src/quiz.js.
  // (App skips this screen when the quiz is empty — this is just in case.)
  if (total === 0) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 text-center">
        <button
          onClick={onNext}
          className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold text-gold active:scale-95"
        >
          a letter, just for u 💌 →
        </button>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
      <div className="flex w-full max-w-md flex-col items-center">
        <p className="cine-rise mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
          pop quiz time 🤓
        </p>
        <CineText
          as="h2"
          text="how well do u know us? 💛"
          delay={0.3}
          className="text-glow-gold mb-3 font-serif text-3xl font-semibold text-ivory sm:text-5xl"
        />
        <p
          className="cine-rise mb-7 font-sans text-sm text-cream/80"
          style={{ animationDelay: '0.9s' }}
        >
          no pressure… ok maybe a lil 🙈
        </p>

        <div className="cine-rise mb-6" style={{ animationDelay: '1.1s' }}>
          <Progress results={results} current={index} />
        </div>

        {!done ? (
          <div ref={cardRef} className="flex w-full flex-col items-center">
            {/* The question (a new key per question → it rises in fresh) */}
            <div
              key={index}
              className="cine-card w-full rounded-2xl border border-gold/25 bg-white/5 px-5 py-5 backdrop-blur-md"
              style={{ animationDelay: index === 0 ? '1.3s' : '0s' }}
            >
              <p className="mb-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">
                question {index + 1} of {total}
              </p>
              <p className="font-serif text-xl italic leading-snug text-ivory sm:text-2xl">
                {q.question}
              </p>
            </div>

            <div className="mt-4 flex w-full flex-col gap-3">
              {q.options.map((option, i) => {
                const isAnswer = i === q.answer;
                const isPicked = i === picked;
                // The rise-in only runs before she answers, so a wrong
                // pick can do its lil "no no" shake afterwards.
                return (
                  <button
                    key={`${index}-${i}`}
                    onClick={() => choose(i)}
                    disabled={answered}
                    className={`relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left font-sans text-base transition-all duration-300 ${
                      !answered
                        ? 'cine-rise border-blush/25 bg-white/5 text-cream hover:border-gold/50 hover:bg-gold/10 active:scale-[0.98]'
                        : isAnswer
                        ? 'animate-soft-glow border-gold/70 bg-gold/15 text-gold'
                        : isPicked
                        ? 'animate-gate-shake border-blush/50 bg-blush/10 text-blush'
                        : 'border-blush/10 bg-white/[0.02] text-cream/40'
                    }`}
                    style={
                      answered
                        ? undefined
                        : { animationDelay: `${(index === 0 ? 1.5 : 0.25) + i * 0.1}s` }
                    }
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        answered && isAnswer ? 'border-gold/70' : 'border-current opacity-70'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {answered && isAnswer && (
                      <span className="relative text-lg">
                        ✓{isPicked && <HeartPop className="left-1/2 top-1/2" />}
                      </span>
                    )}
                    {answered && isPicked && !isAnswer && <span className="text-lg">🙈</span>}
                  </button>
                );
              })}
            </div>

            {/* Her reaction — every answer leads somewhere loving */}
            <div ref={nextRef} className="flex min-h-[8.5rem] w-full flex-col items-center">
              <p
                key={`${index}-${picked}`}
                aria-live="polite"
                className={`cine-rise mt-6 max-w-sm font-script text-2xl leading-snug ${
                  gotIt ? 'text-gold' : 'text-blush'
                }`}
              >
                {reaction}
              </p>
              {answered && (
                <div className="cine-rise mt-5" style={{ animationDelay: '0.7s' }}>
                  <button
                    onClick={next}
                    className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
                  >
                    {index < total - 1 ? 'next question →' : 'see my score 💯'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div ref={cardRef} className="flex w-full flex-col items-center gap-4">
            <div className="cine-card w-full rounded-2xl border border-gold/30 bg-white/5 px-5 py-7 backdrop-blur-md">
              <p className="mb-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">
                ur score
              </p>
              <p className="title-slam text-glow-gold relative inline-block font-serif text-5xl font-bold text-ivory sm:text-6xl">
                {score} / {total}
                <HeartPop className="left-1/2 top-1/2" />
              </p>
              <p
                className="cine-rise mt-4 font-script text-2xl leading-snug text-gold sm:text-3xl"
                style={{ animationDelay: '0.8s' }}
              >
                {verdict}
              </p>
            </div>
            <p
              className="cine-rise font-serif text-lg italic text-blush"
              style={{ animationDelay: '1.6s' }}
            >
              {QUIZ_FINAL_NOTE}
            </p>
            <div className="cine-rise mt-3" style={{ animationDelay: '2.3s' }}>
              <button
                onClick={onNext}
                className="animate-soft-glow rounded-full border border-gold/40 bg-gold/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-gold transition-transform duration-300 hover:scale-105 hover:bg-gold/20 active:scale-95"
              >
                now… a letter, just for u 💌 →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
