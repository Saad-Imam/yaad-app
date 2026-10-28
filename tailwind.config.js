/** @type {import('tailwindcss').Config} */

const color = (token) => `rgb(var(--c-${token}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        'canvas-cream': color('canvas-cream'),
        'surface-container-lowest': color('surface-container-lowest'),
        'surface-cream-subtle': color('surface-cream-subtle'),
        'surface-muted': color('surface-muted'),
        'border-subtle': color('border-subtle'),
        scrim: color('scrim'),

        // Brand & accents
        'urdu-green-deep': color('urdu-green-deep'),
        'urdu-green-light': color('urdu-green-light'),
        primary: color('primary'),
        'primary-container': color('primary-container'),
        'on-primary': color('on-primary'),
        secondary: color('secondary'),
        'secondary-container': color('secondary-container'),
        'secondary-fixed': color('secondary-fixed'),
        'on-secondary-fixed': color('on-secondary-fixed'),
        'saffron-light': color('saffron-light'),

        // Text
        'charcoal-primary': color('charcoal-primary'),
        'charcoal-secondary': color('charcoal-secondary'),
        'charcoal-muted': color('charcoal-muted'),

        // Status
        'urgent-red': color('urgent-red'),
        'urgent-red-bg': color('urgent-red-bg'),
      },
      fontFamily: {
        sans: ['var(--font-app, "DM Sans")', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-heading, "Playfair Display")', 'Georgia', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      fontSize: {
        'headline-lg': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.015em' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.75rem' }],
        'headline-md': ['1.5rem', { lineHeight: '2rem' }],
        'title-card': ['1.125rem', { lineHeight: '1.5rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'body-base': ['1rem', { lineHeight: '1.5rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'label-md': ['0.875rem', { lineHeight: '1.25rem' }],
        'label-sm': ['0.75rem', { lineHeight: '1rem' }],
        caption: ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.03em' }],
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },
      boxShadow: {
        card: '0 4px 12px -2px rgb(var(--c-primary-container) / 0.08)',
        bar: '0 -4px 16px rgb(var(--c-charcoal-primary) / 0.06)',
      },
    },
  },
  plugins: [],
}
