<template>
  <aside :class="['fixed z-40 md:static md:translate-x-0 transition-transform duration-200', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'w-64 bg-white shadow-md flex flex-col h-full']">
    <!-- 헤더 -->
    <div class="h-16 flex items-center justify-between border-b px-4">
      <span class="font-bold text-lg">web-util</span>
      <div class="block md:hidden">
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <nav class="flex-1 p-4 space-y-4">
      <!-- 홈 메뉴 -->
      <NuxtLink to="/" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-home">홈</v-btn>
      </NuxtLink>
      <hr />
      <div>
        <div class="flex items-center cursor-pointer select-none text-xs font-semibold text-gray-500 mb-2" @click="strOpen = !strOpen">
          <v-icon size="18">{{ strOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          <span class="ml-1">문자열</span>
        </div>
        <div class="space-y-2 pl-5" v-show="strOpen">
          <NuxtLink to="/string-utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-alphabetical">문자열 변환</v-btn>
          </NuxtLink>
          <NuxtLink to="/localstorage-utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-database">문자열 저장</v-btn>
          </NuxtLink>
          <NuxtLink to="/number-utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-numeric">숫자 변환</v-btn>
          </NuxtLink>
          <NuxtLink to="/date-utils" custom v-slot="{ navigate, href }">
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
          <NuxtLink to="/json-utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-code-json">JSON/객체</v-btn>
          </NuxtLink>
          <NuxtLink to="/array-utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-format-list-bulleted">배열</v-btn>
          </NuxtLink>
          <NuxtLink to="/color-utils" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-palette">색상</v-btn>
          </NuxtLink>
        </div>
      </div>
      <hr />
      <!-- 타이머/QR 그룹 (아코디언) -->
      <div>
        <div class="flex items-center cursor-pointer select-none text-xs font-semibold text-gray-500 mb-2" @click="timerOpen = !timerOpen">
          <v-icon size="18">{{ timerOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          <span class="ml-1">타이머/QR</span>
        </div>
        <div class="space-y-2 pl-5" v-show="timerOpen">
          <NuxtLink to="/timer-json" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-timer">타이머 Json 생성</v-btn>
          </NuxtLink>
          <NuxtLink to="/timer" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-timer-outline">타이머</v-btn>
          </NuxtLink>
          <NuxtLink to="/qr-generator" custom v-slot="{ navigate, href }">
            <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-qrcode">QR코드 생성</v-btn>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  sidebarOpen: Boolean
});
const emit = defineEmits(['close']);

// 아코디언 상태
const strOpen = ref(true);
const basicOpen = ref(true);
const timerOpen = ref(true);
</script>
