<template>
  <v-app>
    <v-main>
      <div class="app-container">
        <!-- 모바일 오버레이 -->
        <div 
          v-if="sidebarOpen" 
          class="mobile-overlay" 
          @click="sidebarOpen = false"
        />
        
        <div class="app-layout">
          <!-- Sidebar -->
          <SideBar 
            :sidebarOpen="sidebarOpen" 
            @close="sidebarOpen = false" 
          />

          <!-- Main Content -->
          <div class="main-container">
            <!-- Header -->
            <header class="app-header">
              <div class="header-left">
                <v-btn 
                  variant="text" 
                  class="menu-button" 
                  @click="sidebarOpen = true"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
                <!-- link : / -->
                <NuxtLink to="/" class="app-title">
                  <h1 class="app-title">web-util</h1>
                </NuxtLink>
              </div>

              <!-- 광고 위치 -->
              <div class="header-ad">
                <AdSlot
                  :unit-id="headerUnitId"
                  :width="headerWidth"
                  :height="headerHeight"
                />
              </div>
              
              <div class="header-right">
                <!-- GitHub 관련 버튼들 -->
                <div class="github-buttons">
                  <!-- GitHub Repository -->
                  <v-btn 
                    href="https://github.com/moon4311/jmutil" 
                    target="_blank"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-github"
                    class="github-repo-btn"
                  >
                    GitHub
                  </v-btn>
                  
                  <!-- 이슈 신고 -->
                  <v-btn 
                    href="https://github.com/moon4311/jmutil/issues/new" 
                    target="_blank"
                    variant="text"
                    size="large"
                    icon="mdi-bug"
                    class="issue-btn"
                  />
                </div>
                
                <!-- 테마 토글 -->
                <ThemeToggle />
                
                <!-- 모바일용 GitHub 드롭다운 -->
                <div class="mobile-github-menu">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn 
                        v-bind="props" 
                        variant="text" 
                        size="large" 
                        icon="mdi-github"
                        class="mobile-github-btn"
                      />
                    </template>
                    <v-list>
                      <v-list-item 
                        href="https://github.com/moon4311/jmutil" 
                        target="_blank"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-github</v-icon>
                        </template>
                        <v-list-item-title>Repository</v-list-item-title>
                      </v-list-item>
                      <v-list-item 
                        href="https://github.com/moon4311/jmutil/issues/new" 
                        target="_blank"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-bug</v-icon>
                        </template>
                        <v-list-item-title>Report Issue</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                
                <span class="user-name">해방</span>
                <v-avatar size="32" class="user-avatar">
                  <img src="/assets/img/jm.png" alt="User" />
                </v-avatar>
              </div>
            </header>

            <!-- Page Content -->
            <div class="content-wrapper">
              <!-- Main Content Area -->
              <main class="main-content">
                <slot />
                <!-- Toast Notification -->
                <ClientOnly>
                  <transition name="fade">
                    <div 
                      v-if="toast.show" 
                      class="toast-notification"
                    >
                      {{ toast.message }}
                    </div>
                  </transition>
                </ClientOnly>
              </main>
              
              <!-- Ad Banner Area -->
              <aside class="ad-sidebar">
                <div class="ad-sidebar-sticky">
                  <div class="ad-label">광고</div>
                  <div class="ad-container">
                    <AdSlot unit-id="DAN-W1I8djLN57Nf4yPR" :width="160" :height="600" />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SideBar from '@/components/SideBar.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useKakaoAds } from '@/composables/useKakaoAds';
import AdSlot from '@/components/AdSlot.vue';
import { useABVariant } from '@/composables/useABVariant.js';

// 카카오 애드핏 스크립트 추가
useHead({
  script: [
    {
      src: '//t1.daumcdn.net/kas/static/ba.min.js',
      async: true
    }
  ]
});

// 광고 관리
const { initAds, cleanupAds } = useKakaoAds();

const sidebarOpen = ref(false);
const toast = ref({ show: false, message: '' });
let toastTimeout = null;

function showToast(message) {
    toast.value.show = true;
    toast.value.message = message;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.value.show = false;
    }, 1500);
}

function onToastEvent(e) {
    showToast(e.detail || (e instanceof CustomEvent ? e.detail : e));
}

onMounted(() => {
    window.addEventListener('toast', onToastEvent);
    
    // 광고 초기화
    initAds();
});

onUnmounted(() => {
    window.removeEventListener('toast', onToastEvent);
    cleanupAds();
});

// Header Ad 사이즈 고정(728x90) — 카카오 단위 규격 일치 보장
const headerVariant = useABVariant('header-ad-size', ['A'])
const headerUnitId = computed(() => 'DAN-q3apLfzK9uRxRmyA')
const headerWidth = computed(() => 728)
const headerHeight = computed(() => 90)
</script>
<style scoped>
/* === 레이아웃 컨테이너 === */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity var(--transition-normal);
}

@media (min-width: 768px) {
  .mobile-overlay {
    display: none;
  }
}

.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background-alt);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* === 헤더 스타일 === */
.app-header {
  height: 4rem; /* 64px */
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .app-header {
    height: 6rem; /* 96px */
    padding: 0 var(--spacing-lg);
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.menu-button {
  min-width: auto !important;
  padding: var(--spacing-sm) !important;
  color: var(--color-text-secondary) !important;
}

.menu-button:hover {
  background-color: var(--color-gray-100) !important;
  color: var(--color-text-primary) !important;
}

@media (min-width: 768px) {
  .menu-button {
    display: none;
  }
}

.app-title {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
  color: var(--color-primary);
  margin: 0;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.app-title:hover {
  color: var(--color-primary-dark);
}

.header-ad {
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-sm);
}

@media (max-width: 1023px) {
  .header-ad {
    display: none;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.github-buttons {
  display: none;
  align-items: center;
  gap: var(--spacing-sm);
}

@media (min-width: 640px) {
  .github-buttons {
    display: flex;
  }
}

.mobile-github-menu {
  display: block;
}

@media (min-width: 640px) {
  .mobile-github-menu {
    display: none;
  }
}

/* GitHub 버튼 스타일링 */
.github-repo-btn {
  font-size: var(--font-size-sm) !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  text-transform: none !important;
}

.issue-btn {
  min-width: auto !important;
  padding: var(--spacing-sm) !important;
  color: var(--color-text-secondary) !important;
}

.issue-btn:hover {
  background-color: var(--color-gray-100) !important;
  color: var(--color-text-primary) !important;
}

.mobile-github-btn {
  min-width: auto !important;
  padding: var(--spacing-sm) !important;
  color: var(--color-text-secondary) !important;
}

.mobile-github-btn:hover {
  background-color: var(--color-gray-100) !important;
  color: var(--color-text-primary) !important;
}

.user-name {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.user-avatar {
  border: 2px solid var(--color-border);
  transition: border-color var(--transition-fast);
}

.user-avatar:hover {
  border-color: var(--color-primary);
}

/* === 콘텐츠 영역 === */
.content-wrapper {
  flex: 1;
  display: flex;
  background-color: var(--color-background-alt);
  min-width: 0;
}

.main-content {
  flex: 9;
  padding: var(--spacing-md);
  background-color: var(--color-background-alt);
  min-width: 0;
}

@media (min-width: 768px) {
  .main-content {
    padding: var(--spacing-lg);
  }
}

.ad-sidebar {
  display: none;
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  border-left: 1px solid var(--color-border);
  min-width: 200px;
}

@media (min-width: 1024px) {
  .ad-sidebar {
    display: block;
  }
}

.ad-sidebar-sticky {
  position: sticky;
  top: 5rem; /* 80px */
}

@media (min-width: 768px) {
  .ad-sidebar-sticky {
    top: 7rem; /* 112px */
  }
}

.ad-label {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.ad-container {
  display: flex;
  justify-content: center;
}

/* === 토스트 알림 === */
.toast-notification {
  position: fixed;
  left: 50%;
  bottom: var(--spacing-xl);
  z-index: 50;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-gray-800);
  color: white;
  box-shadow: var(--shadow-lg);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  transform: translateX(-50%);
  font-weight: var(--font-weight-medium);
}

/* === 트랜지션 === */
.fade-enter-active, .fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* === 광고 영역 스타일 === */
.kakao_ad_area {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

/* 광고 로딩 애니메이션 */
.kakao_ad_area[style*="display: none"] {
  background: linear-gradient(90deg, var(--color-gray-100) 25%, transparent 37%, var(--color-gray-100) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { 
    background-position: 100% 50%; 
  }
  100% { 
    background-position: -100% 50%; 
  }
}

/* === 추가 반응형 조정 === */
@media (max-width: 768px) {
  .header-right {
    gap: var(--spacing-sm);
  }
}

@media (max-width: 640px) {
  .app-title {
    font-size: var(--font-size-lg);
  }
  
  .header-right {
    gap: var(--spacing-sm);
  }
  
  .user-name {
    display: none;
  }
}
</style>
