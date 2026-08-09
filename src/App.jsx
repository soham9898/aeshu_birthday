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
//    • src/coupons.js                     → your promise coupons 🎟️
//    • src/finale.js                      → final photo + optional voice note
//
//  HOW TO ADD YOUR PHOTOS:
//    1. Create the folder: aeshu_birthday/public/photos/
//    2. Copy your .jpg / .png / .webp photos into that folder
//    3. Open src/photos.js and add each photo following the format shown
//    4. Run `npm run dev` to preview, `npm run deploy` to go live
//
//  SCREEN FLOW:
//    Secret Gate → Countdown → Celebration → Photo Gallery
//               → Message → Reasons I Love You
//               → Promise Coupons → Grand Finale
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { GATE_ENABLED } from './gate.js';
import FloatingHearts from './components/FloatingHearts.jsx';
import MusicToggle from './components/MusicPlayer.jsx';
import GateScreen from './components/GateScreen.jsx';
import CountdownScreen from './components/CountdownScreen.jsx';
import CelebrationScreen from './components/CelebrationScreen.jsx';
import PhotoGalleryScreen from './components/PhotoGalleryScreen.jsx';
import MessageScreen from './components/MessageScreen.jsx';
import ReasonsScreen from './components/ReasonsScreen.jsx';
import CouponsScreen from './components/CouponsScreen.jsx';
import FinaleScreen from './components/FinaleScreen.jsx';

// Her name, gently sprinkled among the floating hearts.
// (Kept as a stable constant so the hearts never jump between screens.)
const HEART_NAMES = ['Aeshu'];

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

export default function App() {
  const [screen, setScreen] = useState(firstScreen);
  const [visible, setVisible] = useState(true);

  // Fade the current screen out, swap it, then fade the next one in (0.8s).
  const goTo = useCallback((next) => {
    setVisible(false);
    setTimeout(() => {
      setScreen(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
      setVisible(true);
    }, 800);
  }, []);

  return (
    <main className="relative min-h-screen w-full">
      {/* Floating hearts live behind every screen so they never stop */}
      <FloatingHearts count={18} names={HEART_NAMES} />

      {/* 🔊/🔇 corner button — appears once her song starts playing */}
      <MusicToggle />

      {/* Screen transition wrapper (opacity + gentle vertical shift) */}
      <div
        className={`relative z-10 transition-all duration-[800ms] ease-in-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
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
          <ReasonsScreen onNext={() => goTo('coupons')} />
        )}
        {screen === 'coupons' && (
          <CouponsScreen onNext={() => goTo('finale')} />
        )}
        {screen === 'finale' && (
          <FinaleScreen onReplay={() => goTo('celebration')} />
        )}
      </div>
    </main>
  );
}
