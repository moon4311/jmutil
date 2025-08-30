// StringUtil.js - 문자열 관련 유틸리티 함수들 (리팩토링)
import { BaseUtil } from './BaseUtil.js';

/**
 * 문자열 처리 유틸리티 클래스
 */
class StringUtilClass extends BaseUtil {
  constructor() {
    super(100, 5 * 60 * 1000) // 100개 캐시, 5분 TTL
  }

  /**
   * 카멜케이스로 변환
   */
  toCamelCase(str) {
    const cacheKey = `camel_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      
      const result = str
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toLowerCase())
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str // 오류 시 원본 반환
    }
  }

  /**
   * 스네이크케이스로 변환
   */
  toSnakeCase(str) {
    const cacheKey = `snake_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      
      const result = str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase()
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * 케밥케이스로 변환
   */
  toKebabCase(str) {
    const cacheKey = `kebab_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      
      const result = str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase()
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * 파스칼케이스로 변환
   */
  toPascalCase(str) {
    const cacheKey = `pascal_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      
      const result = str
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, (m) => m.toUpperCase())
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * 문자열 패딩
   */
  lpad(str, length, char = ' ') {
    const cacheKey = `lpad_${str}_${length}_${char}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      if (!str) str = ''
      const numLength = parseInt(length, 10)
      if (isNaN(numLength) || numLength <= 0) return str.toString()
      if (!char || char === '') char = ' '
      
      const result = str.toString().padStart(numLength, char)
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str.toString()
    }
  }

  rpad(str, length, char = ' ') {
    const cacheKey = `rpad_${str}_${length}_${char}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      if (!str) str = ''
      const numLength = parseInt(length, 10)
      if (isNaN(numLength) || numLength <= 0) return str.toString()
      if (!char || char === '') char = ' '
      
      const result = str.toString().padEnd(numLength, char)
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str.toString()
    }
  }

  /**
   * Base64 인코딩
   */
  encodeBase64(str) {
    const cacheKey = `base64enc_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = btoa(unescape(encodeURIComponent(str)))
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      throw new Error('Base64 인코딩 실패: ' + error.message)
    }
  }

  /**
   * Base64 디코딩
   */
  decodeBase64(str) {
    const cacheKey = `base64dec_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = decodeURIComponent(escape(atob(str)))
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      throw new Error('Base64 디코딩 실패: ' + error.message)
    }
  }

  /**
   * URL 인코딩
   */
  encodeURL(str) {
    const cacheKey = `urlenc_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = encodeURIComponent(str)
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      throw new Error('URL 인코딩 실패: ' + error.message)
    }
  }

  /**
   * URL 디코딩
   */
  decodeURL(str) {
    const cacheKey = `urldec_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = decodeURIComponent(str)
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      throw new Error('URL 디코딩 실패: ' + error.message)
    }
  }

  /**
   * HTML 이스케이프
   */
  escapeHTML(str) {
    const cacheKey = `htmlesc_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * HTML 언이스케이프
   */
  unescapeHTML(str) {
    const cacheKey = `htmlunesc_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
      
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * 문자열 뒤집기
   */
  reverse(str) {
    const cacheKey = `reverse_${str}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const result = str.split('').reverse().join('')
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * 문자열 반복
   */
  repeat(str, count) {
    const cacheKey = `repeat_${str}_${count}`
    const cached = this.getCached(cacheKey)
    if (cached !== null) return cached

    try {
      this.validateInput(str, 'string')
      const numCount = parseInt(count, 10)
      if (isNaN(numCount) || numCount < 0) return str
      
      const result = str.repeat(numCount)
      this.setCached(cacheKey, result)
      return result
    } catch (error) {
      return str
    }
  }

  /**
   * 문자 개수 세기
   */
  countChars(str) {
    try {
      this.validateInput(str, 'string')
      return {
        total: str.length,
        withoutSpaces: str.replace(/\s/g, '').length,
        words: str.trim() ? str.trim().split(/\s+/).length : 0,
        lines: str.split('\n').length
      }
    } catch (error) {
      return { total: 0, withoutSpaces: 0, words: 0, lines: 0 }
    }
  }

  /**
   * HEX 인코딩
   */
  encodeHex(str) {
    try {
      this.validateInput(str, 'string')
      return Array.from(str)
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    } catch (error) {
      throw new Error('HEX 인코딩 실패: ' + error.message)
    }
  }

  /**
   * HEX 디코딩
   */
  decodeHex(str) {
    try {
      this.validateInput(str, 'string')
      return str.match(/.{2}/g)
        ?.map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('') || ''
    } catch (error) {
      throw new Error('HEX 디코딩 실패: ' + error.message)
    }
  }

  /**
   * Unicode 인코딩
   */
  encodeUnicode(str) {
    try {
      this.validateInput(str, 'string')
      return Array.from(str)
        .map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)
        .join('')
    } catch (error) {
      throw new Error('Unicode 인코딩 실패: ' + error.message)
    }
  }

  /**
   * Unicode 디코딩
   */
  decodeUnicode(str) {
    try {
      this.validateInput(str, 'string')
      return str.replace(/\\u([\dA-Fa-f]{4})/g, (m, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    } catch (error) {
      throw new Error('Unicode 디코딩 실패: ' + error.message)
    }
  }

  /**
   * 모든 공백 제거
   */
  removeAllSpaces(str) {
    try {
      if (!str) return ''
      return str.replace(/\s+/g, '')
    } catch (error) {
      return str || ''
    }
  }

  /**
   * 여러 공백을 하나로 변환
   */
  normalizeSpaces(str) {
    try {
      if (!str) return ''
      return str.replace(/\s+/g, ' ').trim()
    } catch (error) {
      return str || ''
    }
  }

  /**
   * 특수문자 제거
   */
  removeSpecialChars(str) {
    try {
      if (!str) return ''
      return str.replace(/[^a-zA-Z0-9가-힣\s]/g, '')
    } catch (error) {
      return str || ''
    }
  }

  /**
   * 숫자만 추출
   */
  extractNumbers(str) {
    try {
      if (!str) return ''
      return str.replace(/[^0-9]/g, '')
    } catch (error) {
      return ''
    }
  }

  /**
   * 영문자만 추출
   */
  extractAlphabets(str) {
    try {
      if (!str) return ''
      return str.replace(/[^a-zA-Z]/g, '')
    } catch (error) {
      return ''
    }
  }

  /**
   * 한글만 추출
   */
  extractKorean(str) {
    try {
      if (!str) return ''
      return str.replace(/[^가-힣]/g, '')
    } catch (error) {
      return ''
    }
  }

  /**
   * 정규식 테스트
   */
  regexTest(str, pattern, flags = 'g') {
    try {
      if (!str || !pattern) {
        return { success: false, error: '문자열과 패턴을 모두 입력해주세요.' }
      }

      const regex = new RegExp(pattern, flags)
      const matches = str.match(regex)
      
      return {
        success: true,
        isMatch: matches !== null,
        matchCount: matches ? matches.length : 0,
        matches: matches || []
      }
    } catch (error) {
      return {
        success: false,
        error: `정규식 오류: ${error.message}`,
        isMatch: false,
        matchCount: 0,
        matches: []
      }
    }
  }

  /**
   * 정규식 치환
   */
  regexReplace(str, pattern, replacement, flags = 'g') {
    try {
      if (!str || !pattern) {
        return { success: false, error: '문자열과 패턴을 모두 입력해주세요.' }
      }

      const regex = new RegExp(pattern, flags)
      const result = str.replace(regex, replacement)
      
      return {
        success: true,
        result: result
      }
    } catch (error) {
      return {
        success: false,
        error: `정규식 치환 오류: ${error.message}`,
        result: str
      }
    }
  }
}

// 인스턴스 생성
const stringUtilInstance = new StringUtilClass()

// 기존 함수들 (호환성을 위해 유지)
export function toCamelCase(str) {
  return stringUtilInstance.toCamelCase(str)
}

export function toSnakeCase(str) {
  return stringUtilInstance.toSnakeCase(str)
}

export function toKebabCase(str) {
  return stringUtilInstance.toKebabCase(str)
}

export function toPascalCase(str) {
  return stringUtilInstance.toPascalCase(str)
}

export function lpad(str, length, char) {
  return stringUtilInstance.lpad(str, length, char)
}

export function rpad(str, length, char) {
  return stringUtilInstance.rpad(str, length, char)
}

export function encodeBase64(str) {
  return stringUtilInstance.encodeBase64(str)
}

export function decodeBase64(str) {
  return stringUtilInstance.decodeBase64(str)
}

export function encodeURL(str) {
  return stringUtilInstance.encodeURL(str)
}

export function decodeURL(str) {
  return stringUtilInstance.decodeURL(str)
}

export function escapeHTML(str) {
  return stringUtilInstance.escapeHTML(str)
}

export function unescapeHTML(str) {
  return stringUtilInstance.unescapeHTML(str)
}

// 추가된 함수들
export function encodeHex(str) {
  return stringUtilInstance.encodeHex(str)
}

export function decodeHex(str) {
  return stringUtilInstance.decodeHex(str)
}

export function encodeUnicode(str) {
  return stringUtilInstance.encodeUnicode(str)
}

export function decodeUnicode(str) {
  return stringUtilInstance.decodeUnicode(str)
}

export function removeAllSpaces(str) {
  return stringUtilInstance.removeAllSpaces(str)
}

export function normalizeSpaces(str) {
  return stringUtilInstance.normalizeSpaces(str)
}

export function removeSpecialChars(str) {
  return stringUtilInstance.removeSpecialChars(str)
}

export function extractNumbers(str) {
  return stringUtilInstance.extractNumbers(str)
}

export function extractAlphabets(str) {
  return stringUtilInstance.extractAlphabets(str)
}

export function extractKorean(str) {
  return stringUtilInstance.extractKorean(str)
}

export function regexTest(str, pattern, flags) {
  return stringUtilInstance.regexTest(str, pattern, flags)
}

export function regexReplace(str, pattern, replacement, flags) {
  return stringUtilInstance.regexReplace(str, pattern, replacement, flags)
}

// 새로운 클래스 기반 인스턴스 내보내기
export const StringUtil = stringUtilInstance
export default stringUtilInstance
