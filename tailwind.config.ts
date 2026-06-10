import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Sozo — nomes próprios, sem conflito com Tailwind nativo
        sozo: {
          950: '#0C0B09',
          900: '#1A1814',
          800: '#2D2A24',
          700: '#44403A',
          500: '#78746C',
          300: '#C4BEB4',
          100: '#F5F0E8',
          50:  '#FAF7F2',
        },
        gold: {
          DEFAULT: '#C8A96E',
          light:   '#E2C898',
          dark:    '#9A7D4A',
        },
        chapel: {
          green:       '#2D6A4F',
          'green-light': '#52B788',
          red:         '#B5485A',
          'red-light': '#E07A8A',
          blue:        '#2C5F8A',
          'blue-light':'#5B9EC9',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        sm:  '8px',
        md:  '14px',
        lg:  '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        glow: '0 8px 40px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config