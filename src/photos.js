// ─────────────────────────────────────────────────────
// TODO: Add your photos here!
// HOW TO ADD PHOTOS:
// 1. Create a folder called "photos" inside the "public" folder: public/photos/
// 2. Copy your image files into public/photos/ (e.g. photo1.jpg, photo2.jpg)
// 3. For each photo, add an entry below with:
//    - src:     the path to the image (starts with /aeshu_birthday/photos/)
//    - caption: a short romantic caption for this photo (optional, leave "" to hide)
//    - date:    an OPTIONAL little date / place line shown under the caption
//               (e.g. 'Goa · Dec 2023' or 'Our first trip'). Leave it out to hide it.
//
// TIP: the most touching captions name the exact moment — the place, the
// date, or your private inside joke. Those are the ones that melt hearts. 💛
// ─────────────────────────────────────────────────────

const photos = [
  {
    src: '/aeshu_birthday/photos/photo1.jpg',
    caption: 'The day everything changed 💛',
    date: 'Where it all began',
  },
  {
    src: '/aeshu_birthday/photos/photo2.jpg',
    caption: 'My favourite smile in the world',
    date: 'Sometime, somewhere, us',
  },
  {
    src: '/aeshu_birthday/photos/photo3.jpg',
    caption: 'Us, always.',
    date: '',
  },
  // Add more photos below in the same format:
  // { src: '/aeshu_birthday/photos/your-photo.jpg', caption: 'Your caption here', date: 'Place · Month Year' },
];

export default photos;
