// ═══════════════════════════════════════════════════════════════
//  Aeshu Birthday Site — main app
//
//  THE FILES YOU CAN EDIT (all beginner-friendly, clearly commented):
//    • src/gate.js                        → the secret entry question 🔐
//    • src/components/CountdownScreen.jsx → set the birthday date
//    • src/music.js                       → her song 🎵 (public/audio/song.mp3)
//    • src/photos.js                      → add your photos (+ captions/dates)
//    • src/components/MessageScreen.jsx   → write your love letter
//    • src/reasons.js                     → your "reasons I love you" list
//    • src/vows.js                        → my promises: the saat vachan / 7 pheras 🔥
//    • src/gift.js                        → where her REAL gift is hiding 🎁
//    • src/finale.js                     → final photo + optional voice note
//    • CHAPTERS (below)                   → the movie-style title cards 🎬
//
//  HOW TO ADD YOUR PHOTOS:
//    1. Create the folder: aeshu_birthday/public/photos/
//    2. Copy your .jpg / .png / .webp photos into that folder
//    3. Open src/photos.js and add each photo following the format shown
//    4. Run `npm run dev` to preview, `npm run deploy` to go live
//
//  SCREEN FLOW:
//    Opening titles → Secret Gate → Countdown → Celebration
//               → Photo Gallery → Message → Reasons I Love You
//               → My Promises (Saat Vachan) → One Lil Secret (gift)
//               → Grand Finale
//
//  Between every scene: the screen blurs out, cinema bars slide
//  in, a chapter title card holds for a heartbeat, and the next
//  scene drifts back into focus. 🎬
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useEffect, useRef } from 'react';
import { GATE_ENABLED } from './gate.js';
import FloatingHearts from './components/FloatingHearts.jsx';
import MusicToggle from './components/MusicPlayer.jsx';
import ChapterCard from './components/ChapterCard.jsx';
import GateScreen from './components/GateScreen.jsx';
import CountdownScreen, { birthdayHasArrived } from './components/CountdownScreen.jsx';
import CelebrationScreen from './components/CelebrationScreen.jsx';
import PhotoGalleryScreen from './components/PhotoGalleryScreen.jsx';
import MessageScreen from './components/MessageScreen.jsx';
import ReasonsScreen from './components/ReasonsScreen.jsx';
import PromisesScreen from './components/PromisesScreen.jsx';
import GiftRevealScreen from './components/GiftRevealScreen.jsx';
import FinaleScreen from './components/FinaleScreen.jsx';

// Her name, gently sprinkled among the floating hearts.
// (Kept as a stable constant so the hearts never jump between screens.)
const HEART_NAMES = ['Aeshu'];

// 🎬 The opening titles, shown once when the site first loads.
const OPENING = {
  kicker: 'soham presents…',
  title: 'a lil love story ✨',
  note: 'starring: aeshuuu 💛',
  duration: 4200,
};

// 🎬 The chapter card shown right before each scene.
// (Leave a screen out to jump into it without a card.)
const CHAPTERS = {
  countdown: { kicker: 'chapter 1', title: 'the wait ⏳' },
  celebration: { kicker: 'chapter 2', title: 'make a wish, bby 🎂' },
  gallery: { kicker: 'chapter 3', title: 'our lil memories 📸' },
  message: { kicker: 'chapter 4', title: 'a letter, just for u 💌' },
  reasons: { kicker: 'chapter 5', title: 'why u? bcoz… 💛' },
  promises: { kicker: 'chapter 6', title: 'my promises to u 💍' },
  gift: { kicker: 'chapter 7', title: 'one lil secret 🤫' },
  finale: { kicker: 'the finale', title: 'forever starts now ✨' },
};

const CARD_MS = 2600; // how long a chapter card holds
const EXIT_MS = 900; // the old scene blurring away
const ENTER_MS = 1400; // the new scene drifting into focus

// Where the experience begins: the secret gate — unless it's disabled,
// or she already answered it this visit (so a refresh doesn't re-ask).
function firstScreen() {
  if (!GATE_ENABLED) return 'countdown';
  try {
    return sessionStorage.getItem('aeshu_unlocked') === '1' ? 'countdown' : 'gate';
  } catch {
    return 'gate';
  }
}

// Once her birthday has arrived the countdown has nothing left to
// count, so we glide straight on to the celebration instead.
function resolve(next) {
  return next === 'countdown' && birthdayHasArrived() ? 'celebration' : next;
}

export default function App() {
  const [screen, setScreen] = useState(null);
  const [card, setCard] = useState(OPENING);
  // 'card' → title card showing · 'enter' → scene focusing in
  // 'idle' → scene playing        · 'exit'  → scene blurring out
  const [phase, setPhase] = useState('card');

  const pending = useRef(resolve(firstScreen()));
  const busy = useRef(true);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Drop the title card and bring the waiting scene into focus.
  const reveal = useCallback(() => {
    clearTimers();
    setCard(null);
    setScreen(pending.current);
    window.scrollTo({ top: 0, behavior: 'auto' });
    setPhase('enter');
    busy.current = false;
    later(() => setPhase('idle'), ENTER_MS);
  }, []);

  // Opening titles hold for a moment, then the first scene begins.
  useEffect(() => {
    later(reveal, OPENING.duration);
    return clearTimers;
  }, [reveal]);

  // Blur the current scene out → chapter card → reveal the next one.
  const goTo = useCallback(
    (next) => {
      if (busy.current) return;
      busy.current = true;
      clearTimers();
      pending.current = resolve(next);
      setPhase('exit');
      later(() => {
        const chapter = CHAPTERS[pending.current];
        setScreen(null);
        setCard(chapter ? { ...chapter, duration: CARD_MS } : null);
        setPhase('card');
        later(reveal, chapter ? CARD_MS : 250);
      }, EXIT_MS);
    },
    [reveal]
  );

  const barsOn = phase === 'card' || phase === 'exit';
  const sceneClass =
    phase === 'enter' ? 'scene-enter' : phase === 'exit' ? 'scene-exit' : '';

  return (
    <main className="relative min-h-screen w-full">
      {/* Floating hearts live behind every screen so they never stop */}
      <FloatingHearts count={18} names={HEART_NAMES} />

      {/* 🎬 Film look: edge vignette, grain, and cinema bars */}
      <div className="cine-vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
      <div
        className={`letterbox letterbox--top ${barsOn ? 'letterbox--on' : ''}`}
        aria-hidden="true"
      />
      <div
        className={`letterbox letterbox--bottom ${barsOn ? 'letterbox--on' : ''}`}
        aria-hidden="true"
      />

      {/* Chapter title card between scenes (tap to skip) */}
      {card && <ChapterCard {...card} onSkip={reveal} />}

      {/* 🔊/🔇 corner button — appears once her song starts playing */}
      <MusicToggle />

      {/* The current scene */}
      <div className={`relative z-10 ${sceneClass}`}>
        {screen === 'gate' && (
          <GateScreen onUnlock={() => goTo('countdown')} />
        )}
        {screen === 'countdown' && (
          <CountdownScreen onComplete={() => goTo('celebration')} />
        )}
        {screen === 'celebration' && (
          <CelebrationScreen onNext={() => goTo('gallery')} />
        )}
        {screen === 'gallery' && (
          <PhotoGalleryScreen onNext={() => goTo('message')} />
        )}
        {screen === 'message' && (
          <MessageScreen onNext={() => goTo('reasons')} />
        )}
        {screen === 'reasons' && (
          <ReasonsScreen onNext={() => goTo('promises')} />
        )}
        {screen === 'promises' && (
          <PromisesScreen onNext={() => goTo('gift')} />
        )}
        {screen === 'gift' && (
          <GiftRevealScreen onNext={() => goTo('finale')} />
        )}
        {screen === 'finale' && (
          <FinaleScreen onReplay={() => goTo('celebration')} />
        )}
      </div>
    </main>
  );
}
