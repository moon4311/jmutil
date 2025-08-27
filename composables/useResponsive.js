// useResponsive.js - 반응형 관련 composable
import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * 반응형 디자인을 위한 composable
 * @returns {Object} 반응형 상태와 유틸리티 함수들
 */
export function useResponsive() {
  // 브레이크포인트 정의
  const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }

  // 현재 화면 너비
  const screenWidth = ref(process.client ? window.innerWidth : 1024)
  const screenHeight = ref(process.client ? window.innerHeight : 768)

  /**
   * 화면 크기 업데이트 함수
   */
  const updateScreenSize = () => {
    if (process.client) {
      screenWidth.value = window.innerWidth
      screenHeight.value = window.innerHeight
    }
  }

  /**
   * 리사이즈 이벤트 핸들러 (throttled)
   */
  let resizeTimeout = null
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(updateScreenSize, 100)
  }

  // 라이프사이클
  onMounted(() => {
    updateScreenSize()
    if (process.client) {
      window.addEventListener('resize', handleResize)
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', handleResize)
    }
    if (resizeTimeout) clearTimeout(resizeTimeout)
  })

  /**
   * 브레이크포인트별 computed 속성들
   */
  const isMobile = computed(() => screenWidth.value < BREAKPOINTS.md)
  const isTablet = computed(() => screenWidth.value >= BREAKPOINTS.md && screenWidth.value < BREAKPOINTS.lg)
  const isDesktop = computed(() => screenWidth.value >= BREAKPOINTS.lg)
  const isSmallScreen = computed(() => screenWidth.value < BREAKPOINTS.sm)
  const isLargeScreen = computed(() => screenWidth.value >= BREAKPOINTS.xl)

  /**
   * 특정 브레이크포인트 체크 함수
   * @param {string} breakpoint - 브레이크포인트 이름
   * @returns {boolean} 해당 브레이크포인트 이상인지 여부
   */
  const isAbove = (breakpoint) => {
    return computed(() => screenWidth.value >= (BREAKPOINTS[breakpoint] || 0))
  }

  /**
   * 특정 브레이크포인트 미만 체크 함수
   * @param {string} breakpoint - 브레이크포인트 이름
   * @returns {boolean} 해당 브레이크포인트 미만인지 여부
   */
  const isBelow = (breakpoint) => {
    return computed(() => screenWidth.value < (BREAKPOINTS[breakpoint] || Infinity))
  }

  /**
   * 아코디언 초기 상태 생성 함수
   * @param {number} count - 패널 개수
   * @param {boolean} [forceCollapsed=false] - 강제로 모두 닫힌 상태로 설정
   * @returns {Array<boolean>} 초기 상태 배열
   */
  const createAccordionState = (count, forceCollapsed = false) => {
    if (forceCollapsed) {
      return new Array(count).fill(false)
    }
    // 모바일에서는 닫힌 상태, 데스크톱에서는 열린 상태
    const defaultState = !isMobile.value
    return new Array(count).fill(defaultState)
  }

  /**
   * CSS 클래스명 생성 도우미
   * @param {Object} classes - 조건부 클래스 객체
   * @returns {string} 클래스명 문자열
   */
  const responsiveClass = (classes) => {
    const result = []
    
    if (classes.mobile && isMobile.value) result.push(classes.mobile)
    if (classes.tablet && isTablet.value) result.push(classes.tablet)
    if (classes.desktop && isDesktop.value) result.push(classes.desktop)
    if (classes.default) result.push(classes.default)
    
    return result.join(' ')
  }

  return {
    // 화면 크기 정보
    screenWidth,
    screenHeight,
    BREAKPOINTS,
    
    // 브레이크포인트 체크
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    
    // 유틸리티 함수
    isAbove,
    isBelow,
    createAccordionState,
    responsiveClass,
    updateScreenSize
  }
}

export default useResponsive
