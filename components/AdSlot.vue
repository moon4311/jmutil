<template>
  <ClientOnly>
    <div
      class="ad-wrapper"
      :style="wrapperStyle"
      ref="targetEl"
      aria-label="advertisement"
    >
      <div v-if="!ready" class="ad-skeleton" :style="skeletonStyle"></div>
      <!-- 카카오 광고 컨테이너는 뷰포트 진입 시에만 렌더링 -->
      <ins
        v-if="inView"
        class="kakao_ad_area"
        :style="adStyle"
        :data-ad-unit="unitId"
        :data-ad-width="width"
        :data-ad-height="height"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
// 광고 슬롯: 뷰포트 진입 시 ins를 생성해 렌더링, 래퍼로 고정 크기 영역을 확보해 CLS 방지
import { ref, computed, onMounted } from 'vue'
import { useLazyLoad } from '@/composables/useLazyLoad.js'
import { useKakaoAds } from '@/composables/useKakaoAds.js'

const props = defineProps({
  unitId: { type: String, required: true },
  width: { type: [Number, String], required: true },
  height: { type: [Number, String], required: true },
  // 추가 여백 등 스타일 조정용
  padding: { type: String, default: '0' }
})

const { useIntersectionObserver, lazyScript } = useLazyLoad()
const { refreshAds } = useKakaoAds()

const inView = ref(false)
const ready = ref(false)

const targetEl = useIntersectionObserver(async (entries) => {
  const entry = entries[0]
  if (!entry || !entry.isIntersecting || inView.value) return
  inView.value = true
  // 카카오 스크립트가 없다면 지연 로드
  try {
    if (!document.querySelector('script[src*="kas/static/ba.min.js"]')) {
      await lazyScript('//t1.daumcdn.net/kas/static/ba.min.js')
    }
  } catch (e) {
    // 스크립트 로드 실패시에도 영역은 유지
    console.warn('Kakao ad script load failed:', e)
  }
  // 스크립트가 있으면 광고 표시 시도
  setTimeout(() => {
    refreshAds()
    // 약간의 지연 후 스켈레톤 제거
    setTimeout(() => { ready.value = true }, 800)
  }, 50)
})

// 래퍼: 고정 크기 + 반응형 중앙 정렬
const wrapperStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : String(props.width),
  height: typeof props.height === 'number' ? `${props.height}px` : String(props.height),
  minHeight: typeof props.height === 'number' ? `${props.height}px` : String(props.height),
  display: 'block',
  margin: '0 auto',
  padding: props.padding,
  position: 'relative'
}))

const skeletonStyle = computed(() => ({
  width: '100%',
  height: '100%'
}))

// 광고 컨테이너 기본 스타일: 네트워크 로딩 전 숨김이더라도 래퍼가 공간을 보장
const adStyle = computed(() => ({
  display: 'none'
}))
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
