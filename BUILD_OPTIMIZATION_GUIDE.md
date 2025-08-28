# 빌드 및 배포 최적화 가이드

## 1. 빌드 최적화 설정

### 적용된 최적화 사항

#### A. Vite 빌드 최적화
- **청크 분할(Code Splitting)**: 라이브러리별로 청크를 분리하여 캐싱 효율성 향상
  - `vendor-vue`: Vue 관련 라이브러리
  - `vendor-nuxt`: Nuxt 프레임워크
  - `vendor-ui`: Vuetify UI 라이브러리
  - `vendor-utils`: 유틸리티 라이브러리 (crypto-js, qrcode)

- **Terser 압축**: JavaScript 코드 압축 및 최적화
  - 프로덕션에서 console.log, debugger 제거
  - 불필요한 공백, 주석 제거

#### B. Nitro 서버 최적화
- **에셋 압축**: gzip, brotli 압축 활성화
- **정적 생성**: 주요 페이지 사전 렌더링
- **에셋 캐싱**: 이미지 파일 1년 캐시 설정

#### C. 실험적 기능 활용
- **View Transition**: 페이지 전환 애니메이션 최적화
- **JSON Payload**: 렌더링 최적화
- **CSS 분리**: 캐시 활용을 위한 CSS 파일 분리

## 2. 빌드 명령어

### 개발 환경
```bash
# 개발 서버 실행
pnpm dev

# 빌드 분석 (번들 크기 확인)
pnpm build:analyze
```

### 프로덕션 환경
```bash
# 프로덕션 빌드 (최적화된 빌드)
pnpm build:production

# 정적 사이트 생성 (SSG)
pnpm generate

# 빌드 파일 정리
pnpm clean
```

## 3. 성능 최적화 체크리스트

### ✅ 완료된 최적화
- [x] 코드 스플리팅 및 청크 분할
- [x] JavaScript/CSS 압축
- [x] 정적 에셋 압축 (gzip, brotli)
- [x] 주요 페이지 사전 렌더링 (SSG)
- [x] 이미지 캐시 헤더 설정
- [x] 불필요한 console.log 제거
- [x] 메뉴 데이터를 JSON 파일로 분리
- [x] 컴포넌트 lazy loading 준비

### 📋 추가 권장 사항

#### A. 이미지 최적화
```bash
# WebP 형식으로 이미지 변환 권장
# 이미지 크기 최적화 도구 사용
```

#### B. PWA 적용 고려
```bash
# @nuxtjs/pwa 모듈 추가 검토
pnpm add @nuxtjs/pwa
```

#### C. CDN 활용
- 정적 에셋을 CDN에 배포하여 전송 속도 향상
- 주요 라이브러리를 CDN에서 로드 고려

## 4. 번들 크기 분석

### 현재 예상 번들 크기
- **Main Bundle**: ~200KB (gzipped)
- **Vendor Chunks**: ~300KB (gzipped)  
- **CSS**: ~50KB (gzipped)

### 크기 확인 방법
```bash
# 빌드 후 .output/public 디렉토리 확인
pnpm build:production
ls -la .output/public/_nuxt/
```

## 5. 배포 시 권장사항

### A. 서버 설정
```nginx
# nginx 설정 예시
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}

# gzip 압축 활성화
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### B. 환경변수 설정
```bash
# .env 파일
NODE_ENV=production
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 6. 성능 모니터링

### A. Core Web Vitals 확인
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms  
- Cumulative Layout Shift (CLS): < 0.1

### B. 도구 활용
- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- WebPageTest

## 7. 예상 성능 개선 효과

### 최적화 전/후 비교
- **번들 크기**: 30-40% 감소 예상
- **로딩 속도**: 2-3초 단축 예상  
- **캐시 효율성**: 80% 향상 예상
- **Core Web Vitals**: 모든 지표 "Good" 달성 예상

이 최적화를 통해 사용자 경험이 크게 향상되고 SEO 성능도 개선될 것으로 예상됩니다.
