/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        cream: '#F2F0E9',
        ink: '#121212',
        'theme-text': 'var(--ink)',
        'theme-bg': 'var(--bg-cream)',
        charcoal: '#1A1A1A',
        zinc: '#27272a',
        pop: 'var(--color-pop)',
        // AA-contrast variant of pop for small/body text on cream (pop itself only passes for large text)
        'pop-ink': '#C43500',
        gold: '#eab308',
        term: {
          accent: 'var(--term-accent)',
          dim: 'var(--term-dim)',
          bg: 'var(--term-bg)',
        },
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px currentColor',
        'hard-hover': '6px 6px 0px 0px currentColor',
      },
      animation: {
        'marquee': 'marquee 60s linear infinite',
        'scanlines': 'scanlines 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scanlines: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100px' },
        }
      }
    }
  },
  plugins: [],
}