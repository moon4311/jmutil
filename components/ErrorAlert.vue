// components/ErrorAlert.vue - 에러 알림 컴포넌트
<template>
  <transition name="error-alert" appear>
    <v-alert
      v-if="show"
      :type="type"
      :variant="variant"
      :color="alertColor"
      closable
      class="error-alert mb-4"
      @click:close="handleClose"
    >
      <template #prepend>
        <v-icon>{{ alertIcon }}</v-icon>
      </template>
      <div>
        <div class="font-semibold">{{ displayTitle }}</div>
        <div class="text-sm mt-1">{{ message }}</div>
        <div v-if="details" class="text-xs mt-2 opacity-75">
          {{ details }}
        </div>
        <!-- 재시도 버튼 -->
        <div v-if="retryable" class="mt-3">
          <v-btn
            size="small"
            :color="alertColor"
            variant="text"
            prepend-icon="mdi-refresh"
            @click="$emit('retry')"
          >
            다시 시도
          </v-btn>
        </div>
      </div>
    </v-alert>
  </transition>
</template>

<script setup>
/**
 * 에러 알림 컴포넌트
 * @component ErrorAlert
 */

import { computed } from 'vue';

/**
 * 컴포넌트 Props
 * @typedef {Object} Props
 * @property {boolean} [show=false] - 알림 표시 여부
 * @property {string} [type='error'] - 알림 타입 (error, warning, info, success)
 * @property {string} [variant='tonal'] - 알림 변형 (tonal, flat, outlined)
 * @property {string} [title] - 알림 제목
 * @property {string} message - 알림 메시지 (필수)
 * @property {string} [details] - 추가 세부 정보
 * @property {boolean} [retryable=false] - 재시도 가능 여부
 * @property {boolean} [autoClose=false] - 자동 닫기 여부
 * @property {number} [autoCloseDelay=5000] - 자동 닫기 지연시간 (ms)
 */
const props = defineProps({
  show: { 
    type: Boolean, 
    default: false 
  },
  type: { 
    type: String, 
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  variant: { 
    type: String, 
    default: 'tonal' 
  },
  title: String,
  message: { 
    type: String, 
    required: true 
  },
  details: String,
  retryable: { 
    type: Boolean, 
    default: false 
  },
  autoClose: { 
    type: Boolean, 
    default: false 
  },
  autoCloseDelay: { 
    type: Number, 
    default: 5000 
  }
});

const emit = defineEmits(['close', 'retry']);

/**
 * 알림 타입별 설정
 */
const alertConfig = {
  error: {
    title: '오류가 발생했습니다',
    icon: 'mdi-alert-circle',
    color: 'error'
  },
  warning: {
    title: '주의가 필요합니다',
    icon: 'mdi-alert',
    color: 'warning'
  },
  info: {
    title: '정보',
    icon: 'mdi-information',
    color: 'info'
  },
  success: {
    title: '성공',
    icon: 'mdi-check-circle',
    color: 'success'
  }
};

/**
 * 계산된 속성들
 */
const displayTitle = computed(() => props.title || alertConfig[props.type].title);
const alertIcon = computed(() => alertConfig[props.type].icon);
const alertColor = computed(() => alertConfig[props.type].color);

/**
 * 알림 닫기 처리
 */
const handleClose = () => {
  emit('close');
};

/**
 * 자동 닫기 타이머
 */
if (props.autoClose && props.show) {
  setTimeout(() => {
    handleClose();
  }, props.autoCloseDelay);
}
</script>

<style scoped>
.error-alert {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 진입/퇴장 애니메이션 */
.error-alert-enter-active {
  transition: all 0.3s ease-out;
}

.error-alert-leave-active {
  transition: all 0.3s ease-in;
}

.error-alert-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.error-alert-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>