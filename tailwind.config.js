/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: {
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#99eefd',
          300: '#54dff9',
          400: '#0bc9f0',
          500: '#00acd6',
          600: '#0288b4',
          700: '#086d92',
          800: '#0d5978',
          900: '#114a65',
        },
        marine: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bubble': 'bubble 3s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'grow': 'grow 4s ease-in-out infinite',
        'swim': 'swim 8s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'liquid': 'liquid 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0px) scale(0.8)', opacity: '0' },
          '50%': { transform: 'translateY(-50px) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0.8)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        grow: {
          '0%': { transform: 'scale(0) rotate(0deg)' },
          '50%': { transform: 'scale(1) rotate(180deg)' },
          '100%': { transform: 'scale(1.1) rotate(360deg)' },
        },
        swim: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(-10px) translateY(5px)' },
          '75%': { transform: 'translateX(15px) translateY(-5px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        },
        liquid: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}