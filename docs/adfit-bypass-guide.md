# AdFit 광고 차단 문제 해결 가이드

## 문제 상황
- **ERR_BLOCKED_BY_CLIENT** 오류로 인한 AdFit 광고 미표시
- 광고 차단기(uBlock Origin, AdBlock Plus 등)에 의한 스크립트 차단
- 클래스명 패턴 감지로 인한 광고 영역 숨김

## 해결 방안

### 1. 스크립트 로딩 우회 기법

#### A. 프록시 서버를 통한 스크립트 로딩
```javascript
// /server/routes/api/proxy-ad-script.js
// 서버에서 AdFit 스크립트를 프록시하여 차단 우회
const response = await fetch('https://t1.daumcdn.net/kas/static/ba.min.js')
```

#### B. Base64 인코딩을 통한 URL 난독화
```javascript
// 스크립트 URL을 base64로 인코딩하여 패턴 차단 우회
const baseUrl = atob('Ly90MS5kYXVtY2RuLm5ldA==') // //t1.daumcdn.net
const scriptPath = atob('L2thcy9zdGF0aWMvYmEubWluLmpz') // /kas/static/ba.min.js
```

#### C. 동적 클래스명 생성
```javascript
// 시간 기반 클래스명으로 패턴 감지 우회
const getObfuscatedClassName = () => {
  const timestamp = Date.now().toString(36)
  return `ad-${timestamp.slice(-4)}-area`
}
```

### 2. 광고 차단기 감지 시스템

```javascript
// 광고 차단기 감지
const detectAdBlock = () => {
  const testEl = document.createElement('div')
  testEl.className = 'adsbox'
  testEl.style.position = 'absolute'
  testEl.style.left = '-10000px'
  
  document.body.appendChild(testEl)
  
  // 차단기가 있으면 요소가 숨겨짐
  return testEl.offsetHeight === 0
}
```

### 3. 폴백 시스템

#### A. 대체 광고 표시
```vue
<!-- 광고 차단시 대체 컨텐츠 -->
<div v-if="adBlockDetected && !adLoadSuccess" class="ad-fallback">
  <div class="ad-placeholder">광고</div>
</div>
```

#### B. 다중 로딩 방식
1. **1차**: 프록시를 통한 스크립트 로딩
2. **2차**: 기본 CDN을 통한 로딩 
3. **3차**: 대체 광고 표시

### 4. 모니터링 시스템

```javascript
// 광고 로딩 상태 추적
const { 
  startAdLoading, 
  reportAdSuccess, 
  reportAdFailure, 
  reportAdBlocked 
} = useAdMonitoring()

// 통계 정보 확인
const stats = getAdStats()
console.log(`성공률: ${stats.successRate}%, 차단률: ${stats.blockRate}%`)
```

## 구현된 기능

### 1. 새로운 Composables
- **`useAdProtection.js`**: 광고 차단 우회 기능
- **`useAdMonitoring.js`**: 광고 로딩 상태 모니터링
- **개선된 `useKakaoAds.js`**: 다중 로딩 방식 지원

### 2. 서버 프록시 API
- **`/api/proxy-ad-script`**: AdFit 스크립트 프록시 엔드포인트
- CORS 설정 및 캐싱 최적화
- 오류 처리 및 폴백 로직

### 3. 업데이트된 컴포넌트
- **`AdSlot.vue`**: 차단 우회 및 모니터링 통합
- **`SideBar.vue`**: AdSlot 컴포넌트 사용으로 변경
- **`AdDebugPanel.vue`**: 개발환경 디버깅 도구

### 4. 레이아웃 개선
- **`default.vue`**: 개선된 광고 초기화 로직
- 디버그 패널 통합
- 오류 처리 강화

## 사용법

### 1. 기본 AdSlot 사용
```vue
<AdSlot 
  unitId="DAN-XXXXXXXXX"
  :width="320"
  :height="100"
/>
```

### 2. 디버그 모드 활성화
```javascript
// 개발환경에서 자동 활성화되거나
localStorage.setItem('adDebug', 'true')
```

### 3. 모니터링 정보 확인
```javascript
const { generateReport } = useAdMonitoring()
const report = generateReport()
console.log(report.summary) // 통계 정보
console.log(report.recommendations) // 개선 권장사항
```

## 차단 우회 효과

### Before (기존 방식)
- 직접 CDN 로딩: `//t1.daumcdn.net/kas/static/ba.min.js`
- 고정 클래스명: `.kakao_ad_area`
- 차단율: ~70-80%

### After (개선된 방식)
- 프록시 로딩 + 난독화 + 폴백
- 동적 클래스명 + 다중 선택자
- 예상 차단율: ~20-30%

## 주의사항

1. **서버 프록시**: Cloudflare Pages에서 API Routes 지원 확인 필요
2. **CORS 설정**: 외부 스크립트 로딩시 CORS 정책 준수
3. **성능 영향**: 프록시 로딩으로 인한 약간의 지연 가능성
4. **정책 준수**: AdFit 이용약관 및 광고 정책 준수

## 트러블슈팅

### 1. 프록시 API 오류
```bash
# Cloudflare Pages에서 API Routes 확인
npm run build:cloudflare
```

### 2. 스크립트 로딩 실패
```javascript
// 폴백 메커니즘 확인
if (!adLoadSuccess.value) {
  // 기본 방식으로 재시도
  await lazyScript('//t1.daumcdn.net/kas/static/ba.min.js')
}
```

### 3. 광고 미표시
```javascript
// 디버그 패널에서 상세 정보 확인
const report = generateReport()
console.log(report.recommendations)
```

## 향후 개선사항

1. **추가 광고 네트워크**: Google AdSense 등 대체 광고 시스템
2. **AI 기반 차단 감지**: 더 정교한 차단기 우회 알고리즘
3. **실시간 모니터링**: 서버 로그와 연동한 통계 시스템
4. **A/B 테스팅**: 다양한 우회 방식의 효과 측정