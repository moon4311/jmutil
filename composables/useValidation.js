// useValidation.js - 유효성 검사 관련 composable
import { ref, computed } from 'vue';

/**
 * 유효성 검사를 위한 composable
 * @returns {Object} 검증 관련 함수들과 상태
 */
export function useValidation() {
  const errors = ref({});
  const isValidating = ref(false);

  /**
   * 특정 필드의 에러 상태 확인
   * @param {string} field - 필드명
   */
  const hasError = (field) => {
    return computed(() => !!errors.value[field]);
  };

  /**
   * 특정 필드의 에러 메시지 가져오기
   * @param {string} field - 필드명
   */
  const getError = (field) => {
    return computed(() => errors.value[field] || '');
  };

  /**
   * 에러 설정
   * @param {string} field - 필드명
   * @param {string} message - 에러 메시지
   */
  const setError = (field, message) => {
    errors.value[field] = message;
  };

  /**
   * 에러 제거
   * @param {string} field - 필드명
   */
  const clearError = (field) => {
    delete errors.value[field];
  };

  /**
   * 모든 에러 제거
   */
  const clearAllErrors = () => {
    errors.value = {};
  };

  /**
   * 전체 유효성 상태
   */
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  /**
   * JSON 유효성 검사
   * @param {string} jsonStr - 검사할 JSON 문자열
   * @returns {Object} { isValid, error, parsed }
   */
  const validateJson = (jsonStr) => {
    try {
      if (!jsonStr || jsonStr.trim() === '') {
        return {
          isValid: false,
          error: 'JSON 문자열이 비어있습니다',
          parsed: null
        };
      }

      const parsed = JSON.parse(jsonStr);
      return {
        isValid: true,
        error: null,
        parsed
      };
    } catch (error) {
      return {
        isValid: false,
        error: `JSON 파싱 오류: ${error.message}`,
        parsed: null
      };
    }
  };

  /**
   * 이메일 유효성 검사
   * @param {string} email - 검사할 이메일
   * @returns {boolean} 유효성 여부
   */
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  /**
   * URL 유효성 검사
   * @param {string} url - 검사할 URL
   * @returns {boolean} 유효성 여부
   */
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * 숫자 유효성 검사
   * @param {any} value - 검사할 값
   * @param {Object} options - 검사 옵션 { min, max, integer }
   * @returns {Object} { isValid, error }
   */
  const validateNumber = (value, options = {}) => {
    const num = Number(value);
    
    if (isNaN(num)) {
      return {
        isValid: false,
        error: '올바른 숫자를 입력해주세요'
      };
    }

    if (options.integer && !Number.isInteger(num)) {
      return {
        isValid: false,
        error: '정수를 입력해주세요'
      };
    }

    if (options.min !== undefined && num < options.min) {
      return {
        isValid: false,
        error: `최솟값은 ${options.min}입니다`
      };
    }

    if (options.max !== undefined && num > options.max) {
      return {
        isValid: false,
        error: `최댓값은 ${options.max}입니다`
      };
    }

    return {
      isValid: true,
      error: null
    };
  };

  return {
    errors,
    isValidating,
    isValid,
    hasError,
    getError,
    setError,
    clearError,
    clearAllErrors,
    validateJson,
    validateEmail,
    validateUrl,
    validateNumber
  };
}
