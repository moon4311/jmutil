<template>
  <div>
    <h2 class="text-xl font-bold mb-4">타이머 원본 데이터 Json 생성</h2>
    <p class="mb-4 text-gray-600">세트 개수와 각 세트별 기록 개수를 입력하면, 각 세트마다 시작(state:1), 기록(state:2), 정지(state:0) 데이터가 시간순으로 생성됩니다.</p>
    <div class="border rounded p-4 bg-gray-50 mb-4 flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
      <div>
        <label class="block mb-1 font-semibold">세트 개수</label>
        <input type="number" v-model.number="setCount" min="1" class="border px-2 py-1 rounded w-32" />
      </div>
      <div>
        <label class="block mb-1 font-semibold">모드</label>
        <select v-model.number="mode" class="border px-2 py-1 rounded w-32">
          <option :value="1">스플릿</option>
          <option :value="2">타이머</option>
        </select>
      </div>
      <div>
        <label class="block mb-1 font-semibold">세트별 기록 개수</label>
        <input type="number" v-model.number="recordCount" min="1" class="border px-2 py-1 rounded w-32" />
      </div>
      <div>
        <label class="block mb-1 font-semibold">시작일시</label>
        <input type="datetime-local" v-model="startDateTime" class="border px-2 py-1 rounded w-56" />
      </div>
      <div>
        <label class="block mb-1 font-semibold">세트별 시작시간 텀(분)</label>
        <input type="number" v-model.number="setGap" min="10" step="10" class="border px-2 py-1 rounded w-32" />
      </div>
      <div class="mt-2 md:mt-0 flex gap-2">
        <button @click="generateJson" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold w-full md:w-auto">생성</button>
        <button @click="clearJson" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow font-bold w-full md:w-auto">초기화</button>
      </div>
    </div>
    <div v-if="genHistory.length" class="border rounded p-4 bg-white mb-4">
      <label class="block mb-2 font-semibold">생성 조건 히스토리</label>
      <ul class="text-xs text-gray-700 list-decimal ml-4">
        <li v-for="(h, i) in genHistory" :key="i">
          세트: {{ h.setCount }}, 기록: {{ h.recordCount }}, 시작: {{ h.startDateTime }}, 텀: {{ h.setGap }}분, 모드: {{ h.mode === 1 ? '스플릿' : '타이머' }}
        </li>
      </ul>
    </div>
    <div v-if="jsonResult" class="border rounded p-4 bg-white">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 좌측: JSON -->
        <div class="border rounded p-4 bg-white flex-1 min-w-0">
          <label class="block mb-2 font-semibold">생성된 JSON</label>
          <CopyTextArea :model-value="jsonResult" />
        </div>
        <div class="border rounded p-4 bg-white flex-1 min-w-0">
          <label class="block mb-2 font-semibold">참고</label>
          <CopyTextArea :model-value="jsonResult2" />
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

import { ref } from 'vue';
import CopyTextArea from '@/components/CopyTextArea.vue';
import { formatDateTime } from '@/utils/DateUtil.js';
import { getToday, toDatetimeLocal } from '@/utils/CommonUtil.js';

const setCount = ref(4);
const recordCount = ref(20); // 세트별 기록 개수
const startDateTime = ref(toDatetimeLocal());
const setGap = ref(10); // 세트별 시작시간 텀(분)
const mode = ref(1); // 1: 스플릿, 2: 타이머
const genHistory = ref([]); // 생성 조건 히스토리
const jsonResult = ref('');
const jsonResult2 = ref('');

function formatUnixTime(unixTime) {
  // unixTime: 초 단위
  return formatDateTime(new Date(unixTime * 1000));
}

function generateJson() {
  let baseUnix;
  if (startDateTime.value) {
    // 입력값을 KST로 간주하고, UTC로 변환하여 unixTime 계산
    // datetime-local은 브라우저 로컬 타임존 기준이므로, 입력값을 UTC+9로 해석
    const [date, time] = startDateTime.value.split('T');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    // Date.UTC는 UTC 기준, KST는 -9시간 해야 UTC
    baseUnix = Math.floor(Date.UTC(year, month - 1, day, hour - 9, minute) / 1000);
  } else {
    baseUnix = Math.floor(Date.now() / 1000);
  }
  
  const arr = [];
  let unixTime = baseUnix;
  for (let i = 0; i < setCount.value; i++) {
    // 세트별 시작시간 텀 적용
    if (i > 0) {
      unixTime += setGap.value * 60;
    }
    // 시작
    arr.push({ unixTime: unixTime, mode: mode.value, state: 1, tapCount: 0 });
    // 기록들 (지정된 개수만큼)
    for (let j = 0; j < recordCount.value; j++) {
      unixTime += 60; // 각 기록마다 1분씩 증가
      arr.push({ unixTime: unixTime, mode: mode.value, state: 2, tapCount: 0 });
    }
    // 정지 (마지막 기록 1분 뒤)
    unixTime += 60;
    arr.push({ unixTime: unixTime, mode: mode.value, state: 0, tapCount: 0 });
  }
  // append 방식
  if (jsonResult.value.trim()) {
    jsonResult.value = jsonResult.value.replace(/\n]$/, ',\n') + arr.map(obj => (obj.state === 1 ? ' ' : '  ') + JSON.stringify(obj)).join(',\n') + '\n]';
    jsonResult2.value = jsonResult2.value.replace(/\n]$/, ',\n') + arr.map(obj => (obj.state === 1 ? ' ' : '  ') + formatUnixTime(obj.unixTime)).join(',\n') + '\n]';
  } else {
    jsonResult.value = '[\n' + arr.map(obj => (obj.state === 1 ? ' ' : '  ') + JSON.stringify(obj)).join(',\n') + '\n]';
    jsonResult2.value = '[\n' + arr.map(obj =>(obj.state === 1 ? ' ' : '  ') + formatUnixTime(obj.unixTime)).join(',\n') + '\n]';
  }
  // 생성 조건 히스토리 누적
  genHistory.value.push({
    setCount: setCount.value,
    recordCount: recordCount.value,
    startDateTime: startDateTime.value,
    setGap: setGap.value,
    mode: mode.value
  });
}

function clearJson() {
  jsonResult.value = '';
  jsonResult2.value = '';
  genHistory.value = [];
}
</script>
