import { useState, useEffect, useRef } from 'react';

// TODO: Replace with your personal message to Aeshu
// (Blank lines create paragraph breaks. It types itself out on screen.)
const MESSAGE = `My Dearest Aeshuu, Aaje hu bav khuch che kaaran k aaje maari 
life na sav thi important person ni Birthday che. Thoda j mahina-o ma aapda aa relation nu 1 varas complete thase.
Maari life nu sav this Happiest 1 varas hatu aa kaaran k aa 1 varas ma tame maari saathe hata, maara hata !
Bs aa j rite maare aakhu jivan tamari saathe rehvu che !
Mane haji yaad che jyaare aapde pehli vaar ek bija saathe vaat kri hti ! Ek e divas hto ane 1 aaj no divas che ! 
Kyaa thi kyaa aai gaya aapde !
Kaya shabdo ma kav tame maara maate ketla important cho ! Bs atlu samjhi lo k tamara vagar nahi jivi saku ! Maara maate Oxygen cho tame ! Bs have tame maari saathe rehjo, maari saathe jivo, maari saathe rehjo, Hamesha !
Jem jem samay jato gyo tem tem tame maara maate maaru jivan bani gaya cho ! Hame tamara vagar jivu ana krta mari javu vadhare pasand kris hu !


`;

export default function MessageScreen({ onNext }) {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  // useEffect(() => {
  //   const prefersReduced =
  //     typeof window !== 'undefined' &&
  //     window.matchMedia &&
  //     window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  //   if (prefersReduced) {
  //     setShown(MESSAGE.length);
  //     setDone(true);
  //     return;
  //   }

  //   let i = 0;
  //   intervalRef.current = setInterval(() => {
  //     i += 1;
  //     setShown(i);
  //     if (i >= MESSAGE.length) {
  //       clearInterval(intervalRef.current);
  //       setDone(true);
  //     }
  //   }, 28);

  //   return () => clearInterval(intervalRef.current);
  // }, []);

  // Tap the letter to reveal it all at once.
  const revealAll = () => {
    if (done) return;
    clearInterval(intervalRef.current);
    setShown(MESSAGE.length);
    setDone(true);
  };

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
      <div className="animate-fade-in max-w-2xl">
        {/* Rose divider (top) */}
        <div className="mb-7 flex items-center justify-center gap-3 text-blush sm:mb-8">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-blush/60 sm:w-16" />
          <span className="text-2xl">🌹</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-blush/60 sm:w-16" />
        </div>

        <h2 className="text-glow-rose mb-7 font-serif text-[1.55rem] font-semibold text-ivory sm:mb-8 sm:text-4xl">
          To the Most Important Person in My Life 💛
        </h2>

        <p
          onClick={revealAll}
          className={`whitespace-pre-line font-serif text-lg italic leading-relaxed text-cream sm:text-2xl sm:leading-loose ${
            done ? '' : 'cursor-pointer'
          }`}
        >
          {MESSAGE}
          {!done && <span className="type-caret">|</span>}
        </p>

        {/* Tiny hint while typing */}
        <p
          className={`mt-4 font-sans text-xs text-cream/40 transition-opacity duration-500 ${
            done ? 'opacity-0' : 'opacity-100'
          }`}
        >
          (tap to read it all at once)
        </p>

        {/* Everything below fades in once the letter finishes */}
        <div
          className={`transition-opacity duration-700 ${
            done ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {/* Gold divider (bottom) */}
          <div className="mt-6 flex items-center justify-center gap-3 text-gold sm:mt-8">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60 sm:w-16" />
            <span className="text-2xl">💛</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60 sm:w-16" />
          </div>

          <p className="text-glow-gold mt-7 font-serif text-2xl italic text-gold sm:mt-8">
            Forever yours 💛
          </p>

          <button
            onClick={onNext}
            className="animate-soft-glow mt-9 rounded-full border border-blush/40 bg-blush/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-blush transition-transform duration-300 hover:scale-105 hover:bg-blush/20 active:scale-95 sm:mt-10"
          >
            There's more in my heart →
          </button>
        </div>
      </div>
    </section>
  );
}
