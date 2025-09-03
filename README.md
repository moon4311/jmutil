# Web-Util - 자바스크립트 유틸리티 모음

한국어로 제공되는 온라인 개발자 도구 모음입니다. 문자열 변환, JSON 처리, 날짜 계산, QR 코드 생성 등 다양한 유틸리티를 웹에서 바로 사용할 수 있습니다.

## 🚀 주요 기능

- **문자열 도구**: 대소문자 변환, 공백 제거, 저장소 관리
- **데이터 도구**: JSON/CSV 변환, 배열 처리
- **데이터베이스 도구**: SQL 쿼리 생성기
- **기타 도구**: QR 코드, 색상 팔레트, 타이머

## 💻 기술 스택

- **Framework**: Nuxt 3 (CSR 모드)
- **UI**: Vuetify + Tailwind CSS
- **Language**: JavaScript (TypeScript 비활성)
- **Package Manager**: pnpm
- **Node Version**: 20.19.4

## 🛠 설치 및 실행

### 요구사항
- Node.js 20.19.4
- pnpm

### pnpm 설치
```bash
npm install -g pnpm
```

### 프로젝트 설정
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (localhost:80)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 미리보기
pnpm preview
```

## 📚 문서

- [프로젝트 기획서](docs/project-plan.md) - 프로젝트 개요 및 기능 명세
- [개발 가이드](docs/development-guide.md) - 개발 환경 설정 및 컨벤션
- [배포 가이드](docs/deployment-guide.md) - SEO 설정 및 검색엔진 등록
- [성능 최적화](docs/performance-optimization.md) - 성능 개선 이력
- [기술 감사](docs/technical-audit.md) - 시스템 진단 및 개선 방향

## 🎨 특징

- **반응형 디자인**: 모바일/데스크톱 최적화
- **다크 모드 지원**: 사용자 환경에 맞는 테마
- **복사 기능**: 모든 결과를 원클릭 복사
- **한국어 지원**: 완전한 한국어 인터페이스
- **SEO 최적화**: 검색엔진 친화적 구조
