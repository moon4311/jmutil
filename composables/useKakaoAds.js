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
    
    // AdFit 관련 함수 확인
    const hasAdFunctions = typeof window.adfit !== 'undefined' && 
                          typeof window.adfit.render === 'function'
    
    return hasOriginalScript || hasProxyScript || hasGlobalAd || hasAdFunctions
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
      
      let adsFound = 0
      let adsShown = 0
      
      selectors.forEach(selector => {
        const ads = document.querySelectorAll(selector)
        adsFound += ads.length
        
        ads.forEach(ad => {
          // 광고 요소 강제 표시
          if (ad.style.display === 'none' || ad.style.display === '') {
            ad.style.display = 'block'
            ad.style.visibility = 'visible'
            ad.style.opacity = '1'
          }
          
          // AdFit 초기화 함수 호출 (있는 경우)
          if (typeof window.adfit !== 'undefined') {
            try {
              window.adfit.refresh()
            } catch (e) {
              console.log('AdFit refresh failed:', e)
            }
          }
          
          // 광고 로드 실패 시 대체 컨텐츠 표시
          if (adBlockDetected.value && !adLoadSuccess.value) {
            ad.innerHTML = '<div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; border-radius: 4px; min-height: 100px; display: flex; align-items: center; justify-content: center;">광고</div>'
            ad.style.display = 'block'
          }
          
          adsShown++
        })
      })
      
      console.log(`광고 표시 완료: ${adsShown}/${adsFound} 광고 처리됨`)
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
   * 광고 초기화 (완전히 새로운 버전)
   */
  const initAds = async () => {
    if (typeof window === 'undefined') return

    try {
      console.log('useKakaoAds: Starting initialization...')
      
      // 1단계: 광고 차단기 감지
      await detectAdBlock()
      
      // 2단계: 스크립트 로드 (우선순위별로)
      let scriptReady = false
      
      // A) 기존 스크립트 확인
      if (checkAdScript()) {
        scriptReady = true
        console.log('useKakaoAds: Script already available')
      }
      
      // B) 스크립트 로드 시도
      if (!scriptReady) {
        console.log('useKakaoAds: Loading script...')
        const loadResult = await loadAdScript()
        if (loadResult) {
          scriptReady = true
          console.log('useKakaoAds: Script loaded successfully')
        }
      }
      
      // 3단계: 광고 렌더링 준비
      await nextTick()
      
      // 4단계: 실제 광고 표시 시도
      if (scriptReady || adBlockDetected.value) {
        console.log('useKakaoAds: Starting ad display...')
        await showAds()
        
        // 추가 렌더링 시도 (일정 간격으로)
        const renderInterval = setInterval(async () => {
          const adElements = document.querySelectorAll('[data-ad-unit]')
          let hasVisibleAds = false
          
          adElements.forEach(el => {
            if (el.offsetHeight > 0 && el.innerHTML.trim().length > 0) {
              hasVisibleAds = true
            }
          })
          
          if (hasVisibleAds) {
            console.log('useKakaoAds: Ads successfully rendered')
            clearInterval(renderInterval)
          } else {
            // 재렌더링 시도
            await showAds()
          }
        }, 2000)
        
        // 10초 후 정리
        setTimeout(() => {
          clearInterval(renderInterval)
        }, 10000)
      }
      
    } catch (error) {
      console.warn('useKakaoAds: Initialization failed:', error)
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
