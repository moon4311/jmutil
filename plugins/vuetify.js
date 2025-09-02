import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // MDI 폰트 먼저 로드
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#3b82f6',   // Tailwind blue-500
            secondary: '#6b7280', // Tailwind gray-500
            success: '#22c55e',   // Tailwind green-500
            warning: '#eab308',   // Tailwind yellow-500
            error:   '#ef4444',   // Tailwind red-500
            info:    '#0ea5e9'    // Tailwind sky-500
          }
        },
        dark: {
          colors: {
            primary: '#93c5fd',   // blue-300
            secondary: '#d1d5db', // gray-300
            success: '#86efac',   // green-300
            warning: '#fde047',   // yellow-300
            error:   '#fca5a5',   // red-300
            info:    '#7dd3fc'    // sky-300
          }
        }
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
})
