# Aeshu Birthday Site 💛

A beautiful, minimal, deeply romantic single-page birthday website — built with
**Vite + React + Tailwind CSS**. No backend, fully static, ready for GitHub Pages.

The experience plays like a little movie 🎬 — opening titles ("soham presents…"),
film grain, cinema bars, and a chapter title card before every scene. It flows
through nine full-screen moments:

1. **Secret Gate** 🔐 – a playful question only she can answer unlocks the site.
2. **Countdown** – a live timer ticking down to the birthday; the final ten
   seconds take over the screen with giant numbers and a heartbeat.
3. **Celebration** – lights off, only the candles glowing… a decorated animated
   cake — and she can **blow
   the candles out with her real breath** 🎤 (the mic listens; tapping works too).
   The room lights up with a flash, the big "Happy Birthday" lands, confetti rains.
   Her favourite song starts playing here and loops softly through every screen.
4. **Photo Gallery** – your memories as a deck of polaroids; each one waits behind
   a blur until she taps to reveal it (it "develops" like a real polaroid), and the
   next tap lifts it away to the next memory.
5. **Personal Message** – a sealed envelope she opens herself; then your love letter
   writes itself out, phrase by phrase, in elegant italics.
6. **Reasons I Love You** – reasons she reveals one by one, straight from your heart.
7. **My Promises** 💍 – a sacred fire appears and she takes the **7 pheras** with
   you, one tap at a time, revealing the saat vachan (wedding vows) one by one.
   Then a big heart she **presses and holds** 💓 — her phone buzzes in a lub-dub
   heartbeat that races faster the longer she holds (Android only; iPhones just
   see the pulse).
8. **One Lil Secret** 🎁 – a golden **scratch card** she rubs with her finger;
   underneath is where her **real gift** is hiding in the real world.
9. **Grand Finale** – a full-screen favourite photo with a slow zoom, fireworks, a
   confetti burst, rolling end credits, an optional voice note, and "Replay our day".

---

## ✏️ The files you can edit (all clearly commented)

| What | File |
| --- | --- |
| The secret gate question 🔐 | `src/gate.js` (question, accepted answers, teasing hints) |
| The birthday date | `src/components/CountdownScreen.jsx` → `BIRTHDAY_DATE` |
| Her song 🎵 | drop `public/audio/song.mp3` (volume in `src/music.js`) |
| Your photos (+ captions, places & dates) | `src/photos.js` (+ drop images in `public/photos/`) |
| Your love letter | `src/components/MessageScreen.jsx` → `MESSAGE` |
| "Reasons I love you" | `src/reasons.js` |
| My promises — the 7 pheras / saat vachan 🔥 | `src/vows.js` |
| Where her real gift is hiding 🎁 | `src/gift.js` (clue, note, optional hint photo) |
| Chapter title cards 🎬 | `src/App.jsx` → `OPENING` / `CHAPTERS` |
| Final photo + voice note | `src/finale.js` (+ optional audio in `public/audio/`) |

### The background music

Copy her favourite song to `public/audio/song.mp3` — that's all. It begins
(with a soft fade-in) the moment she taps a candle button, loops through every
screen, and a 🔊/🔇 toggle appears in the corner. If the file is missing the
site simply runs without music.

### Blowing the candles for real 🎤

On the celebration screen she can tap **"Blow into your phone — for real 🎤"**,
allow the microphone, and blow — the candles go out one by one as she blows.
If she denies the mic (or it fails), the classic tap button still works.
Note: the microphone needs **HTTPS** (GitHub Pages is HTTPS, and `npm run dev`
on localhost also counts as secure — so both are fine).

### Adding photos

1. Copy your images into `public/photos/` (e.g. `photo1.jpg`).
2. List each one in `src/photos.js`:
   ```js
   { src: '/aeshu_birthday/photos/photo1.jpg', caption: 'The day we met 💛', date: 'Goa · Dec 2023' }
   ```
   Paths **must** start with `/aeshu_birthday/photos/`. `date` is optional.

### Adding your voice note (optional)

1. Record yourself, save as `.mp3`, and copy it to `public/audio/voice-note.mp3`.
2. In `src/finale.js` set `voiceNote = '/aeshu_birthday/audio/voice-note.mp3'`.
   (Leave it `''` to hide the play button.)

---

## 🚀 Run it

```bash
npm install      # install dependencies (first time only)
npm run dev      # preview locally at the URL it prints
```

## 💌 Automatic delivery (email + SMS, 1 hour before her birthday)

The repo includes a GitHub Actions workflow
(`.github/workflows/birthday-surprise.yml`) that automatically sends her
the website link by **email** and **SMS** at ~11 PM the night before —
one hour before her day begins. Her email, number, and your credentials
are stored as private **GitHub Secrets**, never in the code.

👉 Follow the step-by-step guide in **`NOTIFICATIONS_SETUP.md`**
(set the date, add the secrets, and send a test to yourself first).

## 🌐 Deploy to GitHub Pages

1. Create a GitHub repo named **`aeshu_birthday`** and push this project to it.
   (If you name the repo something else, update `base` in `vite.config.js`
   and the paths in `src/photos.js` to match.)
2. Deploy:
   ```bash
   npm run deploy   # builds and publishes to the gh-pages branch
   ```
3. In your repo: **Settings → Pages → Branch: `gh-pages` / root**, then save.
4. Your site goes live at:
   `https://<your-github-username>.github.io/aeshu_birthday/`

---

Made with love. 💛
