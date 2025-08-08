import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
        'bubble-rise': 'bubbleRise 4s linear infinite',
        'particle-drift': 'particleDrift 6s ease-in-out infinite',
        'water-flow': 'waterFlow 8s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'morphing': 'morphing 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        bubbleRise: {
          '0%': { 
            transform: 'translateY(100vh) scale(0)', 
            opacity: '0' 
          },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.7' },
          '100%': { 
            transform: 'translateY(-10vh) scale(1)', 
            opacity: '0' 
          },
        },
        particleDrift: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: '0.3' 
          },
          '25%': { 
            transform: 'translate(10px, -5px) rotate(90deg)',
            opacity: '0.7' 
          },
          '75%': { 
            transform: 'translate(-5px, 5px) rotate(-90deg)',
            opacity: '0.5' 
          },
        },
        waterFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        morphing: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, hsla(228,100%,74%,1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(242,100%,70%,1) 0px, transparent 50%)
        `,
        'water-caustics': `
          radial-gradient(ellipse at 20% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 40%),
          radial-gradient(ellipse at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 45%),
          radial-gradient(ellipse at 40% 80%, rgba(14, 165, 233, 0.12) 0%, transparent 35%)
        `,
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        // MODERN AQUASCAPING PALETTE - INSPIRED BY RIDE ENGINE
        primary: {
          50: '#ecfff8',
          100: '#d1fde8', 
          200: '#a7f9d7',
          300: '#6df2c1',
          400: '#2de5a3',
          500: '#00B4A6', // Main teal - professional depth
          600: '#059f8f',
          700: '#0a7f75',
          800: '#0e655e',
          900: '#12534e',
          950: '#032e2a',
        },
        secondary: {
          50: '#fef7ee',
          100: '#fdecd8',
          200: '#fad5b0',
          300: '#f6b47d',
          400: '#f18a48',
          500: '#FF6B47', // Coral accent - warm energy
          600: '#e04e23',
          700: '#ba3c1a',
          800: '#94301c',
          900: '#782a1a',
          950: '#41140c',
        },
        neutral: {
          50: '#f8fffe',   // Pearl white
          100: '#f0fffe',  // Lightest aqua tint
          200: '#d9fffe',  // Very light aqua
          300: '#c4fffe',  // Light aqua gray
          400: '#94fbfa',  // Soft aqua
          500: '#4dd4d4',  // Mid aqua
          600: '#2d8688',  // Charcoal aqua
          700: '#1f5f5f',  // Deep charcoal
          800: '#2D3748',  // Main charcoal - sophisticated
          900: '#1a2332',  // Deepest charcoal
          950: '#0f1419',  // Ocean depths
        },
        // SUPPORTING AQUATIC PALETTE
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#001133', // Deep ocean blue - trust & depth
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        seafoam: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#88D8A3', // Sea foam green - natural growth
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // GLASS & TRANSPARENCY
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          heavy: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 17, 51, 0.3)',
          ocean: 'rgba(0, 180, 166, 0.15)',
          coral: 'rgba(255, 107, 71, 0.15)',
        },
        // STATUS COLORS
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // FLUID TYPOGRAPHY SCALE - RESPONSIVE BY DEFAULT
        'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.375rem)', { lineHeight: '1.5' }],
        'xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.5rem, 1.3rem + 1vw, 2.25rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.875rem, 1.6rem + 1.375vw, 2.875rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(2.25rem, 1.9rem + 1.75vw, 3.5rem)', { lineHeight: '1.1' }],
        '5xl': ['clamp(3rem, 2.5rem + 2.5vw, 4.5rem)', { lineHeight: '1.05' }],
        '6xl': ['clamp(3.75rem, 3rem + 3.75vw, 6rem)', { lineHeight: '1' }],
        '7xl': ['clamp(4.5rem, 3.5rem + 5vw, 7.5rem)', { lineHeight: '1' }],
        '8xl': ['clamp(6rem, 4.5rem + 7.5vw, 9rem)', { lineHeight: '1' }],
        '9xl': ['clamp(8rem, 6rem + 10vw, 12rem)', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
      },
      // MODERN BORDER RADIUS SYSTEM
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
        'full': '9999px',
      },
      // ENHANCED SHADOWS
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // AQUATIC THEMED SHADOWS
        'aqua': '0 8px 32px rgba(0, 180, 166, 0.3)',
        'coral': '0 8px 32px rgba(255, 107, 71, 0.3)',
        'ocean': '0 12px 40px rgba(0, 17, 51, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }: any) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        // MODERN GRADIENT TEXT EFFECTS
        '.text-gradient-primary': {
          backgroundImage: 'linear-gradient(135deg, #00B4A6, #88D8A3, #FF6B47)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 3s ease-in-out infinite',
        },
        '.text-gradient-ocean': {
          backgroundImage: 'linear-gradient(135deg, #001133, #00B4A6, #88D8A3)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        },
        '.text-gradient-coral': {
          backgroundImage: 'linear-gradient(135deg, #FF6B47, #FFB3BA, #FF6B47)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        },
        // GLASS MORPHISM UTILITIES
        '.glass-modern': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
        '.glass-aquatic': {
          background: 'rgba(0, 180, 166, 0.1)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 180, 166, 0.2)',
          boxShadow: '0 12px 40px rgba(0, 180, 166, 0.2)',
        },
        '.glass-ocean': {
          background: 'rgba(0, 17, 51, 0.3)',
          backdropFilter: 'blur(28px)',
          border: '1px solid rgba(136, 216, 163, 0.3)',
          boxShadow: '0 16px 48px rgba(0, 17, 51, 0.3)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}

export default config