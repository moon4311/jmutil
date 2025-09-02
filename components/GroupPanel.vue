<template>
  <div class="group-panel">
    <button
      type="button"
      @click="$emit('update:modelValue', !modelValue)"
      class="group-panel__header"
      :class="[
        modelValue
          ? `bg-${color}-100`
          : `bg-${color}-50 hover:bg-${color}-100`,
        `group-panel__header--${color}`,
        'group-panel__header--colors',
        { 'group-panel__header--expanded': modelValue }
      ]"
      :aria-expanded="modelValue"
      :aria-controls="`panel-${panelId}`"
    >
      <span class="group-panel__title">{{ title }}</span>
      <v-icon 
        :color="modelValue ? color : color"
        class="group-panel__icon"
        :class="{ 'group-panel__icon--expanded': modelValue }"
      >
        {{ modelValue ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
      </v-icon>
    </button>
    <transition 
      name="panel-expand"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div 
        v-show="modelValue" 
        :id="`panel-${panelId}`"
        class="group-panel__content"
        role="region"
        :aria-labelledby="`header-${panelId}`"
      >
        <div class="group-panel__body">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 접을 수 있는 그룹 패널 컴포넌트
 * @component GroupPanel
 */

import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';

/**
 * 컴포넌트 Props
 * @typedef {Object} Props
 * @property {string} title - 패널 제목 (필수)
 * @property {string} [color='blue'] - 테마 색상
 * @property {boolean} modelValue - 패널 확장 상태 (필수)
 * @property {boolean} [mobileCollapsed=true] - 모바일에서 기본값으로 닫힌 상태 사용 여부
 */
const props = defineProps({
  title: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    default: 'blue',
    validator: (value) => {
      return ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'pink', 'teal', 'yellow', 'gray'].includes(value);
    }
  },
  modelValue: { 
    type: Boolean, 
    required: true 
  },
  mobileCollapsed: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'mobile-state-changed']);

// 클라이언트 사이드 마운트 여부
const isClient = ref(false);

/**
 * 고유한 패널 ID 생성
 */
const panelId = computed(() => {
  return `panel_${Math.random().toString(36).substr(2, 9)}`;
});

// 현재 화면 크기 상태 추적
const currentBreakpoint = ref('desktop');

/**
 * 화면 크기에 따라 패널 상태 설정 (개선된 버전)
 */
const setResponsiveState = () => {
  if (!isClient.value || !props.mobileCollapsed) return;
  
  const isDesktop = window.innerWidth >= 768; // md 브레이크포인트
  const newBreakpoint = isDesktop ? 'desktop' : 'mobile';
  
  // 브레이크포인트가 실제로 변경된 경우만 처리
  if (currentBreakpoint.value !== newBreakpoint) {
    currentBreakpoint.value = newBreakpoint;
    
    // 초기 로딩 시에만 자동 상태 변경, 사용자가 수동으로 변경한 이후에는 그대로 유지
    const shouldBeOpen = isDesktop;
    
    // 실제 모델값과 다를 때만 변경
    if (props.modelValue !== shouldBeOpen) {
      emit('update:modelValue', shouldBeOpen);
      emit('mobile-state-changed', { isDesktop, isOpen: shouldBeOpen });
    }
  }
};

// 리사이즈 핸들러 - 쓰로틀링 적용
let resizeTimeout = null;
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(setResponsiveState, 200); // 딜레이 증가
};

onMounted(async () => {
  await nextTick();
  isClient.value = true;
  
  // 초기 브레이크포인트 설정
  if (props.mobileCollapsed && process.client) {
    const isDesktop = window.innerWidth >= 768;
    currentBreakpoint.value = isDesktop ? 'desktop' : 'mobile';
    
    // 초기 상태만 설정 (한 번만)
    const shouldBeOpen = isDesktop;
    if (props.modelValue !== shouldBeOpen) {
      emit('update:modelValue', shouldBeOpen);
    }
  }

  // 리사이즈 이벤트 리스너
  if (process.client) {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (process.client && resizeTimeout) {
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', handleResize);
  }
});

/**
 * 애니메이션 이벤트 핸들러들 - 부드러운 높이 애니메이션
 */
function onBeforeEnter(el) {
  el.style.height = '0px';
  el.style.overflow = 'hidden';
}

function onEnter(el, done) {
  el.style.height = el.scrollHeight + 'px';
  
  // 트랜지션 완료 후 콜백 실행
  const transitionEnd = () => {
    el.removeEventListener('transitionend', transitionEnd);
    done();
  };
  el.addEventListener('transitionend', transitionEnd);
}

function onAfterEnter(el) {
  el.style.height = 'auto';
  el.style.overflow = 'visible';
}

function onBeforeLeave(el) {
  el.style.height = el.scrollHeight + 'px';
  el.style.overflow = 'hidden';
}

function onLeave(el, done) {
  // Force reflow
  el.offsetHeight;
  el.style.height = '0px';
  
  // 트랜지션 완료 후 콜백 실행
  const transitionEnd = () => {
    el.removeEventListener('transitionend', transitionEnd);
    done();
  };
  el.addEventListener('transitionend', transitionEnd);
}

function onAfterLeave(el) {
  el.style.height = 'auto';
  el.style.overflow = 'visible';
}
</script>

<style scoped>
.group-panel {
  margin-bottom: 1rem;
}

.group-panel__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  font-weight: 600;
  transition: background-color 0.2s, color 0.2s;
}

.group-panel__header:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* 색상별 텍스트 색상 지정 - 매우 높은 우선순위로 강제 적용 */
.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--blue.group-panel__header--expanded {
  color: rgb(29 78 216) !important; /* text-blue-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--blue:not(.group-panel__header--expanded) {
  color: rgb(59 130 246) !important; /* text-blue-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--green.group-panel__header--expanded {
  color: rgb(21 128 61) !important; /* text-green-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--green:not(.group-panel__header--expanded) {
  color: rgb(34 197 94) !important; /* text-green-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--red.group-panel__header--expanded {
  color: rgb(185 28 28) !important; /* text-red-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--red:not(.group-panel__header--expanded) {
  color: rgb(239 68 68) !important; /* text-red-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--orange.group-panel__header--expanded {
  color: rgb(194 65 12) !important; /* text-orange-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--orange:not(.group-panel__header--expanded) {
  color: rgb(249 115 22) !important; /* text-orange-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--purple.group-panel__header--expanded {
  color: rgb(126 34 206) !important; /* text-purple-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--purple:not(.group-panel__header--expanded) {
  color: rgb(168 85 247) !important; /* text-purple-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--indigo.group-panel__header--expanded {
  color: rgb(67 56 202) !important; /* text-indigo-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--indigo:not(.group-panel__header--expanded) {
  color: rgb(99 102 241) !important; /* text-indigo-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--pink.group-panel__header--expanded {
  color: rgb(190 24 93) !important; /* text-pink-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--pink:not(.group-panel__header--expanded) {
  color: rgb(236 72 153) !important; /* text-pink-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--teal.group-panel__header--expanded {
  color: rgb(15 118 110) !important; /* text-teal-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--teal:not(.group-panel__header--expanded) {
  color: rgb(20 184 166) !important; /* text-teal-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--yellow.group-panel__header--expanded {
  color: rgb(161 98 7) !important; /* text-yellow-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--yellow:not(.group-panel__header--expanded) {
  color: rgb(234 179 8) !important; /* text-yellow-500 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--gray.group-panel__header--expanded {
  color: rgb(55 65 81) !important; /* text-gray-700 */
}

.group-panel .group-panel__header.group-panel__header--colors.group-panel__header--gray:not(.group-panel__header--expanded) {
  color: rgb(107 114 128) !important; /* text-gray-500 */
}

.group-panel__title {
  text-align: left;
}

.group-panel__icon {
  transition: transform 0.2s;
}

.group-panel__icon--expanded {
  transform: rotate(180deg);
}

.group-panel__content {
  background-color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.group-panel__body {
  padding: 1rem;
}

/* 애니메이션 - 부드러운 높이 트랜지션 */
.panel-expand-enter-active,
.panel-expand-leave-active {
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden !important;
}

.panel-expand-enter-from,
.panel-expand-leave-to {
  height: 0 !important;
}
</style>
