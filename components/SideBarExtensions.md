# SideBar 추가 기능 가이드

## 구현된 기능
1. ✅ Close 버튼 숨김 문제 해결 (wrapper div 사용)
2. ✅ GitHub 링크 추가
3. ✅ 실시간 스타/포크 수 표시
4. ✅ 이슈 신고 링크

## 추가 가능한 기능들

### 1. 다크 모드 토글
```vue
<!-- 헤더 섹션에 추가 -->
<v-btn 
  @click="toggleDarkMode" 
  variant="text" 
  icon="mdi-theme-light-dark"
  size="small"
>
</v-btn>
```

### 2. 언어 변경 드롭다운
```vue
<v-menu>
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" variant="text" prepend-icon="mdi-translate">
      한국어
    </v-btn>
  </template>
  <v-list>
    <v-list-item @click="setLocale('ko')">한국어</v-list-item>
    <v-list-item @click="setLocale('en')">English</v-list-item>
  </v-list>
</v-menu>
```

### 3. 버전 정보 표시
```vue
<div class="px-4 py-2 border-t text-xs text-gray-500">
  Version {{ packageVersion }}
</div>
```

### 4. 소셜 미디어 링크
```vue
<div class="flex space-x-2 px-4 py-2">
  <v-btn href="https://twitter.com/yourhandle" target="_blank" icon="mdi-twitter" size="small"></v-btn>
  <v-btn href="https://discord.gg/yourserver" target="_blank" icon="mdi-discord" size="small"></v-btn>
</div>
```

### 5. 피드백/제안 기능
```vue
<v-btn 
  @click="openFeedbackDialog" 
  variant="text"
  size="small"
  prepend-icon="mdi-message-text"
  block
  class="justify-start"
>
  Send Feedback
</v-btn>
```

### 6. 즐겨찾기 기능
```vue
<!-- 각 메뉴 아이템에 별표 추가 -->
<div class="flex items-center">
  <NuxtLink to="/json-utils" custom v-slot="{ navigate, href }">
    <v-btn :href="href" @click="navigate; emit('close')" block variant="text" class="justify-start flex-1" prepend-icon="mdi-code-json">
      JSON/객체
    </v-btn>
  </NuxtLink>
  <v-btn 
    @click="toggleFavorite('/json-utils')" 
    icon 
    size="x-small" 
    variant="text"
  >
    <v-icon :color="isFavorite('/json-utils') ? 'yellow' : 'grey'">
      mdi-star
    </v-icon>
  </v-btn>
</div>
```

### 7. 검색 기능
```vue
<!-- 헤더 아래에 검색 바 추가 -->
<div class="p-4 border-b">
  <v-text-field
    v-model="searchQuery"
    placeholder="Search tools..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    hide-details
  ></v-text-field>
</div>
```

## 스타일링 개선

### CSS 추가
```css
<style scoped>
/* 애니메이션 효과 */
.sidebar-enter-active, .sidebar-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-enter-from, .sidebar-leave-to {
  transform: translateX(-100%);
}

/* 스크롤바 스타일링 */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

/* 호버 효과 */
.nav-item {
  transition: all 0.2s ease;
}
.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
```
