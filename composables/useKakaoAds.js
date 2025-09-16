/**
 * 카카오 애드핏 광고 관리 Composable (개선된 버전)
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import { useAdProtection } from './useAdProtection.js'

export function useKakaoAds() {
  let adsInitialized = false
  const { adBlockDetected, adLoadSuccess, loadAdScript, detectAdBlock } = useAdProtection()

  /**
   * 광고 스크립트 로드 확인 (다양한 방식으로 확인)
   */
  const checkAdScript = () => {
    if (typeof window === 'undefined') return false
    
    // 기존 방식
    const hasOriginalScript = document.querySelector('script[src*="kas/static/ba.min.js"]')
    
    // 프록시 방식
    const hasProxyScript = document.querySelector('script[data-ad-loaded="true"]')
    
    // 전역 객체 확인
    const hasGlobalAd = window.adfit || window._adfit || window.kakaoAd
    
    return hasOriginalScript || hasProxyScript || hasGlobalAd
  }

  /**
   * 광고 영역 표시 (개선된 버전)
   */
  const showAds = async () => {
    if (typeof window === 'undefined') return

    try {
      // 광고 차단기 감지
      await detectAdBlock()
      
      // 기존 클래스와 새로운 클래스 모두 지원
      const selectors = [
        '.kakao_ad_area',
        '.ad-area',
        '[data-widget-id*="widget-"]',
        'ins[data-ad-unit]'
      ]
      
      selectors.forEach(selector => {
        const ads = document.querySelectorAll(selector)
        ads.forEach(ad => {
          if (ad.style.display === 'none') {
            ad.style.display = 'block'
          }
          
          // 광고 로드 실패 시 대체 컨텐츠 표시
          if (adBlockDetected.value && !adLoadSuccess.value) {
            ad.innerHTML = '<div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; border-radius: 4px;">광고</div>'
            ad.style.display = 'block'
          }
        })
      })
      
      adsInitialized = true
    } catch (error) {
      console.log('광고 로딩 중...', error)
    }
  }

  /**
   * 광고 새로고침 (개선된 버전)
   */
  const refreshAds = async () => {
    if (!checkAdScript() && !adsInitialized) {
      // 스크립트가 없으면 로드 시도
      const success = await loadAdScript()
      if (success || adBlockDetected.value) {
        await showAds()
      }
    } else {
      await showAds()
    }
  }

  /**
   * 광고 초기화 (개선된 버전)
   */
  const initAds = async () => {
    if (typeof window === 'undefined') return

    try {
      // 스크립트 로드
      await loadAdScript()
      
      // 페이지 로드 후 광고 표시
      nextTick(async () => {
        setTimeout(async () => {
          await refreshAds()
        }, 1000)
      })

      // 추가 재시도 로직
      const maxRetries = 3
      let retryCount = 0
      
      const retryInterval = setInterval(async () => {
        if (checkAdScript() || retryCount >= maxRetries) {
          await refreshAds()
          clearInterval(retryInterval)
        }
        retryCount++
      }, 1000)

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(retryInterval)
      }, 10000)
      
    } catch (error) {
      console.warn('광고 초기화 실패:', error)
    }
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
    showAds,
    checkAdScript,
    adBlockDetected,
    adLoadSuccess
  }
}

export default useKakaoAds
