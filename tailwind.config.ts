import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dutch-inspired color palette
        primary: {
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bee4fd',
          300: '#91d4fc',
          400: '#5dbdf8',
          500: '#38a1f3',
          600: '#1e81e8',
          700: '#1a6ad4',
          800: '#1b56ac',
          900: '#1c4a88',
          950: '#152e53',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cabinet)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
