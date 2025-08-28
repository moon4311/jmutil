<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">SQL 쿼리 분석기</h1>
        <p class="text-lg text-gray-600">SQL 쿼리를 분석하고 JSON 형태로 변환합니다</p>
      </div>

      <!-- 관련 도구 링크 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">SQL 관련 도구</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink 
            to="/database/sql"
            class="flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-blue-800">쿼리 생성기</p>
              <p class="text-sm text-gray-500">SQL 쿼리 자동 생성</p>
            </div>
          </NuxtLink>

          <NuxtLink 
            to="/database/mybatis-mapper"
            class="flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-blue-800">MyBatis Mapper 생성</p>
              <p class="text-sm text-gray-500">XML 및 인터페이스 생성</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 쿼리 분석 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">SQL 쿼리 분석</h2>
          <p class="text-sm text-gray-600 mt-1">SQL 쿼리를 입력하여 파싱하고 JSON 형태로 변환합니다</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 입력 영역 -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">SQL 쿼리 입력</label>
                <textarea 
                  v-model="queryToAnalyze" 
                  rows="20" 
                  placeholder="INSERT INTO users (id, name, email) VALUES (1, 'John Doe', 'john@example.com'), (2, 'Jane Smith', 'jane@example.com');"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm transition-colors resize-vertical"
                ></textarea>
              </div>

              <button 
                @click="analyzeQuery" 
                class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
              >
                쿼리 분석
              </button>
            </div>

            <!-- 결과 영역 -->
            <div class="space-y-6">
              <div v-if="analyzedResult.type">
                <h3 class="text-lg font-medium text-gray-800 mb-4">분석 결과</h3>
                
                <!-- 분석 결과 토글 -->
                <div class="mb-4">
                  <button 
                    @click="showResults.analysisResult = !showResults.analysisResult"
                    class="flex items-center justify-between w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span class="font-medium text-blue-800">기본 분석 정보</span>
                    <svg 
                      :class="['w-5 h-5 transform transition-transform', showResults.analysisResult ? 'rotate-180' : '']"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <div v-if="showResults.analysisResult" class="mt-3 p-4 bg-white border border-blue-200 rounded-lg">
                    <div class="flex items-center mb-2">
                      <span class="text-sm font-medium text-blue-800">쿼리 타입:</span>
                      <span class="ml-2 px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">{{ analyzedResult.type }}</span>
                    </div>
                    <div v-if="analyzedResult.table" class="flex items-center">
                      <span class="text-sm font-medium text-blue-800">테이블:</span>
                      <span class="ml-2 text-sm text-blue-700">{{ analyzedResult.table }}</span>
                    </div>
                  </div>
                </div>

                <!-- JSON 매핑 토글 -->
                <div v-if="analyzedResult.jsonMapping" class="mb-4">
                  <button 
                    @click="showResults.keyValueMapping = !showResults.keyValueMapping"
                    class="flex items-center justify-between w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span class="font-medium text-green-800">JSON 매핑</span>
                    <div class="flex items-center">
                      <CopyInput
                        v-if="showResults.keyValueMapping" 
                        :value="analyzedResult.jsonMapping"
                        label="복사"
                        size="xs"
                        class="mr-2"
                      />
                      <svg 
                        :class="['w-5 h-5 transform transition-transform', showResults.keyValueMapping ? 'rotate-180' : '']"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  
                  <div v-if="showResults.keyValueMapping" class="mt-3 p-4 bg-white border border-green-200 rounded-lg">
                    <pre class="text-sm text-gray-700 font-mono whitespace-pre-wrap overflow-x-auto">{{ analyzedResult.jsonMapping }}</pre>
                  </div>
                </div>

                <!-- 포맷된 쿼리 토글 -->
                <div v-if="analyzedResult.formatted" class="mb-4">
                  <button 
                    @click="showResults.formattedQuery = !showResults.formattedQuery"
                    class="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <span class="font-medium text-purple-800">포맷된 쿼리</span>
                    <div class="flex items-center">
                      <CopyInput
                        v-if="showResults.formattedQuery" 
                        :value="analyzedResult.formatted"
                        label="복사"
                        size="xs"
                        class="mr-2"
                      />
                      <svg 
                        :class="['w-5 h-5 transform transition-transform', showResults.formattedQuery ? 'rotate-180' : '']"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  
                  <div v-if="showResults.formattedQuery" class="mt-3 p-4 bg-white border border-purple-200 rounded-lg">
                    <pre class="text-sm text-gray-700 font-mono whitespace-pre-wrap overflow-x-auto">{{ analyzedResult.formatted }}</pre>
                  </div>
                </div>
              </div>

              <div v-if="analyzeError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 class="text-red-800 font-medium mb-2">분석 오류</h4>
                <p class="text-red-700 text-sm">{{ analyzeError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 쿼리 분석 관련
const queryToAnalyze = ref('')
const analyzedResult = reactive({
  type: '',
  table: '',
  jsonMapping: '',
  formatted: ''
})
const analyzeError = ref('')

// 토글 상태
const showResults = reactive({
  analysisResult: true,
  keyValueMapping: true,
  formattedQuery: true
})

// 쿼리 분석 함수
const analyzeQuery = () => {
  if (!queryToAnalyze.value.trim()) {
    alert('분석할 쿼리를 입력해주세요.')
    return
  }

  try {
    analyzeError.value = ''
    const query = queryToAnalyze.value.trim()
    
    // 쿼리 타입 결정
    const queryUpper = query.toUpperCase()
    let type = ''
    if (queryUpper.startsWith('INSERT')) type = 'INSERT'
    else if (queryUpper.startsWith('UPDATE')) type = 'UPDATE'
    else if (queryUpper.startsWith('SELECT')) type = 'SELECT'
    else if (queryUpper.startsWith('DELETE')) type = 'DELETE'
    else type = 'UNKNOWN'

    analyzedResult.type = type

    // 테이블명 추출
    const tableMatch = query.match(/(?:INSERT INTO|UPDATE|FROM|DELETE FROM)\s+(\w+)/i)
    analyzedResult.table = tableMatch ? tableMatch[1] : ''

    // INSERT 쿼리 분석
    if (type === 'INSERT') {
      analyzeInsertQuery(query)
    } else if (type === 'UPDATE') {
      analyzeUpdateQuery(query)
    } else if (type === 'SELECT') {
      analyzeSelectQuery(query)
    }

    // 쿼리 포맷팅
    analyzedResult.formatted = formatQuery(query)

  } catch (error) {
    analyzeError.value = `쿼리 분석 중 오류가 발생했습니다: ${error.message}`
    console.error('Query analysis error:', error)
  }
}

const analyzeInsertQuery = (query) => {
  // 다중 INSERT 처리를 우선 확인
  const multiInsertMatch = query.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES\s*((?:\([^)]+\),?\s*)+)/i)
  
  if (multiInsertMatch) {
    const columns = multiInsertMatch[1].split(',').map(col => col.trim().replace(/[`'"]/g, ''))
    const valuesSection = multiInsertMatch[2]
    
    // 모든 VALUES 절 추출
    const valueGroups = valuesSection.match(/\([^)]+\)/g) || []
    
    if (valueGroups.length > 1) {
      // 다중 INSERT - JSON 배열로 변환
      const jsonArray = []
      
      valueGroups.forEach(valueGroup => {
        const values = valueGroup.slice(1, -1).split(',').map(val => val.trim())
        if (columns.length === values.length) {
          const jsonObject = {}
          columns.forEach((col, index) => {
            let value = values[index].trim()
            // 문자열 값에서 따옴표 제거
            if ((value.startsWith("'") && value.endsWith("'")) || 
                (value.startsWith('"') && value.endsWith('"'))) {
              value = value.slice(1, -1)
            }
            // 데이터 타입 변환
            if (!isNaN(value) && value !== '') {
              jsonObject[col] = Number(value)
            } else if (value.toLowerCase() === 'null') {
              jsonObject[col] = null
            } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
              jsonObject[col] = value.toLowerCase() === 'true'
            } else {
              jsonObject[col] = value
            }
          })
          jsonArray.push(jsonObject)
        }
      })
      
      analyzedResult.jsonMapping = JSON.stringify(jsonArray, null, 2)
    } else if (valueGroups.length === 1) {
      // 단일 INSERT - JSON 객체로 변환
      const values = valueGroups[0].slice(1, -1).split(',').map(val => val.trim())
      if (columns.length === values.length) {
        const jsonObject = {}
        columns.forEach((col, index) => {
          let value = values[index].trim()
          // 문자열 값에서 따옴표 제거
          if ((value.startsWith("'") && value.endsWith("'")) || 
              (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1)
          }
          // 데이터 타입 변환
          if (!isNaN(value) && value !== '') {
            jsonObject[col] = Number(value)
          } else if (value.toLowerCase() === 'null') {
            jsonObject[col] = null
          } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            jsonObject[col] = value.toLowerCase() === 'true'
          } else {
            jsonObject[col] = value
          }
        })
        analyzedResult.jsonMapping = JSON.stringify(jsonObject, null, 2)
      }
    }
  }
}

const analyzeUpdateQuery = (query) => {
  // UPDATE 쿼리에서 SET 절 분석
  const setMatch = query.match(/SET\s+(.*?)(?:\s+WHERE|$)/i)
  if (setMatch) {
    const setPairs = setMatch[1].split(',').map(pair => pair.trim())
    const jsonObject = {}
    
    setPairs.forEach(pair => {
      const [key, value] = pair.split('=').map(p => p.trim())
      let processedValue = value
      
      // 문자열 값에서 따옴표 제거
      if ((processedValue.startsWith("'") && processedValue.endsWith("'")) || 
          (processedValue.startsWith('"') && processedValue.endsWith('"'))) {
        processedValue = processedValue.slice(1, -1)
      }
      
      // 데이터 타입 변환
      if (!isNaN(processedValue) && processedValue !== '') {
        jsonObject[key] = Number(processedValue)
      } else if (processedValue.toLowerCase() === 'null') {
        jsonObject[key] = null
      } else if (processedValue.toLowerCase() === 'true' || processedValue.toLowerCase() === 'false') {
        jsonObject[key] = processedValue.toLowerCase() === 'true'
      } else {
        jsonObject[key] = processedValue
      }
    })
    
    analyzedResult.jsonMapping = JSON.stringify(jsonObject, null, 2)
  }
}

const analyzeSelectQuery = (query) => {
  // SELECT 쿼리는 JSON 매핑이 의미가 없으므로 빈 문자열 설정
  analyzedResult.jsonMapping = ''
}

const formatQuery = (query) => {
  // 기본적인 SQL 포맷팅
  return query
    .replace(/\bSELECT\b/gi, 'SELECT\n    ')
    .replace(/\bFROM\b/gi, '\nFROM')
    .replace(/\bWHERE\b/gi, '\nWHERE')
    .replace(/\bINSERT INTO\b/gi, 'INSERT INTO')
    .replace(/\bVALUES\b/gi, '\nVALUES\n    ')
    .replace(/\bUPDATE\b/gi, 'UPDATE')
    .replace(/\bSET\b/gi, '\nSET\n    ')
    .replace(/,\s*(?![^()]*\))/g, ',\n    ')
    .trim()
}

// SEO 및 페이지 설정
useHead({
  title: 'SQL 쿼리 분석기 - JM Utils',
  meta: [
    { name: 'description', content: 'SQL 쿼리를 분석하고 JSON 형태로 변환하는 개발 도구입니다.' },
    { name: 'keywords', content: 'SQL, 쿼리 분석, JSON 변환, SQL Parser, INSERT' }
  ]
})
</script>
