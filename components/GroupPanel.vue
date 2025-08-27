<template>
  <div class="group-panel">
    <button
      type="button"
      @click="$emit('update:modelValue', !modelValue)"
      class="group-panel__header"
      :class="[
        modelValue
          ? `bg-${color}-100 text-${color}-700`
          : `bg-${color}-50 text-${color}-500 hover:bg-${color}-100`,
        `group-panel__header--${color}`
      ]"
      :aria-expanded="modelValue"
      :aria-controls="`panel-${panelId}`"
    >
      <span class="group-panel__title">{{ title }}</span>
      <v-icon 
        :color="modelValue ? color : color + '-lighten-2'"
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
      return ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'pink'].includes(value);
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

/**
 * 화면 크기에 따라 패널 상태 설정
 */
const setResponsiveState = () => {
  if (!isClient.value || !props.mobileCollapsed) return;
  
  const isDesktop = window.innerWidth >= 768; // md 브레이크포인트
  const shouldBeOpen = isDesktop; // 데스크톱에서는 열림, 모바일에서는 닫힘
  
  if (props.modelValue !== shouldBeOpen) {
    emit('update:modelValue', shouldBeOpen);
    emit('mobile-state-changed', { isDesktop, isOpen: shouldBeOpen });
  }
};

// 리사이즈 핸들러 - 쓰로틀링 적용
let resizeTimeout = null;
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(setResponsiveState, 150);
};

onMounted(async () => {
  await nextTick();
  isClient.value = true;
  
  // 초기 상태 설정
  if (props.mobileCollapsed) {
    setResponsiveState();
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
