// ─────────────────────────────────────────────────────
// SECRET ENTRY GATE settings 🔐
//
// Before anything else, the site asks one playful question
// that only Aeshu can answer. It makes the site feel like it
// was built ONLY for her — and keeps it private if anyone
// else ever stumbles on the link.
//
// The question + answers:
//   • GATE_QUESTION : the question she sees.
//   • GATE_ANSWERS  : every answer you'll accept. Checking is
//     forgiving — lowercase, spaces and punctuation are ignored,
//     so 'Aeshu!', 'aeshu' and ' AESHU ' all match 'aeshu'.
//     Add as many variations as you can think of.
//   • GATE_HINTS    : teasing hints shown after wrong tries
//     (they rotate in order — never a harsh error).
//
// Set GATE_ENABLED = false to skip the gate entirely.
// ─────────────────────────────────────────────────────

export const GATE_ENABLED = true;

export const GATE_QUESTION = 'when did we first talk? 📅💛';

// 1 May 2026, every way she might write it. Spaces and punctuation
// are ignored, so '01/05/2026' is checked as '01052026'.
export const GATE_ANSWERS = [
  // words: 1 may 2026 · 1st may · may 1st, 2026 · first of may…
  '1may', '01may', '1stmay', '1ofmay', '1stofmay', 'firstmay', 'firstofmay',
  'may1', 'may01', 'may1st', 'mayfirst',
  '1may2026', '01may2026', '1stmay2026', '1stofmay2026', 'firstmay2026', 'firstofmay2026',
  'may12026', 'may012026', 'may1st2026',
  '1may26', '01may26', '1stmay26', 'may1st26',
  // numbers, day first: 1/5 · 01/05 · 1-5-2026 · 01.05.26…
  '15', '105', '015', '0105',
  '152026', '1052026', '0152026', '01052026',
  '1526', '10526', '01526', '010526',
  // numbers, month first or year first: 5/1/2026 · 2026-05-01
  '512026', '05012026', '20260501', '202651',
];

export const GATE_HINTS = [
  'hmm nope… try again my luv 💭',
  'uh-ohh 🙈 think back… the very first day we talked 💛 (any format works, like 12 march)',
  'okayy okayy hint: summer 2026, right in mango season 🥭😉',
];
