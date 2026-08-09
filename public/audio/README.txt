Two audio files can live in THIS folder (both optional). 💛

── 1. HER SONG (background music) 🎵 ──────────────────────
1. Pick her favourite song, or a soft romantic instrumental.
2. Save it as an .mp3 and copy it here with EXACTLY this name:
     public/audio/song.mp3

That's it — it starts playing (with a gentle fade-in) the moment she
interacts with the birthday candles, loops softly through every screen,
and gets a 🔊/🔇 toggle in the corner. Volume lives in src/music.js.
If the file is missing, the site simply plays without music.

── 2. YOUR VOICE NOTE (grand finale) 🎙️ ───────────────────
1. Record yourself saying "happy birthday" (your phone's voice recorder is perfect).
2. Save/export it as an .mp3 (or .m4a) and copy it here, e.g.:
     public/audio/voice-note.mp3

3. Then open  src/finale.js  and set:
     export const voiceNote = '/aeshu_birthday/audio/voice-note.mp3';

Notes:
- Paths in the config files MUST start with  /aeshu_birthday/audio/
- Leave voiceNote as ''  (empty) in src/finale.js to hide the play button.
- The voice note never autoplays — she taps "Play my voice 💛" at the end.

(You can delete this README.txt once you've added your audio files.)
