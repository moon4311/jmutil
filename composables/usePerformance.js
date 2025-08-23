// usePerformance.js - 성능 최적화 관련 composable
import { ref, computed } from 'vue';

/**
 * 성능 최적화를 위한 composable
 * @returns {Object} 성능 관련 함수들과 상태
 */
export function usePerformance() {
  const performanceMetrics = ref({});
  const isOptimizationEnabled = ref(true);

  /**
   * 함수 실행 시간 측정
   * @param {Function} fn - 측정할 함수
   * @param {string} label - 측정 레이블
   * @returns {Promise<any>} 함수 실행 결과
   */
  const measureTime = async (fn, label = 'operation') => {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performanceMetrics.value[label] = {
        duration: Math.round(duration * 100) / 100,
        timestamp: new Date().toISOString()
      };
      
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performanceMetrics.value[label] = {
        duration: Math.round(duration * 100) / 100,
        timestamp: new Date().toISOString(),
        error: true
      };
      
      throw error;
    }
  };

  /**
   * 메모이제이션 캐시
   */
  const memoCache = new Map();

  /**
   * 함수 메모이제이션
   * @param {Function} fn - 메모이제이션할 함수
   * @param {Function} [keyGenerator] - 캐시 키 생성 함수
   * @returns {Function} 메모이제이션된 함수
   */
  const memoize = (fn, keyGenerator) => {
    return (...args) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (memoCache.has(key)) {
        return memoCache.get(key);
      }
      
      const result = fn(...args);
      memoCache.set(key, result);
      
      // 캐시 크기 제한 (1000개)
      if (memoCache.size > 1000) {
        const firstKey = memoCache.keys().next().value;
        memoCache.delete(firstKey);
      }
      
      return result;
    };
  };

  /**
   * 디바운스 함수
   * @param {Function} fn - 디바운스할 함수
   * @param {number} delay - 지연 시간 (ms)
   * @returns {Function} 디바운스된 함수
   */
  const debounce = (fn, delay = 300) => {
    let timeoutId;
    
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  /**
   * 쓰로틀 함수
   * @param {Function} fn - 쓰로틀할 함수
   * @param {number} limit - 제한 시간 (ms)
   * @returns {Function} 쓰로틀된 함수
   */
  const throttle = (fn, limit = 100) => {
    let inThrottle;
    
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /**
   * 큰 배열을 청크 단위로 처리
   * @param {Array} array - 처리할 배열
   * @param {Function} processor - 각 청크를 처리할 함수
   * @param {number} [chunkSize=1000] - 청크 크기
   * @returns {Promise<Array>} 처리 결과 배열
   */
  const processLargeArray = async (array, processor, chunkSize = 1000) => {
    const results = [];
    
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      const chunkResult = await processor(chunk);
      results.push(...chunkResult);
      
      // 다음 청크 처리 전에 브라우저에게 제어권 양보
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  };

  /**
   * Virtual Scrolling을 위한 가시 영역 계산
   * @param {Object} config - 설정 { containerHeight, itemHeight, itemCount, scrollTop }
   * @returns {Object} { startIndex, endIndex, offsetY }
   */
  const calculateVisibleRange = (config) => {
    const { containerHeight, itemHeight, itemCount, scrollTop } = config;
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      itemCount - 1
    );
    
    const offsetY = startIndex * itemHeight;
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex: Math.max(0, endIndex),
      offsetY
    };
  };

  /**
   * 메모리 사용량 모니터링 (가능한 경우)
   */
  const getMemoryInfo = () => {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  };

  /**
   * 캐시 정리
   */
  const clearCache = () => {
    memoCache.clear();
  };

  /**
   * 성능 메트릭 리셋
   */
  const resetMetrics = () => {
    performanceMetrics.value = {};
  };

  return {
    performanceMetrics,
    isOptimizationEnabled,
    measureTime,
    memoize,
    debounce,
    throttle,
    processLargeArray,
    calculateVisibleRange,
    getMemoryInfo,
    clearCache,
    resetMetrics
  };
}
