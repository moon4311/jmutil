// Nuxt 3 + Vuetify + Tailwind (JavaScript, no TypeScript) - CSR 최적화
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  ssr: true, // SSR 서버 실행 (nginx 프록시 대상)
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/common.css',
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 메인 페이지에서 분리할 청크들
            'vuetify-components': ['vuetify/components'],
            'heavy-utils': ['~/utils/JsonUtil.js', '~/utils/CsvUtil.js', '~/utils/SqlUtil.js'],
            'light-utils': ['~/utils/StringUtil.js', '~/utils/DateUtil.js'],
            'vendor-heavy': ['qrcode', 'crypto-js'],
            'vendor-light': ['vue']
          }
        }
      },
      chunkSizeWarningLimit: 800, // 더 작은 청크 크기로 설정
      minify: 'esbuild'
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    },
    // 메인 페이지 최적화를 위한 설정
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: ['qrcode', 'crypto-js'] // 메인 페이지에서 불필요한 의존성 제외
    }
  },
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: false,
    treeshakeClientOnly: true,
    componentIslands: false
  },
  // Trailing slash 설정 - nginx와 호환성을 위해
  trailingSlash: false,
  
  // Router 설정
  router: {
    options: {
      hashMode: false,
      linkActiveClass: 'active-link',
      linkExactActiveClass: 'exact-active-link'
    }
  },
  
  // Generate 설정 (정적 사이트 생성)
  generate: {
    routes: [
      '/',
      '/data/json',
      '/data/csv', 
      '/data/array',
      '/database/sql',
      '/string/utils',
      '/string/date',
      '/string/number',
      '/string/storage',
      '/tools/color',
      '/tools/qr-generator',
      '/tools/timer',
      '/tools/timer-json'
    ],
    fallback: '404.html'
  },
  compatibilityDate: '2024-04-03',
  
  // Site 설정
  site: {
    url: 'https://www.web-util.com'
  },
  
  // SEO 설정
  app: {
    head: {
      title: 'Web-Util - 온라인 도구 모음',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '웹 작업자를 위한 필수 온라인 도구 모음. JSON 포맷팅/압축/CSV변환, 문자열 케이스변환/Base64/URL인코딩, 날짜 타임스탬프 변환, 진법변환, HEX/RGB 색상변환, 배열 가공, QR코드 생성기, 타이머, 로컬스토리지 관리 등 다양한 개발 유틸리티를 무료로 제공합니다.' },
        { name: 'keywords', content: 'JSON 포맷팅, JSON 압축, JSON CSV 변환, Base64 인코딩, URL 인코딩, 문자열 변환, 케이스 변환, camelCase, snake_case, 타임스탬프 변환, Unix timestamp, 날짜 변환, 진법 변환, 16진수, HEX RGB 변환, 색상 도구, 배열 중복제거, 배열 평탄화, QR코드 생성기, 개발도구, 웹개발, 프로그래밍 도구, 온라인 유틸리티, 개발자 도구, 무료 웹 툴' },
        { name: 'author', content: 'WebUtil' },
        { property: 'og:title', content: '온라인 유틸리티 도구 모음 - Web-Util' },
        { property: 'og:description', content: 'JSON 포맷팅, Base64 인코딩, 날짜 변환, 색상 변환, QR코드 생성 등 개발 작업에 필요한 다양한 온라인 도구를 무료로 제공하는 웹 유틸리티 사이트입니다.' },
        { property: 'og:type', content: 'website' },
  { property: 'og:url', content: 'https://www.web-util.com' },
        { name: 'robots', content: 'index, follow' },
        { name: 'naver-site-verification', content: '3322ede285ccfd87c679389722eac0eb8b41e0e9' },
        { name: 'google-site-verification', content: 'RK1XMQK_sHYw4ITO1qX8JvYERZqe_RTUL9ylIjivbMw' },
        { name: 'google-adsense-account', content: 'ca-pub-8305610158424209' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.web-util.com' },
        { 
          rel: 'stylesheet', 
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css',
          integrity: 'sha384-rD/hsKwBgzQV4RmixJJ06XlWccvKW1JzxXePOPeCvWNO5kbh7Vfmu8NF9LJOJUQh',
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  
  // Sitemap 설정 (CSR 최적화)
  sitemap: {
    hostname: 'https://www.web-util.com',
    gzip: true,
    routes: [
      '/',
      '/data/json',
      '/data/csv', 
      '/data/array',
      '/database/sql',
      '/string/utils',
      '/string/date',
      '/string/number',
      '/string/storage',
      '/tools/color',
      '/tools/qr-generator',
      '/tools/timer',
      '/tools/timer-json'
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }
  }

})
