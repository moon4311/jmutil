<template>
  <div class="simple-copy">
    <textarea
      v-if="variant === 'textarea'"
      :value="modelValue"
      :rows="rows"
      readonly
      class="copy-area"
      :placeholder="placeholder"
      @focus="$event.target.select()"
    ></textarea>
    
    <input
      v-else
      :value="modelValue"
      readonly
      class="copy-input"
      :placeholder="placeholder"
      @focus="$event.target.select()"
    />
    
    <button 
      class="copy-btn"
      :class="{ copied: showCopied }"
      @click="copyText"
      :disabled="!modelValue"
    >
      {{ showCopied ? '✓' : '📋' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCopy } from '@/composables/useCopy.js';

defineProps({
  modelValue: { type: String, required: true },
  variant: { type: String, default: 'textarea' },
  rows: { type: Number, default: 6 },
  placeholder: { type: String, default: '결과가 여기에 표시됩니다...' }
});

const { copyToClipboard } = useCopy();
const showCopied = ref(false);

const copyText = async () => {
  const success = await copyToClipboard(props.modelValue);
  if (success) {
    showCopied.value = true;
    setTimeout(() => { showCopied.value = false; }, 2000);
  }
};
</script>

<style scoped>
.simple-copy {
  position: relative;
  display: flex;
  align-items: stretch;
}

.copy-area,
.copy-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--v-border-color);
  border-radius: 0.375rem 0 0 0.375rem;
  background: var(--v-surface-variant);
  color: var(--v-on-surface);
  outline: none;
  font-family: monospace;
}

.copy-input {
  border-radius: 0.375rem 0 0 0.375rem;
}

.copy-area {
  resize: vertical;
  font-size: 0.875rem;
  line-height: 1.4;
}

.copy-btn {
  padding: 0.75rem 1rem;
  border: 1px solid var(--v-border-color);
  border-left: none;
  border-radius: 0 0.375rem 0.375rem 0;
  background: var(--v-primary);
  color: var(--v-on-primary);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 3rem;
}

.copy-btn:hover:not(:disabled) {
  background: var(--v-primary-darken-1);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copy-btn.copied {
  background: var(--v-success);
}
</style>