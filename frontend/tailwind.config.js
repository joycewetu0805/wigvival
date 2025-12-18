/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: 'media',

  theme: {
    extend: {

      /* 🎨 WIGVIVAL – Afro Feminine Premium */
      colors: {
        brand: {
          beige: '#D6B79E',
          taupe: '#B89473',
          ivory: '#F8F4E9',
          sand: '#E7D4C0',
          brown: '#6B4A32',
          dark: '#2C1F18',
          gold: '#C9A16A',
        }
      },

      /* 🔤 TYPO */
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* 📏 TITRES */
      fontSize: {
        hero: ['3.2rem', { lineHeight: '1.1', fontWeight: '700' }],
        section: ['2.3rem', { lineHeight: '1.2', fontWeight: '600' }],
        card: ['1.4rem', { lineHeight: '1.3', fontWeight: '500' }],
      },

      /* 🌈 GRADIENTS */
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #F8F4E9 0%, #D6B79E 100%)',
        'gold-gradient': 'linear-gradient(90deg, #C9A16A 0%, #E7D4C0 100%)',
      },

      /* 🌫 SHADOW */
      boxShadow: {
        soft: '0 12px 32px rgba(44,31,24,0.15)',
        gold: '0 10px 30px rgba(201,161,106,0.25)',
      },
    },
  },

  plugins: [],
}
