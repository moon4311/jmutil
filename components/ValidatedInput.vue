// components/ValidatedInput.vue (신규 생성)
<template>
  <div class="space-y-2">
    <label v-if="label" :class="labelClass">{{ label }}</label>
    <v-text-field
      :model-value="modelValue"
      @update:model-value="handleInput"
      :variant="variant"
      :density="density"
      :rules="rules"
      :error-messages="errorMessage"
      :placeholder="placeholder"
      :type="type"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  labelClass: { type: String, default: 'section-label' },
  variant: { type: String, default: 'solo-filled' },
  density: { type: String, default: 'comfortable' },
  rules: Array,
  placeholder: String,
  type: { type: String, default: 'text' },
  validator: Function
})

const emit = defineEmits(['update:modelValue'])

const errorMessage = ref('')

const handleInput = (value) => {
  emit('update:modelValue', value)
  
  if (props.validator) {
    const validation = props.validator(value)
    errorMessage.value = validation === true ? '' : validation
  }
}
</script>