// JsonUtil.js - JSON 관련 유틸리티 함수들 (리팩토링)
import { BaseUtil } from './BaseUtil.js';
import { pad2 } from './CommonUtil.js';

/**
 * JSON 처리 유틸리티 클래스
 */
class JsonUtilClass extends BaseUtil {
  constructor() {
    super(50, 10 * 60 * 1000) // 50개 캐시, 10분 TTL
  }

  /**
   * JSON 문자열을 포맷팅 (들여쓰기 적용)
   * @param {string} jsonStr - 포맷팅할 JSON 문자열
   * @param {number} indent - 들여쓰기 크기 (기본값: 2)
   * @returns {object} { success: boolean, data?: string, error?: string }
   */
  async format(jsonStr, indent = 2) {
    return this.measurePerformance(async () => {
      const cacheKey = `format_${jsonStr}_${indent}`
      const cached = this.getCached(cacheKey)
      if (cached) return cached

      try {
        this.validateInput(jsonStr, 'string', { maxLength: 1000000 })
        
        if (!jsonStr.trim()) {
          throw new Error('JSON 데이터가 비어있습니다.')
        }

        const parsed = JSON.parse(jsonStr)
        const formatted = JSON.stringify(parsed, null, indent)
        
        const result = { success: true, data: formatted }
        this.setCached(cacheKey, result)
        return result
      } catch (error) {
        const result = { success: false, error: this.getErrorMessage(error) }
        this.setCached(cacheKey, result)
        return result
      }
    }, 'JSON Format')
  }

  /**
   * JSON 압축 (공백 제거)
   * @param {string} jsonStr - 압축할 JSON 문자열
   * @returns {object} { success: boolean, data?: string, error?: string }
   */
  async minify(jsonStr) {
    return this.measurePerformance(async () => {
      const cacheKey = `minify_${jsonStr}`
      const cached = this.getCached(cacheKey)
      if (cached) return cached

      try {
        this.validateInput(jsonStr, 'string', { maxLength: 1000000 })
        
        if (!jsonStr.trim()) {
          throw new Error('JSON 데이터가 비어있습니다.')
        }

        const parsed = JSON.parse(jsonStr)
        const minified = JSON.stringify(parsed)
        
        const result = { success: true, data: minified }
        this.setCached(cacheKey, result)
        return result
      } catch (error) {
        const result = { success: false, error: this.getErrorMessage(error) }
        this.setCached(cacheKey, result)
        return result
      }
    }, 'JSON Minify')
  }

  /**
   * JSON 검증
   * @param {string} jsonStr - 검증할 JSON 문자열
   * @returns {object} { valid: boolean, message: string }
   */
  validate(jsonStr) {
    try {
      this.validateInput(jsonStr, 'string')
      
      if (!jsonStr.trim()) {
        return { valid: false, message: 'JSON 데이터가 비어있습니다.' }
      }

      JSON.parse(jsonStr)
      return { valid: true, message: '유효한 JSON입니다.' }
    } catch (error) {
      return { valid: false, message: this.getErrorMessage(error) }
    }
  }

  /**
   * JSON을 CSV로 변환 (성능 최적화 버전)
   * @param {string} jsonStr - 변환할 JSON 문자열
   * @returns {object} { success: boolean, data?: string, error?: string }
   */
  async toCsv(jsonStr) {
    return this.measurePerformance(async () => {
      const cacheKey = `toCsv_${jsonStr}`
      const cached = this.getCached(cacheKey)
      if (cached) return cached

      try {
        this.validateInput(jsonStr, 'string', { maxLength: 5000000 })
        
        if (!jsonStr.trim()) {
          throw new Error('입력된 JSON이 비어있습니다.')
        }

        const jsonData = JSON.parse(jsonStr)
        
        // 배열이 아닌 경우 배열로 감싸기
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]
        
        if (dataArray.length === 0) {
          throw new Error('빈 데이터입니다.')
        }
        
        // 헤더 수집 최적화 - Set 사용
        const headerSet = new Set()
        
        // 첫 번째 객체의 키 순서를 먼저 추가
        const firstItem = dataArray[0]
        if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
          Object.keys(firstItem).forEach(key => headerSet.add(key))
        }
        
        // 나머지 객체들에서 추가 키들 수집 (성능 최적화)
        for (let i = 1; i < dataArray.length; i++) {
          const item = dataArray[i]
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => headerSet.add(key))
          }
        }
        
        const headerArray = Array.from(headerSet)
        
        // CSV 생성 - StringBuilder 패턴 사용
        const csvLines = []
        csvLines.push('\uFEFF' + headerArray.join(',')) // BOM 추가
        
        // 각 행 데이터 생성 (성능 최적화)
        for (const item of dataArray) {
          if (typeof item !== 'object' || item === null) {
            csvLines.push(headerArray.map(() => '').join(','))
            continue
          }
          
          const row = headerArray.map(header => {
            const value = item[header]
            
            if (value == null) return ''
            
            let stringValue = String(value).trim()
            
            if (stringValue === '') return ''
            
            // CSV 이스케이프 처리
            if (stringValue.includes(',') || 
                stringValue.includes('"') || 
                stringValue.includes('\n') || 
                stringValue.includes('\r') ||
                stringValue.startsWith(' ') || 
                stringValue.endsWith(' ')) {
              stringValue = `"${stringValue.replace(/"/g, '""')}"`
            }
            
            return stringValue
          })
          
          csvLines.push(row.join(','))
        }
        
        const result = { success: true, data: csvLines.join('\n') }
        this.setCached(cacheKey, result)
        return result
      } catch (error) {
        const result = { success: false, error: this.getErrorMessage(error) }
        return result
      }
    }, 'JSON to CSV')
  }

  /**
   * 에러 메시지 정리
   */
  getErrorMessage(error) {
    const message = error.message
    if (message.includes('Unexpected token')) {
      return 'JSON 구문 오류: 잘못된 문자가 있습니다.'
    }
    if (message.includes('Unexpected end')) {
      return 'JSON 구문 오류: 예상치 못한 끝입니다.'
    }
    if (message.includes('Expected')) {
      return 'JSON 구문 오류: 필수 요소가 누락되었습니다.'
    }
    return `JSON 오류: ${message}`
  }

  /**
   * JSON 데이터에서 사용 가능한 키 목록 추출
   * @param {string} jsonStr - JSON 문자열
   * @returns {string[]} 키 목록 배열
   */
  extractKeys(jsonStr) {
    try {
      if (!jsonStr) return []

      const jsonData = JSON.parse(jsonStr)
      const keys = new Set()
      
      if (Array.isArray(jsonData)) {
        // 배열인 경우 모든 객체의 키를 수집
        jsonData.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => keys.add(key))
          }
        })
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // 단일 객체인 경우
        Object.keys(jsonData).forEach(key => keys.add(key))
      }
      
      return Array.from(keys).sort()
    } catch (error) {
      return []
    }
  }

  /**
   * JSON 배열에서 특정 키들만 선택해서 추출
   * @param {string} jsonStr - JSON 문자열
   * @param {string[]} keys - 추출할 키 배열
   * @returns {string} 필터링된 JSON 문자열
   */
  selectKeys(jsonStr, keys) {
    try {
      if (!jsonStr || !keys || keys.length === 0) {
        throw new Error('JSON 데이터와 키를 입력해주세요.')
      }

      const jsonData = JSON.parse(jsonStr)
      
      if (Array.isArray(jsonData)) {
        const filteredData = jsonData.map(item => {
          const filteredItem = {}
          keys.forEach(key => {
            if (item.hasOwnProperty(key)) {
              filteredItem[key] = item[key]
            }
          })
          return filteredItem
        })
        return JSON.stringify(filteredData, null, 2)
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        const filteredData = {}
        keys.forEach(key => {
          if (jsonData.hasOwnProperty(key)) {
            filteredData[key] = jsonData[key]
          }
        })
        return JSON.stringify(filteredData, null, 2)
      } else {
        throw new Error('JSON 데이터는 객체 또는 객체 배열이어야 합니다.')
      }
    } catch (error) {
      throw new Error(`키 선택 오류: ${error.message}`)
    }
  }

  /**
   * JSON 배열에서 조건을 만족하는 객체 찾기
   * @param {string} jsonStr - JSON 문자열
   * @param {string} key - 필터링할 키
   * @param {string} operator - 연산자
   * @param {string} value - 비교값
   * @returns {string} 조건에 맞는 객체들의 JSON 문자열
   */
  filterObjects(jsonStr, key, operator, value) {
    try {
      if (!jsonStr || !key) {
        throw new Error('JSON 데이터와 필터링 키를 입력해주세요.')
      }

      const jsonData = JSON.parse(jsonStr)
      
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON 데이터는 배열이어야 합니다.')
      }

      const filteredData = jsonData.filter(item => {
        if (typeof item !== 'object' || item === null) return false
        if (!item.hasOwnProperty(key)) return false

        const itemValue = item[key]
        const compareValue = value

        switch (operator) {
          case '=':
          case '==':
            return itemValue == compareValue
          case '!=':
          case '<>':
            return itemValue != compareValue
          case '>':
            return Number(itemValue) > Number(compareValue)
          case '<':
            return Number(itemValue) < Number(compareValue)
          case '>=':
            return Number(itemValue) >= Number(compareValue)
          case '<=':
            return Number(itemValue) <= Number(compareValue)
          case 'contains':
            return String(itemValue).includes(String(compareValue))
          case 'startsWith':
            return String(itemValue).startsWith(String(compareValue))
          case 'endsWith':
            return String(itemValue).endsWith(String(compareValue))
          default:
            return itemValue == compareValue
        }
      })

      return JSON.stringify(filteredData, null, 2)
    } catch (error) {
      throw new Error(`필터링 오류: ${error.message}`)
    }
  }

  /**
   * JSON 배열에서 다중 조건을 만족하는 객체 찾기
   * @param {string} jsonStr - JSON 문자열
   * @param {array} conditions - 조건 배열
   * @param {string} logicalOperator - 논리 연산자
   * @returns {string} 조건에 맞는 객체들의 JSON 문자열
   */
  filterObjectsMultiple(jsonStr, conditions, logicalOperator = 'AND') {
    try {
      if (!jsonStr || !conditions || conditions.length === 0) {
        throw new Error('JSON 데이터와 필터링 조건을 입력해주세요.')
      }

      const jsonData = JSON.parse(jsonStr)
      
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON 데이터는 배열이어야 합니다.')
      }

      const filteredData = jsonData.filter(item => {
        if (typeof item !== 'object' || item === null) return false

        const results = conditions.map(condition => {
          const { key, operator, value } = condition
          
          if (!item.hasOwnProperty(key)) return false

          const itemValue = item[key]
          const compareValue = value

          switch (operator) {
            case '=':
            case '==':
              return itemValue == compareValue
            case '!=':
            case '<>':
              return itemValue != compareValue
            case '>':
              return Number(itemValue) > Number(compareValue)
            case '<':
              return Number(itemValue) < Number(compareValue)
            case '>=':
              return Number(itemValue) >= Number(compareValue)
            case '<=':
              return Number(itemValue) <= Number(compareValue)
            case 'contains':
              return String(itemValue).includes(String(compareValue))
            case 'startsWith':
              return String(itemValue).startsWith(String(compareValue))
            case 'endsWith':
              return String(itemValue).endsWith(String(compareValue))
            default:
              return itemValue == compareValue
          }
        })

        return logicalOperator === 'AND' 
          ? results.every(result => result === true)
          : results.some(result => result === true)
      })

      return JSON.stringify(filteredData, null, 2)
    } catch (error) {
      throw new Error(`다중 필터링 오류: ${error.message}`)
    }
  }

  /**
   * JSON 배열 정렬
   * @param {string} jsonStr - JSON 문자열
   * @param {string} key - 정렬할 키
   * @param {string} order - 정렬 순서 ('asc' 또는 'desc')
   * @param {string} type - 데이터 타입 ('string', 'number', 'date')
   * @returns {string} 정렬된 JSON 문자열
   */
  sortObjects(jsonStr, key, order = 'asc', type = 'string') {
    try {
      if (!jsonStr || !key) {
        throw new Error('JSON 데이터와 정렬 키를 입력해주세요.')
      }

      const jsonData = JSON.parse(jsonStr)
      
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON 데이터는 배열이어야 합니다.')
      }

      const sortedData = [...jsonData].sort((a, b) => {
        if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
          return 0
        }

        let aValue = a[key]
        let bValue = b[key]

        // null/undefined 처리
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return order === 'asc' ? -1 : 1
        if (bValue == null) return order === 'asc' ? 1 : -1

        // 타입에 따른 비교
        switch (type) {
          case 'number':
            aValue = Number(aValue)
            bValue = Number(bValue)
            if (isNaN(aValue) && isNaN(bValue)) return 0
            if (isNaN(aValue)) return order === 'asc' ? 1 : -1
            if (isNaN(bValue)) return order === 'asc' ? -1 : 1
            break
          case 'date':
            aValue = new Date(aValue).getTime()
            bValue = new Date(bValue).getTime()
            if (isNaN(aValue) && isNaN(bValue)) return 0
            if (isNaN(aValue)) return order === 'asc' ? 1 : -1
            if (isNaN(bValue)) return order === 'asc' ? -1 : 1
            break
          default:
            aValue = String(aValue).toLowerCase()
            bValue = String(bValue).toLowerCase()
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
      })

      return JSON.stringify(sortedData, null, 2)
    } catch (error) {
      throw new Error(`정렬 오류: ${error.message}`)
    }
  }
}

// 인스턴스 생성
const jsonUtilInstance = new JsonUtilClass()

// 호환성을 위한 기존 함수들 (deprecated)
export function formatJson(jsonStr) {
  try {
    // 동기 버전 - 간단한 JSON 포맷팅
    if (!jsonStr || !jsonStr.trim()) {
      throw new Error('JSON 데이터가 비어있습니다.')
    }
    const parsed = JSON.parse(jsonStr)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error(`JSON 오류: ${error.message}`)
  }
}

export async function formatJsonAsync(jsonStr) {
  const result = await jsonUtilInstance.format(jsonStr)
  if (result.success) {
    return result.data
  }
  throw new Error(result.error)
}

export function minifyJson(jsonStr) {
  const result = jsonUtilInstance.minify(jsonStr)
  if (result.success) {
    return result.data
  }
  throw new Error(result.error)
}

export function isValidJson(jsonStr) {
  const result = jsonUtilInstance.validate(jsonStr)
  return result.valid
}

export function jsonToCsv(jsonStr) {
  const result = jsonUtilInstance.toCsv(jsonStr)
  if (result.success) {
    return result.data
  }
  throw new Error(result.error)
}

// 추가된 함수들
export function extractKeys(jsonStr) {
  return jsonUtilInstance.extractKeys(jsonStr)
}

export function selectKeys(jsonStr, keys) {
  return jsonUtilInstance.selectKeys(jsonStr, keys)
}

export function filterObjects(jsonStr, key, operator, value) {
  return jsonUtilInstance.filterObjects(jsonStr, key, operator, value)
}

export function filterObjectsMultiple(jsonStr, conditions, logicalOperator) {
  return jsonUtilInstance.filterObjectsMultiple(jsonStr, conditions, logicalOperator)
}

export function sortObjects(jsonStr, key, order, type) {
  return jsonUtilInstance.sortObjects(jsonStr, key, order, type)
}

// 새로운 클래스 기반 인스턴스 내보내기
export const JsonUtil = jsonUtilInstance
export default jsonUtilInstance
