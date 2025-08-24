// Nuxt 3 + Vuetify + Tailwind (JavaScript, no TypeScript)
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
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
    minify: process.env.NODE_ENV === 'production',          // dev는 보통 끔
    compressPublicAssets: true,                    // 정적 에셋 gzip/br
    storage: { cache: { driver: 'memory' } }       // SSR 캐시 스토리지
  },
  experimental: {
    payloadExtraction: true,   // 초기 페이로드 분리
    inlineSSRStyles: true      // 크리티컬 CSS 인라인
  },
  compatibilityDate: '2024-04-03',
  
  // SEO 설정
  app: {
    head: {
      title: 'Web-Util - 웹 유틸리티 모음',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '다양한 유틸리티 도구: JSON, 문자열, 숫자, 날짜, 색상, 배열 유틸리티 및 QR 코드 생성기' },
        { name: 'keywords', content: 'JSON 유틸리티, 문자열 도구, 인코딩, QR 코드 생성기, 날짜 유틸리티, 색상 도구' },
        { name: 'author', content: 'WebUtil' },
        { property: 'og:title', content: 'WebUtil - 웹 유틸리티 모음' },
        { property: 'og:description', content: '웹 개발자를 위한 다양한 유틸리티 도구모음' },
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
