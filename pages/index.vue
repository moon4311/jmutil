
<template>
  <div class="container mx-auto p-6">
    <!-- SEO 및 접근성 개선된 제목 -->
    <div class="mb-8 text-center">
      <div class="bg-gray-100 rounded-lg p-6">
        <h1 class="text-xl font-semibold text-gray-800 mb-2" id="main-heading">
          JavaScript 유틸리티 도구 모음
        </h1>
        <p class="text-gray-600 mb-4" role="doc-subtitle">
          개발자를 위한 다양한 도구들을 제공합니다. 문자열 처리부터 데이터베이스 쿼리 생성, 
          파일 변환까지 {{ totalToolsCount }}개의 유틸리티를 사용해보세요.
          <br>
          <span class="text-sm text-gray-500">모든 처리는 클라이언트에서 실행되며 데이터가 외부로 전송되지 않습니다.</span>
        </p>
        
        <!-- 검색 기능 -->
        <div class="max-w-md mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="도구를 검색해보세요... (예: JSON, 색상, SQL)"
              class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div v-if="searchQuery && filteredItems.length === 0" class="mt-2 text-sm text-red-500">
            검색 결과가 없습니다.
          </div>
          <div v-if="searchQuery" class="mt-2 text-xs text-gray-500">
            {{ filteredItems.length }}개의 도구가 검색되었습니다.
          </div>
        </div>
      </div>
    </div>

    <!-- 카테고리별 도구 목록 (검색 없을 때) -->
    <div v-if="!searchQuery">
      <div v-for="(category, key) in menuData.categories" :key="key" class="mb-10">
        <div class="mb-6 flex items-center">
          <div class="flex items-center space-x-3">
            <div :class="[`bg-${category.color}-500`, 'p-2 rounded-lg']">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="key === 'string'" fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                <path v-else-if="key === 'data'" fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                <path v-else-if="key === 'database'" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM4 14a2 2 0 002-2h8a2 2 0 002 2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4zM6 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2.343a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H8a2 2 0 01-2-2V4z" />
                <path v-else-if="key === 'tools'" fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                <path v-else-if="key === 'files'" d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z M4 9a2 2 0 100 4h12a2 2 0 100-4H4z M4 15a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path v-else-if="key === 'network'" d="M3 4a1 1 0 000 2v9a2 2 0 002 2h1a1 1 0 000-2H5a1 1 0 01-1-1V6a1 1 0 000-2h12a1 1 0 100-2H3zm11.293 4.293a1 1 0 00-1.414 1.414L14.586 11H7a1 1 0 100 2h7.586l-1.707 1.293a1 1 0 001.414 1.414l3.414-3.414a1 1 0 000-1.414l-3.414-3.414z" />
                <path v-else d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ category.title }}</h2>
              <p class="text-gray-600">{{ category.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="item in category.items.filter(i => i.status === 'implemented')" 
            :key="item.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-l-4"
            :class="[`border-${category.color}-500`]"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-800">{{ item.title }}</h3>
                <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">구현됨</span>
              </div>
              <p class="text-gray-600 mb-4 text-sm">{{ item.description }}</p>
              <div class="flex flex-wrap gap-1 mb-4">
                <span 
                  v-for="keyword in item.keywords.slice(0, 3)" 
                  :key="keyword"
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {{ keyword }}
                </span>
              </div>
              <NuxtLink 
                :to="item.url" 
                :class="[`bg-${category.color}-500`, `hover:bg-${category.color}-600`]"
                class="inline-block w-full text-white text-center py-2 px-4 rounded transition-colors"
              >
                이용하기
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 검색 결과 -->
    <div v-else-if="searchQuery && filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-l-4"
        :class="[`border-${item.categoryColor}-500`]"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-800">{{ item.title }}</h3>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ item.categoryTitle }}</span>
              <span 
                :class="[
                  item.status === 'implemented' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ item.status === 'implemented' ? '구현됨' : '계획됨' }}
              </span>
            </div>
          </div>
          <p class="text-gray-600 mb-4 text-sm">{{ item.description }}</p>
          <div class="flex flex-wrap gap-1 mb-4">
            <span 
              v-for="keyword in item.keywords.slice(0, 4)" 
              :key="keyword"
              class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
            >
              {{ keyword }}
            </span>
          </div>
          <NuxtLink 
            v-if="item.status === 'implemented'"
            :to="item.url" 
            :class="[`bg-${item.categoryColor}-500`, `hover:bg-${item.categoryColor}-600`]"
            class="inline-block w-full text-white text-center py-2 px-4 rounded transition-colors"
          >
            이용하기
          </NuxtLink>
          <div 
            v-else
            class="inline-block w-full bg-gray-300 text-gray-500 text-center py-2 px-4 rounded cursor-not-allowed"
          >
            개발 예정
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import menuItemsData from '~/assets/data/menu-items.json'

// 반응형 데이터
const searchQuery = ref('')
const menuData = ref({})

// 컴포넌트 마운트 시 메뉴 데이터 로드
onMounted(() => {
  menuData.value = menuItemsData
})

// 전체 도구 개수 계산
const totalToolsCount = computed(() => {
  let count = 0
  Object.values(menuData.value.categories || {}).forEach(category => {
    count += category.items?.filter(item => item.status === 'implemented').length || 0
  })
  return count
})

// 검색된 아이템들
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  const query = searchQuery.value.toLowerCase()
  const results = []
  
  Object.entries(menuData.value.categories || {}).forEach(([categoryKey, category]) => {
    category.items?.forEach(item => {
      // 제목, 설명, 키워드에서 검색
      const searchableText = [
        item.title,
        item.description,
        ...item.keywords
      ].join(' ').toLowerCase()
      
      if (searchableText.includes(query)) {
        results.push({
          ...item,
          categoryTitle: category.title,
          categoryColor: category.color
        })
      }
    })
  })
  
  return results
})

// SEO 메타 태그 설정
useHead({
  title: 'JavaScript 유틸리티 도구 모음 - 편리한 웹 도구들',
  meta: [
    { 
      name: 'description', 
      content: '다양한 JavaScript 유틸리티 도구를 제공합니다. 문자열 처리, JSON 가공, SQL 쿼리 생성, 파일 변환 등 다양한 유용한 도구를 무료로 사용해보세요.' 
    },
    { name: 'keywords', content: 'JavaScript, 유틸리티, 도구, 문자열, JSON, SQL, 개발자, 웹도구, 변환, 가공' },
    { property: 'og:title', content: 'JavaScript 유틸리티 도구 모음' },
    { property: 'og:description', content: '편리한 웹 기반 유틸리티 도구들' }
  ]
})
</script>
