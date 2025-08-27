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
                <ClientOnly>
                  <ins 
                    class="kakao_ad_area" 
                    style="display:none;"
                    data-ad-unit="DAN-q3apLfzK9uRxRmyA"
                    data-ad-width="728"
                    data-ad-height="90"
                  />
                </ClientOnly>
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
                    <ClientOnly>
                      <ins 
                        class="kakao_ad_area" 
                        style="display:none;"
                        data-ad-unit="DAN-W1I8djLN57Nf4yPR"
                        data-ad-width="160"
                        data-ad-height="600"
                      />
                    </ClientOnly>
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
import { ref, onMounted, onUnmounted } from 'vue';
import SideBar from '~/components/SideBar.vue';
import { useKakaoAds } from '~/composables/useKakaoAds';

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
}

@media (min-width: 768px) {
  .mobile-overlay {
    display: none;
  }
}

.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
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
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 20;
}

@media (min-width: 768px) {
  .app-header {
    height: 6rem; /* 96px */
    padding: 0 1.5rem;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-button {
  min-width: auto !important;
  padding: 8px !important;
}

@media (min-width: 768px) {
  .menu-button {
    display: none;
  }
}

.app-title {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: #1f2937;
  margin: 0;
}

.header-ad {
  display: none;
  align-items: center;
  padding: 0 0.5rem;
}

@media (min-width: 1024px) {
  .header-ad {
    display: flex;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.github-buttons {
  display: none;
  align-items: center;
  gap: 0.5rem;
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
.issue-btn {
  min-width: auto !important;
  padding: 8px !important;
}

.issue-btn .v-btn__content {
  font-size: 1.25rem !important;
}

.mobile-github-btn {
  min-width: auto !important;
  padding: 8px !important;
}

.mobile-github-btn .v-btn__content {
  font-size: 1.25rem !important;
}

.user-name {
  color: #4b5563;
}

/* === 콘텐츠 영역 === */
.content-wrapper {
  flex: 1;
  display: flex;
  background-color: #f9fafb;
  min-width: 0;
}

.main-content {
  flex: 9;
  padding: 1rem;
  background-color: #f9fafb;
  min-width: 0;
}

@media (min-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }
}

.ad-sidebar {
  display: none;
  flex: 1;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-left: 1px solid #e5e7eb;
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
  font-size: 0.75rem;
  line-height: 1rem;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 0.5rem;
}

.ad-container {
  display: flex;
  justify-content: center;
}

/* === 토스트 알림 === */
.toast-notification {
  position: fixed;
  left: 50%;
  bottom: 2rem;
  z-index: 50;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #111827;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  line-height: 1.5rem;
  transform: translateX(-50%);
}

/* === 트랜지션 === */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* === 광고 영역 스타일 === */
.kakao_ad_area {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 광고 로딩 애니메이션 */
.kakao_ad_area[style*="display: none"] {
  background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
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
    gap: 0.75rem;
  }
}

@media (max-width: 640px) {
  .app-title {
    font-size: 1.125rem;
  }
  
  .header-right {
    gap: 0.5rem;
  }
  
  .user-name {
    display: none;
  }
}
</style>
