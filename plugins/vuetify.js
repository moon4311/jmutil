// 트리쉐이킹 최적화를 위한 최소한의 컴포넌트만 임포트
import { createVuetify } from 'vuetify'
// 실제 사용되는 필수 컴포넌트만 선별
import {
  VApp, VMain, VBtn, VIcon, VList, VListItem, VListItemTitle,
  VCard, VCardText, VTextField, VTextarea, VSelect,
  VContainer, VRow, VCol, VAlert, VTooltip, VDivider,
  VTabs, VTab, VWindow, VWindowItem, VExpansionPanels,
  VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
  VBtnToggle, VChip, VMenu, VAvatar
} from 'vuetify/components'

// MDI 아이콘 직접 임포트
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VApp, VMain, VBtn, VIcon, VList, VListItem, VListItemTitle,
      VCard, VCardText, VTextField, VTextarea, VSelect,
      VContainer, VRow, VCol, VAlert, VTooltip, VDivider,
      VTabs, VTab, VWindow, VWindowItem, VExpansionPanels,
      VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
      VBtnToggle, VChip, VMenu, VAvatar
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
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
