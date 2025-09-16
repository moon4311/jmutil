<template>
  <button 
    @click="toggleTheme"
    :class="[
      'theme-toggle-btn app-btn app-btn-ghost',
      { 'dark-mode': isDark }
    ]"
    :title="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
    aria-label="테마 전환"
  >
    <v-icon size="20" class="theme-icon">
      {{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}
    </v-icon>
    <span class="theme-text sr-only">
      {{ isDark ? '라이트 모드' : '다크 모드' }}
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const isDark = ref(false);

// 테마 감지 및 적용
function detectTheme() {
  if (process.client) {
    // 저장된 설정 확인
    const stored = localStorage.getItem('theme');
    if (stored) {
      isDark.value = stored === 'dark';
    } else {
      // 시스템 설정 확인
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }
}

// 테마 적용
function applyTheme(dark) {
  if (process.client) {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}

// 테마 토글
function toggleTheme() {
  isDark.value = !isDark.value;
}

// 시스템 테마 변경 감지
function setupSystemThemeListener() {
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 사용자가 수동으로 설정하지 않은 경우에만 시스템 설정 따라감
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches;
      }
    });
  }
}

// 테마 변경 감시
watch(isDark, (newValue) => {
  applyTheme(newValue);
}, { immediate: false });

onMounted(() => {
  detectTheme();
  applyTheme(isDark.value);
  setupSystemThemeListener();
});
</script>

<style scoped>
.theme-toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: var(--spacing-sm);
  border-radius: var(--radius-lg);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.theme-toggle-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
  border-color: var(--color-border-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.theme-toggle-btn.dark-mode {
  background: var(--color-gray-800);
  border-color: var(--color-gray-600);
  color: var(--color-gray-200);
}

.theme-toggle-btn.dark-mode:hover {
  background: var(--color-gray-700);
  color: var(--color-gray-100);
  border-color: var(--color-gray-500);
}

.theme-icon {
  transition: all var(--transition-normal);
  animation: themeRotate 0.3s ease-in-out;
}

.theme-text {
  margin-left: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* 아이콘 회전 애니메이션 */
@keyframes themeRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

/* 접근성 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.theme-toggle-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 반응형 */
@media (min-width: 640px) {
  .theme-text {
    position: static;
    width: auto;
    height: auto;
    margin: 0 0 0 var(--spacing-xs);
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
  
  .theme-toggle-btn {
    width: auto;
    padding: var(--spacing-sm) var(--spacing-md);
  }
}

/* 다크 모드에서 아이콘 색상 조정 */
.dark .theme-icon {
  color: var(--color-yellow-400, #fbbf24);
}

.theme-toggle-btn:not(.dark-mode) .theme-icon {
  color: var(--color-gray-600);
}

.theme-toggle-btn:not(.dark-mode):hover .theme-icon {
  color: var(--color-gray-800);
}
</style>