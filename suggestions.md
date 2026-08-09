# 💛 Aeshu Birthday Site — Improvement Plan

A prioritized roadmap to make the surprise more romantic, more personal, and
unforgettable. Work top-to-bottom: **Phase 1 is mandatory**, everything after
that makes it progressively more magical.

---

## Phase 1 — Must-fix before she ever sees it 🚨

These are bugs / missing content that would break the experience.

### 1.1 Set her real birthday date
- **File:** `src/components/CountdownScreen.jsx` (line 6)
- **Problem:** `BIRTHDAY_DATE` is `2025-12-25` — already in the past, so the
  countdown screen vanishes instantly and she never sees it.
- **Fix:** Set it to her actual birthday at midnight, e.g.
  `new Date('2026-MM-DDT00:00:00')`.
- **Pro move:** Send her the link the night before. She watches the timer hit
  zero and the site *unlocks itself* at 12:00 AM. That moment alone is a gift.

### 1.2 Add real photos
- **Folder:** `public/photos/` — currently **empty**, so every polaroid shows
  the "Photo coming soon 🌹" placeholder and the finale has no background.
- **Fix:** Add 6–10 of your best photos, then list them in `src/photos.js`.
- **Caption tip:** Name the exact moment — place, date, inside joke.
  "Udaipur · the day you laughed till you cried" beats "beautiful memory".

### 1.3 Repair the typewriter effect on the love letter
- **File:** `src/components/MessageScreen.jsx`
- **Problem:** The typing animation (lines 22–45) is commented out, and line 75
  renders the whole message at once — yet the blinking caret and the
  "(tap to read it all at once)" hint still appear, and the
  "There's more in my heart →" button stays hidden until she taps the text.
- **Fix:** Restore the effect and render `MESSAGE.slice(0, shown)` instead of
  `MESSAGE`, so the letter slowly types itself out. This is one of the most
  romantic beats of the whole site — it must work.
- Also trim the trailing blank lines at the end of `MESSAGE`.

### 1.4 Rewrite the "Reasons I Love You"
- **File:** `src/reasons.js` — still the generic template text.
- **Fix:** Write 7–10 reasons in *your own voice*, mixing in Gujarati like your
  letter does. Tiny, specific, everyday things melt hearts — not poetry.

### 1.5 Record a voice note
- **File:** `src/finale.js` → `voiceNote` is `''` (disabled).
- **Fix:** Record ~30 seconds on your phone ("Happy Birthday Aeshu…"), save as
  `public/audio/voice-note.mp3`, set the path in `finale.js`.
- Hearing your real voice over her favourite photo at the finale will hit
  harder than anything on screen.

---

## Phase 2 — High-impact surprises ✨

The three additions that turn a beautiful website into an *experience*.

### 2.1 Blow out the candles with her real breath 🎤
- **Screen:** Celebration
- **Idea:** Use the phone microphone (Web Audio API) to detect her blowing into
  the phone — the flames flicker and go out, smoke rises.
- Keep the "Blow the Candles 🕯️" button as a fallback (mic permission denied,
  desktop, etc.).
- This is the kind of surprise people remember forever.

### 2.2 Background music 🎵
- **Idea:** Her favourite song (or a soft instrumental) starts when she blows
  the candles — browsers block autoplay, so tying playback to that first tap
  is the perfect trigger.
- Add a tiny 🔇/🔊 toggle fixed in a corner across all screens.
- **File to add:** `public/audio/song.mp3` + a small `MusicPlayer` component.

### 2.3 A locked entry gate 🔐
- **Screen:** New, shown *before* the countdown.
- **Idea:** A playful question only she can answer — "What date did we first
  talk?" or a pet name. Wrong answers get a teasing hint, never a harsh error.
- Makes the site feel like it was built *only for her* — and keeps it private
  if anyone else stumbles on the link.

---

## Phase 3 — Nice-to-have romance 💐

Add as many as time allows, in this order.

### 3.1 "Our Story" timeline screen
- Between the gallery and the letter: 4–5 milestones with dates —
  "The day we first talked", "First trip", "Almost one year of us…".
- Your letter already references these moments; this screen makes them visual.

### 3.2 Love coupons / promises 🎟️
- After the reasons (or on the finale): tappable "scratch cards" she can
  redeem — one breakfast in bed, one movie night of her choice, one
  no-questions-asked wish.

### 3.3 Fireworks on the finale 🎆
- Replace / accompany the one-time confetti burst with looping CSS fireworks
  over the full-screen photo.

### 3.4 "How well do you know us?" mini-quiz
- 3–4 sweet questions; every answer leads somewhere loving
  ("Wrong — but you're still perfect 💛").

---

## Phase 4 — Delivery day 🚀

1. **Test on her phone size first** — she will almost certainly open it on
   mobile. Check every screen at ~390px width.
2. **Deploy:** `npm run deploy` → GitHub Pages (see README). Verify photos and
   audio load on the *live* URL, not just `npm run dev`.
3. **Consider the repo name** — the URL contains `aeshu_birthday`; that's a
   sweet touch, keep it.
4. **Print a QR code** of the live URL inside her birthday card — scanning a
   mystery code beats being sent a link.
5. **Dry-run the whole flow once** end-to-end the night before: countdown →
   candles → photos → letter → reasons → finale → voice note.

---

## Content checklist (only you can do these) ✍️

- [ ] Her real birthday date in `CountdownScreen.jsx`
- [ ] 6–10 photos in `public/photos/` + captions in `src/photos.js`
- [ ] Personal reasons in `src/reasons.js`
- [ ] Voice note in `public/audio/voice-note.mp3` + path in `src/finale.js`
- [ ] Favourite photo chosen for the finale in `src/finale.js`
- [ ] (Phase 2) Her favourite song as `public/audio/song.mp3`
- [ ] (Phase 2) The secret question + answer for the entry gate
- [ ] Auto-message: her date in the workflow `cron:`, her email & number as
      GitHub Secrets, and a test run to yourself — see `NOTIFICATIONS_SETUP.md`

> The code can be perfect — but the photos, your words, and your voice are
> what will actually make her fall for you all over again. 💛
