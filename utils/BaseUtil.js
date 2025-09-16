/**
 * 경량화된 기본 유틸리티 클래스
 */
export class BaseUtil {
  constructor(cacheSize = 50) {
    this.cache = new Map();
    this.maxCacheSize = cacheSize;
  }

  /**
   * 간단한 캐시 조회
   */
  getCached(key) {
    return this.cache.get(key) || null;
  }

  /**
   * 간단한 캐시 저장
   */
  setCached(key, value) {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  /**
   * 기본 입력 검증
   */
  validateInput(input, type = 'string') {
    if (input === null || input === undefined) {
      throw new Error('입력값이 필요합니다.');
    }
    
    if (type === 'string' && typeof input !== 'string') {
      throw new Error('문자열이 필요합니다.');
    }
    
    return true;
  }

  /**
   * 기본 에러 메시지
   */
  getErrorMessage(error) {
    return error.message || '오류가 발생했습니다.';
  }

  /**
   * 캐시 초기화
   */
  clearCache() {
    this.cache.clear();
  }
}
