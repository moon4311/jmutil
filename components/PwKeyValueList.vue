<template>
  <div class="space-y-2 max-h-64 overflow-y-auto">
    <div v-for="item in filteredSortedItems" :key="item.key" class="flex items-center gap-2 border-b pb-1">
      <span class="font-mono text-sm cursor-pointer" @click="$emit('copy-key', item.key)">{{ item.keyDisplay }}</span>
      <button @click="$emit('copy-key', item.key)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">키복사</button>
      <input type="password" :value="item.value" readonly class="flex-1 font-mono text-sm border-none bg-transparent break-all cursor-not-allowed" style="padding:0;" />
      <button @click="$emit('copy-decrypted', item.key, item.value)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">값복사</button>
      <button @click="$emit('remove', item.key)" class="text-xs text-red-500 px-2 py-1">삭제</button>
    </div>
    <div v-if="!filteredSortedItems.length" class="text-gray-400 text-sm">저장된 항목이 없습니다.</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  items: Array,
  filter: String,
});
const emit = defineEmits(['copy-key', 'copy-decrypted', 'remove']);

const filteredSortedItems = computed(() => {
  let arr = props.items || [];
  if (props.filter) {
    arr = arr.filter(item => item.keyDisplay.includes(props.filter));
  }
  return arr.slice().sort((a, b) => a.keyDisplay.localeCompare(b.keyDisplay));
});
</script>
