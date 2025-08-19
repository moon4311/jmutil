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

    <GroupPanel v-model="showOrange" title="날짜 일괄 변환 (엑셀/시트)" color="orange">
      <div v-show="showOrange" class="p-4 bg-white rounded-b shadow">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 입력 영역 -->
          <div>
            <label class="block mb-2 font-semibold">날짜 데이터 입력 (한 줄당 하나씩)</label>
            <textarea 
              v-model="batchDateInput" 
              placeholder="예:&#10;2023-01-15&#10;2023/02/20 14:30:00&#10;2023.03.25 09:15:30&#10;Jan 15, 2023 16:45:00&#10;01/20/2023 2:30:00 PM"
              class="w-full h-48 p-3 border rounded resize-none font-mono text-sm"
              @input="onBatchDateInputChange"
            ></textarea>
            <div class="mt-2 text-sm text-gray-600">
              감지된 형식: <span class="font-semibold">{{ detectedFormat || '없음' }}</span>
              <span v-if="validCount > 0" class="ml-2 text-green-600">{{ validCount }}개 유효</span>
              <span v-if="invalidCount > 0" class="ml-2 text-red-600">{{ invalidCount }}개 오류</span>
            </div>
          </div>
          
          <!-- 변환 옵션 및 결과 -->
          <div>
            <div class="mb-4">
              <label class="block mb-2 font-semibold">변환할 형식 선택</label>
              <v-select
                v-model="targetFormat"
                :items="formatOptions"
                item-title="name"
                item-value="value"
                density="compact"
                @update:model-value="convertBatchDates"
              />
              
              <div class="mt-3" v-if="targetFormat === 'custom'">
                <label class="block mb-1 text-sm font-medium">커스텀 포맷 패턴</label>
                <v-text-field
                  v-model="customFormat"
                  placeholder="예: YYYY-MM-DD HH:mm:ss"
                  density="compact"
                  hide-details
                  @input="convertBatchDates"
                />
                <div class="mt-1 text-xs text-gray-500">
                  YYYY: 연도, MM: 월, DD: 일, HH: 시간(24시), hh: 시간(12시), mm: 분, ss: 초
                </div>
              </div>
            </div>
            
            <label class="block mb-2 font-semibold">변환 결과</label>
            <div class="relative">
              <textarea 
                v-model="batchDateOutput" 
                readonly
                class="w-full h-48 p-3 border rounded resize-none font-mono text-sm bg-gray-50"
                placeholder="변환 결과가 여기에 표시됩니다"
              ></textarea>
              <button 
                v-if="batchDateOutput"
                @click="copyBatchResult"
                class="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                복사
              </button>
            </div>
          </div>
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
const showOrange = ref(true);

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

// 일괄 변환 관련
const batchDateInput = ref('');
const batchDateOutput = ref('');
const targetFormat = ref('YYYY-MM-DD');
const customFormat = ref('');
const detectedFormat = ref('');
const validCount = ref(0);
const invalidCount = ref(0);

// 날짜 포맷 옵션들
const formatOptions = [
  { name: 'YYYY-MM-DD (ISO 표준)', value: 'YYYY-MM-DD' },
  { name: 'YYYY-MM-DD HH:mm:ss (날짜+시간)', value: 'YYYY-MM-DD HH:mm:ss' },
  { name: 'MM/DD/YYYY (미국식)', value: 'MM/DD/YYYY' },
  { name: 'MM/DD/YYYY HH:mm:ss (미국식+시간)', value: 'MM/DD/YYYY HH:mm:ss' },
  { name: 'DD/MM/YYYY (유럽식)', value: 'DD/MM/YYYY' },
  { name: 'DD/MM/YYYY HH:mm:ss (유럽식+시간)', value: 'DD/MM/YYYY HH:mm:ss' },
  { name: 'YYYY년 MM월 DD일 (한국식)', value: 'YYYY년 MM월 DD일' },
  { name: 'YYYY년 MM월 DD일 HH:mm:ss (한국식+시간)', value: 'YYYY년 MM월 DD일 HH:mm:ss' },
  { name: 'YYYY.MM.DD (점 구분)', value: 'YYYY.MM.DD' },
  { name: 'YYYY.MM.DD HH:mm:ss (점 구분+시간)', value: 'YYYY.MM.DD HH:mm:ss' },
  { name: 'MMM DD, YYYY (영문)', value: 'MMM DD, YYYY' },
  { name: 'MMM DD, YYYY HH:mm:ss (영문+시간)', value: 'MMM DD, YYYY HH:mm:ss' },
  { name: '타임스탬프 (밀리초)', value: 'timestamp' },
  { name: 'Unix 타임스탬프 (초)', value: 'unix' },
  { name: '커스텀 포맷...', value: 'custom' }
];


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

// 일괄 변환 관련 함수들
const detectDateFormat = (dateStr) => {
  const trimmed = dateStr.trim();
  if (!trimmed) return null;
  
  // 다양한 날짜/시간 패턴 검사
  const patterns = [
    // 날짜+시간 패턴들
    { regex: /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/, format: 'YYYY-MM-DD HH:mm:ss' },
    { regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, format: 'YYYY-MM-DDTHH:mm:ss' },
    { regex: /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/, format: 'YYYY-MM-DD HH:mm' },
    { regex: /^\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}$/, format: 'YYYY/MM/DD HH:mm:ss' },
    { regex: /^\d{4}\.\d{2}\.\d{2}\s+\d{2}:\d{2}:\d{2}$/, format: 'YYYY.MM.DD HH:mm:ss' },
    { regex: /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}$/, format: 'MM/DD/YYYY HH:mm:ss' },
    { regex: /^\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM)$/i, format: 'MM/DD/YYYY hh:mm:ss AM/PM' },
    { regex: /^\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}$/, format: 'MM-DD-YYYY HH:mm:ss' },
    { regex: /^\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}:\d{2}$/, format: 'MM.DD.YYYY HH:mm:ss' },
    { regex: /^\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s+\d{2}:\d{2}:\d{2}$/, format: 'YYYY년 MM월 DD일 HH:mm:ss' },
    { regex: /^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}\s+\d{2}:\d{2}:\d{2}$/, format: 'MMM DD, YYYY HH:mm:ss' },
    
    // 날짜만 패턴들
    { regex: /^\d{4}-\d{2}-\d{2}$/, format: 'YYYY-MM-DD' },
    { regex: /^\d{4}\/\d{2}\/\d{2}$/, format: 'YYYY/MM/DD' },
    { regex: /^\d{4}\.\d{2}\.\d{2}$/, format: 'YYYY.MM.DD' },
    { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: 'MM/DD/YYYY' },
    { regex: /^\d{2}-\d{2}-\d{4}$/, format: 'MM-DD-YYYY' },
    { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: 'MM.DD.YYYY' },
    { regex: /^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/, format: 'MMM DD, YYYY' },
    { regex: /^\d{4}년\s*\d{1,2}월\s*\d{1,2}일$/, format: 'YYYY년 MM월 DD일' },
    { regex: /^\d{10,13}$/, format: 'timestamp' }
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(trimmed)) {
      return pattern.format;
    }
  }
  
  // 자연어 날짜도 시도
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return 'natural';
  }
  
  return null;
};

const parseDateString = (dateStr, format) => {
  const trimmed = dateStr.trim();
  if (!trimmed) return null;
  
  try {
    if (format === 'timestamp') {
      const num = Number(trimmed);
      if (isNaN(num)) return null;
      // 타임스탬프가 10자리면 초 단위, 13자리면 밀리초 단위
      return new Date(trimmed.length === 10 ? num * 1000 : num);
    }
    
    // ISO 형식들 (직접 파싱 가능)
    if (format === 'YYYY-MM-DD' || format === 'YYYY/MM/DD' || format === 'YYYY.MM.DD' ||
        format === 'YYYY-MM-DD HH:mm:ss' || format === 'YYYY-MM-DDTHH:mm:ss' ||
        format === 'YYYY/MM/DD HH:mm:ss' || format === 'YYYY.MM.DD HH:mm:ss' ||
        format === 'YYYY-MM-DD HH:mm') {
      const normalizedStr = trimmed.replace(/[/.]/g, '-').replace('T', ' ');
      const parsed = new Date(normalizedStr);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    // MM/DD/YYYY 형식들
    if (format.startsWith('MM/DD/YYYY') || format.startsWith('MM-DD-YYYY') || format.startsWith('MM.DD.YYYY')) {
      const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.';
      const parts = trimmed.split(' ');
      const datePart = parts[0];
      const timePart = parts[1] || '';
      
      const dateComponents = datePart.split(separator);
      if (dateComponents.length === 3) {
        const [mm, dd, yyyy] = dateComponents;
        const dateStr = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        const fullStr = timePart ? `${dateStr} ${timePart}` : dateStr;
        const parsed = new Date(fullStr);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
    }
    
    // AM/PM 형식
    if (format.includes('AM/PM')) {
      const parts = trimmed.split(' ');
      if (parts.length >= 3) {
        const datePart = parts[0];
        const timePart = parts[1];
        const ampm = parts[2];
        
        const dateComponents = datePart.split('/');
        if (dateComponents.length === 3) {
          const [mm, dd, yyyy] = dateComponents;
          const timeComponents = timePart.split(':');
          if (timeComponents.length === 3) {
            let [hh, min, ss] = timeComponents.map(Number);
            if (ampm.toUpperCase() === 'PM' && hh !== 12) hh += 12;
            if (ampm.toUpperCase() === 'AM' && hh === 12) hh = 0;
            
            const dateStr = `${yyyy}-${mm.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}`;
            const timeStr = `${hh.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
            const parsed = new Date(`${dateStr} ${timeStr}`);
            return isNaN(parsed.getTime()) ? null : parsed;
          }
        }
      }
    }
    
    // 한국식 형식
    if (format.includes('년') && format.includes('월') && format.includes('일')) {
      let match;
      if (format.includes('HH:mm:ss')) {
        match = trimmed.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s+(\d{2}):(\d{2}):(\d{2})$/);
        if (match) {
          const [, yyyy, mm, dd, hh, min, ss] = match;
          const dateStr = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')} ${hh}:${min}:${ss}`;
          const parsed = new Date(dateStr);
          return isNaN(parsed.getTime()) ? null : parsed;
        }
      } else {
        match = trimmed.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
        if (match) {
          const [, yyyy, mm, dd] = match;
          const parsed = new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`);
          return isNaN(parsed.getTime()) ? null : parsed;
        }
      }
    }
    
    // 자연어 형식 (MMM DD, YYYY 등)
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
    
  } catch (e) {
    return null;
  }
};

const formatDateToTarget = (date, targetFormat) => {
  if (!date || isNaN(date.getTime())) return '';
  
  // 커스텀 포맷 처리
  if (targetFormat === 'custom') {
    return formatDateCustom(date, customFormat.value);
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  const HH = hours.toString().padStart(2, '0');
  const min = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  
  switch (targetFormat) {
    case 'YYYY-MM-DD':
      return `${year}-${mm}-${dd}`;
    case 'YYYY-MM-DD HH:mm:ss':
      return `${year}-${mm}-${dd} ${HH}:${min}:${ss}`;
    case 'MM/DD/YYYY':
      return `${mm}/${dd}/${year}`;
    case 'MM/DD/YYYY HH:mm:ss':
      return `${mm}/${dd}/${year} ${HH}:${min}:${ss}`;
    case 'DD/MM/YYYY':
      return `${dd}/${mm}/${year}`;
    case 'DD/MM/YYYY HH:mm:ss':
      return `${dd}/${mm}/${year} ${HH}:${min}:${ss}`;
    case 'YYYY년 MM월 DD일':
      return `${year}년 ${month}월 ${day}일`;
    case 'YYYY년 MM월 DD일 HH:mm:ss':
      return `${year}년 ${month}월 ${day}일 ${HH}:${min}:${ss}`;
    case 'YYYY.MM.DD':
      return `${year}.${mm}.${dd}`;
    case 'YYYY.MM.DD HH:mm:ss':
      return `${year}.${mm}.${dd} ${HH}:${min}:${ss}`;
    case 'MMM DD, YYYY':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    case 'MMM DD, YYYY HH:mm:ss':
      const dateStr = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      return `${dateStr} ${HH}:${min}:${ss}`;
    case 'timestamp':
      return date.getTime().toString();
    case 'unix':
      return Math.floor(date.getTime() / 1000).toString();
    default:
      return `${year}-${mm}-${dd}`;
  }
};

// 커스텀 포맷 처리 함수
const formatDateCustom = (date, pattern) => {
  if (!pattern) return '';
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // 12시간제 시간
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  let result = pattern;
  
  // 연도
  result = result.replace(/YYYY/g, year.toString());
  result = result.replace(/YY/g, year.toString().slice(-2));
  
  // 월
  result = result.replace(/MM/g, month.toString().padStart(2, '0'));
  result = result.replace(/M/g, month.toString());
  
  // 일
  result = result.replace(/DD/g, day.toString().padStart(2, '0'));
  result = result.replace(/D/g, day.toString());
  
  // 24시간제 시간
  result = result.replace(/HH/g, hours.toString().padStart(2, '0'));
  result = result.replace(/H/g, hours.toString());
  
  // 12시간제 시간
  result = result.replace(/hh/g, hours12.toString().padStart(2, '0'));
  result = result.replace(/h/g, hours12.toString());
  
  // 분
  result = result.replace(/mm/g, minutes.toString().padStart(2, '0'));
  result = result.replace(/m/g, minutes.toString());
  
  // 초
  result = result.replace(/ss/g, seconds.toString().padStart(2, '0'));
  result = result.replace(/s/g, seconds.toString());
  
  // AM/PM
  result = result.replace(/A/g, ampm);
  result = result.replace(/a/g, ampm.toLowerCase());
  
  return result;
};

const onBatchDateInputChange = () => {
  if (!batchDateInput.value.trim()) {
    detectedFormat.value = '';
    validCount.value = 0;
    invalidCount.value = 0;
    batchDateOutput.value = '';
    return;
  }
  
  const lines = batchDateInput.value.split('\n').filter(line => line.trim());
  if (lines.length === 0) return;
  
  // 첫 번째 유효한 라인으로 포맷 감지
  let detected = '';
  for (const line of lines) {
    detected = detectDateFormat(line);
    if (detected) break;
  }
  
  detectedFormat.value = detected || '알 수 없음';
  
  // 유효성 검사
  let valid = 0;
  let invalid = 0;
  
  for (const line of lines) {
    const format = detectDateFormat(line);
    const parsed = format ? parseDateString(line, format) : null;
    if (parsed) {
      valid++;
    } else {
      invalid++;
    }
  }
  
  validCount.value = valid;
  invalidCount.value = invalid;
  
  // 자동 변환
  convertBatchDates();
};

const convertBatchDates = () => {
  if (!batchDateInput.value.trim()) {
    batchDateOutput.value = '';
    return;
  }
  
  const lines = batchDateInput.value.split('\n');
  const results = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      results.push('');
      continue;
    }
    
    const format = detectDateFormat(trimmed);
    const parsed = format ? parseDateString(trimmed, format) : null;
    
    if (parsed) {
      results.push(formatDateToTarget(parsed, targetFormat.value));
    } else {
      results.push('오류: ' + trimmed);
    }
  }
  
  batchDateOutput.value = results.join('\n');
};

const copyBatchResult = async () => {
  try {
    await navigator.clipboard.writeText(batchDateOutput.value);
    // 간단한 피드백 (토스트 알림 대신)
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '복사됨!';
    button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    button.classList.add('bg-green-500');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-500');
      button.classList.add('bg-blue-500', 'hover:bg-blue-600');
    }, 1000);
  } catch (err) {
    console.error('복사 실패:', err);
    alert('복사에 실패했습니다. 수동으로 선택해서 복사해주세요.');
  }
};

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
