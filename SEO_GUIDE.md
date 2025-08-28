# 검색 엔진 등록 가이드

## sitemap.xml 설정 완료

✅ `@nuxtjs/sitemap` 모듈이 설치되고 설정되었습니다.  
✅ `nuxt.config.js`에 sitemap 설정이 추가되었습니다.  
✅ `robots.txt` 파일이 생성되었습니다.  
✅ SEO 메타 태그가 추가되었습니다.  

## sitemap.xml 접근 경로

**개발 환경**: `http://localhost/sitemap.xml`  
**운영 환경**: `https://your-domain.com/sitemap.xml`

## 현재 포함된 페이지들

### 문자열 도구
- `/string/utils` - 문자열 변환
- `/string/storage` - 문자열 저장  
- `/string/number` - 숫자 변환
- `/string/date` - 날짜/시간

### 데이터/객체 도구
- `/data/json` - JSON 가공 (우선순위 높음: 0.9)
- `/data/csv` - CSV/JSON 변환
- `/data/array` - 배열 처리

### 데이터베이스 도구
- `/database/sql` - SQL 쿼리 생성기
- `/database/sql-analyzer` - SQL 쿼리 분석기
- `/database/mybatis-mapper` - MyBatis Mapper 생성

### 도구들
- `/tools/timer-json` - 타이머 JSON 생성
- `/tools/color` - 색상 유틸리티
- `/tools/timer` - 타이머
- `/tools/qr-generator` - QR코드 생성기

모든 페이지는 주간 업데이트 주기로 설정되어 있습니다.

## 검색 엔진 등록 방법

### 1. 구글 서치 콘솔
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → 도메인 입력
3. 소유권 확인 후 사이트맵 제출: `sitemap.xml`

### 2. 네이버 웹마스터도구  
1. [네이버 웹마스터도구](https://searchadvisor.naver.com/) 접속
2. 사이트 등록 및 소유권 확인
3. 사이트맵 제출: `https://your-domain.com/sitemap.xml`

### 3. 빙 웹마스터 도구
1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. 사이트 추가 및 확인
3. 사이트맵 제출

## 설정 변경사항

### ⚠️ 도메인 업데이트 필요
`nuxt.config.js`에서 실제 도메인으로 변경:
```javascript
sitemap: {
  hostname: 'https://your-domain.com', // 실제 도메인으로 변경
}
```

### 검증 코드 입력
```javascript
{ name: 'naver-site-verification', content: 'your-naver-verification-code' },
{ name: 'google-site-verification', content: 'your-google-verification-code' }
```

✅ **SEO 설정 완료** - 검색 엔진 등록 준비됨
