/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#facc15",
        accent: "#2563eb",
        bg: {
          main: "#fffbea",
          panel: "#fef08a",
          dark: "#1a1a2e",
        },
        text: {
          main: "#1f2937",
          accent: "#0ea5e9",
          dark: "#e2e8f0",
        },
      },
      fontFamily: {
        comic: ['"Comic Neue"', "cursive"],
        code: ["'Fira Code'", "monospace"],
      },
      boxShadow: {
        comic: "5px 5px 0px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blink: {
          "from, to": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
