import { ref, nextTick } from 'vue'
import { useCopy } from './useCopy.js'
import { useNotification } from './useNotification.js'

/**
 * 모든 도구에서 공통으로 사용하는 기능들
 */
export const useToolCommon = () => {
  const { copy } = useCopy()
  const { showError, showSuccess } = useNotification()
  
  const input = ref('')
  const output = ref('')
  const isProcessing = ref(false)
  const error = ref('')
  const processingTime = ref(0)

  /**
   * 공통 처리 함수
   */
  const processInput = async (processor, options = {}) => {
    if (!input.value.trim()) {
      error.value = '입력값을 입력해주세요.'
      return
    }

    isProcessing.value = true
    error.value = ''
    const startTime = performance.now()

    try {
      const result = await processor(input.value, options)
      
      if (result.success) {
        output.value = result.data
        if (options.showSuccess !== false) {
          showSuccess('처리가 완료되었습니다.')
        }
        if (options.autoFormat) {
          nextTick(() => {
            // 자동 포맷팅 적용
            formatOutput()
          })
        }
      } else {
        error.value = result.error
        showError(result.error)
      }
    } catch (err) {
      error.value = '처리 중 오류가 발생했습니다.'
      showError(err.message)
    } finally {
      processingTime.value = performance.now() - startTime
      isProcessing.value = false
    }
  }

  /**
   * 출력 복사
   */
  const copyOutput = () => {
    if (!output.value) {
      showError('복사할 내용이 없습니다.')
      return
    }
    
    copy(output.value)
    showSuccess('클립보드에 복사되었습니다.')
  }

  /**
   * 입력 초기화
   */
  const clearInput = () => {
    input.value = ''
    output.value = ''
    error.value = ''
    processingTime.value = 0
  }

  /**
   * 샘플 데이터 로드
   */
  const loadSample = (sampleData) => {
    input.value = sampleData
    error.value = ''
  }

  /**
   * 출력 포맷팅
   */
  const formatOutput = () => {
    // 자동 포맷팅 로직 (필요시 오버라이드)
  }

  return {
    input,
    output,
    isProcessing,
    error,
    processingTime: readonly(processingTime),
    processInput,
    copyOutput,
    clearInput,
    loadSample,
    formatOutput
  }
}
