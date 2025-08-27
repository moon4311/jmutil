<template>
  <div>
    <h2 class="text-xl font-bold mb-4">파일 변환</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측 컬럼: CSV to JSON -->
      <div class="space-y-6">
        <GroupPanel v-model="showBlue" title="CSV to JSON 변환" color="blue">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">CSV 데이터 입력</label>
              <v-textarea
                v-model="csvInput"
                placeholder="CSV 데이터를 붙여넣으세요&#10;예:&#10;이름,나이,직업&#10;홍길동,30,개발자&#10;김철수,25,디자이너"
                rows="10"
                variant="solo-filled"
                density="comfortable"
                hide-details
              />
            </div>
            
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-32">
                <label class="block mb-1 font-semibold">구분자</label>
                <v-text-field 
                  v-model="csvDelimiter" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder=","
                  maxlength="1"
                />
              </div>
              <div class="flex items-center pt-6">
                <v-checkbox
                  v-model="csvHasHeader"
                  label="첫 행을 헤더로 사용"
                  hide-details
                  density="comfortable"
                />
              </div>
              <div class="flex items-center pt-6">
                <v-checkbox
                  v-model="csvSkipEmptyLines"
                  label="빈 줄 무시"
                  hide-details
                  density="comfortable"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <v-btn 
                color="blue" 
                variant="elevated"
                @click="convertCsvToJson"
                :disabled="!csvInput.trim()"
              >
                JSON 변환
              </v-btn>
              <v-btn 
                color="blue" 
                variant="outlined"
                @click="downloadJsonFile"
                :disabled="!jsonResult"
              >
                JSON 다운로드
              </v-btn>
            </div>

            <div v-if="csvError" class="text-red-500 text-sm">
              {{ csvError }}
            </div>

            <div v-if="jsonResult">
              <label class="block mb-1 font-semibold">JSON 결과</label>
              <CopyTextArea :model-value="jsonResult" rows="12" />
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼: JSON to CSV -->
      <div class="space-y-6">
        <GroupPanel v-model="showGreen" title="JSON to CSV 변환" color="green">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">JSON 배열 입력</label>
              <v-textarea
                v-model="jsonInput"
                placeholder="JSON 배열을 붙여넣으세요&#10;예:&#10;[&#10;  {&quot;이름&quot;: &quot;홍길동&quot;, &quot;나이&quot;: 30, &quot;직업&quot;: &quot;개발자&quot;},&#10;  {&quot;이름&quot;: &quot;김철수&quot;, &quot;나이&quot;: 25, &quot;직업&quot;: &quot;디자이너&quot;}&#10;]"
                rows="10"
                variant="solo-filled"
                density="comfortable"
                hide-details
              />
            </div>
            
            <div class="flex flex-wrap gap-4">
              <div class="flex-1 min-w-32">
                <label class="block mb-1 font-semibold">구분자</label>
                <v-text-field 
                  v-model="jsonDelimiter" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder=","
                  maxlength="1"
                />
              </div>
              <div class="flex items-center pt-6">
                <v-checkbox
                  v-model="jsonIncludeHeader"
                  label="헤더 포함"
                  hide-details
                  density="comfortable"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <v-btn 
                color="green" 
                variant="elevated"
                @click="convertJsonToCsv"
                :disabled="!jsonInput.trim()"
              >
                CSV 변환
              </v-btn>
              <v-btn 
                color="green" 
                variant="outlined"
                @click="downloadCsvFile"
                :disabled="!csvResult"
              >
                CSV 다운로드
              </v-btn>
            </div>

            <div v-if="jsonError" class="text-red-500 text-sm">
              {{ jsonError }}
            </div>

            <div v-if="csvResult">
              <label class="block mb-1 font-semibold">CSV 결과</label>
              <CopyTextArea :model-value="csvResult" rows="12" />
            </div>
          </div>
        </GroupPanel>
      </div>
    </div>

    <!-- 변환 예시 -->
    <div class="mt-6">
      <GroupPanel v-model="showOrange" title="사용 예시" color="orange">
        <div class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-2">CSV 예시</h4>
              <div class="bg-gray-100 p-3 rounded text-sm font-mono">
                이름,나이,직업<br>
                홍길동,30,개발자<br>
                김철수,25,디자이너<br>
                이영희,28,기획자
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-2">JSON 예시</h4>
              <div class="bg-gray-100 p-3 rounded text-sm font-mono">
                [<br>
                &nbsp;&nbsp;{"이름": "홍길동", "나이": 30, "직업": "개발자"},<br>
                &nbsp;&nbsp;{"이름": "김철수", "나이": 25, "직업": "디자이너"},<br>
                &nbsp;&nbsp;{"이름": "이영희", "나이": 28, "직업": "기획자"}<br>
                ]
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold mb-2">사용 팁</h4>
            <ul class="list-disc pl-5 text-sm text-gray-700">
              <li>CSV 데이터에 콤마(,)나 따옴표(")가 포함된 경우 자동으로 이스케이프 처리됩니다</li>
              <li>JSON 배열은 객체의 배열 형태여야 합니다</li>
              <li>구분자를 탭(\t)이나 세미콜론(;)으로 변경할 수 있습니다</li>
              <li>Excel에서 한글이 깨지지 않도록 BOM이 추가된 UTF-8로 다운로드됩니다</li>
            </ul>
          </div>
        </div>
      </GroupPanel>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
import { ref } from 'vue';
import { csvToJson, jsonArrayToCsv, createCSVDownload, createJSONDownload } from '@/utils/CsvUtil.js';
import CopyTextArea from '@/components/CopyTextArea.vue';
import GroupPanel from '@/components/GroupPanel.vue';

// 아코디언 상태
// 아코디언 상태 (모바일에서는 기본 닫힌 상태)
const isMobile = process.client ? window.innerWidth < 768 : false;
const showBlue = ref(!isMobile);
const showGreen = ref(!isMobile);
const showOrange = ref(false);

// CSV to JSON
const csvInput = ref('');
const csvDelimiter = ref(',');
const csvHasHeader = ref(true);
const csvSkipEmptyLines = ref(true);
const jsonResult = ref('');
const csvError = ref('');

// JSON to CSV
const jsonInput = ref('');
const jsonDelimiter = ref(',');
const jsonIncludeHeader = ref(true);
const csvResult = ref('');
const jsonError = ref('');

// CSV to JSON 변환
function convertCsvToJson() {
  csvError.value = '';
  jsonResult.value = '';
  
  try {
    const result = csvToJson(csvInput.value, {
      delimiter: csvDelimiter.value,
      hasHeader: csvHasHeader.value,
      skipEmptyLines: csvSkipEmptyLines.value
    });
    
    if (result.success) {
      jsonResult.value = JSON.stringify(result.data, null, 2);
    } else {
      csvError.value = result.error;
    }
  } catch (error) {
    csvError.value = `변환 오류: ${error.message}`;
  }
}

// JSON to CSV 변환
function convertJsonToCsv() {
  jsonError.value = '';
  csvResult.value = '';
  
  try {
    const jsonData = JSON.parse(jsonInput.value);
    
    const result = jsonArrayToCsv(jsonData, {
      delimiter: jsonDelimiter.value,
      includeHeader: jsonIncludeHeader.value
    });
    
    if (result.success) {
      csvResult.value = result.data;
    } else {
      jsonError.value = result.error;
    }
  } catch (error) {
    jsonError.value = `변환 오류: ${error.message}`;
  }
}

// JSON 파일 다운로드
function downloadJsonFile() {
  if (!jsonResult.value) return;
  
  try {
    const jsonData = JSON.parse(jsonResult.value);
    const download = createJSONDownload(jsonData, 'converted_data.json');
    
    if (download) {
      const a = document.createElement('a');
      a.href = download.url;
      a.download = download.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(download.url);
    }
  } catch (error) {
    console.error('JSON 다운로드 오류:', error);
  }
}

// CSV 파일 다운로드
function downloadCsvFile() {
  if (!csvResult.value) return;
  
  try {
    const download = createCSVDownload(csvResult.value, 'converted_data.csv');
    
    if (download) {
      const a = document.createElement('a');
      a.href = download.url;
      a.download = download.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(download.url);
    }
  } catch (error) {
    console.error('CSV 다운로드 오류:', error);
  }
}
</script>

<style scoped>
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
