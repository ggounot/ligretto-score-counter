/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{svelte,js,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: false,
  },
  plugins: [require("daisyui")],
};
