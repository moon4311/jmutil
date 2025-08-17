<template>
  <aside :class="['fixed z-40 md:static md:translate-x-0 transition-transform duration-200', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'w-64 bg-white shadow-md flex flex-col h-full']">
    <div class="h-16 flex items-center justify-between border-b px-4">
      <span class="font-bold text-lg">jmUtil</span>
      <v-btn icon class="md:hidden" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <nav class="flex-1 p-4 space-y-2">
      <NuxtLink to="/" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-view-dashboard">대시보드</v-btn>
      </NuxtLink>
      <NuxtLink to="/string-utils" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-alphabetical">문자열</v-btn>
      </NuxtLink>
      <NuxtLink to="/number-utils" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-numeric">숫자</v-btn>
      </NuxtLink>
      <NuxtLink to="/date-utils" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-calendar">날짜/시간</v-btn>
      </NuxtLink>
      <NuxtLink to="/encoding-utils" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-code-tags">인코딩/디코딩</v-btn>
      </NuxtLink>
      <NuxtLink to="/json-utils" custom v-slot="{ navigate, href }">
        <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-code-json">JSON/객체</v-btn>
      </NuxtLink>
        <NuxtLink to="/timer-json" custom v-slot="{ navigate, href }">
          <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start" prepend-icon="mdi-timer">타이머 Json 생성</v-btn>
        </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const props = defineProps({
  sidebarOpen: Boolean
});
const emit = defineEmits(['close']);
</script>
