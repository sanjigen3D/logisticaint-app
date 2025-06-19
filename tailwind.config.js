/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#33548e",
        secondary: "#091836",
        error: "#c33f3f",
        foreground: "#b2c1e1",
        background: "#5a8ce8"
      }
    },
  },
  plugins: [],
}