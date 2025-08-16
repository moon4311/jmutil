<template>
  <div>
    <h2 class="text-xl font-bold mb-4">JSON/객체 유틸리티</h2>
    <!-- 예시: JSON 포맷팅 -->
    <div class="mb-4">
      <label class="block mb-1 font-semibold">JSON 입력</label>
      <v-textarea v-model="input" placeholder="JSON 문자열을 입력하세요" />
    </div>
    <div class="flex gap-2 mb-4">
      <v-btn @click="formatJson">포맷팅</v-btn>
      <v-btn @click="minifyJson">압축</v-btn>
    </div>
    <div class="mt-2">
      <label class="block mb-1 font-semibold">결과</label>
      <v-textarea :value="result" readonly />
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref } from 'vue';
const input = ref('');
const result = ref('');
const formatJson = () => {
  try {
    result.value = JSON.stringify(JSON.parse(input.value), null, 2);
  } catch {
    result.value = 'JSON 파싱 오류';
  }
};
const minifyJson = () => {
  try {
    result.value = JSON.stringify(JSON.parse(input.value));
  } catch {
    result.value = 'JSON 파싱 오류';
  }
};

</script>
