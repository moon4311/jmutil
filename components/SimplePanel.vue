<template>
  <div class="app-panel">
    <button
      @click="toggle"
      class="app-panel__header"
      :class="{ 'app-panel__header--active': isOpen }"
    >
      <span class="app-panel__title">{{ title }}</span>
      <v-icon class="app-panel__icon" :class="{ 'rotate-180': isOpen }">
        mdi-chevron-down
      </v-icon>
    </button>
    <div v-show="isOpen" class="app-panel__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
// 간소화된 props 및 emit
const props = defineProps({
  modelValue: Boolean,
  title: String,
  color: { type: String, default: 'primary' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed(() => props.modelValue)

function toggle() {
  emit('update:modelValue', !isOpen.value)
}
</script>

<style scoped>
.app-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.app-panel__header {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: left;
}

.app-panel__header:hover {
  background: var(--color-border);
}

.app-panel__header--active {
  background: rgba(37, 99, 235, 0.1);
}

.app-panel__title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.app-panel__icon {
  transition: transform var(--transition-fast);
}

.rotate-180 {
  transform: rotate(180deg);
}

.app-panel__content {
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
}
</style>