/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safety-bg': '#0B1120',        // Deep Navy / Black
        'safety-panel': '#1E293B',     // Slate 800
        'signal-safe': '#10B981',      // Emerald 500
        'signal-warn': '#F59E0B',      // Amber 500
        'signal-crit': '#EF4444',      // Red 500
        'tech-cyan': '#06B6D4',        // Cyan 500
      },
    },
  },
  plugins: [],
}

