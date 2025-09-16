/**
 * AdFit 스크립트 프록시 API
 * 광고 차단기 우회를 위해 서버에서 스크립트를 프록시
 */
export default defineEventHandler(async (event) => {
  try {
    // CORS 헤더 설정
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Content-Type', 'application/javascript; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // 1시간 캐시

    // 원본 스크립트 URL
    const originalUrl = 'https://t1.daumcdn.net/kas/static/ba.min.js'
    
    // 외부 스크립트 fetch
    const response = await fetch(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/javascript, text/javascript, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Referer': process.env.NUXT_PUBLIC_SITE_URL || 'https://jmutil.com'
      },
      timeout: 10000
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    let scriptContent = await response.text()
    
    // 스크립트 내용 후처리 (선택적)
    // 광고 차단기가 특정 패턴을 찾는 경우를 대비한 난독화
    scriptContent = scriptContent.replace(/kakao/gi, 'k4k40')
    scriptContent = scriptContent.replace(/adfit/gi, '4df1t')
    
    // 디버깅 정보 추가 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      scriptContent = `console.log('AdFit script loaded via proxy'); ${scriptContent}`
    }

    return scriptContent

  } catch (error) {
    console.error('AdFit 스크립트 프록시 오류:', error)
    
    // 오류 발생 시 빈 스크립트 반환 (페이지 깨짐 방지)
    setResponseStatus(event, 500)
    return `console.warn('AdFit script proxy failed: ${error.message}');`
  }
})