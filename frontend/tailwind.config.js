/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FAF5EE',
          100: '#F5EBE1',
          200: '#EDE0D4',
          300: '#DDB892',
          400: '#B08968',
          500: '#8B5A2B',
          600: '#6F4E37',
          700: '#4A2C1B',
          800: '#2C1810',
          900: '#1F130B',
          950: '#120A05',
        },
        gold: {
          300: '#F5D77F',
          400: '#E5C058',
          500: '#D4AF37',
          600: '#B89428',
          700: '#8F7118',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F9F5EE',
          200: '#F2E9DC',
          300: '#E8DAC8',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
