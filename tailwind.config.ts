import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2FAF5',
          100: '#E3F3E9',
          200: '#C4E5D0',
          300: '#95CFAC',
          400: '#5FB483',
          500: '#2E9E4F',
          600: '#23803F',
          700: '#1F6B3C',
          800: '#1B5E38',
          900: '#14472A',
          950: '#0D3620',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1DA851',
        },
        ink: {
          DEFAULT: '#14181C',
          muted: '#6B7280',
          soft: '#9AA1A9',
        },
        line: '#E9EBED',
        surface: '#F5F6F7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        pop: '0 8px 24px rgba(16,24,40,0.10)',
      },
      maxWidth: {
        site: '1240px',
      },
    },
  },
  plugins: [],
};

export default config;
