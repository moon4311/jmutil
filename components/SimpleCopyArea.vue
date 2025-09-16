<template>
  <div class="copy-area">
    <div class="copy-area__container">
      <textarea
        :value="modelValue"
        :rows="rows"
        readonly
        class="app-input copy-area__textarea"
        :placeholder="placeholder"
        @focus="$event.target.select()"
      />
      <button 
        class="app-btn app-btn--secondary copy-area__btn" 
        @click="copyText"
        :disabled="!modelValue"
      >
        <v-icon size="16">{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
        {{ copied ? '복사됨!' : '복사' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  rows: { type: [String, Number], default: 6 },
  placeholder: { type: String, default: '결과가 여기에 표시됩니다...' }
})

const copied = ref(false)

async function copyText() {
  if (!props.modelValue) return
  
  try {
    await navigator.clipboard.writeText(props.modelValue)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.warn('복사 실패:', err)
  }
}
</script>

<style scoped>
.copy-area__container {
  position: relative;
}

.copy-area__textarea {
  resize: vertical;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  padding-right: 80px;
}

.copy-area__btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 0.75rem;
  padding: var(--spacing-xs) var(--spacing-sm);
  gap: var(--spacing-xs);
}
</style>