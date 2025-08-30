/**
 * 성능 측정 및 모니터링 (최적화 버전)
 */
export const usePerformanceMonitoring = () => {
  const metrics = ref({
    processTime: 0,
    memoryUsage: null,
    cacheHitRate: 0,
    bundleSize: 0,
    lcp: 0,
    fid: 0
  })

  const isMonitoring = ref(false)

  /**
   * 처리 시간 측정
   */
  const measureTime = async (fn, label = 'operation') => {
    const start = performance.now()
    
    try {
      const result = await fn()
      const end = performance.now()
      
      metrics.value.processTime = end - start
      
      // 개발 모드에서만 콘솔 출력
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const end = performance.now()
      metrics.value.processTime = end - start
      throw error
    }
  }

  /**
   * 메모리 사용량 측정 (브라우저에서만)
   */
  const measureMemory = () => {
    if (process.client && 'memory' in performance) {
      const memory = performance.memory
      metrics.value.memoryUsage = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100, // MB
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100, // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100 // MB
      }
    }
  }

  /**
   * 번들 크기 추정
   */
  const estimateBundleSize = () => {
    if (process.client) {
      const scripts = document.querySelectorAll('script[src]')
      let totalSize = 0
      
      scripts.forEach(script => {
        // 추정치 계산
        totalSize += script.src.length * 8
      })
      
      metrics.value.bundleSize = Math.round(totalSize / 1024 * 100) / 100 // KB
    }
  }

  /**
   * 실시간 성능 모니터링 시작
   */
  const startMonitoring = () => {
    if (isMonitoring.value) return
    
    isMonitoring.value = true
    
    const monitoringInterval = setInterval(() => {
      measureMemory()
      estimateBundleSize()
    }, 5000) // 5초마다 측정
    
    // 컴포넌트 언마운트 시 정리
    onUnmounted(() => {
      clearInterval(monitoringInterval)
      isMonitoring.value = false
    })
  }

  /**
   * 성능 리포트 생성
   */
  const generateReport = () => {
    return {
      ...metrics.value,
      timestamp: new Date().toISOString(),
      userAgent: process.client ? navigator.userAgent : 'server',
      viewport: process.client ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : null,
      connection: process.client && navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    }
  }

  /**
   * Core Web Vitals 측정
   */
  const measureWebVitals = () => {
    if (process.client && 'PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.value.lcp = lastEntry.startTime
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0]
        metrics.value.fid = firstInput.processingStart - firstInput.startTime
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })
    }
  }

  return {
    metrics: readonly(metrics),
    isMonitoring: readonly(isMonitoring),
    measureTime,
    measureMemory,
    estimateBundleSize,
    startMonitoring,
    generateReport,
    measureWebVitals
  }
}
