<template>
  <v-app>
    <v-main>
        <div>
            <!-- 모바일 오버레이 -->
            <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden" @click="sidebarOpen = false"></div>
            <div class="flex min-h-screen bg-gray-50">
            <!-- Sidebar -->
            <SideBar :sidebarOpen="sidebarOpen" @close="sidebarOpen = false" />

            <!-- Main Content -->
            <div class="flex-1 flex flex-col min-w-0">
                <!-- Header -->
                <header class="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
                <div class="flex items-center gap-2">
                    <v-btn icon class="md:hidden" @click="sidebarOpen = true">
                    <v-icon>mdi-menu</v-icon>
                    </v-btn>
                    <span class="font-bold text-xl text-gray-800">web-util</span>
                </div>
                
                <div class="flex items-center gap-4">
                    <!-- GitHub 관련 버튼들 -->
                    <div class="hidden sm:flex items-center gap-2">
                        <!-- GitHub Repository -->
                        <v-btn 
                            href="https://github.com/moon4311/jmutil" 
                            target="_blank"
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-github"
                        >
                            GitHub
                        </v-btn>
                        
                        <!-- Star 버튼 (동적 스타 수 표시) -->
                        <v-btn 
                            href="https://github.com/moon4311/jmutil/stargazers" 
                            target="_blank"
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-star-outline"
                            class="!min-w-0"
                        >
                            <template v-if="!githubStats.loading">
                                {{ githubStats.stars }}
                            </template>
                            <v-progress-circular v-else size="12" indeterminate></v-progress-circular>
                        </v-btn>
                        
                        <!-- Fork 버튼 -->
                        <v-btn 
                            href="https://github.com/moon4311/jmutil/fork" 
                            target="_blank"
                            variant="text"
                            size="small"
                            prepend-icon="mdi-source-fork"
                        >
                            <span v-if="!githubStats.loading" class="text-xs">
                                {{ githubStats.forks }}
                            </span>
                        </v-btn>
                        
                        <!-- 이슈 신고 -->
                        <v-btn 
                            href="https://github.com/moon4311/jmutil/issues/new" 
                            target="_blank"
                            variant="text"
                            size="small"
                            icon="mdi-bug"
                        >
                        </v-btn>
                    </div>
                    
                    <!-- 모바일용 GitHub 드롭다운 -->
                    <div class="sm:hidden">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" variant="outlined" size="small" icon="mdi-github">
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item href="https://github.com/moon4311/jmutil" target="_blank">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-github</v-icon>
                                    </template>
                                    <v-list-item-title>Repository</v-list-item-title>
                                </v-list-item>
                                <v-list-item href="https://github.com/moon4311/jmutil/stargazers" target="_blank">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-star-outline</v-icon>
                                    </template>
                                    <v-list-item-title>Stars ({{ githubStats.stars }})</v-list-item-title>
                                </v-list-item>
                                <v-list-item href="https://github.com/moon4311/jmutil/fork" target="_blank">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-source-fork</v-icon>
                                    </template>
                                    <v-list-item-title>Fork ({{ githubStats.forks }})</v-list-item-title>
                                </v-list-item>
                                <v-list-item href="https://github.com/moon4311/jmutil/issues/new" target="_blank">
                                    <template v-slot:prepend>
                                        <v-icon>mdi-bug</v-icon>
                                    </template>
                                    <v-list-item-title>Report Issue</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                    
                    <span class="text-gray-600">해방</span>
                    <v-avatar size="32">
                        <img src="/assets/img/jm.png" alt="User" />
                    </v-avatar>
                </div>
                </header>

                <!-- Page Content -->
                <main class="flex-1 p-4 md:p-6 bg-gray-50 min-w-0">
                <slot />
                <!-- Toast Notification -->
                <transition name="fade">
                    <div v-if="toast.show" class="fixed left-1/2 bottom-8 z-50 px-4 py-2 rounded bg-gray-900 text-white shadow-lg text-base" style="transform:translateX(-50%)">
                        {{ toast.message }}
                    </div>
                </transition>
                </main>
            </div>
            </div>
        </div>
        </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SideBar from '~/components/SideBar.vue';
const sidebarOpen = ref(false);

const toast = ref({ show: false, message: '' });
let toastTimeout = null;

// GitHub 정보
const githubStats = ref({
  stars: 0,
  forks: 0,
  loading: true
});

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

// GitHub API에서 레포지토리 정보 가져오기
const fetchGitHubStats = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/moon4311/jmutil');
    const data = await response.json();
    githubStats.value = {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      loading: false
    };
  } catch (error) {
    console.error('GitHub API 호출 실패:', error);
    githubStats.value.loading = false;
  }
};

onMounted(() => {
    window.addEventListener('toast', onToastEvent);
    fetchGitHubStats();
});
onUnmounted(() => {
    window.removeEventListener('toast', onToastEvent);
});
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
