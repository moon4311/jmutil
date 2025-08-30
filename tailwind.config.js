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
    { pattern: /^(bg|text)-(red|blue|green|yellow|emerald|purple|pink|indigo|orange|violet|slate)-(50|100|500|700)$/ },
    { pattern: /^bg-(red|blue|green|yellow|emerald|purple|pink|indigo|orange|violet|slate)-(50|100)$/, variants: ['hover'] },
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  // CSR 최적화를 위한 설정
  corePlugins: {
    // 사용하지 않는 기본 플러그인 비활성화로 경량화
    preflight: true, // 기본 스타일 리셋은 유지
    container: true,
    accessibility: false, // 접근성 관련 플러그인 비활성화 (필요시 활성화)
    backgroundOpacity: false, // 배경 투명도 미사용시 비활성화
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    textOpacity: false
  }
}
