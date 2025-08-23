// useAccordion.js - 아코디언 상태 관리 composable
import { ref } from 'vue';

/**
 * 아코디언 상태 관리를 위한 composable
 * @param {Object} initialState - 초기 상태 객체
 * @returns {Object} 상태와 토글 함수들
 */
export function useAccordion(initialState = {}) {
  // 각 아코디언의 상태를 개별적으로 관리
  const accordionStates = ref({ ...initialState });

  /**
   * 특정 아코디언 상태 토글
   * @param {string} key - 아코디언 키
   */
  const toggleAccordion = (key) => {
    accordionStates.value[key] = !accordionStates.value[key];
  };

  /**
   * 특정 아코디언 상태 설정
   * @param {string} key - 아코디언 키
   * @param {boolean} value - 설정할 값
   */
  const setAccordion = (key, value) => {
    accordionStates.value[key] = value;
  };

  /**
   * 모든 아코디언 열기
   */
  const openAll = () => {
    Object.keys(accordionStates.value).forEach(key => {
      accordionStates.value[key] = true;
    });
  };

  /**
   * 모든 아코디언 닫기
   */
  const closeAll = () => {
    Object.keys(accordionStates.value).forEach(key => {
      accordionStates.value[key] = false;
    });
  };

  return {
    accordionStates,
    toggleAccordion,
    setAccordion,
    openAll,
    closeAll
  };
}
