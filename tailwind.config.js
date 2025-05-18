/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#23468C',  // Deep Blue
        'success': '#238C33',  // Green
        'highlight': '#D9CF4A', // Yellow
        'error': '#F24141',    // Red
        'background': '#0D0D0D', // Deep Black
        'primary-light': '#3A5DA3',
        'primary-dark': '#1A3A7A',
        'success-light': '#36A347',
        'success-dark': '#1A7026',
        'highlight-light': '#E4DB6A',
        'highlight-dark': '#BFB635',
        'error-light': '#F56565',
        'error-dark': '#E02424',
        'gray': {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        'heading': ['"Space Grotesk"', 'sans-serif'],
        'body': ['"IBM Plex Sans"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '100': '25rem',
        '120': '30rem',
      },
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fill-150': 'repeat(auto-fill, minmax(150px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      animation: {
        'tile-blink': 'tile-blink 2s ease-in-out infinite',
        'tile-flip': 'tile-flip 0.6s ease-out forwards',
        'tile-unflip': 'tile-unflip 0.6s ease-out forwards',
      },
      keyframes: {
        'tile-blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'tile-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'tile-unflip': {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
    },
  },
  plugins: [],
};
