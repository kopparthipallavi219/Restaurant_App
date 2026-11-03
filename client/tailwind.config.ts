import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mehfil: {
          saffron: {
            DEFAULT: '#D97706',
            light: '#F59E0B',
            dark: '#B45309',
            glow: '#FBBF24',
          },
          burgundy: {
            DEFAULT: '#1C0D0A',
            dark: '#120907',
            deep: '#0D0605',
            light: '#2A120C',
            accent: '#3D1B13',
            border: '#4A2117',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F3E5AB',
            dark: '#AA7C11',
            metallic: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
          },
          parchment: {
            DEFAULT: '#FDFBF7',
            muted: '#F5F0EB',
            dark: '#E8E2D9',
          },
          charcoal: {
            DEFAULT: '#1A1818',
            card: '#221F1E',
            border: '#332D2B',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'nizami-pattern': "radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.08) 0%, rgba(18, 9, 7, 0) 70%)",
        'hero-gradient': "linear-gradient(to bottom, rgba(18, 9, 7, 0.65), rgba(18, 9, 7, 0.95))",
        'gold-shimmer': "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.25) 50%, transparent 100%)",
      },
      boxShadow: {
        'nizami': '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(217, 119, 6, 0.15)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(217, 119, 6, 0.2)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
