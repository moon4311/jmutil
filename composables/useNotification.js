// useNotification.js - 전역 알림 관리 composable
import { ref } from 'vue'

/**
 * 알림 타입 정의
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// 전역 알림 상태
const notifications = ref([])

/**
 * 알림 관리를 위한 composable
 * @returns {Object} 알림 관련 함수들과 상태
 */
export function useNotification() {
  
  /**
   * 알림 추가
   * @param {string} message - 알림 메시지
   * @param {string} [type='info'] - 알림 타입
   * @param {number} [duration=3000] - 표시 시간 (ms), 0이면 자동 닫기 안함
   * @param {Object} [options={}] - 추가 옵션
   */
  const showNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 3000, options = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      duration,
      timestamp: new Date().toISOString(),
      ...options
    }
    
    notifications.value.push(notification)
    
    // 자동 닫기
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }
    
    return notification.id
  }
  
  /**
   * 성공 알림
   * @param {string} message - 알림 메시지
   * @param {number} [duration=2000] - 표시 시간
   */
  const showSuccess = (message, duration = 2000) => {
    return showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration)
  }
  
  /**
   * 에러 알림
   * @param {string} message - 알림 메시지
   * @param {number} [duration=5000] - 표시 시간
   */
  const showError = (message, duration = 5000) => {
    return showNotification(message, NOTIFICATION_TYPES.ERROR, duration)
  }
  
  /**
   * 경고 알림
   * @param {string} message - 알림 메시지
   * @param {number} [duration=4000] - 표시 시간
   */
  const showWarning = (message, duration = 4000) => {
    return showNotification(message, NOTIFICATION_TYPES.WARNING, duration)
  }
  
  /**
   * 정보 알림
   * @param {string} message - 알림 메시지
   * @param {number} [duration=3000] - 표시 시간
   */
  const showInfo = (message, duration = 3000) => {
    return showNotification(message, NOTIFICATION_TYPES.INFO, duration)
  }
  
  /**
   * 알림 제거
   * @param {string} id - 알림 ID
   */
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(notification => notification.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  /**
   * 모든 알림 제거
   */
  const clearNotifications = () => {
    notifications.value = []
  }
  
  /**
   * 복사 완료 알림 (편의 함수)
   * @param {string} [message='복사되었습니다'] - 메시지
   */
  const showCopySuccess = (message = '복사되었습니다') => {
    return showSuccess(message, 1500)
  }
  
  /**
   * 토스트 이벤트 발생 (기존 호환성 유지)
   * @param {string} message - 메시지
   */
  const showToast = (message) => {
    if (process.client) {
      // 기존 토스트 이벤트 방식 유지
      window.dispatchEvent(new CustomEvent('toast', { detail: message }))
    }
    return showSuccess(message)
  }
  
  return {
    // 상태
    notifications,
    
    // 기본 함수들
    showNotification,
    removeNotification,
    clearNotifications,
    
    // 타입별 편의 함수들
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // 특수 용도 함수들
    showCopySuccess,
    showToast
  }
}

export default useNotification
