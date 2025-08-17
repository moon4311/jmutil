<template>
  <div>
    <h2 class="text-xl font-bold mb-4">문자열 유틸리티</h2>
    <div class="mb-4">
      <v-text-field
        v-model="input"
        label="문자열 입력"
        variant="solo-filled"
        density="comfortable"
        hide-details
        class="w-full"
        placeholder="문자열을 입력하세요"
        floating-label
      />
    </div>

    <GroupPanel v-model="showBlue" title="대/소문자/Trim 변환" color="blue">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-semibold">대문자 결과</label>
          <CopyInput :model-value="upperResult" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">소문자 결과</label>
          <CopyInput :model-value="lowerResult" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Trim 결과</label>
          <CopyInput :model-value="trimResult" />
        </div>
      </div>
    </GroupPanel>

    <GroupPanel v-model="showGreen" title="표기법 변환" color="green">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-semibold">카멜표기 결과</label>
          <CopyInput :model-value="camelResult" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">스네이크표기 결과</label>
          <CopyInput :model-value="snakeResult" />
        </div>
      </div>
    </GroupPanel>

    <GroupPanel v-model="showPurple" title="패딩(LPad/RPad)" color="purple">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-semibold">LPad 결과</label>
          <div class="flex gap-2 mb-1">
            <v-text-field v-model="lpadLen" type="number" label="길이" style="max-width:80px" density="compact" hide-details />
            <v-text-field v-model="lpadChar" label="채울문자" style="max-width:80px" density="compact" hide-details />
          </div>
          <CopyInput :model-value="lpadResult" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">RPad 결과</label>
          <div class="flex gap-2 mb-1">
            <v-text-field v-model="rpadLen" type="number" label="길이" style="max-width:80px" density="compact" hide-details />
            <v-text-field v-model="rpadChar" label="채울문자" style="max-width:80px" density="compact" hide-details />
          </div>
          <CopyInput :model-value="rpadResult" />
        </div>
      </div>
    </GroupPanel>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref, computed } from 'vue';
import CopyInput from '@/components/CopyInput.vue';
import GroupPanel from '@/components/GroupPanel.vue';
const input = ref('');
const showBlue = ref(true);
const showGreen = ref(true);
const showPurple = ref(true);

const upperResult = computed(() => input.value.toUpperCase());
const lowerResult = computed(() => input.value.toLowerCase());

function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (m) => m.toLowerCase());
}
function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}
const camelResult = computed(() => toCamelCase(input.value));
const snakeResult = computed(() => toSnakeCase(input.value));

// lpad, rpad, trim
const lpadLen = ref(10);
const lpadChar = ref('0');
const rpadLen = ref(10);
const rpadChar = ref(' ');
const lpadResult = computed(() => input.value.padStart(Number(lpadLen.value)||0, lpadChar.value||' '));
const rpadResult = computed(() => input.value.padEnd(Number(rpadLen.value)||0, rpadChar.value||' '));
const trimResult = computed(() => input.value.trim());
</script>
