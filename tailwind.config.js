/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        outline: '2px 2px 0px rgba(0, 0, 0, 1)',
        'outline-white': '2px 2px 0px rgba(255, 255, 255, 1)',
        // Add more as needed
      },
    },
  },
  plugins: [],
}