// components/LoadingState.vue (신규 생성)
<template>
  <div class="flex items-center justify-center py-8">
    <v-progress-circular 
      indeterminate 
      color="primary"
      size="32"
    />
    <span class="ml-3 text-gray-600">{{ message || '처리 중...' }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '처리 중...'
  }
})
</script>