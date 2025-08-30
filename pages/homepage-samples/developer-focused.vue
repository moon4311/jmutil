<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div class="relative bg-gray-900 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
      <div class="relative container mx-auto px-6 py-20">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h1 class="text-6xl font-extrabold mb-6 leading-tight">
            Developer
            <span class="block text-blue-400">Toolbox</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            빠르고 안전한 브라우저 기반 개발 도구들로 업무 효율성을 극대화하세요
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="#tools" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg">
              도구 둘러보기
            </a>
            <button class="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg">
              기능 소개
            </button>
          </div>
          
          <!-- Quick Access Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div class="text-3xl mb-3">⚡</div>
              <h3 class="text-lg font-semibold mb-2">즉시 사용</h3>
              <p class="text-gray-400 text-sm">설치나 등록 없이 바로 사용 가능</p>
            </div>
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div class="text-3xl mb-3">🔐</div>
              <h3 class="text-lg font-semibold mb-2">완전 보안</h3>
              <p class="text-gray-400 text-sm">모든 데이터는 브라우저에서만 처리</p>
            </div>
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div class="text-3xl mb-3">🎯</div>
              <h3 class="text-lg font-semibold mb-2">전문가용</h3>
              <p class="text-gray-400 text-sm">실제 개발 업무에 특화된 기능들</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tools Section -->
    <div id="tools" class="py-20 bg-gray-50">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">핵심 도구</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            가장 자주 사용되는 개발 도구들을 카테고리별로 정리했습니다
          </p>
        </div>

        <!-- Tool Categories -->
        <div class="space-y-16">
          <!-- Data Processing -->
          <div>
            <div class="flex items-center mb-8">
              <div class="bg-purple-600 rounded-lg p-3 mr-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">데이터 처리</h3>
                <p class="text-gray-600">JSON, CSV, 배열 등 데이터 변환 및 가공 도구</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- JSON Tool -->
              <div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-purple-500">
                <div class="p-8">
                  <div class="flex items-center justify-between mb-6">
                    <h4 class="text-xl font-bold text-gray-900">JSON 가공</h4>
                    <div class="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-semibold">
                      인기
                    </div>
                  </div>
                  <p class="text-gray-600 mb-6">
                    유효성 검사, 포맷팅, 필터링, 검색 등 JSON 처리의 모든 기능을 제공합니다.
                  </p>
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span class="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">검증</span>
                    <span class="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">포맷팅</span>
                    <span class="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">필터링</span>
                  </div>
                  <NuxtLink 
                    to="/data/json" 
                    class="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl transition-colors font-semibold"
                  >
                    JSON 도구 사용하기 →
                  </NuxtLink>
                </div>
              </div>

              <!-- Array Tool -->
              <div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-red-500">
                <div class="p-8">
                  <div class="flex items-center justify-between mb-6">
                    <h4 class="text-xl font-bold text-gray-900">배열 가공</h4>
                  </div>
                  <p class="text-gray-600 mb-6">
                    중복제거, 평탄화, 섞기, 그룹핑 등 배열 데이터 처리 도구입니다.
                  </p>
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span class="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full">중복제거</span>
                    <span class="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full">정렬</span>
                    <span class="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full">그룹핑</span>
                  </div>
                  <NuxtLink 
                    to="/data/array" 
                    class="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-xl transition-colors font-semibold"
                  >
                    배열 도구 사용하기 →
                  </NuxtLink>
                </div>
              </div>

              <!-- CSV Tool -->
              <div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-yellow-500">
                <div class="p-8">
                  <div class="flex items-center justify-between mb-6">
                    <h4 class="text-xl font-bold text-gray-900">CSV 변환</h4>
                  </div>
                  <p class="text-gray-600 mb-6">
                    CSV와 JSON 간의 상호 변환 및 데이터 정제 기능을 제공합니다.
                  </p>
                  <div class="flex flex-wrap gap-2 mb-6">
                    <span class="bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full">CSV→JSON</span>
                    <span class="bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full">JSON→CSV</span>
                    <span class="bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full">정제</span>
                  </div>
                  <NuxtLink 
                    to="/data/csv" 
                    class="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-3 rounded-xl transition-colors font-semibold"
                  >
                    CSV 도구 사용하기 →
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- String & Number Processing -->
          <div>
            <div class="flex items-center mb-8">
              <div class="bg-green-600 rounded-lg p-3 mr-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">텍스트 & 숫자 처리</h3>
                <p class="text-gray-600">문자열 변환, 숫자 계산, 날짜 처리 도구</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- String Utils -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-green-500">
                <h4 class="text-lg font-bold text-gray-900 mb-3">문자열 가공</h4>
                <p class="text-gray-600 text-sm mb-4">케이스 변환, 인코딩, 포맷팅</p>
                <NuxtLink to="/string/utils" class="text-green-600 hover:text-green-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- Date Utils -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
                <h4 class="text-lg font-bold text-gray-900 mb-3">날짜/시간</h4>
                <p class="text-gray-600 text-sm mb-4">포맷 변환, 타임스탬프, 계산</p>
                <NuxtLink to="/string/date" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- Number Utils -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-orange-500">
                <h4 class="text-lg font-bold text-gray-900 mb-3">숫자 변환</h4>
                <p class="text-gray-600 text-sm mb-4">진법 변환, 랜덤 생성, 계산</p>
                <NuxtLink to="/string/number" class="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- Storage Utils -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-indigo-500">
                <h4 class="text-lg font-bold text-gray-900 mb-3">문자열 저장</h4>
                <p class="text-gray-600 text-sm mb-4">로컬 저장, 암호화, 관리</p>
                <NuxtLink to="/string/storage" class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Developer Tools -->
          <div>
            <div class="flex items-center mb-8">
              <div class="bg-gray-600 rounded-lg p-3 mr-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">개발자 도구</h3>
                <p class="text-gray-600">QR코드, 색상, 타이머, SQL 등 특수 도구</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <!-- SQL Tool -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">SQL 도구</h4>
                <p class="text-gray-600 text-sm mb-4">쿼리 생성 및 분석</p>
                <NuxtLink to="/database/sql" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- Color Tool -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">색상 도구</h4>
                <p class="text-gray-600 text-sm mb-4">HEX/RGB 변환</p>
                <NuxtLink to="/tools/color" class="text-pink-600 hover:text-pink-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- QR Tool -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 3h4v4H3V3zm2 2v0h0V5h2V3H5v2z"/>
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">QR코드</h4>
                <p class="text-gray-600 text-sm mb-4">QR 이미지 생성</p>
                <NuxtLink to="/tools/qr-generator" class="text-gray-600 hover:text-gray-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- Timer JSON -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">타이머 JSON</h4>
                <p class="text-gray-600 text-sm mb-4">타이머앱 데이터</p>
                <NuxtLink to="/tools/timer-json" class="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>

              <!-- Timer -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-2">타이머</h4>
                <p class="text-gray-600 text-sm mb-4">시간 측정 도구</p>
                <NuxtLink to="/tools/timer" class="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                  사용하기 →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">신뢰할 수 있는 도구</h2>
          <p class="text-gray-600">개발자들이 실제로 사용하고 검증한 툴킷</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">12+</div>
            <div class="text-gray-600 font-medium">전문 도구</div>
            <div class="text-sm text-gray-500 mt-1">실무 검증 완료</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">100%</div>
            <div class="text-gray-600 font-medium">클라이언트 처리</div>
            <div class="text-sm text-gray-500 mt-1">서버 전송 없음</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">0ms</div>
            <div class="text-gray-600 font-medium">네트워크 지연</div>
            <div class="text-sm text-gray-500 mt-1">즉시 결과 확인</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">24/7</div>
            <div class="text-gray-600 font-medium">언제나 사용</div>
            <div class="text-sm text-gray-500 mt-1">서버 다운타임 없음</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="py-16 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">자주 묻는 질문</h2>
          
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">데이터가 서버로 전송되나요?</h3>
              <p class="text-gray-600">아니요. 모든 처리는 브라우저에서 이루어지며, 어떤 데이터도 서버로 전송되지 않습니다.</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">회원가입이 필요한가요?</h3>
              <p class="text-gray-600">필요하지 않습니다. 모든 도구는 바로 사용할 수 있으며, 별도의 인증 과정이 없습니다.</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">사용료가 있나요?</h3>
              <p class="text-gray-600">모든 도구는 완전 무료로 제공되며, 사용량에 제한이 없습니다.</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">모바일에서도 사용할 수 있나요?</h3>
              <p class="text-gray-600">네. 모든 도구는 반응형으로 제작되어 PC, 태블릿, 스마트폰에서 모두 사용 가능합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO 설정
useHead({
  title: 'Developer Toolbox - 전문 개발자를 위한 브라우저 기반 도구 모음',
  meta: [
    { name: 'description', content: '개발 업무에 특화된 전문적인 브라우저 기반 도구들을 제공합니다. JSON 처리, 문자열 변환, 데이터 분석 등 실무에 바로 활용할 수 있는 검증된 유틸리티 컬렉션입니다.' },
    { name: 'keywords', content: '개발자도구, 브라우저도구, JSON처리, 문자열변환, 데이터분석, 개발유틸리티' }
  ]
})
</script>
