# 배포 가이드 - Web-Util

## 🚀 배포 준비

### 1. 프로덕션 빌드
```bash
# 의존성 설치
pnpm install

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### 2. 환경 설정
배포 전에 `nuxt.config.js`에서 다음 설정을 실제 도메인으로 변경하세요:

```javascript
// nuxt.config.js
export default defineNuxtConfig({
  site: {
    url: 'https://your-domain.com', // 실제 도메인으로 변경
  },
  
  app: {
    head: {
      link: [
        { rel: 'canonical', href: 'https://your-domain.com' } // 실제 도메인으로 변경
      ]
    }
  },
  
  sitemap: {
    hostname: 'https://your-domain.com', // 실제 도메인으로 변경
    // ...
  }
})
```

## 🔍 SEO 최적화

### sitemap.xml 설정 완료
✅ `@nuxtjs/sitemap` 모듈이 설치되고 설정되었습니다.
✅ `nuxt.config.js`에 sitemap 설정이 추가되었습니다.
✅ `robots.txt` 파일이 생성되었습니다.
✅ SEO 메타 태그가 추가되었습니다.

### sitemap.xml 접근 경로
- 개발 환경: `http://localhost/sitemap.xml`
- 운영 환경: `https://your-domain.com/sitemap.xml`

## 🔐 보안 설정

### HTTPS 설정
1. **SSL 인증서 획득**
   - Let's Encrypt (무료)
   - Cloudflare (무료)
   - 상용 SSL 인증서

2. **서버 설정 (nginx 예시)**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # HSTS 설정
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### CSP (Content Security Policy) 설정
```javascript
// nuxt.config.js
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'script-src': ["'self'", "'unsafe-inline'", "https://t1.kakaocdn.net"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        'img-src': ["'self'", "data:", "https:"],
      }
    }
  }
})
```

## 🔍 검색 엔진 등록

### 1. 구글 서치 콘솔 (Google Search Console)

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. 속성 추가 → URL 접두어에 사이트 도메인 입력
3. 소유권 확인 (HTML 태그 방법 권장)
   ```javascript
   // nuxt.config.js에서 메타 태그 추가
   app: {
     head: {
       meta: [
         { name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE' }
       ]
     }
   }
   ```
4. 사이트맵 제출
   - 왼쪽 메뉴에서 "사이트맵" 클릭
   - "새 사이트맵 추가"에 `sitemap.xml` 입력 후 제출

### 2. 네이버 웹마스터도구

1. [네이버 웹마스터도구](https://searchadvisor.naver.com/)에 접속
2. 사이트 등록 → 사이트 URL 입력
3. 사이트 소유확인
   ```javascript
   // nuxt.config.js에서 메타 태그 추가
   app: {
     head: {
       meta: [
         { name: 'naver-site-verification', content: 'YOUR_VERIFICATION_CODE' }
       ]
     }
   }
   ```
4. 사이트맵 제출
   - "요청" → "사이트맵 제출"에서 `https://your-domain.com/sitemap.xml` 입력

### 3. 빙 웹마스터 도구 (Bing Webmaster Tools)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters)에 접속
2. 사이트 추가 → URL 입력
3. 소유권 확인 및 사이트맵 제출

## 📊 분석 도구 설정

### Google Analytics 4 설정
```javascript
// nuxt.config.js
export default defineNuxtConfig({
  gtag: {
    id: 'G-XXXXXXXXXX' // 실제 GA4 측정 ID로 변경
  }
})
```

### 네이버 애널리틱스
```javascript
// nuxt.config.js에서 스크립트 추가
app: {
  head: {
    script: [
      {
        src: 'https://wcs.naver.net/wcslog.js',
        async: true
      }
    ]
  }
}
```

## 🚀 성능 최적화

### 1. 압축 설정 (nginx)
```nginx
# Gzip 압축
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss;

# Brotli 압축 (모듈 설치 필요)
brotli on;
brotli_comp_level 6;
brotli_types
    text/plain
    text/css
    application/json
    application/javascript
    text/xml
    application/xml;
```

### 2. 캐싱 설정
```nginx
# 정적 에셋 캐싱
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 캐싱 (짧게)
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

### 3. CDN 설정
주요 CDN 서비스:
- **Cloudflare**: 무료 플랜 제공, 한국 서버 포함
- **AWS CloudFront**: AWS 생태계와 연동
- **네이버 클라우드**: 한국 특화 CDN

## 🔧 배포 자동화

### GitHub Actions를 이용한 자동 배포
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.19.4'
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm build
      
    - name: Deploy
      run: |
        # 서버로 파일 전송 및 재시작 스크립트
        # rsync, scp 등 활용
```

## 📋 배포 체크리스트

### 배포 전 확인사항
- [ ] 실제 도메인으로 URL 설정 변경
- [ ] HTTPS 인증서 설치 및 강제 리다이렉트 설정
- [ ] 환경변수 설정 (API 키, DB 연결 등)
- [ ] 보안 헤더 설정 (CSP, HSTS 등)
- [ ] 에러 페이지 설정 (404, 500 등)

### 배포 후 확인사항
- [ ] 사이트 정상 접속 확인
- [ ] HTTPS 접속 및 리다이렉트 확인
- [ ] sitemap.xml 접근 가능 확인
- [ ] robots.txt 접근 가능 확인
- [ ] 주요 페이지 로딩 속도 체크
- [ ] 모바일 반응형 확인

### SEO 확인사항
- [ ] 구글 서치 콘솔에서 사이트맵 제출
- [ ] 네이버 웹마스터도구에서 사이트맵 제출
- [ ] 메타 태그 정상 출력 확인
- [ ] 구조화 데이터 (JSON-LD) 확인
- [ ] 페이지 타이틀 및 설명 최적화 확인

## 🔍 모니터링 및 유지보수

### 성능 모니터링 도구
- **Google PageSpeed Insights**: 성능 점수 및 개선 제안
- **GTmetrix**: 상세한 성능 분석
- **Lighthouse**: 종합적인 웹사이트 품질 평가

### 에러 모니터링
- **Sentry**: JavaScript 에러 추적
- **LogRocket**: 사용자 세션 재생
- **서버 로그**: nginx, PM2 로그 모니터링

### 정기 점검 항목
- [ ] SSL 인증서 만료일 확인
- [ ] 보안 패치 적용
- [ ] 의존성 업데이트
- [ ] 백업 상태 확인
- [ ] 성능 지표 분석

이 가이드를 따라 배포하면 안정적이고 최적화된 서비스를 운영할 수 있습니다.
