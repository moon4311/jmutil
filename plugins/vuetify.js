// 트리쉐이킹 최적화를 위한 개별 임포트
import { createVuetify } from 'vuetify'
// 필수 컴포넌트만 선택적 임포트
import {
  VApp, VMain, VBtn, VIcon, VList, VListItem, VListItemTitle,
  VMenu, VCard, VCardText, VTextField, VTextarea, VSelect,
  VCheckbox, VRadio, VRadioGroup, VContainer, VRow, VCol,
  VAlert, VProgressLinear, VTooltip, VAvatar, VDivider
} from 'vuetify/components'
import { Intersect } from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VApp, VMain, VBtn, VIcon, VList, VListItem, VListItemTitle,
      VMenu, VCard, VCardText, VTextField, VTextarea, VSelect,
      VCheckbox, VRadio, VRadioGroup, VContainer, VRow, VCol,
      VAlert, VProgressLinear, VTooltip, VAvatar, VDivider
    },
    directives: { Intersect },
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
