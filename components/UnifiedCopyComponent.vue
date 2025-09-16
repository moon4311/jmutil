<template>
  <div class="unified-copy-component" :class="componentClasses">
    <!-- Input 모드 -->
    <div v-if="variant === 'input'" class="input-wrapper" role="group" :aria-label="`복사 가능한 입력 필드: ${placeholder}`">
      <input
        ref="inputRef"
        :value="modelValue"
        readonly
        class="unified-input"
        :style="inputStyles"
        :placeholder="placeholder"
        :aria-label="placeholder || '복사할 텍스트'"
        @focus="$event.target.select()"
      />
      <button 
        class="copy-button"
        type="button"
        :disabled="!modelValue"
        :title="copyTooltip"
        @click="handleCopy"
      >
        <v-icon :size="iconSize">{{ copyIcon }}</v-icon>
      </button>
    </div>

    <!-- Textarea 모드 -->
    <div v-else class="textarea-wrapper">
      <div class="textarea-container">
        <textarea
          ref="textareaRef"
          :value="modelValue"
          :rows="rows"
          readonly
          class="unified-textarea"
          :placeholder="placeholder"
          @focus="$event.target.select()"
        ></textarea>
        
        <!-- 라인 번호 (옵션) -->
        <div v-if="showLineNumbers" class="line-numbers">
          <span 
            v-for="n in lineCount" 
            :key="n" 
            class="line-number"
          >
            {{ n }}
          </span>
        </div>
      </div>

      <!-- 복사 버튼 -->
      <button 
        class="copy-button textarea-copy-btn"
        :class="{ 'copied': showCopied }"
        @click="handleCopy"
        :disabled="!modelValue"
      >
        <v-icon :size="iconSize" :color="showCopied ? 'success' : undefined">
          {{ copyIcon }}
        </v-icon>
        <span class="copy-text">{{ copyButtonText }}</span>
      </button>
    </div>

    <!-- 복사 성공 피드백 -->
    <transition name="copy-feedback">
      <div v-if="showSuccessFeedback" class="copy-success-feedback">
        <v-icon color="success" size="16">mdi-check-circle</v-icon>
        <span>{{ successMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 통합 복사 컴포넌트
 * Input과 Textarea 모드를 모두 지원하며, 
 * 다양한 스타일링 옵션과 접근성 기능을 제공
 */

import { ref, computed, watch, nextTick } from 'vue';
import { useCopy } from '@/composables/useCopy.js';

const props = defineProps({
  /** 표시할 값 */
  modelValue: {
    type: String,
    required: true
  },
  
  /** 컴포넌트 타입: 'input' | 'textarea' */
  variant: {
    type: String,
    default: 'textarea',
    validator: (value) => ['input', 'textarea'].includes(value)
  },
  
  /** 플레이스홀더 텍스트 */
  placeholder: {
    type: String,
    default: '결과가 여기에 표시됩니다...'
  },
  
  /** Textarea 행 수 (textarea 모드에서만 사용) */
  rows: {
    type: [String, Number],
    default: 10
  },
  
  /** 라인 번호 표시 여부 */
  showLineNumbers: {
    type: Boolean,
    default: false
  },
  
  /** 복사 성공 메시지 */
  successMessage: {
    type: String,
    default: '복사되었습니다'
  },
  
  /** 복사 버튼 툴팁 */
  copyTooltip: {
    type: String,
    default: '클립보드에 복사'
  },
  
  /** 컴포넌트 크기: 'sm' | 'md' | 'lg' */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  /** 스타일 테마: 'default' | 'minimal' | 'bordered' */
  theme: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'bordered'].includes(value)
  }
});

// Composables
const { copyToClipboard } = useCopy();

// 반응형 상태
const showCopied = ref(false);
const showSuccessFeedback = ref(false);
const inputRef = ref(null);
const textareaRef = ref(null);

// 계산된 속성
const lineCount = computed(() => {
  if (!props.modelValue || !props.showLineNumbers) return 0;
  return props.modelValue.split('\n').length;
});

const copyIcon = computed(() => {
  return showCopied.value ? 'mdi-check' : 'mdi-content-copy';
});

const copyButtonText = computed(() => {
  return showCopied.value ? '복사됨!' : '복사';
});

const componentClasses = computed(() => ({
  [`unified-copy--${props.variant}`]: true,
  [`unified-copy--${props.size}`]: true,
  [`unified-copy--${props.theme}`]: true,
  'unified-copy--with-lines': props.showLineNumbers
}));

const inputStyles = computed(() => ({
  paddingRight: props.variant === 'input' ? '3rem' : undefined
}));

const iconSize = computed(() => {
  const sizes = { sm: 16, md: 20, lg: 24 };
  return sizes[props.size] || 20;
});

// 메서드
const handleCopy = async () => {
  if (!props.modelValue) return;
  
  const success = await copyToClipboard(props.modelValue, props.successMessage);
  
  if (success) {
    showCopied.value = true;
    showSuccessFeedback.value = true;
    
    // 2초 후 상태 초기화
    setTimeout(() => {
      showCopied.value = false;
    }, 2000);
    
    // 3초 후 피드백 숨김
    setTimeout(() => {
      showSuccessFeedback.value = false;
    }, 3000);
  }
};

// 포커스 관련 메서드
const focus = () => {
  nextTick(() => {
    if (props.variant === 'input' && inputRef.value) {
      inputRef.value.focus();
      inputRef.value.select();
    } else if (textareaRef.value) {
      textareaRef.value.focus();
      textareaRef.value.select();
    }
  });
};

// 컴포넌트 API 노출
defineExpose({
  focus,
  copy: handleCopy
});
</script>

<style scoped>
/* 기본 스타일 */
.unified-copy-component {
  position: relative;
  width: 100%;
}

/* Input 스타일 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.unified-input {
  flex: 1;
  padding: 0.75rem 3rem 0.75rem 0.75rem;
  border: 1px solid var(--v-border-color);
  border-radius: 0.375rem;
  background: var(--v-surface-variant);
  color: var(--v-on-surface);
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.unified-input:focus {
  border-color: var(--v-primary);
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

/* Textarea 스타일 */
.textarea-wrapper {
  position: relative;
}

.textarea-container {
  position: relative;
  display: flex;
}

.unified-textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--v-border-color);
  border-radius: 0.375rem;
  background: var(--v-surface-variant);
  color: var(--v-on-surface);
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;
}

.unified-textarea:focus {
  border-color: var(--v-primary);
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

/* 복사 버튼 공통 스타일 */
.copy-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--v-primary);
  color: var(--v-on-primary);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.copy-button:hover:not(:disabled) {
  background: var(--v-primary-darken-1);
  transform: translateY(-1px);
}

.copy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copy-button.copied {
  background: var(--v-success);
  color: var(--v-on-success);
}

/* Input용 복사 버튼 */
.input-wrapper .copy-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem;
  min-width: auto;
}

/* Textarea용 복사 버튼 */
.textarea-copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

/* 라인 번호 */
.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0.5rem;
  background: var(--v-surface);
  border: 1px solid var(--v-border-color);
  border-left: none;
  border-radius: 0 0.375rem 0.375rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--v-on-surface-variant);
  user-select: none;
}

.line-number {
  text-align: right;
  min-width: 2rem;
}

/* 성공 피드백 */
.copy-success-feedback {
  position: absolute;
  top: -2.5rem;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--v-success);
  color: var(--v-on-success);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* 사이즈 변형 */
.unified-copy--sm .unified-input,
.unified-copy--sm .unified-textarea {
  padding: 0.5rem;
  font-size: 0.8rem;
}

.unified-copy--lg .unified-input,
.unified-copy--lg .unified-textarea {
  padding: 1rem;
  font-size: 1rem;
}

/* 테마 변형 */
.unified-copy--minimal .unified-input,
.unified-copy--minimal .unified-textarea {
  border: none;
  background: transparent;
  border-bottom: 1px solid var(--v-border-color);
  border-radius: 0;
}

.unified-copy--bordered .unified-input,
.unified-copy--bordered .unified-textarea {
  border: 2px solid var(--v-border-color);
  border-radius: 0.5rem;
}

/* 애니메이션 */
.copy-feedback-enter-active,
.copy-feedback-leave-active {
  transition: all 0.3s ease;
}

.copy-feedback-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.copy-feedback-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 라인 번호가 있을 때 textarea 스타일 조정 */
.unified-copy--with-lines .unified-textarea {
  border-radius: 0.375rem 0 0 0.375rem;
}
</style>