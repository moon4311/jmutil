// CSR 최적화를 위한 전역 플러그인
export default defineNuxtPlugin(() => {
  // 클라이언트 전용 플러그인이므로 window 체크만 수행
  if (typeof window === 'undefined') return

  // 페이지 로드 완료 후 최적화 기능들 실행
  window.addEventListener('load', () => {
    // 리소스 힌트 추가
    const preloadResources = [
      '/assets/css/tailwind.css',
      '/assets/css/common.css'
    ]
    
    preloadResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = resource
      document.head.appendChild(link)
    })

    // 성능 메트릭 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      const perfData = performance.getEntriesByType('navigation')[0]
      if (perfData) {
        console.log('CSR Performance:', {
          domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
          loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
        })
      }
    }
  })
})
