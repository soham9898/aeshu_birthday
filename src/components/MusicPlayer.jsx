import { useState, useEffect } from 'react';
import { MUSIC_SRC, MUSIC_VOLUME } from '../music.js';

// ─────────────────────────────────────────────────────
// Background music, shared across every screen.
//
//   • startMusic()  — called from CelebrationScreen the moment
//     the candles go out. Safe to call many times; only the
//     first call starts playback. The song fades in gently
//     and loops forever.
//   • primeMusic()  — call it inside a tap when the song should
//     start a lil LATER (e.g. once the mic hears her blow).
//     Browsers only allow sound that a tap started, so this
//     quietly warms the song up without making a sound.
//   • <MusicToggle /> — a small 🔊/🔇 button fixed in the
//     corner (rendered once in App). It stays hidden until
//     the music actually starts, and disappears entirely if
//     public/audio/song.mp3 is missing.
//
// The audio element lives at module level (not React state)
// so the song never restarts when screens change.
// ─────────────────────────────────────────────────────

let audio = null;
let fadeTimer = null;

const state = { started: false, playing: false, failed: false };
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn({ ...state }));

function fail() {
  clearInterval(fadeTimer);
  state.failed = true;
  state.playing = false;
  emit();
}

function createAudio() {
  if (audio || !MUSIC_SRC) return audio;
  audio = new Audio(MUSIC_SRC);
  audio.loop = true;
  audio.volume = 0;
  // Missing / unplayable file → give up quietly (toggle stays hidden).
  audio.addEventListener('error', fail);
  return audio;
}

export function primeMusic() {
  if (state.started || !createAudio()) return;
  audio.muted = true; // iPhones ignore volume, so mute for the warm-up
  audio
    .play()
    .then(() => {
      if (!state.started) audio.pause();
    })
    .catch(() => {});
}

export function startMusic() {
  if (state.started || !createAudio()) return;
  state.started = true;

  audio.muted = false;
  audio.volume = 0;
  audio
    .play()
    .then(() => {
      state.playing = true;
      emit();
      // Fade in softly over ~2 seconds instead of blasting at once.
      const step = MUSIC_VOLUME / 20;
      fadeTimer = setInterval(() => {
        if (!audio) return clearInterval(fadeTimer);
        audio.volume = Math.min(MUSIC_VOLUME, audio.volume + step);
        if (audio.volume >= MUSIC_VOLUME) clearInterval(fadeTimer);
      }, 100);
    })
    .catch(fail);

  emit();
}

export default function MusicToggle() {
  const [snap, setSnap] = useState({ ...state });

  useEffect(() => {
    listeners.add(setSnap);
    setSnap({ ...state }); // catch up in case music started before mount
    return () => listeners.delete(setSnap);
  }, []);

  if (!snap.started || snap.failed) return null;

  const toggle = () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      state.playing = true;
    } else {
      audio.pause();
      state.playing = false;
    }
    emit();
  };

  return (
    <button
      onClick={toggle}
      aria-label={snap.playing ? 'Pause the music' : 'Play the music'}
      title={snap.playing ? 'Pause the music' : 'Play the music'}
      className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-plum/70 text-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95"
    >
      {snap.playing ? '🔊' : '🔇'}
    </button>
  );
}
