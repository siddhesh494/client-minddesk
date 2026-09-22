/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        ink: {
          50: "#f7f5f2",
          100: "#efeae3",
          200: "#e3d9cc",
          700: "#4a4038",
          800: "#322c27",
          900: "#221e1b",
        },
        accent: {
          50: "#eef6f4",
          600: "#2f6f64",
          700: "#24574e",
        },
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(34, 30, 27, 0.25)",
      },
    },
  },
  plugins: [],
};
