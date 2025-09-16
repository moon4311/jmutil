/**
 * AdFit 스크립트 프록시 API (CORS 문제 해결)
 * 광고 차단기 우회를 위해 서버에서 스크립트를 프록시
 */
export default defineEventHandler(async (event) => {
  try {
    // CORS 헤더 설정
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
    setHeader(event, 'Content-Type', 'application/javascript; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // 1시간 캐시
    
    // OPTIONS 요청 처리 (CORS preflight)
    if (getMethod(event) === 'OPTIONS') {
      return ''
    }

    // 원본 스크립트 URL
    const originalUrl = 'https://t1.daumcdn.net/kas/static/ba.min.js'
    
    // 외부 스크립트 fetch (서버에서 실행되므로 CORS 제한 없음)
    const response = await $fetch(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/javascript, text/javascript, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Referer': getHeader(event, 'referer') || 'https://www.web-util.com'
      },
      timeout: 10000,
      responseType: 'text'
    })

    if (!response) {
      throw new Error('Empty response from AdFit server')
    }

    let scriptContent = response
    
    // 스크립트 내용 후처리
    scriptContent = `/* Proxied AdFit Script - ${new Date().toISOString()} */\n${scriptContent}`
    
    // AdFit 초기화 코드 추가 (강화된 버전)
    scriptContent += `

/* AdFit 프록시 초기화 코드 */
if (typeof window !== 'undefined') {
  // 프록시 로드 표시
  window._adfit_proxy_loaded = true;
  console.log('AdFit proxy script loaded successfully');
  
  // 초기화 함수
  function initializeAdFitProxy() {
    console.log('AdFit proxy: Starting initialization...');
    
    // 모든 광고 유닛 찾기
    const adUnits = document.querySelectorAll('[data-ad-unit], ins[data-ad-unit]');
    console.log('AdFit proxy: Found', adUnits.length, 'ad units');
    
    if (adUnits.length === 0) {
      console.log('AdFit proxy: No ad units found, retrying in 1 second...');
      setTimeout(initializeAdFitProxy, 1000);
      return;
    }
    
    adUnits.forEach(function(unit, index) {
      // 광고 요소 가시성 보장
      unit.style.display = 'block';
      unit.style.visibility = 'visible';
      unit.style.opacity = '1';
      unit.style.width = unit.style.width || '100%';
      unit.style.height = unit.style.height || 'auto';
      unit.style.minHeight = unit.style.minHeight || '100px';
      
      console.log('AdFit proxy: Processed unit', index + 1, unit);
      
      // AdFit 렌더링 시도 (여러 방법)
      setTimeout(function() {
        try {
          if (window.adfit && typeof window.adfit.render === 'function') {
            window.adfit.render(unit);
            console.log('AdFit proxy: Rendered unit', index + 1, 'with adfit.render');
          } else if (window.adfit && typeof window.adfit.refresh === 'function') {
            window.adfit.refresh();
            console.log('AdFit proxy: Refreshed all ads with adfit.refresh');
          }
        } catch (e) {
          console.warn('AdFit proxy: Render failed for unit', index + 1, e);
        }
      }, index * 100);
    });
    
    // 전역 광고 새로고침 시도
    setTimeout(function() {
      try {
        if (window.adfit && typeof window.adfit.refresh === 'function') {
          window.adfit.refresh();
          console.log('AdFit proxy: Global refresh completed');
        }
      } catch (e) {
        console.warn('AdFit proxy: Global refresh failed', e);
      }
    }, 1000);
  }
  
  // DOM 준비 상태에 따른 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdFitProxy);
  } else {
    initializeAdFitProxy();
  }
  
  // 추가 안전장치: 재시도 메커니즘
  setTimeout(initializeAdFitProxy, 2000);
  setTimeout(initializeAdFitProxy, 5000);
}

/* AdFit 프록시 초기화 코드 끝 */
`

    // 개발 환경에서 추가 로깅
    if (process.env.NODE_ENV === 'development') {
      scriptContent = `console.log('AdFit script loaded via proxy');\\n${scriptContent}`
    }

    return scriptContent

  } catch (error) {
    console.error('AdFit proxy error:', error)
    
    // 에러 시 대체 스크립트 반환
    const errorScript = `
      console.warn('AdFit proxy failed: ${error.message}');
      // 대체 광고 처리 로직
      if (typeof window !== 'undefined') {
        const adElements = document.querySelectorAll('[data-ad-unit]');
        adElements.forEach(function(el) {
          if (el.innerHTML.trim() === '') {
            el.innerHTML = '<div style="background:#f5f5f5;padding:20px;text-align:center;color:#999;border-radius:4px;min-height:100px;display:flex;align-items:center;justify-content:center;">광고</div>';
            el.style.display = 'block';
          }
        });
      }
    `
    
    return errorScript
  }
})