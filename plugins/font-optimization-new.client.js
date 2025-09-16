// 폰트 최적화 플러그인 - 지연 로딩으로 성능 개선
export default defineNuxtPlugin({
  name: 'font-optimization',
  setup() {
    if (process.client) {
      const loadCriticalFonts = () => {
        // 이미 로딩된 경우 스킵
        if (document.querySelector('link[href*="materialdesignicons"]')) {
          return
        }

        // 폰트 로딩
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'
        link.crossOrigin = 'anonymous'
        
        link.onload = () => {
          document.body.classList.add('mdi-loaded')
        }
        
        link.onerror = () => {
          console.warn('MDI 폰트 로딩 실패')
          document.body.classList.add('mdi-fallback')
        }

        document.head.appendChild(link)
      }

      // idle time에 로딩
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadCriticalFonts, { timeout: 1000 })
      } else {
        setTimeout(loadCriticalFonts, 100)
      }
    }
  }
})