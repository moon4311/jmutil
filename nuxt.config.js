// Nuxt 3 + Vuetify + Tailwind (JavaScript, no TypeScript)
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '@/assets/css/tailwind.css', 
    'vuetify/styles', 
    '@mdi/font/css/materialdesignicons.css',
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },
  nitro: {
    minify: false,          // dev는 보통 끔
  },
  compatibilityDate: '2024-04-03',

})
