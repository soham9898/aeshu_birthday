import { useState, useEffect, useRef, useMemo } from 'react';
import CineText from './CineText.jsx';

// ─────────────────────────────────────────────────────
// The love letter 💌 — played in three beats:
//   1. A sealed envelope ("u've got mail"). She taps the wax seal.
//   2. The flap swings open, the letter slides out.
//   3. The letter appears phrase by phrase, like invisible ink
//      slowly showing up. A tap reveals all of it at once.
// ─────────────────────────────────────────────────────

// The letter to Aeshu
// (Each new line starts a new paragraph. It writes itself out on screen.)
const MESSAGE = `My Dearest Aeshuu, Aaje hu bav khush chu kaaran k aaje maari life na sav thi important person ni Birthday che. Thoda j mahina-o ma aapda aa relation nu 1 varas complete thase.
Maari life nu sav thi Happiest 1 varas hatu aa kaaran k aa 1 varas ma tame maari saathe hata, maara hata !
Bs aa j rite maare aakhu jivan tamari saathe rehvu che !
Mane haji yaad che jyaare aapde pehli vaar ek bija saathe vaat kri hti ! Ek e divas hto ane 1 aaj no divas che !
Kyaa thi kyaa aai gaya aapde !
Kaya shabdo ma kav tame maara maate ketla important cho ! Bs atlu samjhi lo k tamara vagar nahi jivi saku ! Maara maate Oxygen cho tame ! Bs have tame maari saathe rehjo, maari saathe jivo, Hamesha !
Jem jem samay jato gyo tem tem tame maara maate maaru jivan bani gaya cho ! Have tamara vagar jivu ena krta mari javu vadhare pasand karis hu !
Tamne khabar che ? Tamari ek smile maaro aakho divas banavi de che ! Savaar ma tamaro 'Good Morning' no message aave tyaare j maaro divas sharu thaay che, ane raat ma tamara 'Good Night' vagar to mane oongh j nathi aavti 🙈
Aapde saathe ketli badhi yaado banaavi che — e café vaali date, e scooty vaali rides, e cloudy divas, ane e jhaad niche besine kareli lambi lambi vaato ! Ek ek pal mane haji pan evu ne evu yaad che 🥹
Tame jyaare haso cho ne, tyaare evu laage che k aakhi duniya ni khushi bas tamara chehra par aavi gai che ! Ane jyaare tame gusse thao cho, tyaare pan etla j cute lago cho 😜 (pan please vadhare gusso na karta 🙏😂)
Hu perfect nathi, Aeshuu. Ghani vaar maari bhool thai jaay che, ghani vaar ajaanta ma tamne hurt pan kari dau chu… pan ek vaat 100% pakki che — maaro prem tamara maate kyaarey ocho nahi thaay, divase ne divase vadhto j jashe ! ❤️
Tamara badha sapna have maara pan sapna che. Tame je pan karva maango, je pan banva maango — hu hamesha tamari pachhal ubho rahish, tamari taakat banine 💪 Ane jo kyaarey thaaki jao, to maaro khabho hamesha tamara maate haajar che 🤗
Aaje tamara birthday par Bhagwan paase bas ek j vastu maangu chu — k tamari aankh ma kyaarey aansu na aave, ane jo aave to fakt khushi na ! Tamari dareek ichchha puri thaay ane dareek sapnu saachu thaay ✨
Ek divas tamne dulhan na roop ma jovanu sapnu che maaru… laal chundadi ma, haath ma maara naam ni mehndi saathe 💍 Ane e divas have bahu dur nathi 🙈
Saat fera, saat vachan ane saat janam — badhu j tamari saathe karvu che ! Aa janam ma pan tame, ane aavta saat janam ma pan bas tame j ❤️
Happy Birthday maari jaan, maari Aeshuuu ! 🎂 Tame maaro aaj cho, maari aavti kaal cho ane maaru aakhu jivan cho. I love you sooo much… gai kaal karta vadhare ane aavti kaal karta ochu ! ❤️`;

// Split the letter into paragraphs, and each paragraph into little
// phrases (ending at ! ? . or …) — they appear one after another.
function splitLetter(text) {
  let n = 0;
  return text
    .trim()
    .split('\n')
    .filter((line) => line.trim())
    .map((line) =>
      (line.match(/[^!?.…]+(?:[!?.…]+|$)\s*/g) || [line]).map((phrase) => ({
        text: phrase,
        i: n++,
      }))
    );
}

// How long to wait before the next phrase — roughly reading speed.
function pauseAfter(phrase, endsParagraph) {
  const ms = Math.min(4200, Math.max(900, 500 + phrase.length * 30));
  return endsParagraph ? ms + 400 : ms;
}

export default function MessageScreen({ onNext }) {
  const paragraphs = useMemo(() => splitLetter(MESSAGE), []);
  const phrases = useMemo(() => paragraphs.flat(), [paragraphs]);
  const lastOfParagraph = useMemo(
    () => new Set(paragraphs.map((p) => p[p.length - 1].i)),
    [paragraphs]
  );
  const total = phrases.length;

  // 'sealed' → 'opening' (flap + letter animation) → 'reading'
  const [phase, setPhase] = useState('sealed');
  const [leaving, setLeaving] = useState(false);
  const [shown, setShown] = useState(0);
  const autoRef = useRef(true); // false once she taps "show it all"
  const letterRef = useRef(null);
  const done = phase === 'reading' && shown >= total;

  // Tap the seal → open the envelope → start reading.
  const openEnvelope = () => {
    if (phase !== 'sealed') return;
    setPhase('opening');
    setTimeout(() => setLeaving(true), 1700);
    setTimeout(() => setPhase('reading'), 2500);
  };

  // Reveal the next phrase after a reading-speed pause.
  useEffect(() => {
    if (phase !== 'reading' || shown >= total) return;
    const prev = phrases[shown - 1];
    const wait = prev ? pauseAfter(prev.text, lastOfParagraph.has(prev.i)) : 900;
    const id = setTimeout(() => setShown((s) => s + 1), wait);
    return () => clearTimeout(id);
  }, [phase, shown, total, phrases, lastOfParagraph]);

  // Keep the newest phrase in view as the letter grows down the page.
  useEffect(() => {
    if (!autoRef.current || shown === 0) return;
    const el = letterRef.current?.querySelector(`[data-phrase="${shown - 1}"]`);
    if (!el) return;
    const { bottom } = el.getBoundingClientRect();
    if (bottom > window.innerHeight * 0.82) {
      window.scrollBy({ top: bottom - window.innerHeight * 0.6, behavior: 'smooth' });
    }
  }, [shown]);

  // Tap the letter to reveal it all at once.
  const revealAll = () => {
    if (done) return;
    autoRef.current = false;
    setShown(total);
  };

  // ── Beat 1 & 2: the envelope ──
  if (phase !== 'reading') {
    const open = phase === 'opening';
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
        <div className={`flex flex-col items-center ${leaving ? 'envelope-away' : ''}`}>
          {/* Fades away as the flap and letter rise up into its space */}
          <div className={`transition-opacity duration-500 ${open ? 'opacity-0' : ''}`}>
            <p className="cine-rise mb-3 font-sans text-xs uppercase tracking-[0.35em] text-blush/80 sm:text-sm">
              psst… u've got mail 💌
            </p>
            <CineText
              as="h2"
              text="a lil letter, sealed with luv"
              delay={0.3}
              className="text-glow-rose mb-12 font-serif text-[1.55rem] font-semibold text-ivory sm:text-4xl"
            />
          </div>

          <button
            type="button"
            onClick={openEnvelope}
            aria-label="Open the letter"
            className={`envelope cine-rise ${open ? 'envelope--open' : ''}`}
            style={{ animationDelay: '0.9s' }}
          >
            <span className="envelope__back" />
            <span className="envelope__letter flex items-start justify-center pt-4">
              <span className="font-script text-2xl text-[#b0485f]">for u 💛</span>
            </span>
            <span className="envelope__pocket" />
            <span className="envelope__flap" />
            <span className={`envelope__seal ${open ? '' : 'animate-heartbeat'}`}>♥</span>
            <span className="absolute bottom-[12%] left-0 right-0 z-[6] font-script text-xl text-plum/80 sm:text-2xl">
              to: my aeshuuu 💛
            </span>
          </button>

          <p
            className={`cine-rise mt-8 font-script text-xl text-blush transition-opacity duration-500 sm:text-2xl ${
              open ? 'opacity-0' : ''
            }`}
            style={{ animationDelay: '1.5s' }}
          >
            tap the seal to open it 👆
          </p>
        </div>
      </section>
    );
  }

  // ── Beat 3: the letter writes itself ──
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl">
        {/* Rose divider (top) */}
        <div className="cine-rise mb-7 flex items-center justify-center gap-3 text-blush sm:mb-8">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-blush/60 sm:w-16" />
          <span className="text-2xl">🌹</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-blush/60 sm:w-16" />
        </div>

        <CineText
          as="h2"
          text="to the most important person in my lyf 💛"
          delay={0.2}
          className="text-glow-rose mb-7 font-serif text-[1.55rem] font-semibold text-ivory sm:mb-8 sm:text-4xl"
        />

        {/* The letter itself — on a soft sheet of glass */}
        <div
          ref={letterRef}
          onClick={revealAll}
          className={`cine-rise rounded-2xl border border-blush/15 bg-white/[0.04] px-5 py-6 text-left backdrop-blur-sm sm:px-9 sm:py-8 ${
            done ? '' : 'cursor-pointer'
          }`}
          style={{ animationDelay: '0.6s' }}
        >
          {/* Only what's been "written" so far — the sheet grows as it writes */}
          {paragraphs
            .filter((para) => para[0].i < shown)
            .map((para) => (
              <p
                key={para[0].i}
                className="mb-4 font-serif text-lg italic leading-relaxed text-cream last:mb-0 sm:text-xl sm:leading-loose"
              >
                {para
                  .filter(({ i }) => i < shown)
                  .map(({ text, i }) => (
                    <span key={i} data-phrase={i} className="ink-in">
                      {text}
                    </span>
                  ))}
              </p>
            ))}
          {shown === 0 && <span className="type-caret">|</span>}
        </div>

        {/* Tiny hint while it writes itself */}
        <p
          className={`mt-4 font-sans text-xs text-cream/40 transition-opacity duration-500 ${
            done ? 'opacity-0' : 'opacity-100'
          }`}
        >
          (tap the letter to read it all at once 👆)
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
            foreverrr urs 💛
          </p>

          <button
            onClick={onNext}
            tabIndex={done ? 0 : -1}
            className="animate-soft-glow mt-9 rounded-full border border-blush/40 bg-blush/10 px-7 py-3 font-sans text-base font-semibold tracking-wide text-blush transition-transform duration-300 hover:scale-105 hover:bg-blush/20 active:scale-95 sm:mt-10"
          >
            there's sooo much more in my heart →
          </button>
        </div>
      </div>
    </section>
  );
}
