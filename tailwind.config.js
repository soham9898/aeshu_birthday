/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Romantic, warm, minimal palette
        roseblack: '#0d0608', // deep rose-black
        plum: '#100a10', // very dark plum (main background)
        gold: '#f5c842', // warm gold accent
        blush: '#f2a0b0', // blush rose accent
        ivory: '#fdf6f0', // ivory white (headings)
        cream: '#e8d5c4', // soft cream (body text)
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Lato', 'Inter', 'system-ui', 'sans-serif'],
        // Romantic handwriting — used for polaroid captions & love notes
        script: ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
};
