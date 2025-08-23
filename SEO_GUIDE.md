# 검색 엔진 등록 가이드

## sitemap.xml 설정 완료

✅ `@nuxtjs/sitemap` 모듈이 설치되고 설정되었습니다.
✅ `nuxt.config.js`에 sitemap 설정이 추가되었습니다.
✅ `robots.txt` 파일이 생성되었습니다.
✅ SEO 메타 태그가 추가되었습니다.

## sitemap.xml 접근 경로

개발 환경: `http://localhost/sitemap.xml`
운영 환경: `https://your-domain.com/sitemap.xml`

## 검색 엔진 등록 방법

### 1. 구글 서치 콘솔 (Google Search Console)

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. 속성 추가 → URL 접두어에 사이트 도메인 입력
3. 소유권 확인 (HTML 태그 방법 추천)
   - `nuxt.config.js`의 `google-site-verification` 메타 태그에 확인 코드 입력
4. 사이트맵 제출
   - 왼쪽 메뉴에서 "사이트맵" 클릭
   - "새 사이트맵 추가"에 `sitemap.xml` 입력 후 제출

### 2. 네이버 웹마스터도구

1. [네이버 웹마스터도구](https://searchadvisor.naver.com/)에 접속
2. 사이트 등록 → 사이트 URL 입력
3. 사이트 소유확인
   - HTML 태그 방법: `nuxt.config.js`의 `naver-site-verification` 메타 태그에 확인 코드 입력
4. 사이트맵 제출
   - "요청" → "사이트맵 제출"에서 `https://your-domain.com/sitemap.xml` 입력

### 3. 빙 웹마스터 도구 (Bing Webmaster Tools)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters)에 접속
2. 사이트 추가 → URL 입력
3. 소유권 확인
4. 사이트맵 제출

## 설정해야 할 것들

### 1. 도메인 변경
`nuxt.config.js` 파일에서 다음 부분을 실제 도메인으로 변경하세요:
```javascript
sitemap: {
  hostname: 'https://your-domain.com', // 실제 도메인으로 변경
  // ...
}
```

### 2. 검증 코드 입력
구글과 네이버에서 받은 검증 코드를 `nuxt.config.js`에 입력하세요:
```javascript
{ name: 'naver-site-verification', content: 'your-naver-verification-code' },
{ name: 'google-site-verification', content: 'your-google-verification-code' }
```

### 3. robots.txt 도메인 변경
`public/robots.txt` 파일에서 Sitemap URL을 실제 도메인으로 변경하세요:
```
Sitemap: https://your-domain.com/sitemap.xml
```

## 포함된 페이지

현재 sitemap.xml에 포함된 페이지들:
- `/` (홈페이지) - 우선순위: 1.0, 매일 업데이트
- `/array-utils` - 배열 유틸리티
- `/color-utils` - 색상 유틸리티  
- `/date-utils` - 날짜 유틸리티
- `/json-utils` - JSON 유틸리티 (우선순위 높음: 0.9)
- `/localstorage-utils` - 로컬스토리지 유틸리티
- `/number-utils` - 숫자 유틸리티
- `/qr-generator` - QR 코드 생성기
- `/string-utils` - 문자열 유틸리티 (우선순위 높음: 0.9)
- `/timer` - 타이머
- `/timer-json` - 타이머 JSON

모든 페이지는 주간 업데이트 주기로 설정되어 있습니다.

## 추가 SEO 최적화

- 각 페이지별 메타 설명과 키워드 추가
- Open Graph 이미지 설정
- 구조화된 데이터 (JSON-LD) 추가
- 사이트 속도 최적화
- 모바일 친화적 디자인 확인
