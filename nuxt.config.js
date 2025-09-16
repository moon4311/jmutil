// Nuxt 3 + Vuetify + Tailwind (JavaScript, no TypeScript) - CSR 최적화
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

function scanPageRoutes(pagesDir) {
  const routes = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      const st = statSync(full)
      if (st.isDirectory()) {
        walk(full)
      } else if (st.isFile() && /\.vue$/i.test(entry)) {
        const rel = relative(pagesDir, full).replace(/\\/g, '/').replace(/\.vue$/i, '')
        let path = '/' + rel
        // Nuxt 파일 기반 라우팅 규칙 반영
        if (path.endsWith('/index')) path = path.slice(0, -('/index'.length)) || '/'
        routes.push(path)
      }
    }
  }
  walk(pagesDir)
  // 중복 제거 및 정렬
  return Array.from(new Set(routes)).sort()
}

const discoveredRoutes = scanPageRoutes(join(process.cwd(), 'pages'))

// Route Rules 설정
const routeRulesSettings = {
  // 홈페이지는 SSR (SEO 중요)
  '/': { ssr: true, prerender: true },
  // 카테고리 페이지들은 SSR
  '/data/**': { ssr: true },
  '/string/**': { ssr: true },
  '/tools/**': { ssr: true },
  '/database/**': { ssr: true },
  // API 라우트는 SPA
  '/api/**': { ssr: false },
  // 관리자 페이지는 SPA
  '/admin/**': { ssr: false }
}

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  
  // Tailwind CSS 설정
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },
  
  ssr: true, // SSR 활성화로 초기 로딩 개선
  nitro: {
    // Cloudflare Pages 최적화
    preset: 'cloudflare-pages',
    compressPublicAssets: true,
    minify: true,
    experimental: {
      wasm: false
    },
    // Cloudflare 환경 변수 지원
    runtimeConfig: {
      public: {
        siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.web-util.com'
      }
    }
  },
  css: [
    // 필수 CSS만 로드
    '@mdi/font/css/materialdesignicons.min.css', // MDI 아이콘 폰트
    '~/assets/css/common.css', // 경량화된 공통 CSS
    '~/assets/css/tailwind.css'
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
          // 더 세밀한 청크 분리 및 최적화
          manualChunks: (id) => {
            // Vendor 라이브러리 분리
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue-vendor';
              if (id.includes('vuetify')) return 'vuetify-vendor';
              if (id.includes('qrcode')) return 'qrcode-vendor';
              if (id.includes('crypto-js')) return 'crypto-vendor';
              return 'vendor';
            }
            
            // Utils 분리
            if (id.includes('/utils/')) {
              if (id.includes('JsonUtil') || id.includes('CsvUtil')) return 'data-utils';
              if (id.includes('StringUtil') || id.includes('DateUtil')) return 'text-utils';
              if (id.includes('ColorUtil') || id.includes('SqlUtil')) return 'tool-utils';
              return 'base-utils';
            }
            
            // Composables 분리
            if (id.includes('/composables/')) {
              return 'composables';
            }
            
            // Components 분리
            if (id.includes('/components/')) {
              return 'components';
            }
          }
        }
      },
      chunkSizeWarningLimit: 300, // 더 작은 청크 크기 경고
      minify: 'esbuild',
      target: 'es2020',
      sourcemap: false,
      cssCodeSplit: true, // CSS 코드 분할 활성화
      reportCompressedSize: false // 빌드 시간 단축
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      treeShaking: true,
      target: 'es2020'
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vue/runtime-core'],
      exclude: ['qrcode', 'crypto-js'], // 동적 로딩으로 처리
      esbuildOptions: {
        target: 'es2020'
      }
    },
    // 개발 서버 최적화
    server: {
      hmr: {
        overlay: false // 성능 향상을 위해 오버레이 비활성화
      }
    },
    // Cloudflare Workers 호환성
    commonjsOptions: {
      include: [/crypto-js/, /node_modules/]
    }
  },
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: true, // Critical CSS 인라인화
    renderJsonPayloads: false,
    treeshakeClientOnly: true,
    componentIslands: true, // Islands 아키텍처 활용
    viewTransition: true // 페이지 전환 최적화
  },
  // 하이브리드 렌더링 설정 (분리된 설정 사용)
  routeRules: routeRulesSettings,
  
  // 런타임 설정 (Cloudflare 환경 변수 통합)
  runtimeConfig: {
    // 서버 사이드 전용 환경 변수
    apiSecret: process.env.API_SECRET,
    
    // 클라이언트에서도 접근 가능한 환경 변수
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.web-util.com',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      naverSiteVerification: process.env.NUXT_PUBLIC_NAVER_SITE_VERIFICATION || '3322ede285ccfd87c679389722eac0eb8b41e0e9',
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'RK1XMQK_sHYw4ITO1qX8JvYERZqe_RTUL9ylIjivbMw',
      googleAdsenseAccount: process.env.NUXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT || 'ca-pub-8305610158424209',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      devMode: process.env.NUXT_PUBLIC_DEV_MODE === 'true'
    }
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
  
  // Generate 설정 (SSR 환경에서 사용 빈도 낮음, 참고용 유지)
  generate: {
    routes: discoveredRoutes,
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
        { rel: 'canonical', href: 'https://www.web-util.com' }
        // MDI 폰트는 CSS에서 직접 로딩
      ]
    }
  },
  
  // Sitemap 설정 (페이지 자동 수집)
  sitemap: {
    hostname: 'https://www.web-util.com',
    gzip: true,
    routes: discoveredRoutes,
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }
  }

})
