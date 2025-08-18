<template>
  <div>
    <h2 class="text-xl font-bold mb-4">날짜 유틸리티</h2>
    <GroupPanel v-model="showBlue" title="날짜 → 타임스탬프 변환" color="blue">
      <div v-show="showBlue" class="p-4 bg-white rounded-b shadow">
          <div class="flex gap-4">
            <!-- 왼쪽: 날짜 입력 -->
            <div class="flex-1">
              <label class="block mb-1 font-semibold">날짜 입력</label>
              <div class="flex items-center gap-1 mb-2">
                <v-text-field v-model="dateInput" style="max-width:150px" hide-details density="compact" placeholder="YYYY-MM-DD" @input="onDateInput" />
                <v-text-field
                  v-model.number="dateYear"
                  type="number"
                  label="연"
                  min="1900"
                  max="2100"
                  style="max-width:90px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDatePart('year', 1)"
                  @keydown.down.prevent="incDatePart('year', -1)"
                  @change="onDatePartsChange"
                />
                <span>/</span>
                <v-text-field
                  v-model.number="dateMonth"
                  type="number"
                  label="월"
                  min="1"
                  max="12"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDatePart('month', 1)"
                  @keydown.down.prevent="incDatePart('month', -1)"
                  @change="onDatePartsChange"
                />
                <span>/</span>
                <v-text-field
                  v-model.number="dateDay"
                  type="number"
                  label="일"
                  min="1"
                  max="31"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDatePart('day', 1)"
                  @keydown.down.prevent="incDatePart('day', -1)"
                  @change="onDatePartsChange"
                />
                <button @click="setTodayDate" class="bg-blue-500 hover:underline text-white px-2 py-1 rounded">오늘</button>
              </div>
            </div>
            <div class="flex items-center px-2">→</div>
            <div class="flex-1">
              <label class="block mb-1 font-semibold">타임스탬프</label>
              <CopyInput :model-value="dateTimestamp" />
            </div>
          </div>
          <div class="flex gap-4 mt-6">
            <div class="flex-1">
              <label class="block mb-1 font-semibold">일시 입력</label>
              <div class="flex items-center gap-1 mb-2">
                <input type="datetime-local" v-model="datetimeFull" class="border px-2 py-1 rounded w-80" />
              </div>
              <div class="flex items-center gap-1 mb-2">
                <v-text-field
                  v-model.number="dtYear"
                  type="number"
                  label="연"
                  min="1900"
                  max="2100"
                  style="max-width:90px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDateTimePart('year', 1)"
                  @keydown.down.prevent="incDateTimePart('year', -1)"
                  @change="onDateTimePartsChange"
                />
                <span>/</span>
                <v-text-field
                  v-model.number="dtMonth"
                  type="number"
                  label="월"
                  min="1"
                  max="12"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDateTimePart('month', 1)"
                  @keydown.down.prevent="incDateTimePart('month', -1)"
                  @change="onDateTimePartsChange"
                />
                <span>/</span>
                <v-text-field
                  v-model.number="dtDay"
                  type="number"
                  label="일"
                  min="1"
                  max="31"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDateTimePart('day', 1)"
                  @keydown.down.prevent="incDateTimePart('day', -1)"
                  @change="onDateTimePartsChange"
                />
                <v-text-field
                  v-model.number="dtHour"
                  type="number"
                  label="시"
                  min="0"
                  max="23"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDateTimePart('hour', 1)"
                  @keydown.down.prevent="incDateTimePart('hour', -1)"
                  @change="onDateTimePartsChange"
                />
                <span>:</span>
                <v-text-field
                  v-model.number="dtMin"
                  type="number"
                  label="분"
                  min="0"
                  max="59"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDateTimePart('min', 1)"
                  @keydown.down.prevent="incDateTimePart('min', -1)"
                  @change="onDateTimePartsChange"
                />
                <span>:</span>
                <v-text-field
                  v-model.number="dtSec"
                  type="number"
                  label="초"
                  min="0"
                  max="59"
                  style="max-width:70px"
                  density="compact"
                  hide-details
                  @keydown.up.prevent="incDateTimePart('sec', 1)"
                  @keydown.down.prevent="incDateTimePart('sec', -1)"
                  @change="onDateTimePartsChange"
                />
              </div>
            </div>
            <div class="flex items-center px-2">→</div>
            <div class="flex-1">
              <label class="block mb-1 font-semibold">타임스탬프</label>
              <CopyInput :model-value="datetimeTimestamp" />
            </div>
          </div>
        </div>
    </GroupPanel>

    <GroupPanel v-model="showGreen" title="타임스탬프 → 날짜/일시 변환" color="green">
      <div v-show="showGreen" class="p-4 bg-white rounded-b shadow">
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block mb-1 font-semibold">타임스탬프 입력</label>
            <v-text-field 
              v-model="timestampInput" 
              placeholder="숫자만 입력" 
              @input="onTimestampInput"
              @keydown.up.prevent="incTimestamp(1)"
              @keydown.down.prevent="incTimestamp(-1)"
            />
          </div>
          <div class="flex items-center px-2">→</div>
          <div class="flex-1">
            <label class="block mb-1 font-semibold">날짜/일시</label>
            <CopyInput :model-value="timestampDate" />
          </div>
        </div>
      </div>
    </GroupPanel>
    <GroupPanel v-model="showPurple" title="날짜 차이/계산" color="purple">
      <div v-show="showPurple" class="p-4 bg-white rounded-b shadow">
        <div class="flex gap-4 mb-4">
          <div class="flex-1">
            <label class="block mb-1 font-semibold">날짜1</label>
            <v-text-field 
              v-model="diffDate1" 
              type="date"
              @change="calculateDateDiff"
              hide-details
              density="compact"
            />
          </div>
          <div class="flex-1">
            <label class="block mb-1 font-semibold">날짜2</label>
            <v-text-field 
              v-model="diffDate2" 
              type="date"
              @change="calculateDateDiff"
              hide-details
              density="compact"
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-semibold">차이(일)</label>
          <CopyInput :model-value="dateDiffResult" />
        </div>
        <div class="mb-2">
          <label class="block mb-1 font-semibold">날짜 + N일</label>
          <div class="flex gap-2 mb-2">
            <v-text-field 
              v-model="addDate" 
              type="date" 
              style="width: 160px" 
              @change="calculateAddDate"
              hide-details
              density="compact"
            />
            <v-text-field 
              v-model.number="addDays" 
              placeholder="N" 
              type="number" 
              style="width: 100px" 
              @input="calculateAddDate"
              hide-details
              density="compact"
            />
          </div>
          <CopyInput :model-value="addDateResult" />
        </div>
      </div>
    </GroupPanel>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref, nextTick, watchEffect, onMounted } from 'vue';
import {
  isValidDate, isValidTime, isValidDatetime, formatDate, formatDateTime
} from '@/utils/DateUtil.js';
import { getToday, getNowTimestamp, toDatetimeLocal } from '@/utils/CommonUtil.js';
import { formatDateInput } from '@/utils/InputFormatUtil.js';
import CopyInput from '@/components/CopyInput.vue';
import GroupPanel from '@/components/GroupPanel.vue';

const showBlue = ref(true);
const showGreen = ref(true);
const showPurple = ref(true);

const dateInput = ref(getToday());
// 연/월/일 분리 입력
const today = new Date();
const dateYear = ref(today.getFullYear());
const dateMonth = ref(today.getMonth() + 1);
const dateDay = ref(today.getDate());
const dateTimestamp = ref('');

// 일시 입력 분리 (연/월/일/시/분/초)
const now = new Date();
const dtYear = ref(now.getFullYear());
const dtMonth = ref(now.getMonth() + 1);
const dtDay = ref(now.getDate());
const dtHour = ref(now.getHours());
const dtMin = ref(now.getMinutes());
const dtSec = ref(now.getSeconds());
const datetimeFull = ref(toDatetimeLocal(now));
const datetimeTimestamp = ref('');
const timestampInput = ref(getNowTimestamp().toString());
const timestampDate = ref('');

// 날짜 차이 계산 - 기본값을 오늘로 설정
const diffDate1 = ref(getToday());
const diffDate2 = ref(getToday());
const dateDiffResult = ref('');

const addDate = ref(getToday());
const addDays = ref('');
const addDateResult = ref('');


// 날짜 입력 → 타임스탬프 변환
const onDateInput = (e) => {
  const val = e.target.value;
  const formatted = formatDateInput(val);
  nextTick(() => {
    dateInput.value = formatted;
    if (formatted.length === 10 && isValidDate(formatted)) {
      const d = new Date(formatted);
      dateTimestamp.value = d.getTime()+ '';
      // 연/월/일 분리 입력값도 동기화
      dateYear.value = d.getFullYear();
      dateMonth.value = d.getMonth() + 1;
      dateDay.value = d.getDate();
    } else {
      dateTimestamp.value = '';
    }
  });
};

// 연/월/일 분리 입력 → dateInput 동기화
const onDatePartsChange = () => {
  const y = Number(dateYear.value);
  const m = Number(dateMonth.value);
  const d = Number(dateDay.value);
  if (
    y >= 1900 && y <= 2100 &&
    m >= 1 && m <= 12 &&
    d >= 1 && d <= 31
  ) {
    const mm = m.toString().padStart(2, '0');
    const dd = d.toString().padStart(2, '0');
    const str = `${y}-${mm}-${dd}`;
    dateInput.value = str;
    if (isValidDate(str)) {
      dateTimestamp.value = new Date(str).getTime();
    } else {
      dateTimestamp.value = '';
    }
  }
};

// 방향키로 연/월/일 증감
function incDatePart(part, diff) {
  let y = Number(dateYear.value);
  let m = Number(dateMonth.value);
  let d = Number(dateDay.value);
  if (part === 'year') y += diff;
  if (part === 'month') m += diff;
  if (part === 'day') d += diff;
  // 월/일 범위 보정
  if (m < 1) { m = 12; y -= 1; }
  if (m > 12) { m = 1; y += 1; }
  const lastDay = new Date(y, m, 0).getDate();
  if (d < 1) d = lastDay;
  if (d > lastDay) d = 1;
  dateYear.value = y;
  dateMonth.value = m;
  dateDay.value = d;
  onDatePartsChange();
}

// 일시 입력 → 타임스탬프 변환 (분리 입력)
function updateDatetimeTimestamp() {
  const y = Number(dtYear.value), m = Number(dtMonth.value), d = Number(dtDay.value);
  const h = Number(dtHour.value), mi = Number(dtMin.value), s = Number(dtSec.value);
  if (
    y >= 1900 && y <= 2100 &&
    m >= 1 && m <= 12 &&
    d >= 1 && d <= 31 &&
    h >= 0 && h <= 23 &&
    mi >= 0 && mi <= 59 &&
    s >= 0 && s <= 59
  ) {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const hh = String(h).padStart(2, '0');
    const mmi = String(mi).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    const str = `${y}-${mm}-${dd}T${hh}:${mmi}:${ss}`;
    datetimeFull.value = str;
    if (isValidDatetime(`${y}-${mm}-${dd}`, `${hh}:${mmi}:${ss}`)) {
      datetimeTimestamp.value = new Date(`${y}-${mm}-${dd}T${hh}:${mmi}:${ss}`).getTime();
    } else {
      datetimeTimestamp.value = '';
    }
  }
}
watchEffect(() => {
  updateDatetimeTimestamp();
});

// 분리 입력 → 풀텍스트 동기화
const onDateTimePartsChange = () => {
  updateDatetimeTimestamp();
};

// 방향키로 연/월/일/시/분/초 증감
function incDateTimePart(part, diff) {
  let y = Number(dtYear.value);
  let m = Number(dtMonth.value);
  let d = Number(dtDay.value);
  let h = Number(dtHour.value);
  let mi = Number(dtMin.value);
  let s = Number(dtSec.value);
  if (part === 'year') y += diff;
  if (part === 'month') m += diff;
  if (part === 'day') d += diff;
  if (part === 'hour') h += diff;
  if (part === 'min') mi += diff;
  if (part === 'sec') s += diff;
  // 월/일/시/분/초 범위 보정
  if (m < 1) { m = 12; y -= 1; }
  if (m > 12) { m = 1; y += 1; }
  const lastDay = new Date(y, m, 0).getDate();
  if (d < 1) d = lastDay;
  if (d > lastDay) d = 1;
  if (h < 0) h = 23;
  if (h > 23) h = 0;
  if (mi < 0) mi = 59;
  if (mi > 59) mi = 0;
  if (s < 0) s = 59;
  if (s > 59) s = 0;
  dtYear.value = y;
  dtMonth.value = m;
  dtDay.value = d;
  dtHour.value = h;
  dtMin.value = mi;
  dtSec.value = s;
  updateDatetimeTimestamp();
}

// 타임스탬프 입력 → 날짜/일시 변환 (시간까지)
const onTimestampInput = (e) => {
  const val = e.target.value.replace(/\D/g, '');
  timestampInput.value = val;
  if (val.length > 0) {
    const d = new Date(Number(val));
    if (!isNaN(d)) {
      timestampDate.value = formatDateTime(d);
    } else {
      timestampDate.value = '잘못된 타임스탬프';
    }
  } else {
    timestampDate.value = '';
  }
};

// 타임스탬프 입력 증감 (ms 단위, 1초=1000ms)
function incTimestamp(diff) {
  let val = Number(timestampInput.value);
  if (isNaN(val)) val = 0;
  val += diff * 1000;
  timestampInput.value = val.toString();
  // 입력값 변경시 변환도 즉시 반영
  if (!isNaN(val)) {
    const d = new Date(val);
    if (!isNaN(d)) {
      timestampDate.value = formatDateTime(d);
    } else {
      timestampDate.value = '잘못된 타임스탬프';
    }
  } else {
    timestampDate.value = '';
  }
}

function setTodayDate() {
  const todayDate = getToday();
  dateInput.value = todayDate;
  const d = new Date();
  dateYear.value = d.getFullYear();
  dateMonth.value = d.getMonth() + 1;
  dateDay.value = d.getDate();
  onDatePartsChange();
}

// 날짜 차이 계산
const calculateDateDiff = () => {
  if (diffDate1.value && diffDate2.value) {
    const date1 = new Date(diffDate1.value);
    const date2 = new Date(diffDate2.value);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    dateDiffResult.value = diffDays.toString();
  } else {
    dateDiffResult.value = '';
  }
};

// 날짜 + N일 계산
const calculateAddDate = () => {
  if (addDate.value && typeof addDays.value === 'number' && !isNaN(addDays.value)) {
    const d = new Date(addDate.value);
    d.setDate(d.getDate() + Number(addDays.value));
    addDateResult.value = formatDate(d);
  } else {
    addDateResult.value = '';
  }
};

// 컴포넌트 마운트 시 초기 계산 실행
onMounted(() => {
  calculateDateDiff();
  // 초기 타임스탬프 계산
  if (dateInput.value && isValidDate(dateInput.value)) {
    const d = new Date(dateInput.value);
    dateTimestamp.value = d.getTime().toString();
  }
  updateDatetimeTimestamp();
  if (timestampInput.value && !isNaN(Number(timestampInput.value))) {
    const d = new Date(Number(timestampInput.value));
    if (!isNaN(d)) {
      timestampDate.value = formatDateTime(d);
    }
  }
});

// 날짜 입력, 일시 입력, 타임스탬프 입력의 기본값을 현재로 설정
// 아래 watchEffect는 페이지 진입시 타임스탬프 변환을 자동으로 실행
watchEffect(() => {
  // 날짜 입력 → 타임스탬프
  if (dateInput.value && isValidDate(dateInput.value)) {
    const d = new Date(dateInput.value);
    dateTimestamp.value = d.getTime().toString();
  }
  // 일시 입력 → 타임스탬프
  updateDatetimeTimestamp();
  // 타임스탬프 입력 → 날짜/일시
  if (timestampInput.value && !isNaN(Number(timestampInput.value))) {
    const d = new Date(Number(timestampInput.value));
    if (!isNaN(d)) {
      timestampDate.value = formatDateTime(d);
    }
  }
});
</script>
