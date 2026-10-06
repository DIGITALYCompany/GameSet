/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.07)',
        base: {
          bg: '#06060A',
          'bg-alt': '#0A0A12',
          surface: '#0F0F18',
          'surface-2': '#15151F',
          'surface-3': '#1C1C28',
          'surface-4': '#232331',
        },
        accent: {
          purple: '#8E3BFF',
          'purple-light': '#A56BFF',
          magenta: '#E83DBB',
          orange: '#FF9148',
          'orange-light': '#FFB347',
          cyan: '#22D3EE',
          green: '#34D399',
          red: '#F87171',
        },
        ink: {
          DEFAULT: '#F5F5F7',
          muted: '#A5A5B8',
          dim: '#84849B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(142, 59, 255, 0.15)',
        'glow': '0 0 40px -8px rgba(142, 59, 255, 0.2)',
        'glow-lg': '0 0 60px -10px rgba(142, 59, 255, 0.3)',
        'glow-magenta': '0 0 40px -8px rgba(232, 61, 187, 0.2)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'card-hover': '0 8px 30px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-sm': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop': 'pop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'progress-fill': 'progressFill 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'count-up': 'countUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(142, 59, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(142, 59, 255, 0.4)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
