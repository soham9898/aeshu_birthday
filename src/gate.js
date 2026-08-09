// ─────────────────────────────────────────────────────
// SECRET ENTRY GATE settings 🔐
//
// Before anything else, the site asks one playful question
// that only Aeshu can answer. It makes the site feel like it
// was built ONLY for her — and keeps it private if anyone
// else ever stumbles on the link.
//
// TODO: Personalise the question + answers below!
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

export const GATE_QUESTION = 'What does Soham lovingly call you? 💛';

export const GATE_ANSWERS = ['aeshu', 'aeshuu', 'aeshuuu'];

export const GATE_HINTS = [
  'Hmm… try again, my love 💭',
  'You know this one! Think of how I call you 💛',
  'Okay okay — it starts with "Ae…" 😉',
];
