// ArrayUtil.js - 배열 관련 유틸리티 함수들 (리팩토링)
import { BaseUtil } from './BaseUtil.js';

/**
 * 배열 처리 유틸리티 클래스
 */
class ArrayUtilClass extends BaseUtil {
  constructor() {
    super(50, 3 * 60 * 1000) // 50개 캐시, 3분 TTL
  }

  /**
   * 배열에서 중복 요소 제거
   */
  unique(arr) {
    const cacheKey = `unique_${JSON.stringify(arr)}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr, 'array')
      const result = [...new Set(arr)]
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return Array.isArray(arr) ? arr : []
    }
  }

  /**
   * 중첩 배열을 평탄화
   */
  flatten(arr, depth = Infinity) {
    const cacheKey = `flatten_${JSON.stringify(arr)}_${depth}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr, 'array')
      const result = depth === 1 ? arr.flat() : arr.flat(depth)
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return Array.isArray(arr) ? arr : []
    }
  }

  /**
   * 배열을 무작위로 섞기 (Fisher-Yates 알고리즘)
   */
  shuffle(arr) {
    try {
      this.validateInput(arr, 'array')
      const shuffled = [...arr]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    } catch (error) {
      return Array.isArray(arr) ? arr : []
    }
  }

  /**
   * 객체 배열을 특정 키로 그룹핑
   */
  groupBy(arr, key) {
    const cacheKey = `groupBy_${JSON.stringify(arr)}_${key.toString()}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr, 'array')
      const result = arr.reduce((groups, item) => {
        const group = typeof key === 'function' ? key(item) : item[key]
        groups[group] = groups[group] || []
        groups[group].push(item)
        return groups
      }, {})
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return {}
    }
  }

  /**
   * 배열을 지정된 크기로 분할
   */
  chunk(arr, size) {
    const cacheKey = `chunk_${JSON.stringify(arr)}_${size}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr, 'array')
      const chunks = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      
      this.setCached(cacheKey, chunks)
      return chunks
    } catch (error) {
      return Array.isArray(arr) ? [arr] : []
    }
  }

  /**
   * 배열 교집합
   */
  intersection(arr1, arr2) {
    const cacheKey = `intersect_${JSON.stringify(arr1)}_${JSON.stringify(arr2)}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr1, 'array')
      this.validateInput(arr2, 'array')
      
      const result = arr1.filter(value => arr2.includes(value))
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return []
    }
  }

  /**
   * 배열 차집합
   */
  difference(arr1, arr2) {
    const cacheKey = `diff_${JSON.stringify(arr1)}_${JSON.stringify(arr2)}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr1, 'array')
      this.validateInput(arr2, 'array')
      
      const result = arr1.filter(value => !arr2.includes(value))
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return Array.isArray(arr1) ? arr1 : []
    }
  }

  /**
   * 배열 합집합
   */
  union(arr1, arr2) {
    const cacheKey = `union_${JSON.stringify(arr1)}_${JSON.stringify(arr2)}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(arr1, 'array')
      this.validateInput(arr2, 'array')
      
      const result = this.unique([...arr1, ...arr2])
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return []
    }
  }

  /**
   * 배열 정렬 (다양한 옵션)
   */
  sort(arr, options = {}) {
    try {
      this.validateInput(arr, 'array')
      const { key, reverse = false, numeric = false } = options
      
      let result = [...arr]
      
      if (key) {
        // 객체 배열 정렬
        result.sort((a, b) => {
          const aVal = a[key]
          const bVal = b[key]
          
          if (numeric) {
            return reverse ? bVal - aVal : aVal - bVal
          }
          
          if (reverse) {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0
          }
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        })
      } else {
        // 기본 정렬
        result.sort((a, b) => {
          if (numeric) {
            return reverse ? b - a : a - b
          }
          
          if (reverse) {
            return b > a ? 1 : b < a ? -1 : 0
          }
          return a > b ? 1 : a < b ? -1 : 0
        })
      }
      
      return result
    } catch (error) {
      return Array.isArray(arr) ? arr : []
    }
  }

  /**
   * 빈 배열 체크
   */
  isEmpty(arr) {
    return !Array.isArray(arr) || arr.length === 0
  }

  /**
   * 배열 통계
   */
  getStats(arr) {
    try {
      this.validateInput(arr, 'array')
      
      if (this.isEmpty(arr)) {
        return { length: 0, unique: 0, types: {} }
      }
      
      const types = {}
      arr.forEach(item => {
        const type = typeof item
        types[type] = (types[type] || 0) + 1
      })
      
      return {
        length: arr.length,
        unique: this.unique(arr).length,
        types,
        hasNulls: arr.some(item => item === null || item === undefined),
        hasObjects: arr.some(item => typeof item === 'object' && item !== null),
        hasArrays: arr.some(item => Array.isArray(item))
      }
    } catch (error) {
      return { length: 0, unique: 0, types: {} }
    }
  }
}

// 인스턴스 생성
const arrayUtilInstance = new ArrayUtilClass()

// 기존 함수들 (호환성을 위해 유지)
export function unique(arr) {
  return arrayUtilInstance.unique(arr)
}

export function flatten(arr, depth) {
  return arrayUtilInstance.flatten(arr, depth)
}

export function shuffle(arr) {
  return arrayUtilInstance.shuffle(arr)
}

export function groupBy(arr, key) {
  return arrayUtilInstance.groupBy(arr, key)
}

export function chunk(arr, size) {
  return arrayUtilInstance.chunk(arr, size)
}

export function intersection(arr1, arr2) {
  return arrayUtilInstance.intersection(arr1, arr2)
}

export function difference(arr1, arr2) {
  return arrayUtilInstance.difference(arr1, arr2)
}

export function isEmpty(arr) {
  return arrayUtilInstance.isEmpty(arr)
}

// 새로운 클래스 기반 인스턴스 내보내기
export const ArrayUtil = arrayUtilInstance
export default arrayUtilInstance
