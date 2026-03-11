/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Professional Brand Colors
        primary: {
          DEFAULT: "#10b981", // Modern emerald green
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        accent: {
          DEFAULT: "#f59e0b", // Subtle amber accent
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Legacy support
        agriYellow: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        agriGreen: {
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Enhanced Semantic Colors
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Status Colors
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        info: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.025em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.025em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.025em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.05em" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.05em" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.075em" }],
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        21: "5.25rem",
        22: "5.5rem",
        76: "19rem",
        84: "21rem",
        88: "22rem",
        92: "23rem",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(251, 191, 36, 0.3)",
        "glow-green": "0 0 20px -5px rgba(16, 185, 129, 0.3)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "elevation-1": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "elevation-2":
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "elevation-3":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "elevation-4":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translateY(0)" },
          "40%, 43%": { transform: "translateY(-5px)" },
          "70%": { transform: "translateY(-2px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
        "4xl": "1920px",
      },
    },
  },
  plugins: [
    // Custom utility classes plugin
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".glass-card": {
          background: "rgba(255, 255, 255, 0.25)",
          "backdrop-filter": "blur(8px)",
          "-webkit-backdrop-filter": "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },
        ".glass-card-dark": {
          background: "rgba(15, 23, 42, 0.25)",
          "backdrop-filter": "blur(8px)",
          "-webkit-backdrop-filter": "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "box-shadow": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        },
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".text-gradient-agri": {
          background: `linear-gradient(135deg, ${theme("colors.agriYellow.400")}, ${theme("colors.agriGreen.500")})`,
          "-webkit-background-clip": "text",
          "background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".border-gradient-agri": {
          border: "2px solid",
          "border-image": `linear-gradient(135deg, ${theme("colors.agriYellow.400")}, ${theme("colors.agriGreen.500")}) 1`,
        },
        ".custom-scrollbar": {
          "scrollbar-width": "thin",
          "scrollbar-color": `${theme("colors.agriYellow.400")} transparent`,
        },
        ".custom-scrollbar::-webkit-scrollbar": {
          width: "6px",
        },
        ".custom-scrollbar::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".custom-scrollbar::-webkit-scrollbar-thumb": {
          "background-color": theme("colors.agriYellow.400"),
          "border-radius": "3px",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
