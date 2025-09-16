/**
 * 광고 로딩 상태 모니터링 Composable
 */
import { ref, reactive } from 'vue'

export function useAdMonitoring() {
  const adStats = reactive({
    totalAds: 0,
    loadedAds: 0,
    failedAds: 0,
    blockedAds: 0,
    loadTime: 0
  })

  const adLoadHistory = ref([])
  const startTime = ref(0)

  /**
   * 광고 로딩 시작
   */
  const startAdLoading = (unitId) => {
    startTime.value = Date.now()
    adStats.totalAds++
    
    const loadEvent = {
      unitId,
      startTime: startTime.value,
      status: 'loading',
      timestamp: new Date().toISOString()
    }
    
    adLoadHistory.value.push(loadEvent)
    
    // 개발 환경에서만 로그
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Ad Monitor] 광고 로딩 시작: ${unitId}`)
    }
  }

  /**
   * 광고 로딩 성공
   */
  const reportAdSuccess = (unitId) => {
    const endTime = Date.now()
    const loadTime = endTime - startTime.value
    
    adStats.loadedAds++
    adStats.loadTime += loadTime
    
    // 히스토리 업데이트
    const historyItem = adLoadHistory.value.find(item => 
      item.unitId === unitId && item.status === 'loading'
    )
    
    if (historyItem) {
      historyItem.status = 'success'
      historyItem.loadTime = loadTime
      historyItem.endTime = endTime
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Ad Monitor] 광고 로딩 성공: ${unitId} (${loadTime}ms)`)
    }
  }

  /**
   * 광고 로딩 실패
   */
  const reportAdFailure = (unitId, reason = 'unknown') => {
    const endTime = Date.now()
    const loadTime = endTime - startTime.value
    
    adStats.failedAds++
    
    // 히스토리 업데이트
    const historyItem = adLoadHistory.value.find(item => 
      item.unitId === unitId && item.status === 'loading'
    )
    
    if (historyItem) {
      historyItem.status = 'failed'
      historyItem.loadTime = loadTime
      historyItem.endTime = endTime
      historyItem.failureReason = reason
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Ad Monitor] 광고 로딩 실패: ${unitId} - ${reason} (${loadTime}ms)`)
    }
  }

  /**
   * 광고 차단 감지
   */
  const reportAdBlocked = (unitId) => {
    adStats.blockedAds++
    
    // 히스토리 업데이트
    const historyItem = adLoadHistory.value.find(item => 
      item.unitId === unitId && item.status === 'loading'
    )
    
    if (historyItem) {
      historyItem.status = 'blocked'
      historyItem.endTime = Date.now()
      historyItem.loadTime = historyItem.endTime - historyItem.startTime
    }

    if (process.env.NODE_ENV === 'development') {
      console.info(`[Ad Monitor] 광고 차단됨: ${unitId}`)
    }
  }

  /**
   * 통계 정보 가져오기
   */
  const getAdStats = () => {
    const avgLoadTime = adStats.loadedAds > 0 ? 
      Math.round(adStats.loadTime / adStats.loadedAds) : 0
    
    return {
      ...adStats,
      avgLoadTime,
      successRate: adStats.totalAds > 0 ? 
        Math.round((adStats.loadedAds / adStats.totalAds) * 100) : 0,
      blockRate: adStats.totalAds > 0 ? 
        Math.round((adStats.blockedAds / adStats.totalAds) * 100) : 0
    }
  }

  /**
   * 상세 리포트 생성
   */
  const generateReport = () => {
    const stats = getAdStats()
    const recentHistory = adLoadHistory.value.slice(-10) // 최근 10개
    
    return {
      summary: stats,
      recentHistory,
      recommendations: generateRecommendations(stats)
    }
  }

  /**
   * 개선 권장사항 생성
   */
  const generateRecommendations = (stats) => {
    const recommendations = []
    
    if (stats.blockRate > 30) {
      recommendations.push('광고 차단율이 높습니다. 프록시 로딩이나 다른 광고 네트워크를 고려해보세요.')
    }
    
    if (stats.avgLoadTime > 3000) {
      recommendations.push('광고 로딩 시간이 너무 깁니다. 로딩 최적화가 필요합니다.')
    }
    
    if (stats.successRate < 70) {
      recommendations.push('광고 성공률이 낮습니다. 스크립트 로딩 방식을 점검해보세요.')
    }
    
    return recommendations
  }

  /**
   * 통계 초기화
   */
  const resetStats = () => {
    Object.assign(adStats, {
      totalAds: 0,
      loadedAds: 0,
      failedAds: 0,
      blockedAds: 0,
      loadTime: 0
    })
    
    adLoadHistory.value = []
  }

  return {
    adStats,
    adLoadHistory,
    startAdLoading,
    reportAdSuccess,
    reportAdFailure,
    reportAdBlocked,
    getAdStats,
    generateReport,
    resetStats
  }
}

export default useAdMonitoring