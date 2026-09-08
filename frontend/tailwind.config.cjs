/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm paper surfaces + ink — the editorial base
        paper: {
          DEFAULT: '#FBFAF7',
          deep: '#F3F0E8',
        },
        ink: {
          DEFAULT: '#1A1917',
          soft: '#3C3933',
        },
        // Deep teal accent — used sparingly (links, active, the wordmark plus)
        primary: {
          50: '#ECF5F2',
          100: '#D3E8E1',
          200: '#A9D2C6',
          300: '#79B6A6',
          400: '#479485',
          500: '#2A7D6E',
          600: '#1F6F63',
          700: '#185A50',
          800: '#15493F',
          900: '#123B34',
          950: '#0A221E',
        },
        // Success / status only
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // "slate" remapped to a warm neutral ramp so every existing
        // slate-* usage inherits the paper warmth automatically.
        slate: {
          50: '#F7F4EE',
          100: '#EFEBE2',
          200: '#E5DFD3',
          300: '#D2CBBB',
          400: '#A8A192',
          500: '#7A7568',
          600: '#5A5549',
          700: '#403C34',
          800: '#2A2722',
          900: '#1A1917',
          950: '#100F0D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(26, 25, 23, 0.05)',
        'soft': '0 1px 3px 0 rgba(26, 25, 23, 0.05), 0 1px 2px -1px rgba(26, 25, 23, 0.04)',
        'soft-md': '0 4px 6px -1px rgba(26, 25, 23, 0.06), 0 2px 4px -2px rgba(26, 25, 23, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(26, 25, 23, 0.07), 0 4px 6px -4px rgba(26, 25, 23, 0.06)',
        'soft-xl': '0 20px 30px -8px rgba(26, 25, 23, 0.10)',
        'card': '0 1px 2px rgba(26, 25, 23, 0.04)',
        'card-hover': '0 6px 20px -6px rgba(26, 25, 23, 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
