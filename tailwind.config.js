/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      keyframes: {
        flyIn: {
          '0%': { transform: 'translateX(-25px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flyOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-25px)', opacity: '0' },
        },
      },
      animation: {
        flyIn: 'flyIn 0.5s ease-out forwards',
        flyOut: 'flyOut 0.5s ease-in forwards',
      },
    },
  },
  plugins: [],
}

