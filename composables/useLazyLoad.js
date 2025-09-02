// CSR 최적화를 위한 지연 로딩 컴포저블
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

export const useLazyLoad = () => {
  const isClient = typeof window !== 'undefined'

  // 컴포넌트 지연 로딩
  // - loader 함수(() => import('...')) 또는 문자열 경로 지원
  // - 문자열 경로는 Vite 경고 방지를 위해 /* @vite-ignore */ 사용
  const lazyComponent = (componentOrPath) => {
    if (!isClient) return null
    if (typeof componentOrPath === 'function') {
      return defineAsyncComponent(componentOrPath)
    }
    if (typeof componentOrPath === 'string') {
      return defineAsyncComponent(() => import(/* @vite-ignore */ componentOrPath))
    }
    throw new Error('lazyComponent expects a loader function or a path string')
  }

  // 이미지 지연 로딩
  const lazyImage = (src) => {
    const loaded = ref(false)
    const error = ref(false)
    
    if (isClient) {
      const img = new Image()
      img.onload = () => { loaded.value = true }
      img.onerror = () => { error.value = true }
      img.src = src
    }
    
    return { loaded, error }
  }

  // 스크립트 지연 로딩
  const lazyScript = (src) => {
    if (!isClient) return Promise.resolve()
    
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }
      
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // 교차점 관찰자를 이용한 뷰포트 진입 감지
  const useIntersectionObserver = (callback, options = {}) => {
    const target = ref(null)
    
    onMounted(() => {
      if (!isClient || !target.value) return
      
      const observer = new IntersectionObserver(callback, {
        root: null,
        // rootMargin: '50px',
        threshold: 0.1,
        ...options
      })
      
      observer.observe(target.value)
      
      onUnmounted(() => {
        observer.disconnect()
      })
    })
    
    return target
  }

  return {
    lazyComponent,
    lazyImage,
    lazyScript,
    useIntersectionObserver
  }
}
