# Nuxt 3 + Vuetify + Tailwind (JavaScript, pnpm)

## pnpm 설치 방법

`pnpm`이 설치되어 있지 않다면, 아래 명령어로 전역 설치할 수 있습니다:

```bash
npm install -g pnpm
```

## 요구사항
- Node 20.19.4
- pnpm

## 설치
```bash
pnpm install
pnpm dev
```

## 빌드 방법

### 개발 서버 실행
```bash
pnpm dev
```

### 프로덕션 빌드
```bash
pnpm build
```

### 프로덕션 빌드 미리보기
```bash
pnpm preview
```

## 특징
- TypeScript 비활성 (JS 전용)
- Tailwind는 Nuxt 모듈 사용 (CLI init 불필요)
- Vuetify 플러그인(`plugins/vuetify.client.js`)과 `<v-app>` 루트 래핑
- Tailwind 팔레트로 Vuetify 테마 통일
