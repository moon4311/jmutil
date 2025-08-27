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
      @enter="onEnter"
      @after-enter="onAfterEnter"
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

import { computed } from 'vue';

/**
 * 컴포넌트 Props
 * @typedef {Object} Props
 * @property {string} title - 패널 제목 (필수)
 * @property {string} [color='blue'] - 테마 색상
 * @property {boolean} modelValue - 패널 확장 상태 (필수)
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
  }
});

const emit = defineEmits(['update:modelValue']);

/**
 * 고유한 패널 ID 생성
 */
const panelId = computed(() => {
  return `panel_${Math.random().toString(36).substr(2, 9)}`;
});

/**
 * 애니메이션 이벤트 핸들러들
 */
function onEnter(el) {
  el.style.height = '0px';
}

function onAfterEnter(el) {
  el.style.height = 'auto';
}

function onLeave(el) {
  el.style.height = el.scrollHeight + 'px';
  // Force reflow
  el.offsetHeight;
  el.style.height = '0px';
}

function onAfterLeave(el) {
  el.style.height = 'auto';
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

/* 애니메이션 - 공통 트랜지션 사용 */
.panel-expand-enter-active,
.panel-expand-leave-active {
  transition: height 0.3s ease;
}

.panel-expand-enter-from,
.panel-expand-leave-to {
  height: 0;
}
</style>
