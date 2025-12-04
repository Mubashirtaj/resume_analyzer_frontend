import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // MOST IMPORTANT
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}", // if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
