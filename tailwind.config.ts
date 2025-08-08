import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        // Professional Aquascaping Colors - Natural Waters Theme
        primary: {
          DEFAULT: '#1B4332', // Deep Forest
          light: '#2D5A3D',   // Sage Green
          dark: '#0D2818',    // Deeper Forest
        },
        secondary: {
          DEFAULT: '#2B4F60', // Ocean Depth
          light: '#4A6B7A',   // Lighter Ocean
          dark: '#1A3240',    // Deeper Ocean
        },
        accent: {
          DEFAULT: '#E76F51', // Warm Coral
          light: '#F4A261',   // Golden Sand
          mint: '#52B2B2',    // Aqua Mint
          wood: '#8B7355',    // Driftwood
        },
        neutral: {
          50: '#FEFEFE',      // Cloud White
          100: '#F8F9FA',     // Soft Pearl
          200: '#F1F3F4',     // Light neutral
          300: '#E5E7EB',     // Subtle dividers
          400: '#9CA3AF',     // Medium gray
          500: '#6C757D',     // Warm Gray
          600: '#4B5563',     // Dark secondary
          700: '#2D3436',     // Charcoal
          800: '#1A1D23',     // Deep Slate
          900: '#0F1419',     // Deepest
        },
        success: '#40A06A', // Natural green
        warning: '#FFA726', // Warm amber
        error: '#E53935',   // Clear red
        info: '#42A5F5',    // Gentle blue
        glass: {
          100: 'rgba(255, 255, 255, 0.85)',
          200: 'rgba(255, 255, 255, 0.9)',
          300: 'rgba(255, 255, 255, 0.95)',
        }
      },
      fontFamily: {
        primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        heading: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        accent: ['"Source Serif Pro"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
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
        '.text-gradient': {
          backgroundImage: 'linear-gradient(45deg, #1B4332, #E76F51, #52B2B2)',
          backgroundClip: 'text',
          color: 'transparent',
        },
        '.text-primary': {
          color: '#1B4332',
        },
        '.text-accent': {
          color: '#E76F51',
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