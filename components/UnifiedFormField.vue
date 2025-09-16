<template>
  <div class="unified-form-field" :class="fieldClasses">
    <!-- 라벨 -->
    <label v-if="label" :for="fieldId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-indicator" aria-label="필수">*</span>
    </label>

    <!-- 도움말 텍스트 -->
    <div v-if="helpText" class="help-text">
      {{ helpText }}
    </div>

    <!-- 필드 컨테이너 -->
    <div class="field-container">
      <!-- Input 필드 -->
      <component
        :is="fieldComponent"
        :id="fieldId"
        ref="fieldRef"
        v-model="localValue"
        v-bind="fieldProps"
        :class="inputClasses"
        :aria-invalid="hasError"
        :aria-describedby="errorId"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- 액션 버튼들 (복사, 클리어 등) -->
      <div v-if="actions.length > 0" class="field-actions">
        <button
          v-for="action in actions"
          :key="action.name"
          type="button"
          class="action-button"
          :class="`action-${action.name}`"
          :title="action.tooltip"
          :disabled="action.disabled"
          @click="handleAction(action)"
        >
          <v-icon :size="16">{{ action.icon }}</v-icon>
        </button>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <transition name="error-fade">
      <div v-if="hasError" :id="errorId" class="error-message" role="alert">
        <v-icon size="16" color="error">mdi-alert-circle</v-icon>
        {{ errorMessage }}
      </div>
    </transition>

    <!-- 성공 메시지 -->
    <transition name="success-fade">
      <div v-if="successMessage" class="success-message">
        <v-icon size="16" color="success">mdi-check-circle</v-icon>
        {{ successMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 통합 폼 필드 컴포넌트
 * 다양한 입력 타입을 지원하고 유효성 검사, 액션 버튼 등을 통합 제공
 */

import { ref, computed, watch, nextTick, useId } from 'vue';
import { useValidation } from '@/composables/useValidation.js';
import { useCopy } from '@/composables/useCopy.js';

const props = defineProps({
  /** 필드 값 */
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: ''
  },
  
  /** 필드 타입 */
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'url', 'tel',
      'textarea', 'select', 'checkbox', 'radio', 'file'
    ].includes(value)
  },
  
  /** 필드 라벨 */
  label: String,
  
  /** 플레이스홀더 */
  placeholder: String,
  
  /** 도움말 텍스트 */
  helpText: String,
  
  /** 필수 필드 여부 */
  required: Boolean,
  
  /** 읽기 전용 여부 */
  readonly: Boolean,
  
  /** 비활성화 여부 */
  disabled: Boolean,
  
  /** 필드 크기 */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  /** 유효성 검사 규칙 */
  rules: {
    type: Array,
    default: () => []
  },
  
  /** 액션 버튼들 */
  actions: {
    type: Array,
    default: () => []
  },
  
  /** Select 옵션들 */
  options: {
    type: Array,
    default: () => []
  },
  
  /** Textarea 행 수 */
  rows: {
    type: Number,
    default: 4
  },
  
  /** 성공 메시지 */
  successMessage: String,
  
  /** 즉시 유효성 검사 여부 */
  immediate: Boolean
});

const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus', 'action']);

// Composables
const { validateField } = useValidation();
const { copyToClipboard } = useCopy();

// 반응형 상태
const fieldRef = ref(null);
const fieldId = useId();
const errorId = `${fieldId}-error`;
const localValue = ref(props.modelValue);
const isFocused = ref(false);
const isValidated = ref(false);
const internalError = ref('');

// 계산된 속성
const fieldComponent = computed(() => {
  const componentMap = {
    textarea: 'textarea',
    select: 'select',
    checkbox: 'input',
    radio: 'input',
    file: 'input'
  };
  return componentMap[props.type] || 'input';
});

const fieldProps = computed(() => {
  const baseProps = {
    type: props.type === 'textarea' ? undefined : props.type,
    placeholder: props.placeholder,
    readonly: props.readonly,
    disabled: props.disabled,
    required: props.required
  };

  // Textarea 특수 속성
  if (props.type === 'textarea') {
    baseProps.rows = props.rows;
  }

  // Select 특수 속성
  if (props.type === 'select') {
    baseProps.options = props.options;
  }

  return baseProps;
});

const fieldClasses = computed(() => ({
  [`unified-form-field--${props.size}`]: true,
  'unified-form-field--focused': isFocused.value,
  'unified-form-field--error': hasError.value,
  'unified-form-field--readonly': props.readonly,
  'unified-form-field--disabled': props.disabled
}));

const inputClasses = computed(() => ({
  'unified-input': true,
  [`unified-input--${props.size}`]: true,
  'unified-input--error': hasError.value,
  'unified-input--with-actions': props.actions.length > 0
}));

const hasError = computed(() => !!internalError.value);
const errorMessage = computed(() => internalError.value);

// 값 동기화
watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal;
  if (props.immediate && isValidated.value) {
    validateInput();
  }
});

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal);
});

// 메서드
const handleInput = (event) => {
  const value = event.target.value;
  localValue.value = value;
  emit('input', value);
  
  if (isValidated.value) {
    validateInput();
  }
};

const handleBlur = (event) => {
  isFocused.value = false;
  isValidated.value = true;
  validateInput();
  emit('blur', event);
};

const handleFocus = (event) => {
  isFocused.value = true;
  emit('focus', event);
};

const validateInput = async () => {
  if (!props.rules.length) {
    internalError.value = '';
    return true;
  }
  
  try {
    for (const rule of props.rules) {
      const result = await rule(localValue.value);
      if (result !== true) {
        internalError.value = result;
        return false;
      }
    }
    internalError.value = '';
    return true;
  } catch (error) {
    internalError.value = '유효성 검사 중 오류가 발생했습니다.';
    return false;
  }
};

const handleAction = async (action) => {
  switch (action.name) {
    case 'copy':
      await copyToClipboard(localValue.value, '복사되었습니다');
      break;
    case 'clear':
      localValue.value = '';
      break;
    case 'paste':
      try {
        const text = await navigator.clipboard.readText();
        localValue.value = text;
      } catch (error) {
        console.warn('붙여넣기 실패:', error);
      }
      break;
    default:
      emit('action', { name: action.name, value: localValue.value });
  }
};

const focus = () => {
  nextTick(() => {
    fieldRef.value?.focus();
  });
};

const validate = () => {
  isValidated.value = true;
  return validateInput();
};

const reset = () => {
  localValue.value = '';
  internalError.value = '';
  isValidated.value = false;
};

// 컴포넌트 API 노출
defineExpose({
  focus,
  validate,
  reset,
  fieldRef
});
</script>

<style scoped>
.unified-form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--v-on-surface);
  font-size: 0.875rem;
}

.required-indicator {
  color: var(--v-error);
  margin-left: 0.25rem;
}

.help-text {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: var(--v-on-surface-variant);
  line-height: 1.4;
}

.field-container {
  position: relative;
  display: flex;
  align-items: stretch;
}

.unified-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--v-border-color);
  border-radius: 0.375rem;
  background: var(--v-surface);
  color: var(--v-on-surface);
  font-size: 0.875rem;
  line-height: 1.5;
  transition: all 0.2s ease;
  outline: none;
}

.unified-input:focus {
  border-color: var(--v-primary);
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.unified-input--error {
  border-color: var(--v-error);
}

.unified-input--error:focus {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-error), 0.2);
}

.unified-input--with-actions {
  border-radius: 0.375rem 0 0 0.375rem;
}

.unified-input--sm {
  padding: 0.5rem;
  font-size: 0.8rem;
}

.unified-input--lg {
  padding: 1rem;
  font-size: 1rem;
}

.field-actions {
  display: flex;
  border: 1px solid var(--v-border-color);
  border-left: none;
  border-radius: 0 0.375rem 0.375rem 0;
  background: var(--v-surface-variant);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: var(--v-on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
}

.action-button:hover:not(:disabled) {
  background: var(--v-primary);
  color: var(--v-on-primary);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button + .action-button {
  border-left: 1px solid var(--v-border-color);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--v-error);
  line-height: 1.4;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--v-success);
  line-height: 1.4;
}

/* 상태별 스타일 */
.unified-form-field--readonly .unified-input {
  background: var(--v-surface-variant);
  color: var(--v-on-surface-variant);
}

.unified-form-field--disabled .unified-input {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 애니메이션 */
.error-fade-enter-active,
.error-fade-leave-active,
.success-fade-enter-active,
.success-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to,
.success-fade-enter-from,
.success-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Select 스타일 */
select.unified-input {
  cursor: pointer;
}

/* Textarea 스타일 */
textarea.unified-input {
  resize: vertical;
  min-height: 4rem;
  font-family: inherit;
}

/* Checkbox, Radio 스타일 */
input[type="checkbox"].unified-input,
input[type="radio"].unified-input {
  width: auto;
  margin-right: 0.5rem;
}
</style>