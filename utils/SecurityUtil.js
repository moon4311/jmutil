// utils/SecurityUtil.js - 보안 관련 유틸리티 함수들

/**
 * 입력값 검증 및 보안 처리 유틸리티
 */

/**
 * XSS 공격 방지를 위한 HTML 이스케이프
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') return '';
  
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'/]/g, (match) => htmlEscapeMap[match]);
}

/**
 * HTML 태그 제거
 * @param {string} html - HTML 문자열
 * @returns {string} 태그가 제거된 텍스트
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  
  // HTML 태그 제거
  const withoutTags = html.replace(/<[^>]*>/g, '');
  
  // HTML 엔티티 디코딩
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = withoutTags;
  
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * JSON 입력값 보안 검증
 * @param {string} jsonStr - 검증할 JSON 문자열
 * @param {object} options - 검증 옵션
 * @returns {object} 검증 결과
 */
export function validateJsonSecurity(jsonStr, options = {}) {
  const {
    maxLength = 1024 * 1024, // 1MB
    maxDepth = 10,
    maxArrayLength = 10000,
    maxObjectKeys = 1000,
    allowedTypes = ['string', 'number', 'boolean', 'object', 'array', 'null']
  } = options;

  const result = {
    isValid: false,
    error: '',
    warnings: [],
    stats: {
      length: 0,
      depth: 0,
      arrayCount: 0,
      objectCount: 0,
      stringCount: 0
    }
  };

  try {
    // 길이 검증
    if (jsonStr.length > maxLength) {
      result.error = `JSON 크기가 너무 큽니다. 최대 ${Math.round(maxLength / 1024)}KB`;
      return result;
    }

    result.stats.length = jsonStr.length;

    // JSON 파싱 시도
    const parsed = JSON.parse(jsonStr);
    
    // 재귀적 검증 함수
    function validateRecursive(obj, depth = 0) {
      if (depth > maxDepth) {
        throw new Error(`JSON 깊이가 너무 깊습니다. 최대 ${maxDepth}단계`);
      }

      const type = Array.isArray(obj) ? 'array' : obj === null ? 'null' : typeof obj;
      
      if (!allowedTypes.includes(type)) {
        throw new Error(`허용되지 않는 데이터 타입: ${type}`);
      }

      if (type === 'string') {
        result.stats.stringCount++;
        
        // 문자열 길이 검증
        if (obj.length > 10000) {
          result.warnings.push('매우 긴 문자열이 포함되어 있습니다');
        }
        
        // 잠재적 위험 패턴 검사
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /vbscript:/i,
          /data:text\/html/i
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(obj))) {
          result.warnings.push('잠재적으로 위험한 스크립트 패턴이 감지되었습니다');
        }
        
      } else if (type === 'array') {
        result.stats.arrayCount++;
        
        if (obj.length > maxArrayLength) {
          throw new Error(`배열 길이가 너무 큽니다. 최대 ${maxArrayLength}개`);
        }
        
        obj.forEach(item => validateRecursive(item, depth + 1));
        
      } else if (type === 'object') {
        result.stats.objectCount++;
        const keys = Object.keys(obj);
        
        if (keys.length > maxObjectKeys) {
          throw new Error(`객체 키 개수가 너무 많습니다. 최대 ${maxObjectKeys}개`);
        }
        
        keys.forEach(key => {
          // 키 이름 검증
          if (key.length > 100) {
            result.warnings.push('매우 긴 키 이름이 포함되어 있습니다');
          }
          
          validateRecursive(obj[key], depth + 1);
        });
        
        result.stats.depth = Math.max(result.stats.depth, depth);
      }
    }

    validateRecursive(parsed);
    
    result.isValid = true;
    
    // 성능 경고
    if (result.stats.length > 100 * 1024) {
      result.warnings.push('큰 JSON 데이터로 인해 처리 속도가 느려질 수 있습니다');
    }
    
    if (result.stats.objectCount + result.stats.arrayCount > 1000) {
      result.warnings.push('복잡한 구조로 인해 처리 시간이 오래 걸릴 수 있습니다');
    }

  } catch (error) {
    result.error = error.message;
  }

  return result;
}

/**
 * URL 검증 및 정리
 * @param {string} url - 검증할 URL
 * @returns {object} 검증 결과
 */
export function validateUrl(url) {
  const result = {
    isValid: false,
    cleanUrl: '',
    protocol: '',
    warnings: []
  };

  try {
    if (!url || typeof url !== 'string') {
      throw new Error('유효하지 않은 URL입니다');
    }

    // URL 정리
    const cleanUrl = url.trim();
    
    // 허용된 프로토콜 체크
    const allowedProtocols = ['http:', 'https:', 'ftp:', 'mailto:'];
    const urlObj = new URL(cleanUrl);
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      throw new Error(`허용되지 않은 프로토콜: ${urlObj.protocol}`);
    }

    // 위험한 도메인 패턴 체크
    const suspiciousPatterns = [
      /localhost/i,
      /127\.0\.0\.1/,
      /192\.168\./,
      /10\.\d+\./,
      /172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(urlObj.hostname))) {
      result.warnings.push('내부 네트워크 주소가 감지되었습니다');
    }

    result.isValid = true;
    result.cleanUrl = cleanUrl;
    result.protocol = urlObj.protocol;

  } catch (error) {
    result.error = error.message;
  }

  return result;
}

/**
 * 파일명 보안 검증
 * @param {string} filename - 검증할 파일명
 * @returns {object} 검증 결과
 */
export function validateFilename(filename) {
  const result = {
    isValid: false,
    cleanFilename: '',
    warnings: []
  };

  try {
    if (!filename || typeof filename !== 'string') {
      throw new Error('유효하지 않은 파일명입니다');
    }

    // 위험한 문자 제거
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/g;
    let cleanFilename = filename.replace(dangerousChars, '_');
    
    // 예약된 이름 체크 (Windows)
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    if (reservedNames.test(cleanFilename)) {
      cleanFilename = '_' + cleanFilename;
    }

    // 길이 제한
    if (cleanFilename.length > 255) {
      cleanFilename = cleanFilename.substring(0, 255);
      result.warnings.push('파일명이 너무 길어서 잘렸습니다');
    }

    // 공백 정리
    cleanFilename = cleanFilename.trim();
    
    if (cleanFilename !== filename) {
      result.warnings.push('파일명에서 특수문자가 제거되었습니다');
    }

    result.isValid = true;
    result.cleanFilename = cleanFilename;

  } catch (error) {
    result.error = error.message;
  }

  return result;
}

/**
 * 입력값 길이 제한 검증
 * @param {string} input - 검증할 입력값
 * @param {number} maxLength - 최대 길이
 * @returns {object} 검증 결과
 */
export function validateInputLength(input, maxLength = 1000000) {
  const result = {
    isValid: false,
    length: 0,
    error: ''
  };

  if (input == null) {
    result.error = '입력값이 없습니다';
    return result;
  }

  const str = String(input);
  result.length = str.length;

  if (str.length > maxLength) {
    result.error = `입력값이 너무 큽니다. 최대 ${maxLength.toLocaleString()}자`;
    return result;
  }

  result.isValid = true;
  return result;
}

/**
 * 메모리 사용량 기반 입력 검증
 * @param {string} input - 검증할 입력값
 * @returns {object} 검증 결과
 */
export function validateMemoryUsage(input) {
  const result = {
    isValid: false,
    estimatedMemory: 0,
    warning: ''
  };

  if (!input) {
    result.isValid = true;
    return result;
  }

  // 대략적인 메모리 사용량 계산 (UTF-16 기준)
  const estimatedBytes = new Blob([input]).size;
  result.estimatedMemory = estimatedBytes;

  // 10MB 이상이면 경고
  if (estimatedBytes > 10 * 1024 * 1024) {
    result.warning = '입력 데이터가 매우 커서 성능에 영향을 줄 수 있습니다';
  }

  // 50MB 이상이면 거부
  if (estimatedBytes > 50 * 1024 * 1024) {
    result.error = '입력 데이터가 너무 큽니다. 50MB 미만으로 제한됩니다';
    return result;
  }

  result.isValid = true;
  return result;
}

/**
 * Rate Limiting을 위한 요청 빈도 체크
 */
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  /**
   * 요청 허용 여부 확인
   * @param {string} identifier - 클라이언트 식별자
   * @returns {object} 허용 여부 및 정보
   */
  checkLimit(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // 기존 요청 기록 가져오기
    let requestTimes = this.requests.get(identifier) || [];
    
    // 윈도우 시간 이전의 요청 제거
    requestTimes = requestTimes.filter(time => time > windowStart);
    
    // 현재 요청 수 확인
    if (requestTimes.length >= this.maxRequests) {
      const oldestRequest = Math.min(...requestTimes);
      const resetTime = oldestRequest + this.windowMs;
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(resetTime),
        error: `요청 한도를 초과했습니다. ${new Date(resetTime).toLocaleTimeString()}에 재시도하세요.`
      };
    }

    // 새 요청 기록
    requestTimes.push(now);
    this.requests.set(identifier, requestTimes);

    return {
      allowed: true,
      remaining: this.maxRequests - requestTimes.length,
      resetTime: new Date(now + this.windowMs)
    };
  }

  /**
   * 특정 클라이언트의 제한 초기화
   * @param {string} identifier 
   */
  reset(identifier) {
    this.requests.delete(identifier);
  }

  /**
   * 전체 제한 초기화
   */
  resetAll() {
    this.requests.clear();
  }
}

// 전역 Rate Limiter 인스턴스
export const globalRateLimiter = new RateLimiter(100, 60000); // 분당 100회
