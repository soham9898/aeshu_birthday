# 🚧 Blockers — finish these before the site goes live

_Audit: 8 Oct 2026. Updated: 10 Oct 2026._ The build passes
(`npm run build` ✅). The site is **not deployed yet**: there's no `gh-pages`
branch, and `https://soham9898.github.io/aeshu_birthday/` returns 404.

**Already done ✅:** 24 gallery photos + the finale photo, the love letter,
the 7 pheras / saat vachan, the letter animation, the quiz screen, the gate,
the candles, the fireworks, and the end credits.

Work top to bottom. 🔴 means the site is wrong or broken without it.

---

## 🔴 1. Must fix (the site is wrong without these)

- [x] **Set the real birthday date.** `BIRTHDAY_DATE` is now
      `2027-01-18T00:00:00` (`src/components/CountdownScreen.jsx:7`).
- [x] **The gate gives away its own answer.** The new question is _"when did
      we first talk? 📅💛"_ and the answer is **1 May 2026**. It accepts every
      common format: `1 may`, `1st May 2026`, `may 1st`, `01/05/2026`, `1-5-26`,
      `5/1/2026`, `2026-05-01`… (`src/gate.js`).
- [ ] ⏳ **PENDING: add her song.** Copy the mp3 to `public/audio/song.mp3`
      (exactly that name). Until then the site plays no music.
- [x] **Gift clue confirmed:** `'check under ur pillow 🛏️'` (`src/gift.js`).
- [x] **Quiz answers confirmed.** Q1, the first date, is now _taksh galaxy
      mall 🛍️_. Q2, who said "i luv u" first, is Soham.

## 🟡 2. Content only you can finalize

- [ ] ⏳ **PENDING: voice note.** Record ~30 s, save it as
      `public/audio/voice-note.mp3`, then set `src/finale.js:28` to
      `'/aeshu_birthday/audio/voice-note.mp3'`.
- [x] **Reasons I love you.** Kept the 5 as they are.
- [x] **Letter proofread.** Fixed `khuch che → khush chu`,
      `sav this → sav thi`, `Hame → Have`, `ana krta → ena krta`,
      `kris → karis`, and removed the repeated _"maari saathe rehjo"_.
- [x] The two lines under the cake and the heartbeat line are kept.
- [x] Gift hint photo skipped (`GIFT_PHOTO = ''`).

## 🔒 3. Privacy

- [x] **Decided: (a) accept it.** The repo stays public and uses free GitHub
      Pages. The photos, the letter, the gate answer and the gift clue are all
      visible to anyone who browses the repo.

## 🚀 4. Deploy

- [x] Committed the deletion of `suggestions.md` and pushed.
- [x] Deleted `public/audio/README.txt` and `public/photos/README.txt`.
- [ ] Add the song (and the voice note), then run `npm run deploy`. It builds
      the site and creates the `gh-pages` branch.
- [ ] On GitHub, go to **Settings → Pages → Deploy from branch → `gh-pages` /
      root** and save.
- [ ] Open `https://soham9898.github.io/aeshu_birthday/` and check that the
      photos, the finale photo, the song and the voice note load on the
      **live** URL, not just `npm run dev`.

## 💌 5. Auto email + SMS

- [x] **Dropped.** Removed the workflow and its README section.
      **You'll send her the link yourself at midnight** (see 7).

## 📱 6. Final dry run (on an Android phone like hers)

- [ ] Temporarily set `BIRTHDAY_DATE` to 2–3 minutes from now and watch the
      countdown, the last 10 seconds and the switch to the celebration. Then
      **set it back to `2027-01-18T00:00:00`** and redeploy.
- [ ] Do the whole flow once on the **live URL** on a phone (~390 px wide):
      gate (type `1 may`) → countdown → blow the candles (allow the mic) →
      song starts → gallery → quiz → letter → reasons → 7 pheras + heartbeat
      hold (it should vibrate) → scratch card → finale + voice note →
      "Replay our day".
- [ ] Open the link in a fresh incognito tab and check that the gate appears.
      An unlock is remembered for that tab only.
- [ ] Send the link to yourself on WhatsApp and check how the preview looks
      (title _"happyyy birthday aeshuuu 💛"_, no preview image).

## 🎁 7. The night itself (17 → 18 Jan)

- [ ] Gift physically hidden **under her pillow** before midnight.
- [ ] Phone charged, and the link ready to send her by hand. With no
      auto email/SMS, this is how she gets it.
- [ ] _(Optional)_ A QR code of the live URL inside her birthday card.
