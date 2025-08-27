<template>
  <div 
    class="loading-container" 
    :class="{ 'overlay-mode': overlay, 'inline-mode': !overlay }"
    :aria-live="ariaLive"
    :aria-label="loadingText"
    role="status"
  >
    <!-- 오버레이 배경 -->
    <div v-if="overlay" class="overlay-backdrop" @click="onBackdropClick"></div>
    
    <!-- 로딩 콘텐츠 -->
    <div class="loading-content" :class="sizeClass">
      <!-- 로딩 스피너 -->
      <div class="spinner-container">
        <div v-if="type === 'spinner'" class="custom-spinner" :class="colorClass">
          <div class="spinner-circle"></div>
        </div>
        
        <v-progress-circular
          v-else-if="type === 'vuetify'"
          :indeterminate="progress < 0"
          :model-value="progress >= 0 ? progress : undefined"
          :color="color"
          :size="spinnerSize"
        />
        
        <div v-else-if="type === 'dots'" class="dots-spinner" :class="colorClass">
          <div class="dot" v-for="n in 3" :key="n"></div>
        </div>
        
        <div v-else-if="type === 'pulse'" class="pulse-spinner" :class="colorClass">
          <div class="pulse-circle"></div>
        </div>
      </div>
      
      <!-- 로딩 텍스트 -->
      <div v-if="showText" class="loading-text" :class="textSizeClass">
        {{ loadingText }}
      </div>
      
      <!-- 진행률 표시 -->
      <div v-if="showProgress && progress >= 0 && type !== 'vuetify'" class="progress-container mt-3">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
            :class="colorClass"
          ></div>
        </div>
        <div class="progress-text text-sm text-gray-600">{{ Math.round(progress) }}%</div>
      </div>
      
      <!-- 취소 버튼 -->
      <v-btn 
        v-if="cancellable" 
        @click="$emit('cancel')"
        variant="outlined"
        size="small"
        class="mt-4"
        :aria-label="cancelText"
      >
        {{ cancelText }}
      </v-btn>
    </div>
  </div>
</template>

<script setup>
/**
 * 개선된 로딩 상태 컴포넌트
 * @component LoadingState
 */
import { computed } from 'vue';

/**
 * 컴포넌트 Props
 */
const props = defineProps({
  // 로딩 상태 표시 여부
  loading: {
    type: Boolean,
    default: true
  },
  
  // 로딩 메시지
  message: {
    type: String,
    default: '처리 중...'
  },
  
  // 로딩 스피너 타입
  type: {
    type: String,
    default: 'vuetify',
    validator: value => ['vuetify', 'spinner', 'dots', 'pulse'].includes(value)
  },
  
  // 색상 테마
  color: {
    type: String,
    default: 'primary'
  },
  
  // 크기
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value)
  },
  
  // 오버레이 모드
  overlay: {
    type: Boolean,
    default: false
  },
  
  // 진행률 (0-100, -1이면 무한 로딩)
  progress: {
    type: Number,
    default: -1
  },
  
  // 진행률 표시 여부
  showProgress: {
    type: Boolean,
    default: false
  },
  
  // 텍스트 표시 여부
  showText: {
    type: Boolean,
    default: true
  },
  
  // 취소 가능 여부
  cancellable: {
    type: Boolean,
    default: false
  },
  
  // 취소 버튼 텍스트
  cancelText: {
    type: String,
    default: '취소'
  },
  
  // 접근성 관련
  ariaLive: {
    type: String,
    default: 'polite',
    validator: value => ['polite', 'assertive', 'off'].includes(value)
  }
});

/**
 * 이벤트 정의
 */
const emit = defineEmits(['cancel', 'backdrop-click']);

/**
 * 계산된 속성들
 */
const loadingText = computed(() => {
  if (props.progress >= 0 && props.showProgress) {
    return `${props.message} (${Math.round(props.progress)}%)`;
  }
  return props.message;
});

const sizeClass = computed(() => ({
  'size-small': props.size === 'small',
  'size-medium': props.size === 'medium',
  'size-large': props.size === 'large'
}));

const colorClass = computed(() => `color-${props.color}`);

const textSizeClass = computed(() => ({
  'text-sm': props.size === 'small',
  'text-base': props.size === 'medium',
  'text-lg': props.size === 'large'
}));

const spinnerSize = computed(() => {
  const sizes = { small: 24, medium: 32, large: 48 };
  return sizes[props.size] || sizes.medium;
});

/**
 * 이벤트 핸들러
 */
const onBackdropClick = () => {
  emit('backdrop-click');
};
</script>

<style scoped>
/* 로딩 컨테이너 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.inline-mode {
  padding: 2rem 1rem;
}

.overlay-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.overlay-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.loading-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 320px;
  margin: 0 1rem;
}

.overlay-mode .loading-content {
  background: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* 크기별 스타일 */
.size-small {
  padding: 1rem;
}

.size-medium {
  padding: 1.5rem;
}

.size-large {
  padding: 2rem;
}

/* 스피너 컨테이너 */
.spinner-container {
  margin-bottom: 1rem;
}

/* 커스텀 스피너 */
.custom-spinner {
  width: 32px;
  height: 32px;
  position: relative;
}

.size-small .custom-spinner {
  width: 24px;
  height: 24px;
}

.size-large .custom-spinner {
  width: 48px;
  height: 48px;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 점 스피너 */
.dots-spinner {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #3498db;
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out both infinite;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 펄스 스피너 */
.pulse-spinner {
  width: 32px;
  height: 32px;
  position: relative;
}

.pulse-circle {
  width: 100%;
  height: 100%;
  background-color: #3498db;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 로딩 텍스트 */
.loading-text {
  color: #374151;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
}

/* 진행률 표시 */
.progress-container {
  width: 100%;
  max-width: 200px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #3498db;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

/* 색상 테마 */
.color-primary .spinner-circle {
  border-top-color: #3498db;
}

.color-primary .dot,
.color-primary .pulse-circle,
.color-primary .progress-fill {
  background-color: #3498db;
}

.color-success .spinner-circle {
  border-top-color: #22c55e;
}

.color-success .dot,
.color-success .pulse-circle,
.color-success .progress-fill {
  background-color: #22c55e;
}

.color-warning .spinner-circle {
  border-top-color: #f59e0b;
}

.color-warning .dot,
.color-warning .pulse-circle,
.color-warning .progress-fill {
  background-color: #f59e0b;
}

.color-error .spinner-circle {
  border-top-color: #ef4444;
}

.color-error .dot,
.color-error .pulse-circle,
.color-error .progress-fill {
  background-color: #ef4444;
}

/* 반응형 */
@media (max-width: 640px) {
  .loading-content {
    margin: 0 1rem;
    max-width: calc(100vw - 2rem);
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .loading-content {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .loading-text {
    color: #f9fafb;
  }
  
  .progress-bar {
    background-color: #374151;
  }
  
  .progress-text {
    color: #9ca3af;
  }
}
</style>