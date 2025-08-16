<template>
  <div class="copy-textarea-wrapper">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      readonly
      rows="10"
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
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Fira Mono', 'Consolas', monospace;
  resize: none;
}
.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  height: 2.5rem;
}
.copy-btn svg {
  color: #666;
}
.copy-btn:hover svg {
  color: #007bff;
}
</style>
