// 기존 URL을 새로운 구조로 리다이렉트하는 미들웨어
// 클라이언트 보조 리다이렉트 미들웨어
// 목적:
// - 서버 301이 처리하지 않는 클라이언트 내 라우터 전환 시 구 URL을 신 URL로 자연스럽게 연결
// - 로컬 개발/프리뷰 환경에서 nginx 없이도 구경로 호환 유지
// - 쿼리/해시 유지, 히스토리 오염 최소화
export default defineNuxtRouteMiddleware((to) => {
  const redirectMap = {
    '/string-utils': '/string/utils',
    '/localstorage-utils': '/string/storage',
    '/number-utils': '/string/number',
    '/date-utils': '/string/date',
    '/json-utils': '/data/json',
    '/csv-utils': '/data/csv',
    '/array-utils': '/data/array',
    '/sql-utils': '/database/sql',
    '/timer-json': '/tools/timer-json',
    '/color-utils': '/tools/color',
    '/timer': '/tools/timer',
    '/qr-generator': '/tools/qr-generator'
  }

  // SSR 비활성(CSR)이지만, 안전하게 서버 컨텍스트에서는 skip
  if (process.server) return

  // 트레일링 슬래시 정규화
  const rawPath = to.path || '/'
  const normalized = rawPath !== '/' && rawPath.endsWith('/')
    ? rawPath.slice(0, -1)
    : rawPath

  const target = redirectMap[normalized]
  if (!target) return

  // 동일 경로라면 무시(루프 방지)
  if (target === normalized) return

  // 쿼리/해시 보존, 히스토리 오염 최소화
  return navigateTo({ path: target, query: to.query, hash: to.hash }, { replace: true })
})
