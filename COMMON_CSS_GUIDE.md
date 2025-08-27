# 공통 CSS 가이드

## 개요
Vue 컴포넌트들에서 중복되던 CSS 스타일을 `assets/css/common.css`로 추출하여 재사용성과 일관성을 개선했습니다.

## 공통 CSS 클래스 사용법

### 1. 기본 유틸리티 클래스
```vue
<template>
  <div class="font-mono">모노스페이스 폰트</div>
</template>
```

### 2. 트랜지션 클래스
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

### 3. 공통 입력 필드
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

### 4. 공통 카드 스타일
```vue
<template>
  <div class="common-card">
    <div class="common-card-header">제목</div>
    <div class="common-card-body">내용</div>
  </div>
</template>
```

### 5. 로딩 스피너
```vue
<template>
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <div class="loading-spinner small"></div>
    <div class="loading-spinner large"></div>
  </div>
</template>
```

### 6. 프로그레스 바
```vue
<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: '50%' }"></div>
  </div>
  
  <!-- 색상 변형 -->
  <div class="progress-bar">
    <div class="progress-fill success" :style="{ width: '75%' }"></div>
  </div>
</template>
```

### 7. 토스트/알림
```vue
<template>
  <div class="toast-base toast-success">성공 메시지</div>
  <div class="toast-base toast-error">오류 메시지</div>
  <div class="toast-base toast-info">정보 메시지</div>
  <div class="toast-base toast-warning">경고 메시지</div>
</template>
```

### 8. 모달/오버레이
```vue
<template>
  <div class="overlay">
    <div class="modal-container">
      <div class="modal-content">
        모달 내용
      </div>
    </div>
  </div>
</template>
```

### 9. 그리드 레이아웃
```vue
<template>
  <div class="grid-responsive">
    <div>항목 1</div>
    <div>항목 2</div>
    <div>항목 3</div>
  </div>
  
  <!-- 4열 그리드 -->
  <div class="grid-responsive cols-4">
    <div>항목 1</div>
    <div>항목 2</div>
    <div>항목 3</div>
    <div>항목 4</div>
  </div>
</template>
```

### 10. 상태 칩
```vue
<template>
  <span class="status-chip success">완료</span>
  <span class="status-chip error">오류</span>
  <span class="status-chip warning">주의</span>
  <span class="status-chip info">정보</span>
</template>
```

### 11. 반응형 유틸리티
```vue
<template>
  <div class="mobile-only">모바일에서만 표시</div>
  <div class="desktop-only">데스크톱에서만 표시</div>
</template>
```

### 12. 애니메이션
```vue
<template>
  <div class="bounce-in">바운스 인</div>
  <div class="shake">흔들기 효과</div>
</template>
```

## 수정된 컴포넌트들

### 이미 적용된 컴포넌트들:
- ✅ `layouts/default.vue` - 헤더, 레이아웃 스타일 정리
- ✅ `components/CopyInput.vue` - 공통 입력 필드 및 복사 버튼 스타일 적용
- ✅ `components/CopyTextArea.vue` - 공통 입력 필드 스타일 적용
- ✅ `components/LoadingState.vue` - 공통 로딩 스피너 및 프로그레스 바 적용
- ✅ `components/GroupPanel.vue` - 공통 트랜지션 적용
- ✅ `pages/timer.vue` - 공통 폰트 클래스 적용

### 주요 개선 사항:
1. **일관된 디자인**: 모든 컴포넌트에서 동일한 스타일 시스템 사용
2. **코드 중복 제거**: 반복되던 CSS 코드 대폭 감소
3. **유지보수성 향상**: 스타일 변경 시 한 곳에서만 수정
4. **다크모드 지원**: 자동 다크모드 스타일 적용
5. **반응형 디자인**: 일관된 브레이크포인트와 반응형 유틸리티
6. **접근성 개선**: 포커스 상태, 키보드 네비게이션 등 고려

## 사용 시 주의사항

1. **클래스 충돌**: 기존 scoped 스타일과 충돌하지 않도록 주의
2. **Specificity**: 필요한 경우 `!important` 또는 더 구체적인 선택자 사용
3. **브라우저 지원**: 최신 CSS 기능 사용 시 폴백 고려
4. **성능**: 사용하지 않는 클래스들은 주기적으로 정리

## 향후 계획

- [ ] 더 많은 페이지/컴포넌트에 공통 스타일 적용
- [ ] 테마 시스템 구축 (색상, 폰트 등)
- [ ] CSS 변수를 활용한 동적 테마 시스템
- [ ] 컴포넌트 라이브러리 구축
