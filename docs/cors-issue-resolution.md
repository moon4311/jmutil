# CORS 정책 문제 해결 가이드

## 문제 상황
```
Access to script at 'https://t1.daumcdn.net/kas/static/ba.min.js' from origin 'https://www.web-util.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 원인 분석
- **외부 도메인 스크립트**: AdFit 스크립트가 다른 도메인에서 제공됨
- **CORS 정책**: 브라우저의 동일 출처 정책(Same-Origin Policy)에 의한 차단
- **fetch() API 사용**: 일부 코드에서 fetch()로 스크립트를 로드하려 시도

## 해결 방안

### 1. Script 태그 방식 사용
```javascript
// ❌ 잘못된 방법 - fetch() 사용시 CORS 오류
const response = await fetch('https://t1.daumcdn.net/kas/static/ba.min.js')

// ✅ 올바른 방법 - script 태그 사용
const script = document.createElement('script')
script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'
script.crossOrigin = 'anonymous'
document.head.appendChild(script)
```

### 2. 서버 프록시 API 개선
```javascript
// /server/routes/api/proxy-ad-script.js
export default defineEventHandler(async (event) => {
  // CORS 헤더 설정
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (getMethod(event) === 'OPTIONS') {
    return ''
  }
  
  // 서버에서 스크립트 fetch (CORS 제한 없음)
  const response = await $fetch('https://t1.daumcdn.net/kas/static/ba.min.js', {
    responseType: 'text'
  })
  
  return response
})
```

### 3. 다중 로딩 전략
```javascript
const loadAdScript = async () => {
  try {
    // 1순위: 프록시를 통한 로딩
    const proxySuccess = await loadScriptViaProxy()
    if (proxySuccess) return true
    
    // 2순위: 직접 script 태그 로딩
    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
    
    return new Promise((resolve) => {
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
    })
  } catch (error) {
    console.warn('All loading methods failed:', error)
    return false
  }
}
```

### 4. useHead() 설정 개선
```javascript
// layouts/default.vue
useHead({
  script: [
    {
      src: '//t1.daumcdn.net/kas/static/ba.min.js',
      async: true,
      defer: true,
      crossorigin: 'anonymous'  // CORS 속성 추가
    }
  ]
})
```

## 구현된 해결책

### 1. 서버 프록시 개선
- **OPTIONS 요청 처리**: CORS preflight 요청 지원
- **적절한 헤더 설정**: Access-Control-* 헤더 완전 구성
- **$fetch 사용**: Nuxt의 내장 fetch로 안정성 향상

### 2. Script 태그 전용 로딩
- **fetch() 제거**: 모든 스크립트 로딩을 script 태그로 변경
- **crossOrigin 속성**: 명시적 CORS 설정
- **오류 처리**: 로딩 실패시 적절한 폴백

### 3. useLazyLoad 개선
```javascript
const lazyScript = (src, options = {}) => {
  const script = document.createElement('script')
  script.src = src
  script.crossOrigin = options.crossorigin || 'anonymous'
  
  return new Promise((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
```

### 4. AdSlot 컴포넌트 강화
```javascript
// CORS 안전한 폴백 로딩
await lazyScript('//t1.daumcdn.net/kas/static/ba.min.js', {
  crossorigin: 'anonymous',
  attributes: {
    'data-fallback-loaded': 'true'
  }
})
```

## 테스트 방법

### 1. 브라우저 개발자 도구
```javascript
// 콘솔에서 확인
console.log(document.querySelectorAll('script[src*="kas/static/ba.min.js"]'))
```

### 2. 네트워크 탭 확인
- AdFit 스크립트 요청이 200 OK로 성공하는지 확인
- CORS 오류가 없는지 확인

### 3. 디버그 패널 활용
```javascript
// 개발환경에서 자동 표시되는 디버그 패널 확인
localStorage.setItem('adDebug', 'true')
```

## 주의사항

### 1. Cloudflare Pages 배포
- API Routes가 제대로 작동하는지 확인
- 서버리스 함수 한계 확인

### 2. 성능 고려사항
- 프록시 로딩시 약간의 지연 발생 가능
- 캐싱 정책으로 반복 요청 최소화

### 3. 정책 준수
- AdFit 이용약관 준수
- CORS 우회가 서비스 정책에 위배되지 않는지 확인

## 향후 개선사항

1. **CDN 캐싱**: 프록시된 스크립트의 CDN 캐싱
2. **리얼타임 모니터링**: CORS 오류 실시간 감지
3. **A/B 테스팅**: 로딩 방식별 성공률 비교
4. **자동 복구**: 오류 발생시 자동 재시도 로직