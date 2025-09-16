/**
 * 광고 차단기 우회를 위한 Composable
 */
import { ref, nextTick } from 'vue'

export function useAdProtection() {
  const adBlockDetected = ref(false)
  const adLoadSuccess = ref(false)

  /**
   * 광고 차단기 감지
   */
  const detectAdBlock = () => {
    return new Promise((resolve) => {
      // 테스트용 요소 생성
      const testEl = document.createElement('div')
      testEl.innerHTML = '&nbsp;'
      testEl.className = 'adsbox'
      testEl.style.position = 'absolute'
      testEl.style.left = '-10000px'
      testEl.style.height = '1px'
      testEl.style.width = '1px'
      
      document.body.appendChild(testEl)
      
      setTimeout(() => {
        if (testEl.offsetHeight === 0) {
          adBlockDetected.value = true
          resolve(true)
        } else {
          adBlockDetected.value = false
          resolve(false)
        }
        
        document.body.removeChild(testEl)
      }, 100)
    })
  }

  /**
   * 난독화된 스크립트 URL 생성
   */
  const getObfuscatedScriptUrl = () => {
    // 프로토콜을 명시적으로 지정하여 CORS 문제 해결
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https:' : 'https:'
    const baseUrl = atob('dDEuZGF1bWNkbi5uZXQ=') // base64로 인코딩된 t1.daumcdn.net
    const scriptPath = atob('L2thcy9zdGF0aWMvYmEubWluLmpz') // base64로 인코딩된 /kas/static/ba.min.js
    return `${protocol}//${baseUrl}${scriptPath}`
  }

  /**
   * 프록시된 스크립트 로드 (CORS 해결)
   */
  const loadScriptViaProxy = async () => {
    try {
      // 프록시 URL을 통해 스크립트 로드 (script 태그 사용)
      const proxyUrl = '/api/proxy-ad-script'
      
      return new Promise((resolve, reject) => {
        // 이미 프록시 스크립트가 로드되어 있는지 확인
        if (document.querySelector('script[data-proxy-loaded="true"]')) {
          resolve(true)
          return
        }
        
        const script = document.createElement('script')
        script.src = proxyUrl
        script.async = true
        script.setAttribute('data-proxy-loaded', 'true')
        script.setAttribute('data-ad-loaded', 'true')
        
        script.onload = () => {
          console.log('프록시 스크립트 로드 성공')
          resolve(true)
        }
        
        script.onerror = (error) => {
          console.warn('프록시 스크립트 로드 실패:', error)
          resolve(false)
        }
        
        document.head.appendChild(script)
        
        // 5초 타임아웃
        setTimeout(() => {
          if (!script.onload.called) {
            reject(new Error('Proxy script load timeout'))
          }
        }, 5000)
      })
    } catch (error) {
      console.warn('프록시 스크립트 로드 실패:', error)
      return false
    }
  }

  /**
   * 동적 스크립트 로드 (난독화) - CORS 해결 버전
   */
  const loadAdScript = async () => {
    if (typeof window === 'undefined') return false

    try {
      // 이미 로드된 경우 스킵
      const existingScript = document.querySelector('script[data-ad-loaded="true"]') ||
                           document.querySelector('script[src*="kas/static/ba.min.js"]')
      
      if (existingScript) {
        adLoadSuccess.value = true
        return true
      }

      // 광고 차단기 감지
      const isBlocked = await detectAdBlock()
      
      if (isBlocked) {
        console.log('광고 차단기 감지됨, 프록시 로드 시도')
        const proxySuccess = await loadScriptViaProxy()
        if (proxySuccess) {
          adLoadSuccess.value = true
          return true
        }
      }

      // 일반 로드 시도 (script 태그 방식)
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = getObfuscatedScriptUrl()
        script.async = true
        script.crossOrigin = 'anonymous' // CORS 설정
        script.setAttribute('data-ad-loaded', 'true')
        
        script.onload = () => {
          adLoadSuccess.value = true
          console.log('AdFit 스크립트 로드 성공 (일반 방식)')
          resolve(true)
        }
        
        script.onerror = () => {
          console.warn('AdFit 스크립트 로드 실패 (일반 방식)')
          adLoadSuccess.value = false
          resolve(false)
        }
        
        document.head.appendChild(script)
        
        // 5초 타임아웃
        setTimeout(() => {
          if (!adLoadSuccess.value) {
            console.warn('AdFit 스크립트 로드 타임아웃')
            resolve(false)
          }
        }, 5000)
      })
    } catch (error) {
      console.warn('광고 스크립트 로드 실패:', error)
      adLoadSuccess.value = false
      return false
    }
  }

  /**
   * 난독화된 클래스명 생성
   */
  const getObfuscatedClassName = () => {
    // kakao_ad_area를 base64로 인코딩 후 디코딩하여 난독화
    const originalClass = 'kakao_ad_area'
    const timestamp = Date.now().toString(36)
    return `ad-${timestamp.slice(-4)}-area`
  }

  /**
   * 광고 영역 안전 렌더링
   */
  const createSafeAdElement = (unitId, width, height, className) => {
    const ins = document.createElement('ins')
    ins.className = className || getObfuscatedClassName()
    ins.style.display = 'none'
    ins.setAttribute('data-ad-unit', unitId)
    ins.setAttribute('data-ad-width', width)
    ins.setAttribute('data-ad-height', height)
    
    // 추가 속성으로 광고 차단기 회피
    ins.setAttribute('data-content-type', 'widget')
    ins.setAttribute('data-widget-id', `widget-${unitId}`)
    
    return ins
  }

  return {
    adBlockDetected,
    adLoadSuccess,
    detectAdBlock,
    loadAdScript,
    getObfuscatedClassName,
    createSafeAdElement,
    getObfuscatedScriptUrl
  }
}

export default useAdProtection