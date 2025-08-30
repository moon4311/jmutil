/**
 * 모든 유틸리티의 기본 클래스
 * 캐싱, 검증, 성능 최적화 기능 제공
 */
export class BaseUtil {
  constructor(cacheSize = 100, ttl = 5 * 60 * 1000) {
    this.cache = new Map()
    this.maxCacheSize = cacheSize
    this.cacheTtl = ttl
    this.cacheHits = 0
    this.cacheMisses = 0
  }

  /**
   * 캐시에서 값 가져오기
   */
  getCached(key) {
    const item = this.cache.get(key)
    if (!item) {
      this.cacheMisses++
      return null
    }
    
    if (Date.now() - item.timestamp > this.cacheTtl) {
      this.cache.delete(key)
      this.cacheMisses++
      return null
    }
    
    this.cacheHits++
    return item.value
  }

  /**
   * 캐시에 값 저장
   */
  setCached(key, value) {
    // LRU 방식으로 캐시 관리
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  /**
   * 입력 검증
   */
  validateInput(input, type = 'string', options = {}) {
    if (input === null || input === undefined) {
      throw new Error('입력값이 필요합니다.')
    }

    if (options.maxLength && input.length > options.maxLength) {
      throw new Error(`입력값이 너무 깁니다. 최대 ${options.maxLength}자까지 가능합니다.`)
    }

    switch (type) {
      case 'string':
        if (typeof input !== 'string') {
          throw new Error('문자열 형태의 입력값이 필요합니다.')
        }
        return true
      case 'object':
        if (typeof input !== 'object') {
          throw new Error('객체 형태의 입력값이 필요합니다.')
        }
        return true
      case 'array':
        if (!Array.isArray(input)) {
          throw new Error('배열 형태의 입력값이 필요합니다.')
        }
        return true
      default:
        return true
    }
  }

  /**
   * 캐시 통계
   */
  getCacheStats() {
    const totalRequests = this.cacheHits + this.cacheMisses
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: totalRequests > 0 ? (this.cacheHits / totalRequests * 100).toFixed(2) + '%' : '0%'
    }
  }

  /**
   * 캐시 초기화
   */
  clearCache() {
    this.cache.clear()
    this.cacheHits = 0
    this.cacheMisses = 0
  }

  /**
   * 성능 측정 래퍼
   */
  async measurePerformance(fn, label = 'operation') {
    const start = performance.now()
    
    try {
      const result = await fn()
      const end = performance.now()
      
      // 개발 모드에서만 로깅
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const end = performance.now()
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${label} failed after ${(end - start).toFixed(2)}ms:`, error.message)
      }
      
      throw error
    }
  }
}
