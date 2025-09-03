# 기술 감사 및 개선 계획 - Web-Util

## 📊 시스템 현황 분석 (2025-09-02)

### 개요
- **대상**: Nuxt 4 + Vuetify + Tailwind, CSR 구성(SSR 비활성)
- **범위**: 서버 구축, 프로그래밍, 비즈니스 관점 진단 및 개선 방향

## 🔍 발견된 문제점

### 서버 구축 관점
**문제점**
- HTTPS 미사용: nuxt 설정과 meta/canonical/OG/sitemap 모두 http 사용 → 보안/SEO/신뢰도 저하
- 301 리다이렉트가 클라이언트 미들웨어에 한정되어 HTTP 301 헤더 부재 → SEO 이점 상실
- CSP 과도 허용: default-src에 'unsafe-inline', 도메인 범위 광범위 → XSS/무분별 로드 위험
- 압축: gzip만 활성, br 미사용
- 캐싱: 모든 정적자산 1년 immutable 패턴(해시 없는 파일/HTML에 적용 위험)
- 라우팅: location 블록 복잡 → 유지보수성 저하

### 프로그래밍 관점
**문제점**
- CSR 강제와 문서 대비 불일치(SSR 최적화 언급 vs ssr:false)
- JsonUtil 비동기 버그: `jsonToCsv`에서 Promise를 await하지 않음(사용 시 실패 가능)
- 캐시 키로 원문 전체 사용 → 메모리/GC 부담, 해시 필요
- 대용량 JSON 처리 시 메인 스레드 프리즈 가능(Web Worker 부재)
- 스크립트 오류: `build:report`가 존재하지 않는 파일 경로 참조, `clean`이 Windows 비호환(`rm -rf`)
- SEO 신호 불일치: canonical/OG/sitemap이 http

### 비즈니스 관점
**문제점**
- SEO 신호 약함: CSR + http + 클라이언트 리다이렉트 + 수동 sitemap routes → 색인/랭킹 손실
- 광고 수익 최적화 미흡: LCP/CLS 영향 관리 및 A/B 테스트 부재
- 로깅/분석 부재: server/api 비어 있음 → 인사이트 부족
- 글로벌 확장성 낮음: 한국어 전용
- 브랜딩/신뢰도: http, UI 내 개인 닉네임 노출 등

## 🚀 개선 방향

### 서버 구축 개선
- HTTPS 전환 및 강제(HSTS, includeSubDomains, preload), 모든 URL을 https로 통일
- 서버 301 리다이렉트 맵 도입(nginx 또는 Nitro routeRules)
- CSP 세분화(script-src/style-src/img-src/frame-ancestors 등), 필요한 출처만 화이트리스트, nonce/hash 기반 인라인 허용 전환
- Brotli 활성화(gzip 병행)
- 캐시 정책 구분: HTML no-store, 해시 포함 자산만 immutable, 폰트/아이콘 등은 짧은 max-age
- nginx 라우팅 단순화: `try_files $uri $uri/ /index.html;`로 통합

### 프로그래밍 개선
- SSR/Hybrid 재검토: 홈/카테고리만 SSR(점진), 도구 페이지는 CSR 유지 또는 프리렌더 확대
- `jsonToCsv`를 async로 수정하고 일관된 비동기 사용
- 캐시 키 해시화(SHA-1/MD5 등) + 캐시 통계 노출
- Web Worker로 포맷/CSV/정렬/필터 옮기기, 진행률/취소 지원
- 스크립트 정비: Windows 호환(`rimraf`), 분석 스크립트 경로 수정
- SEO 정합성: https 통일 및 도구별 메타/OG

### 비즈니스 개선
- SEO 강화: https, 서버 301, sitemap 자동화, 구조화 데이터(FAQ/SoftwareApplication), 도구별 OG 이미지
- 광고 최적화: A/B 테스트 프레임워크, Core Web Vitals 모니터링, 광고 위치/크기 최적화
- 분석 강화: 사용 패턴 추적, 도구별 인기도 측정, 사용자 경로 분석
- 글로벌화 준비: i18n 도입, 영문 콘텐츠, 다국가 SEO
- 브랜딩 개선: 전문적인 UI/UX, 회사명/서비스명 통일, About 페이지

## 📋 실행 계획 (우선순위별)

### P0. 빠른 안정화 패치 (즉시 적용)
**체크리스트**
- [x] `utils/JsonUtil.js`의 `jsonToCsv` 비동기 버그 수정
- [x] `package.json`의 `clean` Windows 호환으로 교체, `build:report` 경로 수정

**검증**
- [x] pnpm install/빌드 정상 동작
- [ ] CSV/JSON 페이지에서 변환 기능 동작 확인

### P1. HTTPS 전환 및 URL 일관화
**체크리스트**
- [ ] 인증서 적용(Cloudflare/Let's Encrypt 등)
- [ ] nginx 80 → 443 리다이렉트(301), HSTS 적용
- [ ] `nuxt.config.js`의 site.url, canonical, og:url, sitemap.hostname을 https로 변경
- [ ] robots.txt의 Sitemap URL https 확인

**검증**
- [ ] http 접속 시 https로 301 이동 확인
- [ ] canonical/OG가 https로 노출 확인

### P2. 서버 301 리다이렉트 맵 도입
**체크리스트**
- [ ] nginx `rewrite`로 구 URL → 신 URL 301 구성
- [ ] Nuxt 미들웨어는 보조 유지(클라이언트 내 내비게이션 시 쿼리/해시 보존, 루프 방지)

**검증**
- [ ] 검색엔진 테스트 도구로 301 확인
- [ ] 구 URL 직접 입력 시 상태코드 301

### P3. 보안/성능 헤더 및 압축
**체크리스트**
- [ ] CSP를 출처별 화이트리스트로 세분화(script/img/style/frame-ancestors)
- [ ] Brotli on, gzip 병행
- [ ] 캐시: HTML no-store, 해시 포함 자산 immutable, 폰트/아이콘 max-age 단축
- [ ] `try_files` 단순화로 라우팅 블록 정리

**검증**
- [ ] securityheaders.com 점수 확인
- [ ] Lighthouse 성능/최적화 재측정

### P4. 프로그래밍 품질 개선
**체크리스트**
- [ ] `jsonToCsv` async 수정 및 일관된 비동기 패턴 적용
- [ ] 캐시 키 해시화 구현
- [ ] Web Worker 도입 검토 (JSON 처리)
- [ ] SEO 메타 태그 통일 (https)

**검증**
- [ ] 비동기 처리 정상 작동 확인
- [ ] 메모리 사용량 개선 확인
- [ ] 대용량 데이터 처리 성능 측정

### P5. SEO 및 분석 강화
**체크리스트**
- [ ] 구조화 데이터 추가 (JSON-LD)
- [ ] 도구별 개별 OG 이미지 생성
- [ ] Google Analytics/네이버 애널리틱스 연동
- [ ] 사용자 행동 추적 구현

**검증**
- [ ] 구글 검색 결과 리치 스니펫 확인
- [ ] 분석 데이터 수집 확인

### P6. 장기 개선 (3-6개월)
**체크리스트**
- [ ] SSR/Hybrid 모드 검토 및 적용
- [ ] 다국어 지원 (i18n) 구현
- [ ] 광고 수익 최적화 A/B 테스트
- [ ] 브랜딩 및 UI/UX 개선

## 🔧 기술 부채 관리

### 코드 품질
- [ ] TypeScript 도입 검토
- [ ] 단위 테스트 추가
- [ ] 코드 리뷰 프로세스 구축
- [ ] 의존성 정기 업데이트 계획

### 모니터링
- [ ] 에러 추적 시스템 (Sentry)
- [ ] 성능 모니터링 대시보드
- [ ] 사용자 피드백 수집 시스템
- [ ] 서비스 상태 페이지

### 보안
- [ ] 보안 스캔 자동화
- [ ] 의존성 취약점 검사
- [ ] OWASP 보안 가이드라인 준수
- [ ] 정기 보안 감사

## 📊 성과 측정 지표

### 기술 지표
- **페이지 로드 속도**: 3초 이내
- **Lighthouse 점수**: 90점 이상
- **Core Web Vitals**: Good 등급
- **보안 헤더 점수**: A+ 등급

### 비즈니스 지표
- **월간 활성 사용자**: 현재 대비 30% 증가
- **검색 트래픽**: 50% 증가
- **사용자 만족도**: 4.5/5.0 이상
- **페이지 이탈률**: 60% 이하

이 계획을 단계별로 실행하여 안정적이고 성능 좋은 서비스로 개선할 수 있습니다.
