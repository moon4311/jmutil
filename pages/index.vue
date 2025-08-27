
<template>
  <div class="container mx-auto p-6">
    <!-- SEO 및 접근성 개선된 제목 -->
    <div class="mb-12 text-center">
      <div class="bg-gray-100 rounded-lg p-6">
        <h1 class="text-xl font-semibold text-gray-800 mb-2" id="main-heading">
          유용한 도구들
        </h1>
        <p class="text-gray-600" role="doc-subtitle">
          일상적인 개발 작업에서 자주 사용되는 JavaScript 유틸리티 함수들을 웹 인터페이스로 제공합니다.
          <br>
          모든 도구는 클라이언트 사이드에서 실행되며, 데이터가 서버로 전송되지 않습니다.
        </p>
      </div>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 문자열 -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-green-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            문자열 가공
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">케이스 변환, 문자열 패딩, 포맷팅 등</p>
          <NuxtLink to="/string/utils" class="inline-block w-full bg-green-500 text-white text-center py-2 px-4 rounded hover:bg-green-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

      <!-- JSON 가공 (위치 변경됨) -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-purple-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            JSON 가공
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">유효성 검사, 포맷팅, 필터링, 검색, 정렬 등</p>
          <NuxtLink to="/data/json" class="inline-block w-full bg-purple-500 text-white text-center py-2 px-4 rounded hover:bg-purple-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

      <!-- 날짜/시간 -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-blue-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            일시 변환/계산
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">형식 변환, 타임스탬프 처리, 날짜 계산 등</p>
          <NuxtLink to="/string/date" class="inline-block w-full bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

       <!-- 문자열 저장 -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-indigo-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            문자열 저장
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">일반텍스트, 암호 등</p>
          <NuxtLink to="/string/storage" class="inline-block w-full bg-indigo-500 text-white text-center py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

      <!-- SQL 유틸리티 -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-blue-600 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM4 14a2 2 0 002-2h8a2 2 0 002 2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4zM6 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2.343a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H8a2 2 0 01-2-2V4z" />
            </svg>
            SQL 유틸리티
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">쿼리 생성, Mapper 생성, 쿼리 분석 등</p>
          <NuxtLink to="/database/sql" class="inline-block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

      <!-- 배열  -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-red-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 000 2v9a2 2 0 002 2h1a1 1 0 000-2H5a1 1 0 01-1-1V6a1 1 0 000-2h12a1 1 0 100-2H3zm11.293 4.293a1 1 0 00-1.414 1.414L14.586 11H7a1 1 0 100 2h7.586l-1.707 1.293a1 1 0 001.414 1.414l3.414-3.414a1 1 0 000-1.414l-3.414-3.414z" clip-rule="evenodd" />
            </svg>
            배열 가공
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">중복제거, 평탄화, 섞기, 그룹핑 등</p>
          <NuxtLink to="/data/array" class="inline-block w-full bg-red-500 text-white text-center py-2 px-4 rounded hover:bg-red-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

      <!-- 색상 -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-pink-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
            </svg>
            색상 
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">HEX/RGB 변환, 색상 조절, 랜덤 색상 등</p>
          <NuxtLink to="/tools/color" class="inline-block w-full bg-pink-500 text-white text-center py-2 px-4 rounded hover:bg-pink-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

     

      

      <!-- JSON 유틸리티 (위치 변경됨 - 이제는 숫자가 이 위치에) -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-orange-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
            </svg>
            숫자 변환/생성
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">진법 변환, 랜덤 수 생성, 수학 계산 등</p>
          <NuxtLink to="/string/number" class="inline-block w-full bg-orange-500 text-white text-center py-2 px-4 rounded hover:bg-orange-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>      <!-- QR코드 생성 -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-gray-700 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3h4v4H3V3zm2 2v0h0V5h2V3H5v2zm8-2h4v4h-4V3zm2 2v0h0V5h2V3h-2v2zm-2 8h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm-8-2h2v2H5v-2zm2 2h2v2H7v-2zm-4-4h2v2H3v-2zm2 2h2v2H5v-2zm10-2h2v2h-2v-2zm2 2h2v2h-2v-2z" />
            </svg>
            QR코드 생성
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">QR코드 이미지 생성 및 다운로드</p>
          <NuxtLink to="/tools/qr-generator" class="inline-block w-full bg-gray-700 text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>

      <!-- 타이머 JSON -->
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="bg-teal-500 text-white p-4">
          <h2 class="text-xl font-semibold flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            타이머 JSON
          </h2>
        </div>
        <div class="p-4">
          <p class="text-gray-600 mb-4">타이머앱 JSON 데이터 생성</p>
          <NuxtLink to="/tools/timer-json" class="inline-block w-full bg-teal-500 text-white text-center py-2 px-4 rounded hover:bg-teal-600 transition-colors">
            이용하기
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
