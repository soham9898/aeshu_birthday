// ─────────────────────────────────────────────────────
// BACKGROUND MUSIC settings 🎵
//
// A song that starts playing the moment she interacts with
// the candles (browsers only allow sound after a tap, so the
// candle moment is the perfect trigger). It keeps looping
// softly through every screen, with a 🔊/🔇 toggle in the
// corner.
//
// HOW TO ADD YOUR SONG:
//   1. Pick her favourite song (or a soft romantic instrumental).
//   2. Save it as an .mp3 and copy it to:  public/audio/song.mp3
//   3. That's it — the path below already points there.
//
// If the file is missing, the site simply plays without music
// (no errors, no broken buttons).
// ─────────────────────────────────────────────────────

export const MUSIC_SRC = '/aeshu_birthday/audio/song.mp3';

// Volume from 0 (silent) to 1 (full). Keep it soft & dreamy.
export const MUSIC_VOLUME = 0.45;
