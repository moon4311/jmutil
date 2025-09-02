<template>
  <div class="container mx-auto p-6">
    <div class="bg-blue-50 rounded-lg p-6 mb-8">
      <h1 class="text-3xl font-bold text-blue-800 mb-2 flex items-center">
        <svg class="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM4 14a2 2 0 002-2h8a2 2 0 002 2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4zM6 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2.343a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H8a2 2 0 01-2-2V4z" />
        </svg>
        SQL 유틸리티
      </h1>
      <p class="text-blue-700">
        SQL 쿼리 생성, 분석, MyBatis Mapper 생성 등의 도구를 제공합니다.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <button
        @click="activeTab = 'query-generator'"
        :class="[
          'p-4 rounded-lg border-2 transition-all duration-200',
          activeTab === 'query-generator' 
            ? 'border-blue-500 bg-blue-50 text-blue-800' 
            : 'border-gray-200 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center mb-2">
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          쿼리 생성
        </div>
        <p class="text-sm text-gray-600">INSERT, UPDATE, SELECT 쿼리 자동 생성</p>
      </button>

      <button
        @click="activeTab = 'mapper-generator'"
        :class="[
          'p-4 rounded-lg border-2 transition-all duration-200',
          activeTab === 'mapper-generator' 
            ? 'border-blue-500 bg-blue-50 text-blue-800' 
            : 'border-gray-200 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center mb-2">
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Mapper 생성
        </div>
        <p class="text-sm text-gray-600">MyBatis Mapper XML 및 인터페이스 생성</p>
      </button>

      <button
        @click="activeTab = 'query-analyzer'"
        :class="[
          'p-4 rounded-lg border-2 transition-all duration-200',
          activeTab === 'query-analyzer' 
            ? 'border-blue-500 bg-blue-50 text-blue-800' 
            : 'border-gray-200 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center mb-2">
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          쿼리 분석
        </div>
        <p class="text-sm text-gray-600">쿼리 파싱, 키-값 매핑, 포맷팅</p>
      </button>
    </div>

    <!-- 쿼리 생성 탭 -->
    <div v-if="activeTab === 'query-generator'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-800">SQL 쿼리 생성기</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 입력 영역 -->
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">쿼리 타입</label>
              <select v-model="queryType" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="insert">INSERT</option>
                <option value="update">UPDATE</option>
                <option value="select">SELECT</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">테이블명</label>
              <input 
                v-model="tableName" 
                type="text" 
                placeholder="table_name"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                컬럼 정보 (한 줄에 하나씩, 형식: column_name:data_type)
              </label>
              <textarea 
                v-model="columnInput" 
                rows="10" 
                placeholder="id:BIGINT&#10;name:VARCHAR(100)&#10;email:VARCHAR(255)&#10;created_at:DATETIME"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              ></textarea>
            </div>

            <div v-if="queryType === 'update'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">WHERE 조건 (선택사항)</label>
              <input 
                v-model="whereCondition" 
                type="text" 
                placeholder="id = ?"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <button 
              @click="generateQuery" 
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              쿼리 생성
            </button>
          </div>

          <!-- 결과 영역 -->
          <div>
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">생성된 쿼리</label>
                <button 
                  v-if="generatedQuery" 
                  @click="copyToClipboard(generatedQuery, 'query')"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    copyStatus.query === 'copied' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ copyStatus.query === 'copied' ? '복사됨!' : '복사' }}
                </button>
              </div>
              <textarea 
                :value="generatedQuery" 
                readonly 
                rows="10" 
                class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                placeholder="생성된 쿼리가 여기에 표시됩니다"
              ></textarea>
            </div>

            <div v-if="parameterList.length > 0" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">파라미터 순서</label>
              <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div v-for="(param, index) in parameterList" :key="index" class="text-sm text-yellow-800">
                  {{ index + 1 }}. {{ param }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapper 생성 탭 -->
    <div v-if="activeTab === 'mapper-generator'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-800">MyBatis Mapper 생성기</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 입력 영역 -->
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">네임스페이스</label>
              <input 
                v-model="namespace" 
                type="text" 
                placeholder="com.example.mapper.UserMapper"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">테이블명</label>
              <input 
                v-model="mapperTableName" 
                type="text" 
                placeholder="users"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">엔티티 클래스명</label>
              <input 
                v-model="entityClassName" 
                type="text" 
                placeholder="User"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                필드 매핑 (column_name:field_name:java_type)
              </label>
              <textarea 
                v-model="fieldMapping" 
                rows="8" 
                placeholder="id:id:Long&#10;user_name:userName:String&#10;email:email:String&#10;created_at:createdAt:LocalDateTime"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              ></textarea>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">생성할 메소드</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" v-model="generateMethods.insert" class="mr-2">
                  <span class="text-sm">INSERT</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="generateMethods.update" class="mr-2">
                  <span class="text-sm">UPDATE</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="generateMethods.selectById" class="mr-2">
                  <span class="text-sm">SELECT BY ID</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="generateMethods.selectAll" class="mr-2">
                  <span class="text-sm">SELECT ALL</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="generateMethods.delete" class="mr-2">
                  <span class="text-sm">DELETE</span>
                </label>
              </div>
            </div>

            <button 
              @click="generateMapper" 
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Mapper 생성
            </button>
          </div>

          <!-- 결과 영역 -->
          <div>
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">MyBatis Mapper XML</label>
                <button 
                  v-if="generatedMapperXml" 
                  @click="copyToClipboard(generatedMapperXml, 'mapperXml')"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    copyStatus.mapperXml === 'copied' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ copyStatus.mapperXml === 'copied' ? '복사됨!' : '복사' }}
                </button>
              </div>
              <textarea 
                :value="generatedMapperXml" 
                readonly 
                rows="15" 
                class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                placeholder="생성된 Mapper XML이 여기에 표시됩니다"
              ></textarea>
            </div>

            <div v-if="generatedMapperInterface" class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">Java 인터페이스</label>
                <button 
                  @click="copyToClipboard(generatedMapperInterface, 'mapperInterface')"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    copyStatus.mapperInterface === 'copied' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ copyStatus.mapperInterface === 'copied' ? '복사됨!' : '복사' }}
                </button>
              </div>
              <textarea 
                :value="generatedMapperInterface" 
                readonly 
                rows="10" 
                class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                placeholder="생성된 Java 인터페이스가 여기에 표시됩니다"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 쿼리 분석 탭 -->
    <div v-if="activeTab === 'query-analyzer'" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-blue-800">쿼리 분석기</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 입력 영역 -->
          <div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">SQL 쿼리 입력</label>
              <textarea 
                v-model="queryToAnalyze" 
                rows="15" 
                placeholder="INSERT INTO users (id, name, email, created_at) VALUES (1, 'John Doe', 'john@example.com', '2023-01-01 10:00:00');"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              ></textarea>
            </div>

            <button 
              @click="analyzeQuery" 
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              쿼리 분석
            </button>
          </div>

          <!-- 결과 영역 -->
          <div>
            <div v-if="analyzedResult.type" class="mb-6">
              <h3 class="text-lg font-medium text-gray-800 mb-3">분석 결과</h3>
              
              <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <div class="flex items-center mb-2">
                  <span class="text-sm font-medium text-blue-800">쿼리 타입:</span>
                  <span class="ml-2 px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">{{ analyzedResult.type }}</span>
                </div>
                <div v-if="analyzedResult.table" class="flex items-center">
                  <span class="text-sm font-medium text-blue-800">테이블:</span>
                  <span class="ml-2 text-sm text-blue-700">{{ analyzedResult.table }}</span>
                </div>
              </div>

              <div v-if="analyzedResult.columns && analyzedResult.columns.length > 0" class="mb-4">
                <h4 class="text-md font-medium text-gray-700 mb-2">컬럼 정보</h4>
                <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div v-for="(column, index) in analyzedResult.columns" :key="index" 
                       class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span class="font-mono text-sm text-gray-700">{{ column.name }}</span>
                    <span class="text-sm text-gray-500">{{ column.type || 'Unknown' }}</span>
                  </div>
                </div>
              </div>

              <div v-if="analyzedResult.keyValuePairs && analyzedResult.keyValuePairs.length > 0" class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-md font-medium text-gray-700">키-값 매핑</h4>
                  <button 
                    @click="copyToClipboard(formatKeyValuePairs(analyzedResult.keyValuePairs), 'keyValuePairs')"
                    :class="[
                      'px-3 py-1 text-sm rounded transition-colors',
                      copyStatus.keyValuePairs === 'copied' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    {{ copyStatus.keyValuePairs === 'copied' ? '복사됨!' : '복사' }}
                  </button>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div v-for="(pair, index) in analyzedResult.keyValuePairs" :key="index" 
                       class="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span class="font-mono text-sm text-gray-700 break-all">{{ pair.key }}</span>
                    <span class="text-sm text-gray-500 ml-4 break-all">{{ pair.value }}</span>
                  </div>
                </div>
              </div>

              <div v-if="analyzedResult.formatted" class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-md font-medium text-gray-700">포맷된 쿼리</h4>
                  <button 
                    @click="copyToClipboard(analyzedResult.formatted, 'formatted')"
                    :class="[
                      'px-3 py-1 text-sm rounded transition-colors',
                      copyStatus.formatted === 'copied' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    {{ copyStatus.formatted === 'copied' ? '복사됨!' : '복사' }}
                  </button>
                </div>
                <textarea 
                  :value="analyzedResult.formatted" 
                  readonly 
                  rows="8" 
                  class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                ></textarea>
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 활성 탭
const activeTab = ref('query-generator')

// URL 파라미터에서 탭 설정
onMounted(() => {
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab && ['query-generator', 'mapper-generator', 'query-analyzer'].includes(tab)) {
      activeTab.value = tab
    }
  }
})

// 쿼리 생성 관련
const queryType = ref('insert')
const tableName = ref('')
const columnInput = ref('')
const whereCondition = ref('')
const generatedQuery = ref('')
const parameterList = ref([])

// Mapper 생성 관련
const namespace = ref('')
const mapperTableName = ref('')
const entityClassName = ref('')
const fieldMapping = ref('')
const generatedMapperXml = ref('')
const generatedMapperInterface = ref('')

const generateMethods = reactive({
  insert: true,
  update: true,
  selectById: true,
  selectAll: false,
  delete: false
})

// 쿼리 분석 관련
const queryToAnalyze = ref('')
const analyzedResult = reactive({
  type: '',
  table: '',
  columns: [],
  keyValuePairs: [],
  formatted: ''
})
const analyzeError = ref('')

// 복사 상태
const copyStatus = reactive({
  query: '',
  mapperXml: '',
  mapperInterface: '',
  keyValuePairs: '',
  formatted: ''
})

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

// Mapper 생성 함수
const generateMapper = () => {
  if (!namespace.value.trim() || !mapperTableName.value.trim() || !entityClassName.value.trim() || !fieldMapping.value.trim()) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  const fields = parseFieldMapping(fieldMapping.value)
  if (fields.length === 0) {
    alert('올바른 필드 매핑을 입력해주세요.')
    return
  }

  try {
    generateMapperXml(fields)
    generateMapperJavaInterface(fields)
  } catch (error) {
    alert('Mapper 생성 중 오류가 발생했습니다: ' + error.message)
  }
}

const parseFieldMapping = (input) => {
  return input.split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      const parts = line.split(':')
      if (parts.length >= 3) {
        return {
          column: parts[0].trim(),
          field: parts[1].trim(),
          type: parts[2].trim()
        }
      }
      return null
    })
    .filter(field => field !== null)
}

const generateMapperXml = (fields) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="${namespace.value}">

    <!-- Result Map -->
    <resultMap id="${entityClassName.value}ResultMap" type="${entityClassName.value}">
`

  fields.forEach(field => {
    const tag = field.column === 'id' ? 'id' : 'result'
    xml += `        <${tag} column="${field.column}" property="${field.field}" />\n`
  })

  xml += `    </resultMap>

    <!-- Base Column List -->
    <sql id="Base_Column_List">
        ${fields.map(f => f.column).join(', ')}
    </sql>
`

  // INSERT 쿼리
  if (generateMethods.insert) {
    xml += `
    <!-- Insert -->
    <insert id="insert${entityClassName.value}" parameterType="${entityClassName.value}">
        INSERT INTO ${mapperTableName.value} (
            ${fields.map(f => f.column).join(', ')}
        ) VALUES (
            ${fields.map(f => `#{${f.field}}`).join(', ')}
        )
    </insert>
`
  }

  // UPDATE 쿼리
  if (generateMethods.update) {
    xml += `
    <!-- Update -->
    <update id="update${entityClassName.value}" parameterType="${entityClassName.value}">
        UPDATE ${mapperTableName.value}
        SET
            ${fields.filter(f => f.column !== 'id').map(f => `${f.column} = #{${f.field}}`).join(',\n            ')}
        WHERE id = #{id}
    </update>
`
  }

  // SELECT BY ID 쿼리
  if (generateMethods.selectById) {
    xml += `
    <!-- Select by ID -->
    <select id="select${entityClassName.value}ById" parameterType="long" resultMap="${entityClassName.value}ResultMap">
        SELECT
            <include refid="Base_Column_List" />
        FROM ${mapperTableName.value}
        WHERE id = #{id}
    </select>
`
  }

  // SELECT ALL 쿼리
  if (generateMethods.selectAll) {
    xml += `
    <!-- Select All -->
    <select id="selectAll${entityClassName.value}s" resultMap="${entityClassName.value}ResultMap">
        SELECT
            <include refid="Base_Column_List" />
        FROM ${mapperTableName.value}
        ORDER BY id DESC
    </select>
`
  }

  // DELETE 쿼리
  if (generateMethods.delete) {
    xml += `
    <!-- Delete -->
    <delete id="delete${entityClassName.value}" parameterType="long">
        DELETE FROM ${mapperTableName.value}
        WHERE id = #{id}
    </delete>
`
  }

  xml += '\n</mapper>'
  generatedMapperXml.value = xml
}

const generateMapperJavaInterface = (fields) => {
  const packageName = namespace.value.substring(0, namespace.value.lastIndexOf('.'))
  const className = namespace.value.substring(namespace.value.lastIndexOf('.') + 1)
  
  let javaInterface = `package ${packageName};

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ${className} {

`

  if (generateMethods.insert) {
    javaInterface += `    int insert${entityClassName.value}(${entityClassName.value} ${entityClassName.value.toLowerCase()});\n\n`
  }

  if (generateMethods.update) {
    javaInterface += `    int update${entityClassName.value}(${entityClassName.value} ${entityClassName.value.toLowerCase()});\n\n`
  }

  if (generateMethods.selectById) {
    javaInterface += `    ${entityClassName.value} select${entityClassName.value}ById(@Param("id") Long id);\n\n`
  }

  if (generateMethods.selectAll) {
    javaInterface += `    List<${entityClassName.value}> selectAll${entityClassName.value}s();\n\n`
  }

  if (generateMethods.delete) {
    javaInterface += `    int delete${entityClassName.value}(@Param("id") Long id);\n\n`
  }

  javaInterface += '}'
  generatedMapperInterface.value = javaInterface
}

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
  // INSERT 쿼리에서 컬럼과 값 추출
  const columnMatch = query.match(/\(([^)]+)\)\s*VALUES?\s*\(([^)]+)\)/i)
  if (columnMatch) {
    const columns = columnMatch[1].split(',').map(col => col.trim())
    const values = columnMatch[2].split(',').map(val => val.trim())
    
    analyzedResult.columns = columns.map(col => ({ name: col, type: 'Unknown' }))
    
    if (columns.length === values.length) {
      analyzedResult.keyValuePairs = columns.map((col, index) => ({
        key: col,
        value: values[index]
      }))
    }
  }
}

const analyzeUpdateQuery = (query) => {
  // UPDATE 쿼리에서 SET 절 분석
  const setMatch = query.match(/SET\s+(.*?)(?:\s+WHERE|$)/i)
  if (setMatch) {
    const setPairs = setMatch[1].split(',').map(pair => pair.trim())
    analyzedResult.keyValuePairs = setPairs.map(pair => {
      const [key, value] = pair.split('=').map(p => p.trim())
      return { key, value }
    })
    
    analyzedResult.columns = setPairs.map(pair => {
      const key = pair.split('=')[0].trim()
      return { name: key, type: 'Unknown' }
    })
  }
}

const analyzeSelectQuery = (query) => {
  // SELECT 쿼리에서 컬럼 추출
  const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i)
  if (selectMatch) {
    const columnsPart = selectMatch[1].trim()
    if (columnsPart !== '*') {
      const columns = columnsPart.split(',').map(col => col.trim())
      analyzedResult.columns = columns.map(col => ({ name: col, type: 'Unknown' }))
    }
  }
}

const formatQuery = (query) => {
  // 기본적인 SQL 포맷팅
  return query
    .replace(/\bSELECT\b/gi, 'SELECT\n    ')
    .replace(/\bFROM\b/gi, '\nFROM')
    .replace(/\bWHERE\b/gi, '\nWHERE')
    .replace(/\bINSERT INTO\b/gi, 'INSERT INTO')
    .replace(/\bVALUES\b/gi, '\nVALUES')
    .replace(/\bUPDATE\b/gi, 'UPDATE')
    .replace(/\bSET\b/gi, '\nSET\n    ')
    .replace(/,\s*(?![^()]*\))/g, ',\n    ')
    .trim()
}

const formatKeyValuePairs = (pairs) => {
  return pairs.map(pair => `${pair.key} = ${pair.value}`).join('\n')
}

// 복사 함수
const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus[type] = 'copied'
    setTimeout(() => {
      copyStatus[type] = ''
    }, 2000)
  } catch (error) {
    console.error('복사 실패:', error)
    alert('복사에 실패했습니다.')
  }
}

// SEO 및 페이지 설정 (canonical/OG + JSON-LD)
const config = useRuntimeConfig()
const siteUrl = config.public?.siteUrl || 'https://www.web-util.com'
useHead({
  title: 'SQL 유틸리티 · 쿼리/Mapper 생성·분석 | Web-Util',
  meta: [
    { name: 'description', content: 'SQL 쿼리 생성, MyBatis Mapper 생성, 포맷팅과 분석까지 한 곳에서 처리하는 SQL 개발 도구.' },
    { property: 'og:title', content: 'SQL 유틸리티 - Web-Util' },
    { property: 'og:description', content: 'SQL 생성·분석·포맷팅을 지원하는 무료 웹 도구입니다.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl + '/database/sql' }
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/database/sql' }]
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SQL 유틸리티',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl + '/database/sql',
        description: 'SQL 쿼리 및 MyBatis Mapper 생성, 포맷팅과 분석을 제공하는 무료 웹 도구.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
      })
    }
  ]
})
</script>
