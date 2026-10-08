// ─────────────────────────────────────────────────────
// "HOW WELL DO U KNOW US?" — the mini-quiz 🤓💛
//
// Right after the photo gallery she gets a lil pop quiz about
// the two of you, one question at a time:
//   • right answer → it glows gold, hearts pop, a happy line
//   • wrong answer → the right one glows, n a sweet line —
//     never a "fail". Every answer leads somewhere loving.
// At the end she sees her score + a loving verdict.
//
// TODO: Replace the sample questions below with your own!
//   • question : what you ask her
//   • options  : 2–4 answers for her to pick from
//   • answer   : which option is right, counted from 0
//                (0 = 1st option, 1 = 2nd, 2 = 3rd, 3 = 4th)
//   • right    : (optional) the line she sees if she gets it right
//   • wrong    : (optional) the line she sees if she gets it wrong
//     Leave right / wrong out and a random line from
//     RIGHT_REACTIONS / WRONG_REACTIONS (below) is used instead.
//
// 3–5 questions is the sweet spot. To skip the quiz entirely,
// delete them all, leaving:  const quiz = [];
// ─────────────────────────────────────────────────────

const quiz = [
  {
    // TODO: sample — swap in your real question, options + answer
    question: 'where did we go on our very first date? ☕',
    options: ['a cozy café ☕', 'a long scooty ride 🛵', 'the beach 🌊', 'garba night 💃'],
    answer: 0,
  },
  {
    // TODO: sample — set `answer` to whoever really said it first
    question: 'who said "i luv u" first? 🙈',
    options: ['me (aeshu) 🙋‍♀️', 'soham 🙋‍♂️'],
    answer: 1,
    right: 'yesss it was me… n i meant every lil bit of it 🥹',
    wrong: "it was me 😌 i just couldn't hold it in any longer 🙈",
  },
  {
    question: "wht's my fav thing about u? 😍",
    options: ['ur smile 😊', 'ur eyes 👀', 'ur laugh 😂', 'all of the above 💛'],
    answer: 3,
    right: 'ofc!! how could i ever pick just one 🫶',
    wrong: "trick question 😜 it's literally everything about u 💛",
  },
  {
    question: 'who luvs who more? 😏',
    options: ['me (aeshu) 🙋‍♀️', 'soham 🙋‍♂️'],
    answer: 1,
    right: 'see? even u admit it 😌💛',
    wrong: 'nope 😌 i luv u more. always. no arguments 🤭',
  },
];

// Used when a question has no `right` line of its own.
export const RIGHT_REACTIONS = [
  'obviously!! u know me better than i know myself 🥹',
  'correct!! my smart lil wifey 😌💛',
  'yesss!! 10/10, no notes 🫶',
];

// Used when a question has no `wrong` line of its own.
export const WRONG_REACTIONS = [
  'wrong — but ur still perfect 💛',
  "nope 🙈 but i'll let it slide… bcoz i luv u",
  "hehe not quite 😂 we'll make sooo many more memories so u never forget 💛",
];

// The verdict at the end, picked by her score. Every one of them is a win 💛
export const QUIZ_RESULTS = {
  perfect: 'full marks!! ofc 🥹 u know us by heart, just like i know u 💛', // all right
  good: "sooo close!! not bad at all, my lil wifey 😌 we'll ace it together next year", // more than half
  sweet: "oops 😂 guess we need more dates… i'm not complaining tho 🙈", // half or fewer
};

export const QUIZ_FINAL_NOTE = "score doesn't matter tho… u already won me 💛";

export default quiz;
