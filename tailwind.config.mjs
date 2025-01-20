/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        modern: {
          dark: '#1a1b1e',
          purple: '#6b46c1',
          indigo: '#4f46e5',
          cyan: '#06b6d4',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            code: {
              backgroundColor: 'rgb(var(--tw-prose-pre-bg))',
              padding: '0.25rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '600'
            },
            pre: {
              backgroundColor: '#1e1e1e',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              margin: '2rem 0'
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontWeight: '400'
            },
            p: {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              lineHeight: '1.8'
            },
            h1: {
              marginBottom: '2rem'
            },
            h2: {
              marginTop: '2.5rem',
              marginBottom: '1.5rem'
            }
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}