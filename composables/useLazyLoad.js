// CSR 최적화를 위한 지연 로딩 컴포저블
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

export const useLazyLoad = () => {
  const isClient = typeof window !== 'undefined'

  // 컴포넌트 지연 로딩
  const lazyComponent = (componentPath) => {
    if (!isClient) return null
    return defineAsyncComponent(() => import(componentPath))
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
        rootMargin: '50px',
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
