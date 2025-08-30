<template>
  <aside :class="['fixed z-40 md:static md:translate-x-0 transition-transform duration-200', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'w-64 bg-white shadow-md flex flex-col h-full']">
    <!-- 헤더 -->
    <nav class="flex-1 p-4 space-y-4">
      <!-- 홈 메뉴 -->
      <v-btn @click="$emit('close')" block variant="text" class="block md:hidden h-24">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <hr />
      <div>
        <div class="flex items-center cursor-pointer select-none text-xs font-semibold text-gray-500 mb-2" @click="strOpen = !strOpen">
          <v-icon size="18">{{ strOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          <span class="ml-1">문자열</span>
        </div>
        <div class="space-y-2 pl-5" v-show="strOpen">
          <NuxtLink to="/string/utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-alphabetical">문자열 변환</v-btn>
          </NuxtLink>
          <NuxtLink to="/string/storage" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-database">문자열 저장</v-btn>
          </NuxtLink>
          <NuxtLink to="/string/number" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-numeric">숫자 변환</v-btn>
          </NuxtLink>
          <NuxtLink to="/string/date" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-calendar">날짜/시간</v-btn>
          </NuxtLink>
        </div>
      </div>
      <hr />
      <div>
        <div class="flex items-center cursor-pointer select-none text-xs font-semibold text-gray-500 mb-2" @click="basicOpen = !basicOpen">
          <v-icon size="18">{{ basicOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          <span class="ml-1">객체</span>
        </div>
        <div class="space-y-2 pl-5" v-show="basicOpen">
          <NuxtLink to="/data/json" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-code-json">JSON 가공</v-btn>
          </NuxtLink>
          <NuxtLink to="/data/csv" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-file-delimited">CSV/JSON 변환</v-btn>
          </NuxtLink>
          <NuxtLink to="/data/array" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-format-list-bulleted">배열</v-btn>
          </NuxtLink>
        </div>
      </div>
      <hr />
      <div>
        <div class="flex items-center cursor-pointer select-none text-xs font-semibold text-gray-500 mb-2" @click="databaseOpen = !databaseOpen">
          <v-icon size="18">{{ databaseOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          <span class="ml-1">데이터베이스</span>
        </div>
        <div class="space-y-2 pl-5" v-show="databaseOpen">
          <NuxtLink to="/database/sql" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-database-search">SQL 유틸리티</v-btn>
          </NuxtLink>
        </div>
      </div>
      <hr />
      <div>
        <div class="flex items-center cursor-pointer select-none text-xs font-semibold text-gray-500 mb-2" @click="timerOpen = !timerOpen">
          <v-icon size="18">{{ timerOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          <span class="ml-1">테스트</span>
        </div>
        <div class="space-y-2 pl-5" v-show="timerOpen">
          <NuxtLink to="/tools/timer-json" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-timer">타이머 Json 생성</v-btn>
          </NuxtLink>
          <NuxtLink to="/tools/color" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-palette">색상</v-btn>
          </NuxtLink>
          <NuxtLink to="/tools/timer" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-timer-outline">타이머</v-btn>
          </NuxtLink>
          <NuxtLink to="/tools/qr-generator" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-qrcode">QR코드 생성</v-btn>
          </NuxtLink>
        </div>
      </div>
    </nav>
    <!-- 광고위치-->
     <ClientOnly>
      <ins 
        class="kakao_ad_area" 
        style="display:none;"
        data-ad-unit="DAN-03qvHyP7MQAvCIUk"
        data-ad-width="250"
        data-ad-height="250"
      />
    </ClientOnly>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  sidebarOpen: Boolean
});
const emit = defineEmits(['close']);

// 아코디언 상태 - SSR 호환성을 위해 기본값은 false로 설정
const strOpen = ref(false);
const basicOpen = ref(false);
const databaseOpen = ref(false);
const timerOpen = ref(false);

// 클라이언트 사이드 마운트 여부
const isClient = ref(false);

// 화면 크기에 따라 아코디언 상태 설정
const setAccordionState = () => {
  if (!isClient.value) return;
  
  const isDesktop = window.innerWidth >= 768; // md 브레이크포인트 (768px)
  
  // 데스크톱에서는 열림, 모바일에서는 닫힘
  strOpen.value = isDesktop;
  basicOpen.value = isDesktop;
  databaseOpen.value = isDesktop;
  timerOpen.value = isDesktop;
};

// 리사이즈 핸들러 - 쓰로틀링 적용
let resizeTimeout = null;
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(setAccordionState, 150);
};

onMounted(async () => {
  await nextTick();
  isClient.value = true;
  
  // 초기 설정
  setAccordionState();

  // 리사이즈 이벤트 리스너
  if (process.client) {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (process.client && resizeTimeout) {
    clearTimeout(resizeTimeout);
    window.removeEventListener('resize', handleResize);
  }
});
</script>
