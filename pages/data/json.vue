<template>
  <div>
    <h2 class="text-xl font-bold mb-4">JSON/객체 유틸리티</h2>
    
    <!-- JSON 입력 영역 (1단 전체 너비) -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <label class="font-semibold">JSON 입력</label>
        <div v-if="validationMessage" class="text-sm" :class="isValid ? 'text-green-600' : 'text-red-600'">
          {{ validationMessage }}
          <span v-if="isValid && objectCount > 0" class="ml-2 font-semibold">
            ({{ objectCount }}개 객체)
          </span>
        </div>
      </div>
      
      <!-- JSON 탭 전환 -->
      <v-tabs v-model="activeTab" class="mb-3" density="compact">
        <v-tab value="original">원본</v-tab>
        <v-tab value="processed" :disabled="!processedData">가공</v-tab>
      </v-tabs>
      
      <v-window v-model="activeTab">
        <!-- 원본 탭 -->
        <v-window-item value="original">
          <v-textarea
            v-model="input"
            placeholder="JSON 문자열을 입력하세요"
            rows="8"
            variant="solo-filled"
            density="comfortable"
            hide-details
            @input="onInputChange"
          />
        </v-window-item>
        
        <!-- 가공 탭 -->
        <v-window-item value="processed">
          <div class="space-y-3">
            <!-- 포맷팅/압축 버튼 -->
            <div class="flex gap-2 mb-3">
              <v-btn 
                @click="handleFormat" 
                :color="processMode === 'format' ? 'blue' : 'grey'"
                :variant="processMode === 'format' ? 'elevated' : 'outlined'"
                size="small"
                :disabled="!processedData"
                prepend-icon="mdi-code-braces"
              >
                포맷팅
              </v-btn>
              <v-btn 
                @click="handleMinify" 
                :color="processMode === 'minify' ? 'orange' : 'grey'"
                :variant="processMode === 'minify' ? 'elevated' : 'outlined'"
                size="small"
                :disabled="!processedData"
                prepend-icon="mdi-compress"
              >
                압축
              </v-btn>
            </div>
            
            <CopyTextArea :model-value="processedData" rows="8" readonly />
          </div>
        </v-window-item>
      </v-window>
    </div>
    
    <!-- 특정 키 선택 (1단 전체 너비) -->
    <div class="mb-6" v-if="availableKeys.length > 0">
      <div class="flex justify-between items-center mb-2">
        <label class="font-semibold">특정 키 선택 (토글로 선택)</label>
        <v-btn 
          @click="selectAllKeys"
          color="blue"
          variant="outlined"
          size="small"
          prepend-icon="mdi-check-all"
        >
          전체 선택
        </v-btn>
      </div>
      <div class="flex flex-wrap gap-2 mb-3">
        <v-chip
          v-for="key in availableKeys"
          :key="key"
          :color="selectedKeysSet.has(key) ? 'blue' : 'grey'"
          :variant="selectedKeysSet.has(key) ? 'elevated' : 'outlined'"
          @click="toggleKey(key)"
          class="cursor-pointer"
        >
          <v-icon v-if="selectedKeysSet.has(key)" start>mdi-check</v-icon>
          {{ key }}
        </v-chip>
      </div>
    </div>
    
    <!-- 기능별 버튼 그룹 (2단 구조) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="accordionStates.showFiltering" title="조건별 객체 찾기" color="blue">
          <div class="space-y-3">
            <!-- 조건 추가 버튼과 논리 연산자 -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <v-btn 
                  @click="addFilterCondition"
                  color="blue"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-plus"
                >
                  조건 추가
                </v-btn>
                <div v-if="filterConditions.length > 1" class="flex items-center gap-2">
                  <span class="text-xs">연결:</span>
                  <v-btn-toggle v-model="logicalOperator" mandatory density="compact" size="small">
                    <v-btn value="AND" size="small">AND</v-btn>
                    <v-btn value="OR" size="small">OR</v-btn>
                  </v-btn-toggle>
                </div>
              </div>
              <div class="flex gap-2">
                <v-btn 
                  @click="handleMultiFilter" 
                  color="blue"
                  variant="elevated"
                  size="small"
                  :disabled="!processedData && !input || !hasValidConditions"
                  prepend-icon="mdi-filter"
                >
                  검색
                </v-btn>
                <v-btn 
                  @click="handleResetFilter" 
                  color="red"
                  variant="outlined"
                  size="small"
                  :disabled="filterConditions.length <= 1 && !filterConditions[0].key"
                  prepend-icon="mdi-refresh"
                >
                  초기화
                </v-btn>
              </div>
            </div>
            
            <!-- 콤팩트한 조건 입력 -->
            <div v-for="(condition, index) in filterConditions" :key="index" class="border rounded p-2 bg-gray-50">
              <div class="grid grid-cols-12 gap-2 items-end">
                <!-- 조건 번호 -->
                <div class="col-span-1">
                  <span class="text-xs font-medium text-gray-500">{{ index + 1 }}</span>
                </div>
                
                <!-- 키 선택 -->
                <div class="col-span-3">
                  <v-select
                    v-model="condition.key"
                    :items="processedAvailableKeys"
                    variant="outlined"
                    density="compact"
                    hide-details
                    placeholder="키"
                  />
                </div>
                
                <!-- 연산자 -->
                <div class="col-span-2">
                  <v-select
                    v-model="condition.operator"
                    :items="compactFilterOperators"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </div>
                
                <!-- 값 -->
                <div class="col-span-5">
                  <v-text-field 
                    v-model="condition.value" 
                    variant="outlined"
                    density="compact"
                    hide-details
                    placeholder="비교값"
                  />
                </div>
                
                <!-- 삭제 버튼 -->
                <div class="col-span-1">
                  <v-btn 
                    v-if="filterConditions.length > 1"
                    @click="removeFilterCondition(index)"
                    color="red"
                    variant="text"
                    size="x-small"
                    icon="mdi-close"
                  />
                </div>
              </div>
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="accordionStates.showSorting" title="정렬" color="green">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block mb-1 font-semibold">정렬 키</label>
                <v-select
                  v-model="sortKey"
                  :items="processedAvailableKeys"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="키를 선택하세요"
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">순서</label>
                <v-select
                  v-model="sortOrder"
                  :items="sortOrders"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">데이터 타입</label>
                <v-select
                  v-model="sortType"
                  :items="sortTypes"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                />
              </div>
            </div>
            <v-btn 
              @click="handleSort" 
              color="green"
              variant="elevated"
              size="large"
              :disabled="(!processedData && !input) || !sortKey"
              prepend-icon="mdi-sort"
              block
            >
              정렬 적용
            </v-btn>
          </div>
        </GroupPanel>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
// SEO 메타 및 구조화 데이터 설정
const config = useRuntimeConfig()
const siteUrl = config.public?.siteUrl || 'https://www.web-util.com'
useHead({
  title: 'JSON 가공 · 포맷팅/유효성/필터/정렬 | Web-Util',
  meta: [
    { name: 'description', content: 'JSON 유효성 검사, 포맷팅, 키 선택, 다중 필터링, 정렬까지 한 번에 처리하는 개발자용 JSON 도구.' },
    { property: 'og:title', content: 'JSON 가공 도구 - Web-Util' },
    { property: 'og:description', content: 'JSON 포맷팅·검증·필터·정렬 기능을 제공하는 무료 웹 도구입니다.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl + '/data/json' }
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/data/json' }]
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'JSON 가공 도구',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl + '/data/json',
        description: 'JSON 포맷팅, 유효성 검사, 키 선택, 다중 필터링, 정렬을 지원하는 무료 웹 도구.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
      })
    }
  ]
})
import { ref, computed } from 'vue';
import { extractKeys, selectKeys, filterObjects, filterObjectsMultiple, sortObjects, JsonUtil, formatJson } from '@/utils/JsonUtil.js';
import GroupPanel from '@/components/GroupPanel.vue';
import CopyTextArea from '@/components/CopyTextArea.vue';
import { useAccordion } from '@/composables/useAccordion.js';
import { useValidation } from '@/composables/useValidation.js';

const input = ref('');
const activeTab = ref('original');
const processedData = ref('');
const processMode = ref(''); // 'format', 'minify', 'select' 등

// 키 선택 기능
const selectedKeysArray = ref([]);

// 다중 필터링 기능
const filterConditions = ref([
  { key: '', operator: '=', value: '' }
]);
const logicalOperator = ref('AND');
const filteredCount = ref(0);

const filterOperators = [
  { title: '같음 (=)', value: '=' },
  { title: '다름 (!=)', value: '!=' },
  { title: '큼 (>)', value: '>' },
  { title: '작음 (<)', value: '<' },
  { title: '크거나 같음 (>=)', value: '>=' },
  { title: '작거나 같음 (<=)', value: '<=' },
  { title: '포함 (contains)', value: 'contains' },
  { title: '시작 (startsWith)', value: 'startsWith' },
  { title: '끝남 (endsWith)', value: 'endsWith' }
];

// 콤팩트한 연산자 목록
const compactFilterOperators = [
  { title: '=', value: '=' },
  { title: '≠', value: '!=' },
  { title: '>', value: '>' },
  { title: '<', value: '<' },
  { title: '≥', value: '>=' },
  { title: '≤', value: '<=' },
  { title: '포함', value: 'contains' },
  { title: '시작', value: 'startsWith' },
  { title: '끝남', value: 'endsWith' }
];

// 정렬 기능
const sortKey = ref('');
const sortOrder = ref('asc');
const sortType = ref('string');

const sortOrders = [
  { title: '오름차순 (ASC)', value: 'asc' },
  { title: '내림차순 (DESC)', value: 'desc' }
];

const sortTypes = [
  { title: '문자열', value: 'string' },
  { title: '숫자', value: 'number' },
  { title: '날짜', value: 'date' }
];

// 아코디언 상태 관리
const { accordionStates } = useAccordion({
  showFiltering: true,
  showSorting: true
});

// 원본 데이터의 사용 가능한 키 목록
const availableKeys = computed(() => {
  if (!input.value || !isValid.value) return [];
  const keys = extractKeys(input.value);
  
  // JSON 입력이 유효하고 키가 있으면 자동으로 모든 키 선택 (탭 이동 없이)
  if (keys.length > 0 && selectedKeysArray.value.length === 0) {
    // 약간의 지연을 두어 reactive 업데이트 완료 후 실행
    setTimeout(() => {
      if (selectedKeysArray.value.length === 0) {
        selectedKeysArray.value = [...keys];
        // 자동 선택된 키로 가공 데이터 생성 (탭 이동 없이)
        try {
          const result = selectKeys(input.value, keys);
          // 기본적으로 포맷팅 적용
          if (result) {
            processedData.value = formatJson(result);
            processMode.value = 'format';
          }
          // activeTab.value = 'processed'; // 자동 탭 이동 제거
        } catch (error) {
          console.warn('자동 키 선택 실패:', error.message);
          // 오류 발생 시 가공 데이터 초기화
          processedData.value = '';
          processMode.value = '';
        }
      }
    }, 100);
  }
  
  return keys;
});

// 가공 데이터의 사용 가능한 키 목록
const processedAvailableKeys = computed(() => {
  if (!processedData.value) {
    // 가공 데이터가 없으면 원본 데이터의 키를 사용
    return availableKeys.value;
  }
  try {
    return extractKeys(processedData.value);
  } catch {
    return availableKeys.value;
  }
});

const selectedKeysSet = computed(() => new Set(selectedKeysArray.value));

// JSON 객체 개수 계산
const objectCount = computed(() => {
  if (!input.value || !isValid.value) return 0;
  try {
    const jsonData = JSON.parse(input.value);
    if (Array.isArray(jsonData)) {
      return jsonData.length;
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      return 1;
    }
    return 0;
  } catch {
    return 0;
  }
});

// 유효한 필터 조건 체크
const hasValidConditions = computed(() => {
  return filterConditions.value.some(condition => 
    condition.key && condition.value.trim()
  );
});

// 유효성 검사
const { validateJson } = useValidation();

// JSON 유효성 검사
const validationResult = computed(() => {
  if (!input.value.trim()) {
    return { isValid: false, error: '', parsed: null };
  }
  return validateJson(input.value);
});

const isValid = computed(() => validationResult.value.isValid);

const validationMessage = computed(() => {
  if (!input.value.trim()) return '';
  if (validationResult.value.isValid) return '✓ 유효한 JSON 형식입니다.';
  return `✗ ${validationResult.value.error}`;
});

const onInputChange = () => {
  // 입력이 변경되면 결과 초기화
  processedData.value = '';
  processMode.value = '';
  selectedKeysArray.value = [];
  filteredCount.value = 0;
  
  // 필터 조건 초기화
  filterConditions.value = [{ key: '', operator: '=', value: '' }];
  sortKey.value = '';
  
  // 원본 탭으로 돌아가기
  activeTab.value = 'original';
};

// 다중 필터 조건 관리
const addFilterCondition = () => {
  filterConditions.value.push({ key: '', operator: '=', value: '' });
};

const removeFilterCondition = (index) => {
  if (filterConditions.value.length > 1) {
    filterConditions.value.splice(index, 1);
  }
};

// 키 토글 기능
const toggleKey = (key) => {
  const index = selectedKeysArray.value.indexOf(key);
  if (index > -1) {
    selectedKeysArray.value.splice(index, 1);
  } else {
    selectedKeysArray.value.push(key);
  }
  
  // 키가 선택/해제될 때마다 자동으로 가공 탭에 결과 업데이트
  if (selectedKeysArray.value.length > 0) {
    try {
      const result = selectKeys(input.value, selectedKeysArray.value);
      // 현재 모드가 포맷팅이면 포맷팅 적용
      if (processMode.value === 'format') {
        processedData.value = formatJson(result);
      } 
      // 현재 모드가 압축이면 압축 적용
      else if (processMode.value === 'minify') {
        processedData.value = minifyJson(result);
      } 
      // 기본은 포맷팅으로 적용
      else {
        processedData.value = formatJson(result);
        processMode.value = 'format';
      }
      activeTab.value = 'processed';
    } catch (error) {
      processedData.value = `오류: ${error.message}`;
    }
  } else {
    processedData.value = '';
    processMode.value = '';
  }
};

const handleFormat = async () => {
  try {
    const sourceData = processedData.value || input.value;
    const result = await JsonUtil.format(sourceData);
    if (result.success) {
      processedData.value = result.data;
      processMode.value = 'format';
      activeTab.value = 'processed';
    } else {
      processedData.value = `오류: ${result.error}`;
    }
  } catch (error) {
    processedData.value = `오류: ${error.message}`;
  }
};

const handleMinify = async () => {
  try {
    const sourceData = processedData.value || input.value;
    const result = await JsonUtil.minify(sourceData);
    if (result.success) {
      processedData.value = result.data;
      processMode.value = 'minify';
      activeTab.value = 'processed';
    } else {
      processedData.value = `오류: ${result.error}`;
    }
  } catch (error) {
    processedData.value = `오류: ${error.message}`;
  }
};

// minifyJson 헬퍼 함수 추가
const minifyJson = (jsonStr) => {
  try {
    if (!jsonStr || !jsonStr.trim()) {
      throw new Error('JSON 데이터가 비어있습니다.');
    }
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error(`JSON 압축 오류: ${error.message}`);
  }
};

const handleReset = () => {
  // 가공 데이터 초기화
  processedData.value = '';
  processMode.value = '';
  
  // 키 선택 초기화
  selectedKeysArray.value = [];
  
  // 필터 조건 초기화
  filterConditions.value = [{ key: '', operator: '=', value: '' }];
  filteredCount.value = 0;
  
  // 정렬 키 초기화
  sortKey.value = '';
  
  // 원본 탭으로 이동
  activeTab.value = 'original';
};

// 필터 조건만 초기화하는 함수
const handleResetFilter = () => {
  // 필터 조건 초기화
  filterConditions.value = [{ key: '', operator: '=', value: '' }];
  filteredCount.value = 0;
  logicalOperator.value = 'AND';
  
  // 검색 이전 상태로 되돌리기
  // 선택된 키들을 기준으로 원본 데이터에서 키 선택 적용
  if (selectedKeysArray.value.length > 0) {
    try {
      const result = selectKeys(input.value, selectedKeysArray.value);
      
      // 현재 포맷 모드에 따라 적용
      if (processMode.value === 'format') {
        processedData.value = formatJson(result);
      } else if (processMode.value === 'minify') {
        processedData.value = minifyJson(result);
      } else {
        // 기본은 포맷팅으로 적용
        processedData.value = formatJson(result);
        processMode.value = 'format';
      }
    } catch (error) {
      processedData.value = `오류: ${error.message}`;
    }
  }
};

const handleMultiFilter = () => {
  try {
    // 유효한 조건이 있는지 확인
    const validConditions = filterConditions.value.filter(condition => 
      condition.key && condition.value.trim()
    );
    
    if (validConditions.length === 0) {
      processedData.value = '오류: 유효한 필터 조건을 입력해주세요.';
      return;
    }

    const sourceData = processedData.value || input.value;
    if (!sourceData || !sourceData.trim()) {
      processedData.value = '오류: 필터링할 JSON 데이터가 없습니다.';
      return;
    }

    const result = filterObjectsMultiple(sourceData, validConditions, logicalOperator.value);
    
    // 현재 모드에 따라 결과 포맷팅
    if (processMode.value === 'format') {
      processedData.value = formatJson(result);
    } else if (processMode.value === 'minify') {
      processedData.value = minifyJson(result);
    } else {
      processedData.value = formatJson(result);
      processMode.value = 'format';
    }
    
    activeTab.value = 'processed';
    
    // 필터링된 결과 개수 계산
    try {
      const parsed = JSON.parse(result);
      filteredCount.value = Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      filteredCount.value = 0;
    }
  } catch (error) {
    processedData.value = `오류: ${error.message}`;
    filteredCount.value = 0;
  }
};

const handleSort = () => {
  try {
    if (!sortKey.value || !sortKey.value.trim()) {
      processedData.value = '오류: 정렬할 키를 선택해주세요.';
      return;
    }

    const sourceData = processedData.value || input.value;
    if (!sourceData || !sourceData.trim()) {
      processedData.value = '오류: 정렬할 JSON 데이터가 없습니다.';
      return;
    }

    const result = sortObjects(sourceData, sortKey.value, sortOrder.value, sortType.value);
    
    // 현재 모드에 따라 결과 포맷팅
    if (processMode.value === 'format') {
      processedData.value = formatJson(result);
    } else if (processMode.value === 'minify') {
      processedData.value = minifyJson(result);
    } else {
      processedData.value = formatJson(result);
      processMode.value = 'format';
    }
    
    activeTab.value = 'processed';
  } catch (error) {
    processedData.value = `오류: ${error.message}`;
  }
};

// 전체 키 선택 기능
const selectAllKeys = () => {
  if (availableKeys.value.length === 0) return;
  
  const allSelected = selectedKeysArray.value.length === availableKeys.value.length;
  
  if (allSelected) {
    // 모든 키가 선택된 상태면 전체 해제
    selectedKeysArray.value = [];
    processedData.value = '';
    processMode.value = '';
  } else {
    // 전체 선택
    selectedKeysArray.value = [...availableKeys.value];
    try {
      const result = selectKeys(input.value, selectedKeysArray.value);
      // 현재 모드에 따라 결과 포맷팅
      if (processMode.value === 'format') {
        processedData.value = formatJson(result);
      } else if (processMode.value === 'minify') {
        processedData.value = minifyJson(result);
      } else {
        // 기본은 포맷팅으로 적용
        processedData.value = formatJson(result);
        processMode.value = 'format';
      }
      activeTab.value = 'processed';
    } catch (error) {
      processedData.value = `오류: ${error.message}`;
    }
  }
};
</script>
