
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
                    <span class="font-bold text-xl text-gray-800">JmUtil</span>
                </div>
                <div class="flex items-center gap-4">
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
