/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app.vue',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
  ],
  safelist: [
    // bg, text, hover:bg 변형까지 한꺼번에
    { pattern: /^(bg|text)-(red|blue|green|yellow|emerald|sky|slate)-(50|100|500|700)$/ },
    { pattern: /^bg-(red|blue|green|yellow|emerald|sky|slate)-(50|100)$/, variants: ['hover'] },
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
