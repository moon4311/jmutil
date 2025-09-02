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
        class="kakao_ad_area"
        style="display:none;"
        :data-ad-unit="unitId"
        :data-ad-width="width"
        :data-ad-height="height"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
// 광고 슬롯: 뷰포트 진입 시 ins를 생성해 렌더링, 래퍼로 고정 크기 영역을 확보해 CLS 방지
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLazyLoad } from '@/composables/useLazyLoad.js'
import { useKakaoAds } from '@/composables/useKakaoAds.js'

const props = defineProps({
  unitId: { type: String, required: true },
  width: { type: [Number, String], required: true },
  height: { type: [Number, String], required: true },
  // 추가 여백 등 스타일 조정용
  padding: { type: String, default: '0' }
})

const { lazyScript } = useLazyLoad()
const { refreshAds } = useKakaoAds()

const inView = ref(false)
const ready = ref(false)
const targetEl = ref(null)
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
    
    // 카카오 스크립트가 없다면 지연 로드
    try {
      if (!document.querySelector('script[src*="kas/static/ba.min.js"]')) {
        console.log('Loading Kakao ad script...')
        await lazyScript('//t1.daumcdn.net/kas/static/ba.min.js')
      }
    } catch (e) {
      // 스크립트 로드 실패시에도 영역은 유지
      console.warn('Kakao ad script load failed:', e)
    }
    // 스크립트가 있으면 광고 표시 시도
    setTimeout(() => {
      console.log(`AdSlot ${props.unitId}: Refreshing ads...`)
      refreshAds()
      // 광고 초기화 직후 스켈레톤을 짧게 유지 후 제거
      setTimeout(() => { 
        console.log(`AdSlot ${props.unitId}: Ready state = true`)
        ready.value = true 
      }, 600)
    }, 50)
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
</style>
