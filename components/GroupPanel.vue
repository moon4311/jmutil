<template>
  <div class="mb-4">
    <button
      @click="$emit('update:modelValue', !modelValue)"
      class="w-full flex justify-between items-center p-3 rounded-t shadow font-semibold transition-colors duration-200"
      :class="[
        modelValue
          ? `bg-${color}-100 text-${color}-700`
          : `bg-${color}-50 text-${color}-500 hover:bg-${color}-100`
      ]"
    >
      {{ title }}
      <v-icon :color="modelValue ? color : color + '-lighten-2'">{{ modelValue ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </button>
    <transition name="fade">
      <div v-show="modelValue" class="p-4 bg-white rounded-b shadow">
        <slot />
      </div>
    </transition>
  </div>
</template>
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  color: { type: String, default: 'blue' },
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(['update:modelValue']);
</script>
