<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">SQL 쿼리 생성기</h1>
        <p class="text-lg text-gray-600">INSERT, UPDATE, SELECT 쿼리를 자동으로 생성합니다</p>
      </div>

      <!-- 관련 도구 링크 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">SQL 관련 도구</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink 
            to="/database/sql-analyzer"
            class="flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-blue-800">쿼리 분석기</p>
              <p class="text-sm text-gray-500">SQL 파싱 및 JSON 변환</p>
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

    <!-- 쿼리 생성 탭 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">SQL 쿼리 생성</h2>
        <p class="text-sm text-gray-600 mt-1">테이블 정보를 입력하여 SQL 쿼리를 자동 생성합니다</p>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 입력 영역 -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">쿼리 타입</label>
              <select 
                v-model="queryType" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="insert">INSERT</option>
                <option value="update">UPDATE</option>
                <option value="select">SELECT</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">테이블명</label>
              <input 
                v-model="tableName" 
                type="text" 
                placeholder="table_name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                컬럼 정보 (한 줄에 하나씩, 형식: column_name:data_type)
              </label>
              <textarea 
                v-model="columnInput" 
                rows="12" 
                placeholder="id:BIGINT&#10;name:VARCHAR(100)&#10;email:VARCHAR(255)&#10;created_at:DATETIME"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-colors resize-vertical"
              ></textarea>
            </div>

            <div v-if="queryType === 'update'">
              <label class="block text-sm font-medium text-gray-700 mb-2">WHERE 조건 (선택사항)</label>
              <input 
                v-model="whereCondition" 
                type="text" 
                placeholder="id = ?"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>

            <button 
              @click="generateQuery" 
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              쿼리 생성
            </button>
          </div>

          <!-- 결과 영역 -->
          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-center mb-3">
                <label class="block text-sm font-medium text-gray-700">생성된 쿼리</label>
                <CopyInput
                  v-if="generatedQuery"
                  :value="generatedQuery"
                  label="복사"
                  size="sm"
                />
              </div>
              <textarea 
                :value="generatedQuery" 
                readonly 
                rows="12" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-vertical"
                placeholder="생성된 쿼리가 여기에 표시됩니다"
              ></textarea>
            </div>

            <div v-if="parameterList.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-3">파라미터 순서</label>
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div v-for="(param, index) in parameterList" :key="index" class="text-sm text-yellow-800 py-1">
                  {{ index + 1 }}. {{ param }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 쿼리 생성 관련
const queryType = ref('insert')
const tableName = ref('')
const columnInput = ref('')
const whereCondition = ref('')
const generatedQuery = ref('')
const parameterList = ref([])

// 쿼리 생성 함수
const generateQuery = () => {
  if (!tableName.value.trim() || !columnInput.value.trim()) {
    alert('테이블명과 컬럼 정보를 입력해주세요.')
    return
  }

  const columns = parseColumns(columnInput.value)
  if (columns.length === 0) {
    alert('올바른 컬럼 정보를 입력해주세요.')
    return
  }

  try {
    switch (queryType.value) {
      case 'insert':
        generateInsertQuery(columns)
        break
      case 'update':
        generateUpdateQuery(columns)
        break
      case 'select':
        generateSelectQuery(columns)
        break
    }
  } catch (error) {
    alert('쿼리 생성 중 오류가 발생했습니다: ' + error.message)
  }
}

const parseColumns = (input) => {
  return input.split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      const parts = line.split(':')
      if (parts.length >= 2) {
        return {
          name: parts[0].trim(),
          type: parts[1].trim()
        }
      }
      return null
    })
    .filter(col => col !== null)
}

const generateInsertQuery = (columns) => {
  const columnNames = columns.map(col => col.name).join(', ')
  const placeholders = columns.map(() => '?').join(', ')
  
  generatedQuery.value = `INSERT INTO ${tableName.value} (\n    ${columnNames}\n) VALUES (\n    ${placeholders}\n);`
  parameterList.value = columns.map(col => col.name)
}

const generateUpdateQuery = (columns) => {
  const setClause = columns.map(col => `    ${col.name} = ?`).join(',\n')
  const whereClause = whereCondition.value.trim() || 'id = ?'
  
  generatedQuery.value = `UPDATE ${tableName.value}\nSET\n${setClause}\nWHERE ${whereClause};`
  parameterList.value = [...columns.map(col => col.name), ...whereClause.split('?').slice(0, -1).map(() => 'where_param')]
}

const generateSelectQuery = (columns) => {
  const columnNames = columns.map(col => col.name).join(',\n    ')
  const whereClause = whereCondition.value.trim() || ''
  
  let query = `SELECT\n    ${columnNames}\nFROM ${tableName.value}`
  if (whereClause) {
    query += `\nWHERE ${whereClause}`
    parameterList.value = whereClause.split('?').slice(0, -1).map(() => 'where_param')
  } else {
    parameterList.value = []
  }
  query += ';'
  
  generatedQuery.value = query
}

// SEO 및 페이지 설정
useHead({
  title: 'SQL 쿼리 생성기 - JM Utils',
  meta: [
    { name: 'description', content: 'INSERT, UPDATE, SELECT 쿼리를 자동으로 생성하는 SQL 개발 도구입니다.' },
    { name: 'keywords', content: 'SQL, 쿼리 생성, INSERT, UPDATE, SELECT, SQL Generator' }
  ]
})
</script>
