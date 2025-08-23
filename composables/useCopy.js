// useCopy.js - 복사 기능 관련 composable
import { ref } from 'vue';

/**
 * 클립보드 복사 기능을 위한 composable
 * @returns {Object} 복사 관련 함수들과 상태
 */
export function useCopy() {
  const isSupported = ref(!!navigator.clipboard);
  const copyError = ref(null);

  /**
   * 텍스트를 클립보드에 복사
   * @param {string|number} text - 복사할 텍스트
   * @param {string} [successMessage='복사되었습니다'] - 성공 메시지
   * @returns {Promise<boolean>} 복사 성공 여부
   */
  const copyToClipboard = async (text, successMessage = '복사되었습니다') => {
    if (!text) {
      console.warn('복사할 내용이 없습니다');
      return false;
    }

    copyError.value = null;

    try {
      // 현대적인 Clipboard API 사용
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(String(text));
      } else {
        // 폴백: 레거시 방식
        const textArea = document.createElement('textarea');
        textArea.value = String(text);
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!result) {
          throw new Error('복사 명령이 실행되지 않았습니다');
        }
      }

      // 성공 알림 표시
      showNotification(successMessage);
      return true;

    } catch (error) {
      copyError.value = error.message;
      console.error('복사 실패:', error);
      showNotification('복사에 실패했습니다');
      return false;
    }
  };

  /**
   * 토스트 알림 표시 함수
   * @param {string} message - 표시할 메시지
   */
  const showNotification = (message) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: message }));
  };

  /**
   * 여러 값을 한 번에 복사 (개행으로 구분)
   * @param {Array} values - 복사할 값들의 배열
   * @param {string} [separator='\n'] - 구분자
   * @param {string} [successMessage='복사되었습니다'] - 성공 메시지
   */
  const copyMultiple = async (values, separator = '\n', successMessage = '복사되었습니다') => {
    const text = values.filter(Boolean).join(separator);
    return await copyToClipboard(text, successMessage);
  };

  return {
    isSupported,
    copyError,
    copyToClipboard,
    copyMultiple
  };
}
