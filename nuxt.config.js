// Nuxt 3 + Vuetify + Tailwind (JavaScript, no TypeScript)
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  ssr: true,
  css: [
    '@/assets/css/tailwind.css', 
    'vuetify/styles', 
    '@mdi/font/css/materialdesignicons.css',
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },
  nitro: {
    minify: process.env.NODE_ENV === 'production',          // 프로덕션에서만 minify
    compressPublicAssets: true,                    // 정적 에셋 gzip/br
    storage: { cache: { driver: 'memory' } },      // SSR 캐시 스토리지
    prerender: {
      crawlLinks: true,  // 링크 자동 크롤링으로 정적 생성
      routes: ['/']      // 미리 렌더링할 라우트
    }
  },
  experimental: {
    payloadExtraction: false,  // SSR에서는 payload 추출 비활성화
    inlineSSRStyles: true,     // 크리티컬 CSS 인라인
    renderJsonPayloads: true   // JSON payload 렌더링 최적화
  },
  compatibilityDate: '2024-04-03',
  
  // Site 설정
  site: {
    url: 'http://www.web-util.com'
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
        { property: 'og:url', content: 'http://www.web-util.com' },
        { name: 'robots', content: 'index, follow' },
        { name: 'naver-site-verification', content: '3322ede285ccfd87c679389722eac0eb8b41e0e9' },
        { name: 'google-site-verification', content: 'RK1XMQK_sHYw4ITO1qX8JvYERZqe_RTUL9ylIjivbMw' },
        { name: 'google-adsense-account', content: 'ca-pub-8305610158424209' }
      ],
      link: [
        { rel: 'canonical', href: 'http://www.web-util.com' }
      ]
    }
  },
  
  // Sitemap 설정
  sitemap: {
    hostname: 'http://www.web-util.com', // 실제 도메인으로 변경하세요
    gzip: true,
    routes: [
      {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      },
      {
        url: '/array-utils',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: '/color-utils',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: '/date-utils',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: '/json-utils',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      },
      {
        url: '/localstorage-utils',
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      },
      {
        url: '/number-utils',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: '/qr-generator',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        url: '/string-utils',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      },
      {
        url: '/timer',
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      },
      {
        url: '/timer-json',
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      }
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }
  }

})
