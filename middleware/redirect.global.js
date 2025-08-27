// 기존 URL을 새로운 구조로 리다이렉트하는 미들웨어
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

  if (redirectMap[to.path]) {
    return navigateTo(redirectMap[to.path], { redirectCode: 301 })
  }
})
