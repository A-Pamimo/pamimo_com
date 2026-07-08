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
        // Fixed literals — the palette. Used directly and via `dark:` variants.
        cream: '#F2F0E9',
        ink: '#121212',
        charcoal: '#1A1A1A',
        zinc: '#27272a',
        gold: '#eab308',
        // Semantic, mode-aware surfaces (single source of truth in globals.css)
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        edge: 'var(--border)',
        // Brand accent + AA-safe small-text variant
        pop: 'var(--color-pop)',
        'pop-ink': '#C43500',
        // Legacy — still consumed by blog + grocery-gap components
        'theme-text': 'var(--ink)',
        'theme-bg': 'var(--bg-cream)',
        term: {
          accent: 'var(--term-accent)',
          dim: 'var(--term-dim)',
          bg: 'var(--term-bg)',
        },
      },
      fontSize: {
        // Display (Syne 700/800) — type-as-architecture
        'display-hero': ['clamp(2.75rem,10vw,9rem)', { lineHeight: '0.86', letterSpacing: '-0.03em' }],
        'display-1': ['clamp(2.5rem,7vw,6rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(1.75rem,4vw,3rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-3': ['clamp(1.375rem,2.2vw,2rem)', { lineHeight: '1.0', letterSpacing: '-0.01em' }],
        // Body (Inter) + label (mono)
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.18em' }],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px currentColor',
        'hard-hover': '6px 6px 0px 0px currentColor',
        'hard-lg': '8px 8px 0px 0px currentColor',
        'hard-xl': '12px 12px 0px 0px currentColor',
      },
      animation: {
        'marquee': 'marquee 60s linear infinite',
        'marquee-reverse': 'marquee-reverse 60s linear infinite',
        'scanlines': 'scanlines 2s linear infinite',
        'flicker': 'flicker 4s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        scanlines: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100px' },
        },
        flicker: {
          '0%, 96%, 100%': { opacity: '1' },
          '97%': { opacity: '0.82' },
          '98%': { opacity: '1' },
          '99%': { opacity: '0.88' },
        },
      }
    }
  },
  plugins: [],
}