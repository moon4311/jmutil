<template>
  <aside :class="[
    'fixed z-40 md:static md:translate-x-0 transition-transform duration-200',
    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    'w-64 bg-white shadow-md flex flex-col h-full border-r border-gray-200'
  ]">
    <!-- 사이드바 헤더 -->
    <div class="sidebar-header">
      <div class="flex items-center justify-between p-4">
        <h2 class="sidebar-title">도구 메뉴</h2>
        <v-btn 
          @click="$emit('close')" 
          icon="mdi-close"
          variant="text"
          size="small"
          class="close-btn md:hidden"
        />
      </div>
      <hr class="border-gray-200" />
    </div>
    
    <!-- 네비게이션 메뉴 -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <!-- 문자열 카테고리 -->
      <div class="menu-category">
        <button 
          class="category-header"
          @click="strOpen = !strOpen"
          :class="{ 'active': strOpen }"
        >
          <v-icon size="18" class="category-icon">
            {{ strOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
          </v-icon>
          <span class="category-title">문자열</span>
        </button>
        <div class="menu-items" v-show="strOpen">
          <NuxtLink to="/string/utils" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-alphabetical</v-icon>
              <span>문자열 변환</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/string/storage" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-database</v-icon>
              <span>문자열 저장</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/string/number" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-numeric</v-icon>
              <span>숫자 변환</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/string/date" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-calendar</v-icon>
              <span>날짜/시간</span>
            </a>
          </NuxtLink>
        </div>
      </div>
      
      <!-- 객체 카테고리 -->
      <div class="menu-category">
        <button 
          class="category-header"
          @click="basicOpen = !basicOpen"
          :class="{ 'active': basicOpen }"
        >
          <v-icon size="18" class="category-icon">
            {{ basicOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
          </v-icon>
          <span class="category-title">객체</span>
        </button>
        <div class="menu-items" v-show="basicOpen">
          <NuxtLink to="/data/json" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-code-json</v-icon>
              <span>JSON 가공</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/data/csv" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-file-delimited</v-icon>
              <span>CSV/JSON 변환</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/data/array" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-format-list-bulleted</v-icon>
              <span>배열</span>
            </a>
          </NuxtLink>
        </div>
      </div>
      
      <!-- 데이터베이스 카테고리 -->
      <div class="menu-category">
        <button 
          class="category-header"
          @click="databaseOpen = !databaseOpen"
          :class="{ 'active': databaseOpen }"
        >
          <v-icon size="18" class="category-icon">
            {{ databaseOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
          </v-icon>
          <span class="category-title">데이터베이스</span>
        </button>
        <div class="menu-items" v-show="databaseOpen">
          <NuxtLink to="/database/sql" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-database-search</v-icon>
              <span>SQL 유틸리티</span>
            </a>
          </NuxtLink>
        </div>
      </div>
      
      <!-- 테스트 카테고리 -->
      <div class="menu-category">
        <button 
          class="category-header"
          @click="timerOpen = !timerOpen"
          :class="{ 'active': timerOpen }"
        >
          <v-icon size="18" class="category-icon">
            {{ timerOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
          </v-icon>
          <span class="category-title">테스트</span>
        </button>
        <div class="menu-items" v-show="timerOpen">
          <NuxtLink to="/tools/timer-json" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-timer</v-icon>
              <span>타이머 Json 생성</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/tools/color" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-palette</v-icon>
              <span>색상</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/tools/timer" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-timer-outline</v-icon>
              <span>타이머</span>
            </a>
          </NuxtLink>
          <NuxtLink to="/tools/qr-generator" custom v-slot="{ navigate, href, isActive }">
            <a 
              :href="href" 
              @click="navigate; emit('close')" 
              :class="['menu-item', { 'active': isActive }]"
            >
              <v-icon size="20" class="menu-icon">mdi-qrcode</v-icon>
              <span>QR코드 생성</span>
            </a>
          </NuxtLink>
        </div>
      </div>
    </nav>
    
    <!-- 광고 영역 -->
    <div class="sidebar-footer">
      <ClientOnly>
        <AdSlot 
          unitId="DAN-03qvHyP7MQAvCIUk"
          :width="250"
          :height="250"
          padding="8px"
        />
      </ClientOnly>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import AdSlot from '@/components/AdSlot.vue';

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

<style scoped>
/* === 사이드바 기본 스타일 === */
.sidebar-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  color: var(--color-text-secondary) !important;
}

.close-btn:hover {
  background-color: var(--color-gray-100) !important;
  color: var(--color-text-primary) !important;
}

/* === 메뉴 카테고리 === */
.menu-category {
  margin-bottom: var(--spacing-sm);
}

.category-header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.category-header:hover {
  background-color: var(--color-gray-50);
  color: var(--color-text-primary);
}

.category-header.active {
  background-color: var(--color-primary);
  color: white;
}

.category-header.active .category-icon {
  color: white;
}

.category-icon {
  margin-right: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.category-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* === 메뉴 아이템 === */
.menu-items {
  margin-top: var(--spacing-xs);
  margin-left: var(--spacing-lg);
  padding-left: var(--spacing-sm);
  border-left: 2px solid var(--color-border-light);
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.menu-item:hover {
  background-color: var(--color-gray-50);
  color: var(--color-text-primary);
  transform: translateX(2px);
  border-color: var(--color-border);
}

.menu-item.active {
  background-color: var(--color-primary-light);
  color: white;
  font-weight: var(--font-weight-medium);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.menu-item.active .menu-icon {
  color: white;
}

.menu-icon {
  margin-right: var(--spacing-sm);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.menu-item:hover .menu-icon {
  color: var(--color-text-primary);
}

/* === 사이드바 푸터 === */
.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background: var(--color-background-alt);
}

.sidebar-ad {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

/* === 반응형 조정 === */
@media (max-width: 768px) {
  .sidebar-title {
    font-size: var(--font-size-base);
  }
  
  .menu-item {
    padding: var(--spacing-sm);
  }
}

/* === 스크롤바 스타일링 === */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
}

nav::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-sm);
}

nav::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}

/* === 애니메이션 === */
.menu-items {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === 접근성 === */
.category-header:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.menu-item:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
