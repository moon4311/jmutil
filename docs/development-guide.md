# 개발 가이드 - Web-Util

## 개요
Web-Util은 Nuxt 3 + Vuetify + Tailwind CSS를 기반으로 한 JavaScript 유틸리티 모음입니다. 이 문서는 개발 환경 설정부터 컴포넌트 개발, 스타일링 가이드까지 포함합니다.

## 🛠️ 개발 환경 설정

### 요구사항
- Node.js 20.19.4
- pnpm 패키지 매니저

### 설치 및 실행
```bash
# pnpm 설치 (필요한 경우)
npm install -g pnpm

# 의존성 설치
pnpm install

# 개발 서버 실행 (localhost:80)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 미리보기
pnpm preview
```

### 프로젝트 구조
```
├── assets/css/         # 공통 CSS 스타일
├── components/         # 재사용 가능한 Vue 컴포넌트
├── composables/        # Vue 컴포저블 (상태 관리)
├── layouts/            # 페이지 레이아웃
├── pages/              # 자동 라우팅 페이지
├── plugins/            # Nuxt 플러그인
├── utils/              # 순수 JavaScript 유틸리티
└── docs/               # 문서
```

## 🎨 스타일링 가이드

### 공통 CSS 클래스 시스템
`assets/css/common.css`에서 공통 스타일을 관리하며, 다음 클래스들을 제공합니다:

#### 1. 기본 유틸리티
```vue
<template>
  <div class="font-mono">모노스페이스 폰트</div>
</template>
```

#### 2. 트랜지션 효과
```vue
<template>
  <transition name="fade">
    <div v-if="show">페이드 인/아웃</div>
  </transition>
  
  <transition name="slide">
    <div v-if="show">슬라이드 인/아웃</div>
  </transition>
</template>
```

#### 3. 공통 입력 필드
```vue
<template>
  <div class="input-wrapper">
    <input class="input-field" />
    <button class="copy-button">
      <v-icon>mdi-content-copy</v-icon>
    </button>
  </div>
</template>
```

#### 4. 로딩 및 상태 표시
```vue
<template>
  <!-- 로딩 스피너 -->
  <div class="loading-spinner"></div>
  
  <!-- 프로그레스 바 -->
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: '50%' }"></div>
  </div>
  
  <!-- 상태 칩 -->
  <span class="status-chip success">완료</span>
  <span class="status-chip error">오류</span>
</template>
```

#### 5. 토스트 알림
```vue
<template>
  <div class="toast-base toast-success">성공 메시지</div>
  <div class="toast-base toast-error">오류 메시지</div>
  <div class="toast-base toast-info">정보 메시지</div>
</template>
```

### 반응형 디자인
```vue
<template>
  <div class="mobile-only">모바일에서만 표시</div>
  <div class="desktop-only">데스크톱에서만 표시</div>
  
  <!-- 그리드 레이아웃 -->
  <div class="grid-responsive">
    <div>항목 1</div>
    <div>항목 2</div>
  </div>
</template>
```

## 🧩 컴포넌트 개발 가이드

### 재사용 가능한 컴포넌트들
- `CopyInput.vue` - 복사 기능이 있는 입력 필드
- `CopyTextArea.vue` - 복사 기능이 있는 텍스트 영역
- `LoadingState.vue` - 로딩 상태 표시
- `ErrorAlert.vue` - 에러 메시지 표시
- `GroupPanel.vue` - 접을 수 있는 패널

### 컴포넌트 작성 규칙
1. **Composition API 사용**: `<script setup>` 문법 사용
2. **Props 검증**: TypeScript 없이도 런타임 검증 적용
3. **공통 스타일 활용**: `common.css` 클래스 우선 사용
4. **접근성 고려**: ARIA 라벨, 키보드 네비게이션 지원

## 📱 SideBar 컴포넌트 확장

### 현재 구현된 기능
- Close 버튼 및 오버레이 처리
- GitHub 링크 및 실시간 통계
- 이슈 신고 링크

### 확장 가능한 기능들

#### 1. 다크 모드 토글
```vue
<v-btn 
  @click="toggleDarkMode" 
  variant="text" 
  icon="mdi-theme-light-dark"
  size="small"
/>
```

#### 2. 언어 변경
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

#### 3. 즐겨찾기 기능
```vue
<div class="flex items-center">
  <NuxtLink to="/data/json" custom v-slot="{ navigate, href }">
    <v-btn :href="href" @click="navigate" block variant="text">
      JSON 도구
    </v-btn>
  </NuxtLink>
  <v-btn @click="toggleFavorite('/data/json')" icon size="x-small">
    <v-icon :color="isFavorite('/data/json') ? 'yellow' : 'grey'">
      mdi-star
    </v-icon>
  </v-btn>
</div>
```

## 🔧 유틸리티 개발 가이드

### 유틸리티 함수 작성 규칙
1. **순수 함수**: 사이드 이펙트 없는 함수 작성
2. **캐싱**: 반복적인 연산은 Map을 이용한 캐싱 적용
3. **에러 처리**: try-catch로 안전한 에러 처리
4. **JSDoc**: 함수 문서화 필수

### 예제: 새로운 유틸리티 추가
```javascript
// utils/NewUtil.js
export class NewUtil {
  static cache = new Map();
  
  /**
   * 새로운 유틸리티 함수
   * @param {string} input - 입력 문자열
   * @returns {string} 처리된 결과
   */
  static processData(input) {
    if (this.cache.has(input)) {
      return this.cache.get(input);
    }
    
    try {
      const result = input.toUpperCase(); // 예시 처리
      this.cache.set(input, result);
      return result;
    } catch (error) {
      throw new Error(`처리 중 오류 발생: ${error.message}`);
    }
  }
}
```

### 컴포저블 생성
```javascript
// composables/useNewUtil.js
import { ref, computed } from 'vue'
import { NewUtil } from '~/utils/NewUtil.js'

export const useNewUtil = () => {
  const input = ref('')
  const output = ref('')
  const loading = ref(false)
  
  const processData = async () => {
    loading.value = true
    try {
      output.value = NewUtil.processData(input.value)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  
  return {
    input,
    output,
    loading,
    processData
  }
}
```

## 📋 개발 체크리스트

### 새로운 도구 추가 시
- [ ] `utils/` 폴더에 유틸리티 클래스 생성
- [ ] `composables/` 폴더에 Vue 컴포저블 생성
- [ ] `pages/` 폴더에 페이지 컴포넌트 생성
- [ ] `components/SideBar.vue` 메뉴에 추가
- [ ] `nuxt.config.js` sitemap에 경로 추가
- [ ] 필요시 `middleware/redirect.global.js`에 리다이렉트 규칙 추가

### 코드 품질 체크
- [ ] ESLint 규칙 준수
- [ ] 공통 CSS 클래스 활용
- [ ] 에러 처리 구현
- [ ] 반응형 디자인 적용
- [ ] 접근성 고려
- [ ] 성능 최적화 (캐싱, 지연 로딩)

## 🚀 성능 최적화 가이드

### 코드 분할 및 지연 로딩
```javascript
// 무거운 라이브러리 동적 임포트
const { default: QRCode } = await import('qrcode')

// 컴포넌트 지연 로딩
const AsyncComponent = defineAsyncComponent(() => import('~/components/Heavy.vue'))
```

### 캐싱 전략
```javascript
// 유틸리티 함수에서 캐싱 활용
static cache = new Map();

static processData(input) {
  if (this.cache.has(input)) {
    return this.cache.get(input);
  }
  // ... 처리 로직
}
```

### 메모리 관리
- 컴포넌트 언마운트 시 이벤트 리스너 정리
- 대용량 데이터 처리 후 캐시 정리
- 불필요한 반응성 데이터 최소화

이 가이드를 따라 개발하면 일관성 있고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
