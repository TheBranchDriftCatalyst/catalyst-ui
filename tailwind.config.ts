import type { Config } from "tailwindcss";
import theme from "./lib/catalyst-tw";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./lib/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: theme,
  plugins: [
    require("tailwindcss-animate")
  ],
} satisfies Config;

export default config;