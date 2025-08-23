// useErrorHandler.js - 전역 에러 처리 composable
import { ref } from 'vue';

/**
 * 에러 처리를 위한 composable
 * @returns {Object} 에러 처리 관련 함수들과 상태
 */
export function useErrorHandler() {
  const errors = ref([]);
  const isLoading = ref(false);

  /**
   * 에러 추가
   * @param {Error|string} error - 에러 객체 또는 메시지
   * @param {string} [context=''] - 에러 발생 컨텍스트
   */
  const addError = (error, context = '') => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorObj = {
      id: Date.now() + Math.random(),
      message: errorMessage,
      context,
      timestamp: new Date().toISOString()
    };
    
    errors.value.push(errorObj);
    
    // 에러 로깅
    console.error(`[${context}] ${errorMessage}`, error);
  };

  /**
   * 에러 제거
   * @param {number} id - 에러 ID
   */
  const removeError = (id) => {
    const index = errors.value.findIndex(error => error.id === id);
    if (index !== -1) {
      errors.value.splice(index, 1);
    }
  };

  /**
   * 모든 에러 제거
   */
  const clearErrors = () => {
    errors.value = [];
  };

  /**
   * 안전한 비동기 함수 실행
   * @param {Function} fn - 실행할 함수
   * @param {string} [context=''] - 에러 발생 컨텍스트
   * @param {boolean} [showLoading=true] - 로딩 상태 표시 여부
   * @returns {Promise<any>} 함수 실행 결과
   */
  const safeExecute = async (fn, context = '', showLoading = true) => {
    if (showLoading) isLoading.value = true;
    
    try {
      const result = await fn();
      return result;
    } catch (error) {
      addError(error, context);
      throw error;
    } finally {
      if (showLoading) isLoading.value = false;
    }
  };

  /**
   * 안전한 동기 함수 실행
   * @param {Function} fn - 실행할 함수
   * @param {string} [context=''] - 에러 발생 컨텍스트
   * @param {any} [fallback=null] - 에러 시 반환할 기본값
   * @returns {any} 함수 실행 결과 또는 기본값
   */
  const safeSyncExecute = (fn, context = '', fallback = null) => {
    try {
      return fn();
    } catch (error) {
      addError(error, context);
      return fallback;
    }
  };

  /**
   * API 에러 처리
   * @param {Response} response - fetch Response 객체
   * @param {string} [context='API 호출'] - 에러 발생 컨텍스트
   */
  const handleApiError = async (response, context = 'API 호출') => {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      
      throw new Error(errorMessage);
    }
  };

  /**
   * 사용자 친화적 에러 메시지 생성
   * @param {Error|string} error - 에러 객체 또는 메시지
   * @param {string} [defaultMessage='알 수 없는 오류가 발생했습니다'] - 기본 메시지
   * @returns {string} 사용자 친화적 에러 메시지
   */
  const getUserFriendlyMessage = (error, defaultMessage = '알 수 없는 오류가 발생했습니다') => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // 일반적인 에러 패턴들을 사용자 친화적 메시지로 변환
    const errorMappings = {
      'NetworkError': '네트워크 연결을 확인해주세요',
      'JSON 파싱 오류': 'JSON 형식이 올바르지 않습니다',
      'Unexpected token': 'JSON 형식이 올바르지 않습니다',
      'fetch': '서버 연결에 실패했습니다'
    };

    for (const [key, value] of Object.entries(errorMappings)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }

    return errorMessage || defaultMessage;
  };

  return {
    errors,
    isLoading,
    addError,
    removeError,
    clearErrors,
    safeExecute,
    safeSyncExecute,
    handleApiError,
    getUserFriendlyMessage
  };
}
