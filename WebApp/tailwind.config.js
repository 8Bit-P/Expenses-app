/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        desk: "1150px", // Custom breakpoint for layout transition
      },
      colors: {
        "primary": "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "secondary": "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "error": "var(--error)",
        "error-container": "var(--error-container)",
        "background": "var(--background)",
        "on-background": "var(--on-background)",
        "surface": "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        "outline": "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "tertiary": "var(--tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "accent": "var(--accent)",
        "on-accent": "var(--on-accent)",
        "rail": "var(--rail)",
        "on-rail": "var(--on-rail)",
        "on-rail-variant": "var(--on-rail-variant)",
        "rail-hover": "var(--rail-hover)",
        "rail-border": "var(--rail-border)",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.625rem",
        "2xl": "0.75rem",
        "3xl": "1rem",
        full: "9999px"
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(22, 22, 19, 0.04)",
        DEFAULT: "0 1px 3px 0 rgba(22, 22, 19, 0.06)",
        md: "0 2px 6px -1px rgba(22, 22, 19, 0.08)",
        lg: "0 8px 20px -6px rgba(22, 22, 19, 0.14)",
        xl: "0 16px 32px -12px rgba(22, 22, 19, 0.22)",
        "2xl": "0 24px 56px -16px rgba(22, 22, 19, 0.30)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        headline: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}