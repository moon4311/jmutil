<template>
  <div>
    <h2 class="text-xl font-bold mb-4">타이머 원본 데이터 Json 생성</h2>
    <p class="mb-4 text-gray-600">세트 개수를 입력하면, 각 세트마다 시작(state:1), 기록(state:2), 정지(state:0) 데이터가 시간순으로 생성됩니다.</p>
    <div class="border rounded p-4 bg-gray-50 mb-4 flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
      <div>
        <label class="block mb-1 font-semibold">세트 개수</label>
        <input type="number" v-model.number="setCount" min="1" class="border px-2 py-1 rounded w-32" />
      </div>
      <div>
        <label class="block mb-1 font-semibold">시작일시</label>
        <input type="datetime-local" v-model="startDateTime" class="border px-2 py-1 rounded w-56" />
      </div>
      <div>
        <label class="block mb-1 font-semibold">세트별 시작시간 텀(분)</label>
        <input type="number" v-model.number="setGap" min="10" step="10" class="border px-2 py-1 rounded w-32" />
      </div>
      <div>
        <label class="block mb-1 font-semibold">모드</label>
        <div class="flex gap-4 mt-1">
          <label class="inline-flex items-center gap-1">
            <input type="radio" v-model="mode" :value="1" />
            <span>스플릿</span>
          </label>
          <label class="inline-flex items-center gap-1">
            <input type="radio" v-model="mode" :value="2" />
            <span>타이머</span>
          </label>
        </div>
      </div>
      <div class="mt-2 md:mt-0">
        <button @click="generateJson" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold w-full md:w-auto">생성</button>
      </div>
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


const setCount = ref(5);
const startDateTime = ref(getNowDateTimeLocal());
const setGap = ref(10); // 세트별 시작시간 텀(분)
const mode = ref(1); // 1: 스플릿, 2: 타이머
const jsonResult = ref('');
const jsonResult2 = ref('');

function getNowDateTimeLocal() {
  const now = new Date();
  now.setSeconds(0, 0); // 초, ms 0으로
  return now.toISOString().slice(0, 16);
}

function generateJson() {
  let baseUnix;
  if (startDateTime.value) {
    baseUnix = Math.floor(new Date(startDateTime.value).getTime() / 1000);
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
    // 기록 (1분 뒤)
    arr.push({ unixTime: unixTime + 60, mode: mode.value, state: 2, tapCount: 0 });
    // 정지 (2분 뒤)
    arr.push({ unixTime: unixTime + 120, mode: mode.value, state: 0, tapCount: 0 });
    unixTime = unixTime + 120; // 다음 세트 시작점 기준(마지막 정지 시각)
  }
  // 각 객체를 한 줄로 출력
  jsonResult.value = '[\n' + arr.map(obj => '  ' + JSON.stringify(obj)).join(',\n') + '\n]';
  jsonResult2.value = '[\n' + arr.map(obj => formatUnixTime(obj.unixTime)).join(',\n') + '\n]';
}

function formatUnixTime(unixTime) {
  const d = new Date(unixTime * 1000);
  // YYYY-MM-DD HH:mm:ss 포맷
  const pad = n => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
</script>
