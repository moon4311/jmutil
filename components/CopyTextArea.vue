<template>
  <div class="copy-textarea-wrapper">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :rows="rows"
      readonly
      class="copy-textarea"
      @focus="$event.target.select()"
    ></textarea>
    <button class="copy-btn" @click="copyToClipboard">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1a1 1 0 0 1 1 1v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2a1 1 0 0 1 1-1h6Zm3 5h-2v2a1 1 0 0 1-2 0V6H7v14h12V6Zm-4-2h-4v2h4V4Z"/></svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  rows: {
    type: [String, Number],
    default: 10
  }
});
const textareaRef = ref(null);

function showNotification(message) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

function copyToClipboard() {
  if (textareaRef.value) {
    textareaRef.value.select();
    document.execCommand('copy');
    showNotification('복사되었습니다');
  }
}
</script>

<style scoped>
.copy-textarea-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.copy-textarea {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Courier New', Consolas, Monaco, 'Lucida Console', monospace;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  resize: none;
}

.copy-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  height: 2.5rem;
}

.copy-btn:hover {
  background-color: #f3f4f6;
}

.copy-btn svg {
  color: #6b7280;
  transition: color 0.2s ease;
}

.copy-btn:hover svg {
  color: #3b82f6;
}
</style>
