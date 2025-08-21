<template>
  <div class="space-y-2 max-h-64 overflow-y-auto">
    <div v-for="item in filteredSortedItems" :key="item.key" class="flex items-center gap-2 border-b pb-1">
      <span class="font-mono text-sm cursor-pointer" @click="$emit('copy-key', item.key)">{{ item.keyDisplay }}</span>
      <button @click="$emit('copy-key', item.key)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">키복사</button>
      <template v-if="editKey === item.key">
        <input v-model="editValue" class="flex-1 font-mono text-sm border rounded px-1 py-0.5" @keyup.enter="$emit('save-edit', item.key, editValue)" />
        <button @click="$emit('save-edit', item.key, editValue)" class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">저장</button>
        <button @click="$emit('cancel-edit')" class="text-xs bg-gray-200 px-2 py-0.5 rounded">취소</button>
      </template>
      <template v-else>
        <span class="flex-1 font-mono text-sm break-all cursor-pointer" @click="$emit('copy-value', item.value)">{{ item.valueDisplay }}</span>
        <button @click="$emit('copy-value', item.value)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">값복사</button>
        <button v-if="allowEdit" @click="$emit('start-edit', item.key, item.value)" class="text-xs bg-yellow-300 px-2 py-0.5 rounded">수정</button>
      </template>
      <button @click="$emit('remove', item.key)" class="text-xs text-red-500 px-2 py-1">삭제</button>
    </div>
    <div v-if="!filteredSortedItems.length" class="text-gray-400 text-sm">저장된 항목이 없습니다.</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
const props = defineProps({
  items: Array,
  filter: String,
  editKey: String,
  editValue: String,
  allowEdit: Boolean,
});
const emit = defineEmits(['copy-key', 'copy-value', 'remove', 'start-edit', 'save-edit', 'cancel-edit']);

const filteredSortedItems = computed(() => {
  let arr = props.items || [];
  if (props.filter) {
    arr = arr.filter(item => item.keyDisplay.includes(props.filter));
  }
  return arr.slice().sort((a, b) => a.keyDisplay.localeCompare(b.keyDisplay));
});
</script>
