# Cloudflare Pages 배포 가이드

## 🚀 Cloudflare Pages 배포 방법

### 1. 사전 준비

1. **Cloudflare 계정 생성**
   - [Cloudflare](https://dash.cloudflare.com/)에서 계정 생성
   - Pages 메뉴로 이동

2. **Wrangler CLI 설치 및 로그인**
   ```bash
   pnpm install -g wrangler
   wrangler login
   ```

### 2. 프로젝트 설정

1. **환경 변수 설정** (`.env.production` 파일 생성)
   ```bash
   NUXT_PUBLIC_SITE_URL=https://your-domain.com
   NUXT_PUBLIC_NAVER_SITE_VERIFICATION=your-naver-verification
   NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification
   NUXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT=your-adsense-id
   ```

2. **wrangler.toml 파일 수정**
   - 프로젝트명과 도메인을 실제 값으로 변경

### 3. 빌드 및 배포

#### 로컬에서 빌드하여 배포
```bash
# Cloudflare용 빌드
pnpm build:cloudflare

# 로컬에서 미리보기
pnpm preview:cloudflare

# Cloudflare Pages에 배포
pnpm deploy:cloudflare
```

#### GitHub 연동 자동 배포 (추천)

1. **GitHub 저장소와 연결**
   - Cloudflare Pages 대시보드에서 "Create a project" 클릭
   - GitHub 저장소 선택

2. **빌드 설정**
   ```
   Framework preset: Nuxt.js
   Build command: pnpm install && pnpm build:cloudflare
   Build output directory: .output/public
   Root directory: /
   Environment variables: 환경 변수 설정
   ```

3. **환경 변수 설정**
   Cloudflare Pages 대시보드 > Settings > Environment variables에서 설정:
   ```
   NODE_VERSION=20.19.4
   PNPM_VERSION=9
   NUXT_PUBLIC_SITE_URL=https://your-domain.com
   NUXT_PUBLIC_NAVER_SITE_VERIFICATION=your-verification
   NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification
   NUXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT=your-adsense-id
   ```

### 4. 도메인 설정

1. **커스텀 도메인 연결**
   - Pages 대시보드 > Custom domains
   - 도메인 추가 및 DNS 설정

2. **SSL/TLS 설정**
   - 자동으로 Let's Encrypt 인증서 발급
   - HTTPS 리다이렉트 활성화

### 5. 성능 최적화

#### Cloudflare 기능 활용
- **자동 최소화**: HTML, CSS, JS 자동 압축
- **Brotli 압축**: 고성능 압축 활성화
- **이미지 최적화**: Polish 기능 활성화
- **캐싱 규칙**: 정적 자산 장기 캐싱

#### 설정 확인
```bash
# 빌드 크기 확인
pnpm build:analyze

# 성능 벤치마크
pnpm benchmark
```

### 6. 모니터링 및 분석

1. **Cloudflare Analytics**
   - 트래픽 분석
   - 성능 모니터링
   - 보안 이벤트 추적

2. **Web Vitals 모니터링**
   - Core Web Vitals 추적
   - 실제 사용자 경험 데이터

### 7. 트러블슈팅

#### 일반적인 문제들

1. **빌드 실패**
   ```bash
   # 캐시 정리 후 재빌드
   pnpm clean
   pnpm install
   pnpm build:cloudflare
   ```

2. **CSS 파일 404 오류**
   - `public/_headers` 파일 확인
   - 정적 자산 경로 확인

3. **환경 변수 미적용**
   - Cloudflare Pages 설정에서 환경 변수 재확인
   - 빌드 로그에서 변수 로딩 확인

#### 유용한 명령어
```bash
# 로컬 Cloudflare 환경 테스트
wrangler pages dev .output/public

# 배포 상태 확인
wrangler pages deployment list

# 로그 확인
wrangler pages deployment tail
```

### 8. 보안 설정

- **CSP 헤더**: `public/_headers`에서 설정
- **HSTS**: Cloudflare SSL/TLS 설정에서 활성화
- **보안 헤더**: 자동으로 적용되는 보안 헤더들

### 9. 백업 및 롤백

- **자동 백업**: GitHub 저장소가 백업 역할
- **즉시 롤백**: 이전 배포 버전으로 즉시 롤백 가능
- **브랜치 배포**: 스테이징 환경 구성 가능

## 📊 예상 성능

- **초기 로딩 시간**: < 1초
- **LCP (Largest Contentful Paint)**: < 2.5초  
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **전 세계 CDN**: 300+ 지역에서 서비스