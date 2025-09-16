// 폰트 최적화 플러그인 - 아이콘 체크 및 폴백 처리
export default defineNuxtPlugin(() => {
  if (process.client) {
    const checkMDIIcons = () => {
      // MDI 폰트가 로드되었는지 확인
      const testElement = document.createElement('span')
      testElement.className = 'mdi mdi-check'
      testElement.style.position = 'absolute'
      testElement.style.visibility = 'hidden'
      document.body.appendChild(testElement)
      
      const computedStyle = window.getComputedStyle(testElement, '::before')
      const content = computedStyle.content
      
      document.body.removeChild(testElement)
      
      // MDI 아이콘이 제대로 로드되었는지 확인
      if (content && content !== 'none' && content !== '""') {
        document.body.classList.add('mdi-loaded')
        console.log('✅ MDI 아이콘 로드 완료')
      } else {
        console.warn('⚠️ MDI 아이콘 로드 실패 - 폴백 처리')
        document.body.classList.add('mdi-fallback')
        
        // 폴백으로 다시 시도
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      }
    }

    // DOM이 준비된 후 체크
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkMDIIcons)
    } else {
      setTimeout(checkMDIIcons, 100)
    }
  }
})