<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div class="relative container mx-auto px-6 py-16">
        <div class="text-center mb-16">
          <div class="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-lg mb-6">
            <svg class="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            <span class="text-gray-700 font-medium">개발자를 위한 필수 도구</span>
          </div>
          <h1 class="text-5xl font-bold text-gray-900 mb-4">
            Web Utility
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dashboard</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            일상적인 개발 작업을 위한 강력하고 직관적인 온라인 도구 모음집입니다.
            <br>모든 처리는 클라이언트에서 이루어지며 데이터는 안전하게 보호됩니다.
          </p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="text-3xl font-bold text-blue-600">12+</div>
            <div class="text-gray-600 mt-2">유용한 도구</div>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="text-3xl font-bold text-green-600">100%</div>
            <div class="text-gray-600 mt-2">클라이언트 처리</div>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="text-3xl font-bold text-purple-600">0ms</div>
            <div class="text-gray-600 mt-2">서버 지연</div>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div class="text-3xl font-bold text-orange-600">무료</div>
            <div class="text-gray-600 mt-2">영구 사용</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Categories -->
    <div class="container mx-auto px-6 pb-20">
      <!-- Popular Tools -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">인기 도구</h2>
          <div class="flex space-x-2">
            <div class="w-12 h-1 bg-blue-600 rounded-full"></div>
            <div class="w-6 h-1 bg-gray-300 rounded-full"></div>
            <div class="w-6 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- JSON 가공 -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">JSON 가공</h3>
              <p class="text-gray-600 mb-6">유효성 검사, 포맷팅, 필터링, 검색 등 JSON 처리의 모든 것</p>
              <NuxtLink to="/data/json" class="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group-hover:translate-x-2 transition-transform">
                시작하기 
                <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- 문자열 가공 -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">문자열 가공</h3>
              <p class="text-gray-600 mb-6">케이스 변환, 인코딩, 포맷팅 등 문자열 처리 도구</p>
              <NuxtLink to="/string/utils" class="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group-hover:translate-x-2 transition-transform">
                시작하기 
                <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- 날짜/시간 -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">날짜/시간</h3>
              <p class="text-gray-600 mb-6">형식 변환, 타임스탬프, 날짜 계산 등 시간 관련 도구</p>
              <NuxtLink to="/string/date" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-transform">
                시작하기 
                <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- All Tools Grid -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">모든 도구</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- 문자열 저장 -->
          <NuxtLink to="/string/storage" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4 group-hover:bg-indigo-200 transition-colors">
              <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">문자열 저장</h3>
            <p class="text-gray-600 text-sm">로컬 저장 및 암호화</p>
          </NuxtLink>

          <!-- SQL 유틸리티 -->
          <NuxtLink to="/database/sql" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">SQL 유틸리티</h3>
            <p class="text-gray-600 text-sm">쿼리 생성 및 분석</p>
          </NuxtLink>

          <!-- 배열 가공 -->
          <NuxtLink to="/data/array" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4 group-hover:bg-red-200 transition-colors">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 000 2v9a2 2 0 002 2h1a1 1 0 000-2H5a1 1 0 01-1-1V6a1 1 0 000-2h12a1 1 0 100-2H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">배열 가공</h3>
            <p class="text-gray-600 text-sm">정렬, 필터링, 변환</p>
          </NuxtLink>

          <!-- 색상 도구 -->
          <NuxtLink to="/tools/color" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-4 group-hover:bg-pink-200 transition-colors">
              <svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">색상 도구</h3>
            <p class="text-gray-600 text-sm">HEX/RGB 변환</p>
          </NuxtLink>

          <!-- 숫자 변환 -->
          <NuxtLink to="/string/number" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
              <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">숫자 변환</h3>
            <p class="text-gray-600 text-sm">진법 변환, 계산</p>
          </NuxtLink>

          <!-- QR코드 생성 -->
          <NuxtLink to="/tools/qr-generator" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4 group-hover:bg-gray-200 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h4v4H3V3zm2 2v0h0V5h2V3H5v2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">QR코드 생성</h3>
            <p class="text-gray-600 text-sm">이미지 생성 및 다운로드</p>
          </NuxtLink>

          <!-- CSV 변환 -->
          <NuxtLink to="/data/csv" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4 group-hover:bg-yellow-200 transition-colors">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">CSV 변환</h3>
            <p class="text-gray-600 text-sm">CSV/JSON 상호 변환</p>
          </NuxtLink>

          <!-- 타이머 JSON -->
          <NuxtLink to="/tools/timer-json" class="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-4 group-hover:bg-teal-200 transition-colors">
              <svg class="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">타이머 JSON</h3>
            <p class="text-gray-600 text-sm">타이머앱 JSON 생성</p>
          </NuxtLink>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">지금 시작해보세요</h2>
        <p class="text-xl mb-8 opacity-90">모든 도구는 무료로 제공되며, 설치나 등록 없이 바로 사용할 수 있습니다</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors">
            인기 도구 둘러보기
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors">
            전체 도구 보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO 설정
useHead({
  title: 'Web Utility Dashboard - 개발자를 위한 필수 온라인 도구',
  meta: [
    { name: 'description', content: 'JSON 포맷팅, 문자열 변환, 날짜 계산, 색상 도구 등 개발 작업에 필요한 다양한 온라인 유틸리티를 무료로 제공하는 현대적인 대시보드입니다.' },
    { name: 'keywords', content: '웹유틸리티, 개발도구, JSON, 문자열변환, 날짜계산, 온라인도구' }
  ]
})
</script>
