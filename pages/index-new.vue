<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-6 py-12">
        <div class="max-w-4xl mx-auto text-center">
          <div class="flex items-center justify-center mb-6">
            <div class="bg-blue-600 rounded-full p-3 mr-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 class="text-4xl font-bold text-gray-900">Web Utility Tools</h1>
          </div>
          <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            개발 업무를 효율적으로 만드는 검증된 온라인 도구 모음입니다. 
            모든 처리는 브라우저에서 이루어지며 개인정보를 안전하게 보호합니다.
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-sm">
            <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              클라이언트 처리
            </div>
            <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              데이터 보호
            </div>
            <div class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              무료 사용
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="container mx-auto px-6 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="도구 검색 (예: JSON, 문자열, 날짜...)"
            class="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          >
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        <!-- Category Filter -->
        <div class="flex flex-wrap justify-center gap-3 mt-6">
          <button 
            v-for="category in categories" 
            :key="category.key"
            @click="activeCategory = activeCategory === category.key ? 'all' : category.key"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeCategory === category.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="container mx-auto px-6 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.path"
          class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
        >
          <div class="p-6">
            <!-- Tool Icon & Category -->
            <div class="flex items-start justify-between mb-4">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', tool.iconBg]">
                <svg class="w-6 h-6" :class="tool.iconColor" fill="currentColor" viewBox="0 0 20 20">
                  <path v-html="tool.icon"/>
                </svg>
              </div>
              <span :class="['text-xs px-2 py-1 rounded-full', tool.categoryColor]">
                {{ tool.category }}
              </span>
            </div>
            
            <!-- Tool Info -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ tool.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ tool.description }}</p>
            
            <!-- Features -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span 
                v-for="feature in tool.features.slice(0, 2)" 
                :key="feature"
                class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {{ feature }}
              </span>
            </div>
            
            <!-- Action Button -->
            <NuxtLink 
              :to="tool.path" 
              class="block w-full text-center bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium group-hover:bg-blue-600"
            >
              사용하기
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredTools.length === 0" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-8-8m0 0V5a2 2 0 012-2h4a2 2 0 012 2v8m-8-8h8m8 8l8-8m0 0V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v8m8-8h-8"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
        <p class="text-gray-600">다른 키워드로 검색해보세요.</p>
      </div>
    </div>

    <!-- Usage Statistics -->
    <div class="bg-white py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-12">서비스 통계</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">12+</div>
            <div class="text-gray-600">유용한 도구</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div class="text-gray-600">월간 사용자</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
            <div class="text-gray-600">성공률</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div class="text-gray-600">서비스 제공</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 빈 레이아웃 사용
definePageMeta({
  layout: 'empty'
})

// 반응형 데이터
const searchQuery = ref('')
const activeCategory = ref('all')

// 카테고리 정의
const categories = [
  { key: 'all', name: '전체' },
  { key: 'string', name: '문자열' },
  { key: 'data', name: '데이터' },
  { key: 'database', name: 'DB' },
  { key: 'tools', name: '도구' }
]

// 도구 목록
const tools = [
  {
    title: 'JSON 가공',
    path: '/data/json',
    description: '유효성 검사, 포맷팅, 필터링, 검색, 정렬 등 JSON 처리의 모든 기능',
    category: '데이터',
    categoryKey: 'data',
    categoryColor: 'bg-purple-100 text-purple-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z',
    features: ['포맷팅', '유효성검사', '필터링']
  },
  {
    title: '문자열 가공',
    path: '/string/utils',
    description: '케이스 변환, 문자열 패딩, 포맷팅 등 문자열 처리 도구',
    category: '문자열',
    categoryKey: 'string',
    categoryColor: 'bg-green-100 text-green-800',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
    features: ['케이스변환', '인코딩', '포맷팅']
  },
  {
    title: '날짜/시간',
    path: '/string/date',
    description: '형식 변환, 타임스탬프 처리, 날짜 계산 등 시간 관련 도구',
    category: '문자열',
    categoryKey: 'string',
    categoryColor: 'bg-blue-100 text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z',
    features: ['포맷변환', '타임스탬프', '계산']
  },
  {
    title: '문자열 저장',
    path: '/string/storage',
    description: '로컬스토리지 활용한 문자열 저장 및 암호화 기능',
    category: '문자열',
    categoryKey: 'string',
    categoryColor: 'bg-indigo-100 text-indigo-800',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z',
    features: ['로컬저장', '암호화', '관리']
  },
  {
    title: '숫자 변환',
    path: '/string/number',
    description: '진법 변환, 랜덤 수 생성, 수학 계산 등 숫자 처리',
    category: '문자열',
    categoryKey: 'string',
    categoryColor: 'bg-orange-100 text-orange-800',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    icon: 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z',
    features: ['진법변환', '랜덤생성', '계산']
  },
  {
    title: '배열 가공',
    path: '/data/array',
    description: '중복제거, 평탄화, 섞기, 그룹핑 등 배열 처리',
    category: '데이터',
    categoryKey: 'data',
    categoryColor: 'bg-red-100 text-red-800',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    icon: 'M3 4a1 1 0 000 2v9a2 2 0 002 2h1a1 1 0 000-2H5a1 1 0 01-1-1V6a1 1 0 000-2h12a1 1 0 100-2H3zm11.293 4.293a1 1 0 00-1.414 1.414L14.586 11H7a1 1 0 100 2h7.586l-1.707 1.293a1 1 0 001.414 1.414l3.414-3.414a1 1 0 000-1.414l-3.414-3.414z',
    features: ['중복제거', '정렬', '그룹핑']
  },
  {
    title: 'CSV 변환',
    path: '/data/csv',
    description: 'CSV와 JSON 간의 상호 변환 및 데이터 처리',
    category: '데이터',
    categoryKey: 'data',
    categoryColor: 'bg-yellow-100 text-yellow-800',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    icon: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm5 2a1 1 0 000 2h2a1 1 0 100-2H9z',
    features: ['CSV변환', 'JSON변환', '데이터정제']
  },
  {
    title: 'SQL 유틸리티',
    path: '/database/sql',
    description: '쿼리 생성, MyBatis Mapper 생성, 쿼리 분석 등',
    category: 'DB',
    categoryKey: 'database',
    categoryColor: 'bg-blue-100 text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM4 14a2 2 0 002-2h8a2 2 0 002 2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4z',
    features: ['쿼리생성', 'Mapper생성', '분석']
  },
  {
    title: '색상 도구',
    path: '/tools/color',
    description: 'HEX/RGB 변환, 색상 조절, 랜덤 색상 등',
    category: '도구',
    categoryKey: 'tools',
    categoryColor: 'bg-pink-100 text-pink-800',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    icon: 'M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486z',
    features: ['HEX변환', 'RGB변환', '랜덤색상']
  },
  {
    title: 'QR코드 생성',
    path: '/tools/qr-generator',
    description: 'QR코드 이미지 생성 및 다운로드',
    category: '도구',
    categoryKey: 'tools',
    categoryColor: 'bg-gray-100 text-gray-800',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    icon: 'M3 3h4v4H3V3zm2 2v0h0V5h2V3H5v2zm8-2h4v4h-4V3zm2 2v0h0V5h2V3h-2v2zm-2 8h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm-8-2h2v2H5v-2zm2 2h2v2H7v-2zm-4-4h2v2H3v-2z',
    features: ['QR생성', '이미지다운', '텍스트변환']
  },
  {
    title: '타이머 JSON',
    path: '/tools/timer-json',
    description: '타이머앱용 JSON 데이터 생성',
    category: '도구',
    categoryKey: 'tools',
    categoryColor: 'bg-teal-100 text-teal-800',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z',
    features: ['JSON생성', '타이머앱', '설정관리']
  }
]

// 필터링된 도구 목록 계산
const filteredTools = computed(() => {
  let filtered = tools

  // 카테고리 필터링
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(tool => tool.categoryKey === activeCategory.value)
  }

  // 검색어 필터링
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool =>
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.features.some(feature => feature.toLowerCase().includes(query))
    )
  }

  return filtered
})

// SEO 설정
useHead({
  title: 'Web Utility Tools - 개발자를 위한 검증된 온라인 도구',
  meta: [
    { name: 'description', content: 'JSON 포맷팅, 문자열 변환, 날짜 계산 등 개발 업무에 필요한 신뢰할 수 있는 온라인 유틸리티 도구 모음입니다.' },
    { name: 'keywords', content: '웹도구, 개발유틸리티, JSON도구, 문자열변환, 개발자도구' }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
