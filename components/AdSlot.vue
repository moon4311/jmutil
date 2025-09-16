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
        style="display:none;"
        :data-ad-unit="unitId"
        :data-ad-width="width"
        :data-ad-height="height"
        :data-widget-id="`widget-${unitId}`"
        data-content-type="widget"
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
const adClassName = ref('kakao_ad_area') // 기본값
let observer = null

// onUnmounted를 async setup 전에 등록
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    console.log(`AdSlot ${props.unitId}: Observer disconnected`)
  }
})

// 직접 IntersectionObserver 구현
onMounted(async () => {
  console.log(`AdSlot ${props.unitId}: Component mounted`)
  
  // DOM 업데이트 완료까지 대기
  await nextTick()
  
  if (!targetEl.value) {
    console.error(`AdSlot ${props.unitId}: targetEl still not found after nextTick`)
    return
  }

  observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0]
    console.log(`AdSlot ${props.unitId}: Observer callback fired, isIntersecting: ${entry.isIntersecting}`)
    
    if (!entry.isIntersecting || inView.value) return
    
    console.log(`AdSlot ${props.unitId}: Entering viewport, loading ad...`)
    inView.value = true
    
    // 모니터링 시작
    startAdLoading(props.unitId)
    
    // 난독화된 클래스명 생성 (광고 차단기 우회)
    adClassName.value = getObfuscatedClassName()
    
    // 카카오 스크립트 로드 시도 (여러 방법)
    try {
      const scriptLoaded = await loadAdScript()
      console.log(`AdSlot ${props.unitId}: Script load result:`, scriptLoaded)
      
      if (!scriptLoaded) {
        // 기존 방법으로 폴백
        if (!document.querySelector('script[src*="kas/static/ba.min.js"]')) {
          console.log('Loading Kakao ad script via fallback...')
          await lazyScript('//t1.daumcdn.net/kas/static/ba.min.js')
        }
      }
      
      // 스크립트가 있으면 광고 표시 시도
      setTimeout(async () => {
        console.log(`AdSlot ${props.unitId}: Refreshing ads...`)
        await refreshAds()
        
        // 광고 로딩 결과 확인
        setTimeout(() => {
          const adElement = document.querySelector(`[data-ad-unit="${props.unitId}"]`)
          const isVisible = adElement && adElement.offsetHeight > 0 && adElement.style.display !== 'none'
          
          if (isVisible || adLoadSuccess.value) {
            reportAdSuccess(props.unitId)
          } else if (adBlockDetected.value) {
            reportAdBlocked(props.unitId)
          } else {
            reportAdFailure(props.unitId, 'Ad element not visible')
          }
          
          console.log(`AdSlot ${props.unitId}: Ready state = true`)
          ready.value = true
        }, 1000)
      }, 50)
      
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

  observer.observe(targetEl.value)
  console.log(`AdSlot ${props.unitId}: Observer started`)
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
