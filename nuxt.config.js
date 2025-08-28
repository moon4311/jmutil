// Nuxt 3 + Vuetify + Tailwind (JavaScript, no TypeScript)
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'], // '@nuxtjs/sitemap' 임시 비활성화
  ssr: true,
  css: [
    '@/assets/css/tailwind.css', 
    'vuetify/styles', 
    '@mdi/font/css/materialdesignicons.css',
  ],
  build: {
    transpile: ['vuetify', 'crypto-js', 'qrcode']
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
      'global': 'globalThis',
    },
    optimizeDeps: {
      include: ['crypto-js', 'qrcode'],
      exclude: ['@nuxt/kit']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // 벤더 라이브러리를 별도 청크로 분리
            'vendor-vue': ['vue', '@vue/runtime-core'],
            'vendor-nuxt': ['nuxt'],
            'vendor-ui': ['vuetify'],
            'vendor-utils': ['crypto-js', 'qrcode']
          }
        }
      },
      // 압축 및 최적화 설정
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
          pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : []
        }
      }
    }
  },
  nitro: {
    minify: process.env.NODE_ENV === 'production',
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    storage: { cache: { driver: 'memory' } },
    rollupConfig: {
      external: [],
      plugins: []
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/string/utils',
        '/string/storage', 
        '/string/number',
        '/string/date',
        '/data/json',
        '/data/csv',
        '/data/array',
        '/database/sql',
        '/database/sql-analyzer',
        '/database/mybatis-mapper',
        '/tools/color',
        '/tools/qr-generator',
        '/tools/timer',
        '/tools/timer-json'
      ]
    },
    // 정적 에셋 최적화
    publicAssets: [
      {
        dir: '~/assets/img',
        maxAge: 60 * 60 * 24 * 365, // 1년 캐시
        immutable: true
      }
    ]
  },
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false, // CSS 파일을 분리하여 캐싱 활용
    renderJsonPayloads: true,
    viewTransition: true, // 페이지 전환 애니메이션 최적화
    importProtection: false // import protection 비활성화
  },
  ssr: true,
  // 특정 페이지들을 클라이언트 전용으로 설정
  hooks: {
    'render:route': (url, result, context) => {
      const clientOnlyRoutes = ['/string/storage', '/tools/qr-generator'];
      if (clientOnlyRoutes.includes(url)) {
        result.html = result.html.replace('data-ssr="true"', 'data-ssr="false"');
      }
    }
  },
  compatibilityDate: '2024-04-03',
  
  // 런타임 최적화
  runtimeConfig: {
    public: {
      // 클라이언트에서 필요한 설정만 포함
      siteUrl: 'http://www.web-util.com'
    }
  },
  
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
  
  // Sitemap 설정 - 임시 비활성화하여 import 오류 해결
  /*
  sitemap: {
    hostname: 'http://www.web-util.com',
    gzip: true,
    routes: [
      '/', '/string/utils', '/string/storage', '/string/number', '/string/date',
      '/data/json', '/data/csv', '/data/array',
      '/database/sql', '/tools/color', '/tools/qr-generator', '/tools/timer', '/tools/timer-json'
    ]
  }
  */

})
