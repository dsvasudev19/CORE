/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        burgundy: {
          50: '#FDF2F5',
          100: '#FCE4EA',
          200: '#F9C9D5',
          300: '#F5A3B8',
          400: '#EE7294',
          500: '#E14370',
          600: '#8B1538', // Main burgundy
          700: '#6B0E2A',
          800: '#4D0A1F',
          900: '#330714',
          950: '#1A030A',
        },
        coral: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8787',
          500: '#FF6B6B', // Main coral
          600: '#FA5252',
          700: '#F03E3E',
          800: '#E03131',
          900: '#C92A2A',
          950: '#A61E1E',
        },
        navy: {
          50: '#EFF3F8',
          100: '#E0E7F1',
          200: '#C1CFE3',
          300: '#9DB0D0',
          400: '#738FBD',
          500: '#4D6FA8',
          600: '#1E3A5F', // Main navy
          700: '#172D4A',
          800: '#102138',
          900: '#0A1628',
          950: '#050B14',
        },
        steel: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Main steel
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Extended semantic colors matching theme
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Main green
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Main yellow
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Main orange-red
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"Fira Code"',
          'Consolas',
          'Monaco',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.75rem' }], // 10px - ultra compact
        'xs': ['0.6875rem', { lineHeight: '1rem' }],    // 11px - compact tables
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }], // 13px - body text
        'base': ['0.875rem', { lineHeight: '1.5rem' }], // 14px - default
        'lg': ['1rem', { lineHeight: '1.75rem' }],      // 16px - emphasis
        'xl': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - headings
        '2xl': ['1.25rem', { lineHeight: '2rem' }],     // 20px
        '3xl': ['1.5rem', { lineHeight: '2.25rem' }],   // 24px
        '4xl': ['1.875rem', { lineHeight: '2.5rem' }],  // 30px
        '5xl': ['2.25rem', { lineHeight: '2.75rem' }],  // 36px
      },
      spacing: {
        '0.25': '0.0625rem', // 1px
        '0.75': '0.1875rem', // 3px
        '4.5': '1.125rem',   // 18px
        '5.5': '1.375rem',   // 22px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '18': '4.5rem',      // 72px
        '88': '22rem',       // 352px
        '100': '25rem',      // 400px
        '112': '28rem',      // 448px
        '128': '32rem',      // 512px
      },
      borderRadius: {
        'xs': '0.125rem',  // 2px - ultra compact
        'sm': '0.25rem',   // 4px - compact
        'DEFAULT': '0.375rem', // 6px - default
        'md': '0.5rem',    // 8px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'DEFAULT': '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'burgundy': '0 4px 14px 0 rgba(139, 21, 56, 0.25)',
        'coral': '0 4px 14px 0 rgba(255, 107, 107, 0.25)',
        'navy': '0 4px 14px 0 rgba(30, 58, 95, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      maxWidth: {
        '8xl': '88rem',   // 1408px
        '9xl': '96rem',   // 1536px
        'screen-3xl': '1920px',
      },
      minHeight: {
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        xs: '2px',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only apply to elements with 'form-input', 'form-select' etc.
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for executive density utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-compact': {
          fontSize: '0.6875rem',
          lineHeight: '1rem',
          letterSpacing: '-0.01em',
        },
        '.text-dense': {
          fontSize: '0.75rem',
          lineHeight: '1.125rem',
          letterSpacing: '-0.01em',
        },
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          backgroundColor: '#F1F5F9',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          backgroundColor: '#CBD5E1',
          borderRadius: '3px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#94A3B8',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
  // Enable dark mode if needed in future
  darkMode: 'class',
}