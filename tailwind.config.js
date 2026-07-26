/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Soft sage-neutral surface, deep forest-charcoal ink, muted teal accent.
        // Deliberately not the cream+terracotta or dark+neon defaults.
        surface: '#F6F7F5',
        card: '#FFFFFF',
        ink: '#202A25',
        muted: '#6B7B76',
        border: '#E3E8E2',
        accent: {
          DEFAULT: '#2F6F62',
          light: '#E7F0ED',
          dark: '#20504A',
        },
        status: {
          completed: '#3F9142',
          completedBg: '#E9F5E9',
          progress: '#C98A1F',
          progressBg: '#FBF1DF',
          notstarted: '#8A968F',
          notstartedBg: '#EEF1ED',
          overdue: '#C64545',
          overdueBg: '#FBEAEA',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}
