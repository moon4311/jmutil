<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">MyBatis Mapper 생성기</h1>
        <p class="text-lg text-gray-600">MyBatis Mapper XML 파일과 Java 인터페이스를 자동 생성합니다</p>
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
        </div>
      </div>

      <!-- Mapper 생성 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">MyBatis Mapper 생성</h2>
          <p class="text-sm text-gray-600 mt-1">테이블 정보를 입력하여 MyBatis Mapper XML과 Java 인터페이스를 생성합니다</p>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 입력 영역 -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">네임스페이스</label>
                <input 
                  v-model="namespace" 
                  type="text" 
                  placeholder="com.example.mapper.UserMapper"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">테이블명</label>
                <input 
                  v-model="tableName" 
                  type="text" 
                  placeholder="users"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">엔티티 클래스명</label>
                <input 
                  v-model="entityClassName" 
                  type="text" 
                  placeholder="User"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  필드 매핑 (column_name:field_name:java_type)
                </label>
                <textarea 
                  v-model="fieldMapping" 
                  rows="10" 
                  placeholder="id:id:Long&#10;user_name:userName:String&#10;email:email:String&#10;created_at:createdAt:LocalDateTime"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm transition-colors resize-vertical"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">생성할 메소드</label>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input type="checkbox" v-model="generateMethods.insert" class="mr-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                    <span class="text-sm font-medium text-gray-700">INSERT</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="generateMethods.update" class="mr-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                    <span class="text-sm font-medium text-gray-700">UPDATE</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="generateMethods.selectById" class="mr-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                    <span class="text-sm font-medium text-gray-700">SELECT BY ID</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="generateMethods.selectAll" class="mr-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                    <span class="text-sm font-medium text-gray-700">SELECT ALL</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="generateMethods.delete" class="mr-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                    <span class="text-sm font-medium text-gray-700">DELETE</span>
                  </label>
                </div>
              </div>

              <button 
                @click="generateMapper" 
                class="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Mapper 생성
              </button>
            </div>

            <!-- 결과 영역 -->
            <div class="space-y-6">
              <div v-if="generatedMapperXml">
                <div class="flex justify-between items-center mb-3">
                  <label class="block text-sm font-medium text-gray-700">MyBatis Mapper XML</label>
                  <CopyInput
                    :value="generatedMapperXml"
                    label="복사"
                    size="sm"
                  />
                </div>
                <textarea 
                  :value="generatedMapperXml" 
                  readonly 
                  rows="18" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-vertical"
                  placeholder="생성된 Mapper XML이 여기에 표시됩니다"
                ></textarea>
              </div>

              <div v-if="generatedMapperInterface">
                <div class="flex justify-between items-center mb-3">
                  <label class="block text-sm font-medium text-gray-700">Java 인터페이스</label>
                  <CopyInput
                    :value="generatedMapperInterface"
                    label="복사"
                    size="sm"
                  />
                </div>
                <textarea 
                  :value="generatedMapperInterface" 
                  readonly 
                  rows="12" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-vertical"
                  placeholder="생성된 Java 인터페이스가 여기에 표시됩니다"
                ></textarea>
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

// Mapper 생성 관련
const namespace = ref('')
const tableName = ref('')
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

// Mapper 생성 함수
const generateMapper = () => {
  if (!namespace.value.trim() || !tableName.value.trim() || !entityClassName.value.trim() || !fieldMapping.value.trim()) {
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
        INSERT INTO ${tableName.value} (
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
        UPDATE ${tableName.value}
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
        FROM ${tableName.value}
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
        FROM ${tableName.value}
        ORDER BY id DESC
    </select>
`
  }

  // DELETE 쿼리
  if (generateMethods.delete) {
    xml += `
    <!-- Delete -->
    <delete id="delete${entityClassName.value}" parameterType="long">
        DELETE FROM ${tableName.value}
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

// SEO 및 페이지 설정
useHead({
  title: 'MyBatis Mapper 생성기 - JM Utils',
  meta: [
    { name: 'description', content: 'MyBatis Mapper XML 파일과 Java 인터페이스를 자동으로 생성하는 개발 도구입니다.' },
    { name: 'keywords', content: 'MyBatis, Mapper, XML, Java Interface, 자동 생성' }
  ]
})
</script>
