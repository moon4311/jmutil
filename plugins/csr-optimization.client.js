// SSR 최적화를 위한 전역 플러그인
export default defineNuxtPlugin(() => {
  // 클라이언트 전용 최적화
  if (typeof window === 'undefined') return

  // Critical Resource Hints
  const addCriticalHints = () => {
    const hints = [
      { rel: 'preload', href: '/assets/css/critical.css', as: 'style' },
      { rel: 'preload', href: '/assets/css/tailwind.css', as: 'style' }
    ]
    
    hints.forEach(hint => {
      const link = document.createElement('link')
      Object.assign(link, hint)
      document.head.appendChild(link)
    })
  }

  // DOM Ready 시점에 힌트 추가
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCriticalHints)
  } else {
    addCriticalHints()
  }

  // 성능 메트릭 수집 (개발 환경)
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      // Web Vitals 측정
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('📊 Navigation Metrics:', {
              'DNS Lookup': Math.round(entry.domainLookupEnd - entry.domainLookupStart),
              'TCP Connect': Math.round(entry.connectEnd - entry.connectStart),
              'Request': Math.round(entry.responseStart - entry.requestStart),
              'Response': Math.round(entry.responseEnd - entry.responseStart),
              'DOM Parse': Math.round(entry.domContentLoadedEventEnd - entry.responseEnd),
              'Total Load': Math.round(entry.loadEventEnd - entry.navigationStart)
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      
      // Core Web Vitals
      setTimeout(() => {
        const paintEntries = performance.getEntriesByType('paint')
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
        
        if (fcpEntry) {
          console.log('🎨 First Contentful Paint:', Math.round(fcpEntry.startTime), 'ms')
        }
      }, 1000)
    })
  }
})
