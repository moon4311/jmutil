// components/ErrorAlert.vue (신규 생성)
<template>
  <v-alert
    v-if="show"
    type="error"
    variant="tonal"
    closable
    class="mb-4"
    @click:close="$emit('close')"
  >
    <template #prepend>
      <v-icon>mdi-alert-circle</v-icon>
    </template>
    <div>
      <div class="font-semibold">{{ title || '오류가 발생했습니다' }}</div>
      <div class="text-sm mt-1">{{ message }}</div>
    </div>
  </v-alert>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: String,
  message: { type: String, required: true }
})

defineEmits(['close'])
</script>