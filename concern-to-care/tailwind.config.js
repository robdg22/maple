/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        line: 'var(--line)',
        sage: 'var(--sage)',
        'sage-soft': 'var(--sage-soft)',
        'sage-deep': 'var(--sage-deep)',
        amber: 'var(--amber)',
        'amber-soft': 'var(--amber-soft)',
        alert: 'var(--alert)',
        'alert-soft': 'var(--alert-soft)',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        medium: '500',
        semibold: '600',
        bold: '600',
      },
      boxShadow: {
        phone: '0 28px 80px rgb(26 26 26 / 18%)',
        card: '0 14px 40px rgb(26 26 26 / 8%)',
      },
      borderRadius: {
        card: '20px',
        button: '12px',
      },
    },
  },
  plugins: [],
}
