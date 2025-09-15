// 폰트 최적화 플러그인 - Critical path에서 제외
export default defineNuxtPlugin({
  name: 'font-optimization',
  setup() {
    // 폰트 지연 로딩
    if (process.client) {
      // DOM 로드 완료 후 폰트 로딩
      const loadFonts = () => {
        // 이미 로딩된 경우 중복 로딩 방지
        if (document.querySelector('link[href*="materialdesignicons"]')) {
          console.log('MDI 폰트 이미 로딩됨')
          return
        }

        // MDI 폰트 지연 로딩 (integrity 제거로 SRI 검증 문제 해결)
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'
        link.crossOrigin = 'anonymous'
        
        // 폰트 로딩 완료 후 추가
        link.onload = () => {
          console.log('MDI 폰트 로딩 완료')
          // 폰트 로딩 완료를 전역에 알림
          document.body.classList.add('mdi-loaded')
        }
        
        // 로딩 실패 시 fallback
        link.onerror = () => {
          console.warn('MDI 폰트 로딩 실패 - fallback 사용')
          document.body.classList.add('mdi-fallback')
        }
        
        document.head.appendChild(link)
        
        // Vuetify 스타일 지연 로딩
        import('vuetify/styles').then(() => {
          console.log('Vuetify 스타일 로딩 완료')
        }).catch(() => {
          console.warn('Vuetify 스타일 로딩 실패')
        })
      }
      
      // 페이지 로드 완료 후 실행
      if (document.readyState === 'complete') {
        setTimeout(loadFonts, 100) // 100ms 지연
      } else {
        window.addEventListener('load', () => {
          setTimeout(loadFonts, 100)
        })
      }
    }
  }
})
