// ─────────────────────────────────────────────────────
// OUR MEMORIES 📸 — the polaroids she taps through. Each one
// waits behind a blur until she taps to reveal it 👀
//
// HOW TO ADD / CHANGE PHOTOS:
// 1. Copy your image files into public/photos/ (e.g. photo1.jpg, photo2.jpg)
//    Tip: shrink big phone photos first (~1280px tall is plenty) so the
//    site loads fast on her phone.
// 2. For each photo, add an entry below with:
//    - src:     the path to the image (starts with /aeshu_birthday/photos/)
//    - caption: a short romantic caption for this photo (optional, leave "" to hide)
//    - date:    an OPTIONAL little date / place line shown under the caption
//               (e.g. 'Goa · Dec 2023' or 'Our first trip'). Leave it out to hide it.
//
// They appear in this exact order — real moments first, then the
// dreamy ones we're still going to live. 💛
// ─────────────────────────────────────────────────────

const photos = [
  {
    src: '/aeshu_birthday/photos/01-cafe-date.jpg',
    caption: "café date + that lil 'love u' 🥹☕",
    date: 'our café date',
  },
  {
    src: '/aeshu_birthday/photos/02-cloudy-day.jpg',
    caption: 'cloudy sky, sunny us ☁️☀️',
    date: '26 · jul · 2026',
  },
  {
    src: '/aeshu_birthday/photos/03-holding-hands.jpg',
    caption: 'this hand? never letting it go 🤝💛',
    date: '26 · jul · 2026',
  },
  {
    src: '/aeshu_birthday/photos/04-scooty-ride.jpg',
    caption: 'u, me n a random scooty ride 🛵💨',
    date: 'scooty diaries',
  },
  {
    src: '/aeshu_birthday/photos/05-under-the-tree.jpg',
    caption: 'one tree, one bench, my fav human 🌳',
    date: '03 · aug · 2026',
  },
  {
    src: '/aeshu_birthday/photos/06-photo-strip.jpg',
    caption: 'smile… smile… *kiss* 😚',
    date: 'our lil photo booth',
  },
  {
    src: '/aeshu_birthday/photos/07-cozy-hearts.jpg',
    caption: 'my safe place = right next to u 🫶',
    date: 'cozy days',
  },
  {
    src: '/aeshu_birthday/photos/08-night-ride.jpg',
    caption: 'late night rides hit diff with u 🌙',
    date: 'u n me in the mirror',
  },
  {
    src: '/aeshu_birthday/photos/09-golden-hour-strip.jpg',
    caption: 'lying in the grass, lost in uu 🌿',
    date: 'golden hour',
  },
  {
    src: '/aeshu_birthday/photos/13-cheek-to-cheek.jpg',
    caption: 'cheek to cheek, heart to heart 🫶',
    date: 'our lil late nights',
  },
  {
    src: '/aeshu_birthday/photos/14-vintage-cuddle.jpg',
    caption: 'chin on ur shoulder, heart in ur hands 🤍',
    date: 'vintage us',
  },
  {
    src: '/aeshu_birthday/photos/15-bw-hearts.jpg',
    caption: 'black n white, but u make it all colour 🤍',
    date: 'hearts everywhere',
  },
  {
    src: '/aeshu_birthday/photos/16-flower-crowns.jpg',
    caption: 'matching flower crowns, matching hearts 🌼',
    date: 'night mode: on',
  },
  {
    src: '/aeshu_birthday/photos/17-kodak-moment.jpg',
    caption: "if we were a film roll, i'd shoot u forever 🎞️",
    date: 'kodak moment',
  },
  {
    src: '/aeshu_birthday/photos/18-right-behind-u.jpg',
    caption: 'always right behind u, no matter wht 🫂',
    date: 'same cloudy day ☁️',
  },
  {
    src: '/aeshu_birthday/photos/19-eye-to-eye.jpg',
    caption: 'these eyes only look at u like this 👀💗',
    date: 'too close? never',
  },
  {
    src: '/aeshu_birthday/photos/20-forehead-kiss.jpg',
    caption: 'forehead kisses > everything 😌',
    date: 'my fav kind of quiet',
  },
  {
    src: '/aeshu_birthday/photos/21-dinner-date.jpg',
    caption: 'candlelight, flowers n u 🕯️🌸',
    date: 'our dinner date',
  },
  {
    src: '/aeshu_birthday/photos/22-cafe-twinning.jpg',
    caption: 'twinning in white, winning at love 🤍',
    date: 'café hopping',
  },
  {
    src: '/aeshu_birthday/photos/10-forehead-touch.jpg',
    caption: 'no words needed… just us 🖤',
    date: 'forever mood',
  },
  {
    src: '/aeshu_birthday/photos/11-beach-sunset.jpg',
    caption: 'our beach trip era… loading 🌊',
    date: 'someday soon',
  },
  {
    src: '/aeshu_birthday/photos/23-garba-night.jpg',
    caption: 'garba nights r better with u 💃🪔',
    date: 'navratri with u',
  },
  {
    src: '/aeshu_birthday/photos/24-maroon-dupatta.jpg',
    caption: 'u in that dupatta = me lost forever 🥹❤️',
    date: 'future wala us ✨',
  },
  {
    src: '/aeshu_birthday/photos/12-lakeside-saree.jpg',
    caption: 'u in a saree = my heart: gone 🥀',
    date: 'n sooo many more to make',
  },
  // Add more photos below in the same format:
  // { src: '/aeshu_birthday/photos/your-photo.jpg', caption: 'Your caption here', date: 'Place · Month Year' },
];

export default photos;
