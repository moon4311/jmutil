<template>
  <div class="copy-input-wrapper" role="group" :aria-label="`복사 가능한 입력 필드: ${placeholder}`">
    <input
      ref="inputRef"
      :value="modelValue"
      readonly
      class="copy-input"
      :placeholder="placeholder"
      :aria-label="placeholder || '복사할 텍스트'"
      :aria-describedby="copyTooltip ? 'copy-tooltip' : undefined"
      @focus="$event.target.select()"
    />
    <button 
      class="copy-btn" 
      type="button"
      :disabled="!modelValue"
      :title="copyTooltip"
      :aria-label="copyTooltip"
      :id="copyTooltip ? 'copy-tooltip' : undefined"
      @click="copyToClipboard"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="img"
      >
        <path fill="currentColor" d="M16 1a1 1 0 0 1 1 1v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2a1 1 0 0 1 1-1h6Zm3 5h-2v2a1 1 0 0 1-2 0V6H7v14h12V6Zm-4-2h-4v2h4V4Z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
/**
 * 복사 가능한 읽기 전용 입력 컴포넌트
 * @component CopyInput
 */

import { ref, computed } from 'vue';

/**
 * 컴포넌트 Props
 * @typedef {Object} Props
 * @property {string|number} modelValue - 표시할 값 (필수)
 * @property {string} [placeholder=''] - 플레이스홀더 텍스트
 * @property {string} [copyMessage='복사되었습니다'] - 복사 완료 메시지
 */
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  copyMessage: {
    type: String,
    default: '복사되었습니다'
  }
});

const inputRef = ref(null);

/**
 * 복사 버튼 툴팁 텍스트
 */
const copyTooltip = computed(() => {
  return props.modelValue ? '클립보드에 복사' : '복사할 내용이 없습니다';
});

/**
 * 토스트 알림 표시 함수
 * @param {string} message - 표시할 메시지
 */
function showNotification(message) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

/**
 * 클립보드 복사 함수 (현대적인 API 사용, 에러 처리 강화)
 * @async
 */
async function copyToClipboard() {
  if (!props.modelValue) return;

  const textToCopy = String(props.modelValue);

  try {
    // 현대적인 Clipboard API 사용 (HTTPS 환경에서)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      // 폴백: 레거시 방식 (HTTP 환경에서)
      await fallbackCopyToClipboard(textToCopy);
    }
    
    showNotification(props.copyMessage);
  } catch (error) {
    console.error('복사 실패:', error);
    
    // 폴백 시도
    try {
      await fallbackCopyToClipboard(textToCopy);
      showNotification(props.copyMessage);
    } catch (fallbackError) {
      console.error('폴백 복사도 실패:', fallbackError);
      showNotification('복사에 실패했습니다. 수동으로 선택 후 복사해주세요.');
    }
  }
}

/**
 * 레거시 복사 방식 (폴백)
 * @param {string} text 
 */
async function fallbackCopyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (!inputRef.value) {
      reject(new Error('입력 요소를 찾을 수 없습니다'));
      return;
    }

    // 임시로 값 설정하고 선택
    const originalReadonly = inputRef.value.readOnly;
    inputRef.value.readOnly = false;
    inputRef.value.value = text;
    inputRef.value.select();
    inputRef.value.setSelectionRange(0, text.length);

    try {
      const successful = document.execCommand('copy');
      inputRef.value.readOnly = originalReadonly;
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('execCommand 실패'));
      }
    } catch (error) {
      inputRef.value.readOnly = originalReadonly;
      reject(error);
    }
  });
}
</script>

<style scoped>
.copy-input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}
.copy-input {
  width: 100%;
  padding: 0.5rem 3rem 0.5rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}
.copy-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
}
.copy-btn svg {
  color: #666;
}
.copy-btn:hover svg {
  color: #007bff;
}
</style>

<style scoped>
.copy-alert {
  position: absolute;
  top: -2.2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  font-size: 0.95rem;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  opacity: 0.95;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
