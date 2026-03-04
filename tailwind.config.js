/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',         // warm-white / slate-900
        foreground: 'var(--color-foreground)',         // gray-800 / slate-200

        card: {
          DEFAULT: 'var(--color-card)',                // slate-50 / slate-800
          foreground: 'var(--color-card-foreground)',  // gray-800 / slate-200
        },
        popover: {
          DEFAULT: 'var(--color-popover)',             // white / slate-800
          foreground: 'var(--color-popover-foreground)', // gray-800 / slate-200
        },
        primary: {
          DEFAULT: 'var(--color-primary)',             // blue-800 / blue-500
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',           // blue-900 / blue-800
          foreground: 'var(--color-secondary-foreground)', // white
        },
        accent: {
          DEFAULT: 'var(--color-accent)',              // orange-600 / orange-700
          foreground: 'var(--color-accent-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)',               // slate-100 / slate-700
          foreground: 'var(--color-muted-foreground)', // gray-500 / slate-400
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',         // red-600 / red-500
          foreground: 'var(--color-destructive-foreground)', // white
        },
        success: {
          DEFAULT: 'var(--color-success)',             // emerald-600 / emerald-500
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)',             // amber-600 / amber-500
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)',               // red-600 / red-500
          foreground: 'var(--color-error-foreground)', // white
        },
        border: 'var(--color-border)',                 // gray-500/20 / gray-400/15
        input: 'var(--color-input)',                   // gray-500/20 / gray-400/15
        ring: 'var(--color-ring)',                     // blue-800 / blue-500
        'text-primary': 'var(--color-text-primary)',   // gray-800 / slate-200
        'text-secondary': 'var(--color-text-secondary)', // gray-500 / slate-400
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
        caption: ['Nunito Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.2' }],
        'h2': ['1.875rem', { lineHeight: '1.25' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'h5': ['1.125rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '18px',
        xl: '24px',
        '2xl': '32px',
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
        md: '0 6px 12px rgba(0, 0, 0, 0.10)',
        lg: '0 12px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 12px rgba(30, 64, 175, 0.3)',
        'glow-accent': '0 0 12px rgba(234, 88, 12, 0.3)',
      },
      transitionTimingFunction: {
        'institutional': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'base': '250ms',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        'dropdown': '50',
        'sticky': '100',
        'modal': '200',
        'toast': '300',
      },
      maxWidth: {
        'prose': '70ch',
        'content': '1280px',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      scrollPadding: {
        'nav': '80px',
      },
      animation: {
        'skeleton-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dropdown-open': 'dropdownOpen 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        dropdownOpen: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};