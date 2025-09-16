<template>
  <ClientOnly>
    <div
      class="ad-wrapper"
      :style="{
        width: typeof width === 'number' ? `${width}px` : String(width),
        height: typeof height === 'number' ? `${height}px` : String(height),
        minHeight: typeof height === 'number' ? `${height}px` : String(height),
        display: 'block',
        margin: '0 auto',
        padding: padding,
        position: 'relative'
      }"
      ref="targetEl"
      aria-label="advertisement"
    >
      <div v-if="!ready" class="ad-skeleton" :style="{ width: '100%', height: '100%' }"></div>
      <!-- 카카오 광고 컨테이너는 뷰포트 진입 시에만 렌더링 -->
      <ins
        v-if="inView"
        :class="adClassName"
        :data-ad-unit="unitId"
        :data-ad-width="width"
        :data-ad-height="height"
        :data-widget-id="`widget-${unitId}`"
        data-content-type="widget"
        :style="{ 
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: typeof height === 'number' ? `${height}px` : String(height)
        }"
        ref="adElement"
      />
      <!-- 광고 차단시 대체 컨텐츠 -->
      <div 
        v-if="inView && adBlockDetected && !adLoadSuccess" 
        class="ad-fallback"
        :style="{ width: '100%', height: '100%' }"
      >
        <div class="ad-placeholder">
          광고
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
// 광고 슬롯: 뷰포트 진입 시 ins를 생성해 렌더링, 래퍼로 고정 크기 영역을 확보해 CLS 방지
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLazyLoad } from '@/composables/useLazyLoad.js'
import { useKakaoAds } from '@/composables/useKakaoAds.js'
import { useAdProtection } from '@/composables/useAdProtection.js'
import { useAdMonitoring } from '@/composables/useAdMonitoring.js'

const props = defineProps({
  unitId: { type: String, required: true },
  width: { type: [Number, String], required: true },
  height: { type: [Number, String], required: true },
  // 추가 여백 등 스타일 조정용
  padding: { type: String, default: '0' }
})

const { lazyScript } = useLazyLoad()
const { refreshAds, adBlockDetected, adLoadSuccess } = useKakaoAds()
const { getObfuscatedClassName, loadAdScript } = useAdProtection()
const { startAdLoading, reportAdSuccess, reportAdFailure, reportAdBlocked } = useAdMonitoring()

const inView = ref(false)
const ready = ref(false)
const targetEl = ref(null)
const adElement = ref(null)
const adClassName = ref('kakao_ad_area') // 기본값
let observer = null

// onUnmounted를 async setup 전에 등록
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    console.log(`AdSlot ${props.unitId}: Observer disconnected`)
  }
})

// 광고 초기화 함수
const initializeAd = async () => {
  console.log(`AdSlot ${props.unitId}: Starting ad initialization...`)
  
  // DOM 업데이트 대기
  await nextTick()
  
  // 광고 요소가 DOM에 있는지 확인
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const currentAdElement = document.querySelector(`[data-ad-unit="${props.unitId}"]`)
  
  if (!currentAdElement) {
    console.error(`AdSlot ${props.unitId}: Ad element not found in DOM`)
    reportAdFailure(props.unitId, 'Ad element not found')
    ready.value = true
    return
  }
  
  console.log(`AdSlot ${props.unitId}: Ad element found, attempting render...`)
  
  // AdFit 렌더링 시도 (여러 방법)
  let renderSuccess = false
  
  // 방법 1: adfit.render 사용
  if (typeof window !== 'undefined' && window.adfit && typeof window.adfit.render === 'function') {
    try {
      window.adfit.render(currentAdElement)
      renderSuccess = true
      console.log(`AdSlot ${props.unitId}: Rendered using adfit.render`)
    } catch (renderError) {
      console.warn(`AdSlot ${props.unitId}: adfit.render failed:`, renderError)
    }
  }
  
  // 방법 2: 전역 새로고침
  if (!renderSuccess && typeof window !== 'undefined' && window.adfit && typeof window.adfit.refresh === 'function') {
    try {
      window.adfit.refresh()
      renderSuccess = true
      console.log(`AdSlot ${props.unitId}: Refreshed using adfit.refresh`)
    } catch (refreshError) {
      console.warn(`AdSlot ${props.unitId}: adfit.refresh failed:`, refreshError)
    }
  }
  
  // 방법 3: useKakaoAds의 refreshAds 사용
  if (!renderSuccess) {
    try {
      await refreshAds()
      renderSuccess = true
      console.log(`AdSlot ${props.unitId}: Refreshed using useKakaoAds`)
    } catch (refreshError) {
      console.warn(`AdSlot ${props.unitId}: useKakaoAds refresh failed:`, refreshError)
    }
  }
  
  // 결과 확인 (2초 후)
  setTimeout(() => {
    checkAdResult(currentAdElement)
  }, 2000)
}

// 광고 결과 확인 함수
const checkAdResult = (adElement) => {
  console.log(`AdSlot ${props.unitId}: Checking ad result...`)
  
  if (!adElement) {
    reportAdFailure(props.unitId, 'Ad element lost')
    ready.value = true
    return
  }
  
  // 더 정확한 가시성 검사
  const isVisible = adElement.offsetHeight > 0 && 
                   adElement.offsetWidth > 0 &&
                   getComputedStyle(adElement).display !== 'none' &&
                   getComputedStyle(adElement).visibility !== 'hidden'
  
  // AdFit 스크립트가 광고를 실제로 렌더링했는지 확인
  const hasAdContent = adElement.innerHTML.trim().length > 0 ||
                      adElement.querySelector('iframe') ||
                      adElement.querySelector('script') ||
                      adElement.hasChildNodes()
  
  console.log(`AdSlot ${props.unitId}: Check result:`, {
    visible: isVisible,
    hasContent: hasAdContent,
    offsetHeight: adElement.offsetHeight,
    offsetWidth: adElement.offsetWidth,
    innerHTML: adElement.innerHTML.substring(0, 100),
    childNodes: adElement.childNodes.length
  })
  
  if (isVisible && hasAdContent) {
    reportAdSuccess(props.unitId)
    console.log(`AdSlot ${props.unitId}: Ad successfully loaded and displayed`)
  } else if (adBlockDetected.value) {
    reportAdBlocked(props.unitId)
    console.log(`AdSlot ${props.unitId}: Ad blocked by ad blocker`)
  } else {
    reportAdFailure(props.unitId, `Visibility: ${isVisible}, Content: ${hasAdContent}`)
    console.log(`AdSlot ${props.unitId}: Ad failed to display properly`)
  }
  
  ready.value = true
}

onMounted(async () => {
  console.log(`AdSlot ${props.unitId}: Component mounted`)
  
  // DOM 업데이트 완료까지 대기
  await nextTick()
  
  // targetEl이 유효한지 확인
  if (!targetEl.value || !(targetEl.value instanceof Element)) {
    console.error(`AdSlot ${props.unitId}: targetEl is not a valid Element:`, targetEl.value)
    return
  }
  
  // IntersectionObserver를 통한 지연 로딩
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect() // 한번만 실행
    
    console.log(`AdSlot ${props.unitId}: In view, starting load process...`)

    // 카카오 스크립트 로드 시도 (여러 방법)
    try {
      // 먼저 기본 스크립트 로드 시도
      console.log(`AdSlot ${props.unitId}: Loading AdFit script...`)
      
      let scriptLoaded = false
      
      // 1차: 기본 CDN에서 로드
      if (!document.querySelector('script[src*="kas/static/ba.min.js"]')) {
        try {
          await lazyScript('https://t1.daumcdn.net/kas/static/ba.min.js', {
            crossorigin: 'anonymous',
            attributes: {
              'data-adfit-loaded': 'true'
            }
          })
          scriptLoaded = true
          console.log(`AdSlot ${props.unitId}: CDN script loaded successfully`)
        } catch (cdnError) {
          console.warn(`AdSlot ${props.unitId}: CDN loading failed:`, cdnError)
        }
      } else {
        scriptLoaded = true
        console.log(`AdSlot ${props.unitId}: Script already loaded`)
      }
      
      // 2차: 프록시 시도 (CDN 실패시)
      if (!scriptLoaded) {
        try {
          const proxyLoaded = await loadAdScript()
          if (proxyLoaded) {
            scriptLoaded = true
            console.log(`AdSlot ${props.unitId}: Proxy script loaded successfully`)
          }
        } catch (proxyError) {
          console.warn(`AdSlot ${props.unitId}: Proxy loading failed:`, proxyError)
        }
      }
      
      if (!scriptLoaded) {
        console.error(`AdSlot ${props.unitId}: All script loading methods failed`)
        reportAdFailure(props.unitId, 'Script loading failed')
        ready.value = true
        return
      }
      
      // 스크립트 로드 후 광고 초기화 시도
      console.log(`AdSlot ${props.unitId}: Initializing ad...`)
      await initializeAd()
      
    } catch (e) {
      // 스크립트 로드 실패
      console.warn('Kakao ad script load failed:', e)
      reportAdFailure(props.unitId, `Script load failed: ${e.message}`)
      ready.value = true
    }
  }, {
    rootMargin: '50px',
    threshold: 0
  })

  // targetEl이 여전히 유효한지 다시 확인 후 observer 시작
  if (targetEl.value && targetEl.value instanceof Element) {
    observer.observe(targetEl.value)
    console.log(`AdSlot ${props.unitId}: Observer started`)
  } else {
    console.error(`AdSlot ${props.unitId}: Cannot start observer - targetEl invalid`)
  }
})

// 광고 컨테이너는 숨기지 않고, 스켈레톤으로만 시각적 안정성 제공
</script>

<style scoped>
.ad-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #ffffff 37%, #f0f0f0 63%);
  background-size: 400% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  position: absolute;
  inset: 0;
}

@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: -100% 50%; }
}

.ad-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-placeholder {
  background: #f5f5f5;
  color: #999;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  font-size: 14px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
