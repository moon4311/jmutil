<template>
  <div class="copy-input-wrapper">
    <input
      ref="inputRef"
      :value="modelValue"
      readonly
      class="copy-input"
      @focus="$event.target.select()"
    />
    <button class="copy-btn" @click="copyToClipboard">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1a1 1 0 0 1 1 1v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2a1 1 0 0 1 1-1h6Zm3 5h-2v2a1 1 0 0 1-2 0V6H7v14h12V6Zm-4-2h-4v2h4V4Z"/></svg>
    </button>
  <!-- Notification handled by Notification API -->
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);
const inputRef = ref(null);
const instance = getCurrentInstance();


function showNotification(message) {
  // Emit a global event for toast notification
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

function copyToClipboard() {
  if (inputRef.value) {
    inputRef.value.select();
    document.execCommand('copy');
    showNotification('복사되었습니다');
  }
}
</script>

<style scoped>
.copy-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.copy-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.copy-btn {
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
