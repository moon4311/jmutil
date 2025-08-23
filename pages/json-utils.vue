<template>
  <div>
    <h2 class="text-xl font-bold mb-4">JSON/객체 유틸리티</h2>
    
    <!-- JSON 입력 영역 (1단 전체 너비) -->
    <div class="mb-6">
      <label class="block mb-2 font-semibold">JSON 입력</label>
      <v-textarea
        v-model="input"
        placeholder="JSON 문자열을 입력하세요"
        rows="6"
        variant="solo-filled"
        density="comfortable"
        hide-details
        @input="onInputChange"
      />
      <div v-if="validationMessage" class="mt-2 text-sm" :class="isValid ? 'text-green-600' : 'text-red-600'">
        {{ validationMessage }}
      </div>
    </div>
    
    <!-- 기능별 버튼 그룹 (2단 구조) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showFormatting" title="JSON 포맷팅 & 압축" color="blue">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-btn 
                @click="handleFormat" 
                color="blue"
                variant="elevated"
                size="large"
                :disabled="!input || !isValid"
                prepend-icon="mdi-code-braces"
                block
              >
                포맷팅 (예쁘게)
              </v-btn>
              <v-btn 
                @click="handleMinify" 
                color="indigo"
                variant="tonal"
                size="large"
                :disabled="!input || !isValid"
                prepend-icon="mdi-compress"
                block
              >
                압축 (한 줄로)
              </v-btn>
            </div>
            <div v-if="formattedResult">
              <label class="block mb-2 font-semibold">포맷팅/압축 결과</label>
              <CopyTextArea :model-value="formattedResult" rows="8" />
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showCsvConversion" title="CSV 변환 & 다운로드" color="green">
          <div class="space-y-4">
            <div class="flex flex-col gap-3">
              <v-btn 
                @click="handleCsvPreview" 
                color="green"
                variant="elevated"
                size="large"
                :disabled="!input || !isValid"
                prepend-icon="mdi-table"
                block
              >
                CSV 미리보기
              </v-btn>
              <v-btn 
                @click="handleCsvDownload" 
                color="green"
                variant="tonal"
                size="large"
                :disabled="!input || !isValid"
                prepend-icon="mdi-download"
                block
              >
                CSV 파일 다운로드
              </v-btn>
            </div>
            <div v-if="csvPreview">
              <label class="block mb-2 font-semibold">CSV 미리보기</label>
              <CopyTextArea :model-value="csvPreview" rows="8" />
            </div>
          </div>
        </GroupPanel>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref, computed } from 'vue';
import { formatJson, minifyJson, jsonToCsv, generateCsvFileName, isValidJson } from '@/utils/JsonUtil.js';
import GroupPanel from '@/components/GroupPanel.vue';
import CopyTextArea from '@/components/CopyTextArea.vue';

const input = ref('');
const formattedResult = ref('');
const csvPreview = ref('');
const showFormatting = ref(true);
const showCsvConversion = ref(true);

// JSON 유효성 검사
const isValid = computed(() => {
  if (!input.value.trim()) return false;
  return isValidJson(input.value);
});

const validationMessage = computed(() => {
  if (!input.value.trim()) return '';
  if (isValid.value) return '✓ 유효한 JSON 형식입니다.';
  return '✗ JSON 형식이 올바르지 않습니다.';
});

const onInputChange = () => {
  // 입력이 변경되면 결과 초기화
  formattedResult.value = '';
  csvPreview.value = '';
};

const handleFormat = () => {
  try {
    formattedResult.value = formatJson(input.value);
  } catch (error) {
    formattedResult.value = `오류: ${error.message}`;
  }
};

const handleMinify = () => {
  try {
    formattedResult.value = minifyJson(input.value);
  } catch (error) {
    formattedResult.value = `오류: ${error.message}`;
  }
};

const handleCsvPreview = () => {
  try {
    csvPreview.value = jsonToCsv(input.value);
  } catch (error) {
    csvPreview.value = `오류: ${error.message}`;
  }
};

const handleCsvDownload = () => {
  try {
    // CSV 데이터 생성 (미리보기 없이도 생성)
    const csvData = jsonToCsv(input.value);
    
    if (csvData.startsWith('오류:')) {
      // 오류가 있을 경우 csvPreview에 표시하고 종료
      csvPreview.value = csvData;
      return;
    }
    
    // Blob 생성
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    
    // 다운로드 링크 생성
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', generateCsvFileName());
    link.style.visibility = 'hidden';
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL 객체 해제
    URL.revokeObjectURL(url);
    
    // 성공 알림 (전역 토스트 이벤트 발생)
    window.dispatchEvent(new CustomEvent('toast', { detail: 'CSV 파일이 다운로드되었습니다.' }));
  } catch (error) {
    csvPreview.value = `오류: ${error.message}`;
  }
};
</script>
