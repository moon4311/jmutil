<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Cloudflare 런타임 설정
const { $config } = useNuxtApp()
const config = useRuntimeConfig()

// Critical path 최적화
useSeoMeta({
  title: 'Web-Util - 온라인 도구 모음',
  description: '웹 작업자를 위한 필수 온라인 도구 모음. JSON 포맷팅, 문자열 변환, 날짜 변환 등 다양한 개발 유틸리티를 무료로 제공합니다.',
  ogUrl: config.public.siteUrl,
  twitterCard: 'summary_large_image'
})

// 리소스 힌트 최적화
useHead({
  link: [
    // DNS prefetch for external resources
    { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
    { rel: 'dns-prefetch', href: '//t1.daumcdn.net' },
    // Preconnect for critical resources
    { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
    // CSS 파일들을 public 폴더에서 로드
    { rel: 'stylesheet', href: '/css/critical.css' },
    { rel: 'stylesheet', href: '/css/common.css' },
    // Canonical URL
    { rel: 'canonical', href: config.public.siteUrl }
  ]
})
</script>
