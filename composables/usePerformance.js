// usePerformance.js - 경량화된 성능 composable
import { ref } from 'vue';

/**
 * 경량화된 성능 측정 composable
 */
export function usePerformance() {
  const metrics = ref({});

  /**
   * 간단한 시간 측정
   */
  const measureTime = async (fn, label = 'operation') => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      metrics.value[label] = duration;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * 기본 디바운스
   */
  const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  /**
   * 기본 쓰로틀
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

  return {
    metrics,
    measureTime,
    debounce,
    throttle
  };
}