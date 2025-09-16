<template>
  <div class="simple-form-field">
    <!-- 라벨 -->
    <label v-if="label" :for="fieldId" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <!-- 입력 필드 -->
    <div class="input-wrapper">
      <component
        :is="fieldType"
        :id="fieldId"
        v-model="localValue"
        v-bind="fieldAttrs"
        class="form-input"
        :class="{ 'error': hasError }"
        @blur="validate"
      />
      
      <!-- 액션 버튼 -->
      <button 
        v-if="showCopyButton" 
        type="button" 
        class="copy-btn"
        @click="copyValue"
      >
        📋
      </button>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="hasError" class="error-msg">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCopy } from '@/composables/useCopy.js';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean,
  readonly: Boolean,
  disabled: Boolean,
  showCopy: Boolean,
  rules: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue']);

const { copyToClipboard } = useCopy();
const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
const localValue = ref(props.modelValue);
const errorMsg = ref('');

// 계산된 속성
const fieldType = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input';
});

const fieldAttrs = computed(() => ({
  type: props.type === 'textarea' ? undefined : props.type,
  placeholder: props.placeholder,
  readonly: props.readonly,
  disabled: props.disabled,
  required: props.required
}));

const hasError = computed(() => !!errorMsg.value);
const showCopyButton = computed(() => props.showCopy && localValue.value);

// 값 동기화
watch(localValue, (newVal) => {
  emit('update:modelValue', newVal);
});

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal;
});

// 메서드
const validate = () => {
  errorMsg.value = '';
  
  if (props.required && !localValue.value) {
    errorMsg.value = '필수 입력 항목입니다.';
    return false;
  }
  
  for (const rule of props.rules) {
    const result = rule(localValue.value);
    if (result !== true) {
      errorMsg.value = result;
      return false;
    }
  }
  
  return true;
};

const copyValue = () => {
  if (localValue.value) {
    copyToClipboard(localValue.value);
  }
};
</script>

<style scoped>
.simple-form-field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--v-on-surface);
}

.required {
  color: var(--v-error);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: stretch;
}

.form-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--v-border-color);
  border-radius: 0.375rem;
  background: var(--v-surface);
  color: var(--v-on-surface);
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--v-primary);
}

.form-input.error {
  border-color: var(--v-error);
}

.copy-btn {
  margin-left: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--v-border-color);
  border-radius: 0.375rem;
  background: var(--v-surface-variant);
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background: var(--v-primary);
  color: var(--v-on-primary);
}

.error-msg {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--v-error);
}

textarea.form-input {
  resize: vertical;
  min-height: 4rem;
}
</style>