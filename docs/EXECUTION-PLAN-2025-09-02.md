## 실행 플랜 (우선순위 정렬, 따라하기용)

본 문서는 우선순위대로 하나씩 진행할 수 있도록 구체 단계와 체크리스트를 제공합니다. Windows(CMD) 기준 명령을 병기합니다.

### P0. 빠른 안정화 패치 (로컬 즉시 적용)
체크리스트
- [ ] `utils/JsonUtil.js`의 `jsonToCsv` 비동기 버그 수정 적용 확인
- [ ] `package.json`의 `clean` Windows 호환으로 교체, `build:report` 경로 수정

검증
- [ ] pnpm install/빌드 정상 동작
- [ ] CSV/JSON 페이지에서 변환 기능 동작

### P1. HTTPS 전환 및 URL 일관화
체크리스트
- [ ] 인증서 적용(Cloudflare/Let's Encrypt 등)
- [ ] nginx 80 → 443 리다이렉트(301), HSTS 적용
- [ ] `nuxt.config.js`의 site.url, canonical, og:url, sitemap.hostname을 https로 변경
- [ ] robots.txt의 Sitemap URL https 확인

검증
- [ ] http 접속 시 https로 301 이동 확인
- [ ] canonical/OG가 https로 노출 확인

### P2. 서버 301 리다이렉트 맵 도입
체크리스트
- [ ] nginx `map` 또는 `rewrite`로 구 URL → 신 URL 301 구성
- [ ] Nuxt 미들웨어는 보조 유지(클라이언트 내비게이션 시 이점)

검증
- [ ] 검색엔진 테스트 도구로 301 확인
- [ ] 구 URL 직접 입력 시 상태코드 301

### P3. 보안/성능 헤더 및 압축
체크리스트
- [ ] CSP를 출처별 화이트리스트로 세분화(script/img/style/frame-ancestors)
- [ ] Brotli on, gzip 병행
- [ ] 캐시: HTML no-store, 해시 포함 자산 immutable, 폰트/아이콘 max-age 단축
- [ ] `try_files` 단순화로 라우팅 블록 정리

검증
- [ ] securityheaders.com 점수 확인
- [ ] Lighthouse 성능/최적화 재측정

### P4. SEO 정합성 및 자동화
체크리스트
- [ ] sitemap 자동 라우트 수집 활성화 또는 생성 로직 개선
- [ ] 페이지별 meta/og 보강(도구별 키워드/설명/이미지)
- [ ] 구조화 데이터(FAQ/SoftwareApplication)

검증
- [ ] 구글 Search Console 색인 현황 개선 추적

### P5. 대용량 처리 UX(Worker)
체크리스트
- [ ] Web Worker 기반 JSON 포맷/CSV 변환/정렬/필터 구현
- [ ] 취소/진행률/에러 핸들링 추가

검증
- [ ] 10MB급 JSON 입력 시 UI 프리즈 없는지 확인

### P6. 광고 최적화
체크리스트
- [ ] Lazy + IntersectionObserver로 뷰포트 진입 시 로드
- [ ] 고정 플레이스홀더로 CLS 보호
- [ ] 위치/빈도 A/B 테스트 설계

검증
- [ ] LCP/CLS가 악화되지 않는지 모니터링

### P7. 데이터/분석 파이프라인
체크리스트
- [ ] pageview/툴 이벤트/복사 클릭/광고 가시성 로깅 API 추가(server/api)
- [ ] 주간 리포트 스크립트 및 대시보드 초안

검증
- [ ] 이벤트 수집률/지연/오류율 확인

### P8. 국제화/브랜딩
체크리스트
- [ ] 핵심 툴 영문 UI 동시 제공(i18n)
- [ ] 상단 프로필 영역 정리 및 브랜드 일관화

검증
- [ ] 언어 토글/자동 감지 동작

---

## 빠른 실행 명령(선택)
Windows CMD
```
pnpm i
pnpm build
pnpm preview
```

문제 발생 시
```
pnpm run clean
pnpm i
```
