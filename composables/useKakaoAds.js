/**
 * 카카오 애드핏 광고 관리 Composable
 */
import { onMounted, onUnmounted, nextTick } from 'vue'

export function useKakaoAds() {
  let adsInitialized = false

  /**
   * 광고 스크립트 로드 확인
   */
  const checkAdScript = () => {
    return typeof window !== 'undefined' && 
           document.querySelector('script[src*="kas/static/ba.min.js"]')
  }

  /**
   * 광고 영역 표시
   */
  const showAds = () => {
    if (typeof window === 'undefined') return

    try {
      const ads = document.querySelectorAll('.kakao_ad_area')
      ads.forEach(ad => {
        if (ad.style.display === 'none') {
          ad.style.display = 'block'
        }
      })
      adsInitialized = true
    } catch (error) {
      console.log('광고 로딩 중...', error)
    }
  }

  /**
   * 광고 새로고침
   */
  const refreshAds = () => {
    if (checkAdScript() && !adsInitialized) {
      showAds()
    }
  }

  /**
   * 광고 초기화
   */
  const initAds = () => {
    if (typeof window === 'undefined') return

    // 페이지 로드 후 광고 표시
    nextTick(() => {
      setTimeout(() => {
        refreshAds()
      }, 1000)
    })

    // 스크립트 로드 완료시 광고 표시
    const interval = setInterval(() => {
      if (checkAdScript()) {
        refreshAds()
        clearInterval(interval)
      }
    }, 500)

    // 10초 후 타임아웃
    setTimeout(() => {
      clearInterval(interval)
    }, 10000)
  }

  /**
   * 광고 정리
   */
  const cleanupAds = () => {
    adsInitialized = false
  }

  return {
    initAds,
    refreshAds,
    cleanupAds,
    showAds
  }
}

export default useKakaoAds
