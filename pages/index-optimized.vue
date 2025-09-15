<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Critical Above-the-fold Content -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-6 py-12">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Hero Section - Critical -->
          <div class="flex items-center justify-center mb-6">
            <div class="bg-blue-600 rounded-full p-3 mr-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 class="text-4xl font-bold text-gray-900">Web Utility Tools</h1>
          </div>
          
          <!-- Critical Description -->
          <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            개발 업무를 효율적으로 만드는 검증된 온라인 도구 모음입니다. 
            모든 처리는 브라우저에서 이루어지며 개인정보를 안전하게 보호합니다.
          </p>
          
          <!-- Feature Badges - Critical -->
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

    <!-- Non-Critical Content - Lazy Loaded -->
    <ClientOnly>
      <LazyGrid :tools="tools" :search-query="searchQuery" />
      <template #fallback>
        <div class="container mx-auto px-6 py-8">
          <!-- Search Skeleton -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="skeleton h-12 rounded-lg"></div>
          </div>
          
          <!-- Tools Grid Skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="skeleton h-48 rounded-lg"></div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
// SSR 최적화된 메타 데이터
useSeoMeta({
  title: 'Web-Util - 온라인 도구 모음',
  description: '웹 작업자를 위한 필수 온라인 도구 모음. JSON 포맷팅/압축/CSV변환, 문자열 케이스변환/Base64/URL인코딩, 날짜 타임스탬프 변환, 진법변환, HEX/RGB 색상변환, 배열 가공, QR코드 생성기, 타이머, 로컬스토리지 관리 등 다양한 개발 유틸리티를 무료로 제공합니다.',
  keywords: 'JSON 포맷팅, JSON 압축, JSON CSV 변환, Base64 인코딩, URL 인코딩, 문자열 변환, 케이스 변환, camelCase, snake_case, 타임스탬프 변환, Unix timestamp, 날짜 변환, 진법 변환, 16진수, HEX RGB 변환, 색상 도구, 배열 중복제거, 배열 평탄화, QR코드 생성기, 개발도구, 웹개발, 프로그래밍 도구, 온라인 유틸리티, 개발자 도구, 무료 웹 툴',
  ogTitle: '온라인 유틸리티 도구 모음 - Web-Util',
  ogDescription: 'JSON 포맷팅, Base64 인코딩, 날짜 변환, 색상 변환, QR코드 생성 등 개발 작업에 필요한 다양한 온라인 도구를 무료로 제공하는 웹 유틸리티 사이트입니다.',
  ogType: 'website',
  ogUrl: 'https://www.web-util.com'
})

// 컴포넌트 동적 로딩 (Nuxt Lazy 경고 해결)
const LazyGrid = defineAsyncComponent(() => import('~/components/ToolsGrid.vue'))

// 검색 상태 (reactive)
const searchQuery = ref('')

// SSR에서 미리 생성된 도구 목록 (Static)
const tools = [
  {
    title: 'JSON 포맷팅',
    description: 'JSON 데이터를 읽기 쉽게 포맷팅하고 압축합니다',
    path: '/data/json',
    category: 'data',
    icon: 'mdi-code-json'
  },
  {
    title: '문자열 변환',
    description: '다양한 문자열 케이스 변환 및 인코딩',
    path: '/string/utils',
    category: 'string',
    icon: 'mdi-format-text'
  },
  {
    title: '날짜 변환',
    description: '날짜와 타임스탬프 상호 변환',
    path: '/string/date',
    category: 'string',
    icon: 'mdi-calendar-clock'
  },
  {
    title: 'QR 코드 생성',
    description: '텍스트나 URL을 QR 코드로 변환',
    path: '/tools/qr-generator',
    category: 'tools',
    icon: 'mdi-qrcode'
  },
  {
    title: '색상 변환',
    description: 'HEX, RGB, HSL 색상 코드 변환',
    path: '/tools/color',
    category: 'tools',
    icon: 'mdi-palette'
  },
  {
    title: '배열 처리',
    description: '배열 중복제거, 정렬, 평탄화 등',
    path: '/data/array',
    category: 'data',
    icon: 'mdi-view-list'
  }
]
</script>

<style scoped>
/* Critical CSS는 별도 파일에서 관리 */
</style>
