<template>
  <div class="copy-textarea-wrapper">
    <div class="textarea-container">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        :rows="rows"
        readonly
        class="copy-textarea app-input app-textarea"
        @focus="$event.target.select()"
        :placeholder="placeholder"
      ></textarea>
      <button 
        class="copy-btn app-btn app-btn-sm app-btn-ghost" 
        @click="copyToClipboard"
        :class="{ 'copied': showCopied }"
        :disabled="!modelValue"
      >
        <v-icon v-if="!showCopied" size="16">mdi-content-copy</v-icon>
        <v-icon v-else size="16" color="success">mdi-check</v-icon>
        <span class="copy-text">{{ showCopied ? '복사됨' : '복사' }}</span>
      </button>
    </div>
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
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  rows: {
    type: [String, Number],
    default: 10
  },
  placeholder: {
    type: String,
    default: '결과가 여기에 표시됩니다...'
  },
  showLineNumbers: {
    type: Boolean,
    default: false
  }
});

const textareaRef = ref(null);
const showCopied = ref(false);

// 라인 수 계산
const lineCount = computed(() => {
  if (!props.modelValue) return parseInt(props.rows);
  const lines = props.modelValue.split('\n').length;
  return Math.max(lines, parseInt(props.rows));
});

function showNotification(message) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

async function copyToClipboard() {
  if (!props.modelValue) return;
  
  try {
    // 최신 Clipboard API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.modelValue);
    } else {
      // 폴백: execCommand 사용
      if (textareaRef.value) {
        textareaRef.value.select();
        document.execCommand('copy');
      }
    }
    
    // 복사 완료 애니메이션
    showCopied.value = true;
    showNotification('클립보드에 복사되었습니다');
    
    setTimeout(() => {
      showCopied.value = false;
    }, 2000);
    
  } catch (err) {
    console.error('복사 실패:', err);
    showNotification('복사에 실패했습니다');
  }
}

// modelValue 변경 시 복사 상태 리셋
watch(() => props.modelValue, () => {
  showCopied.value = false;
});
</script>

<style scoped>
/* === 컨테이너 레이아웃 === */
.copy-textarea-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
}

.textarea-container {
  position: relative;
  flex: 1;
  min-width: 0;
}

/* === 텍스트 영역 스타일 === */
.copy-textarea {
  width: 100%;
  min-height: 120px;
  font-family: 'Courier New', Consolas, Monaco, 'Lucida Console', monospace !important;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  resize: vertical;
  white-space: pre;
  overflow-wrap: break-word;
  word-break: break-all;
  tab-size: 2;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.copy-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.copy-textarea:read-only {
  background: var(--color-gray-50);
  color: var(--color-text-primary);
}

.copy-textarea::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

/* === 복사 버튼 스타일 === */
.copy-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: auto;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.copy-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-gray-100);
  color: var(--color-text-muted);
}

.copy-btn.copied {
  background: var(--color-success);
  color: white;
  border-color: var(--color-success);
  animation: copySuccess 0.3s ease;
}

@keyframes copySuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.copy-text {
  display: none;
}

@media (min-width: 640px) {
  .copy-text {
    display: inline;
  }
}

/* === 라인 번호 스타일 === */
.line-numbers {
  display: flex;
  flex-direction: column;
  background: var(--color-gray-100);
  border: 1px solid var(--color-border);
  border-left: none;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  padding: var(--spacing-sm) var(--spacing-xs);
  font-family: 'Courier New', Consolas, Monaco, 'Lucida Console', monospace;
  font-size: var(--font-size-xs);
  line-height: 1.5;
  color: var(--color-text-muted);
  user-select: none;
  min-width: 40px;
  text-align: right;
}

.line-number {
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: var(--spacing-xs);
  border-right: 1px solid var(--color-border-light);
}

.line-number:hover {
  background: var(--color-gray-200);
}

/* === 반응형 디자인 === */
@media (max-width: 640px) {
  .copy-btn {
    padding: var(--spacing-xs);
    min-width: 32px;
    height: 32px;
    justify-content: center;
  }
  
  .copy-textarea {
    font-size: var(--font-size-xs);
  }
  
  .line-numbers {
    min-width: 32px;
    font-size: 10px;
  }
}

/* === 접근성 개선 === */
.copy-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.copy-textarea:focus + .copy-btn {
  opacity: 1;
}

/* === 스크롤바 스타일링 === */
.copy-textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.copy-textarea::-webkit-scrollbar-track {
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
}

.copy-textarea::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-sm);
}

.copy-textarea::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}

.copy-textarea::-webkit-scrollbar-corner {
  background: var(--color-gray-100);
}

/* === 다크 모드 지원 준비 === */
@media (prefers-color-scheme: dark) {
  .copy-textarea:read-only {
    background: var(--color-gray-800, #374151);
    color: var(--color-gray-100, #f3f4f6);
  }
  
  .line-numbers {
    background: var(--color-gray-700, #4b5563);
    color: var(--color-gray-300, #d1d5db);
  }
}
</style>
