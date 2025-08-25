// StringUtil.js - 문자열 관련 유틸리티 함수들

/**
 * 카멜케이스로 변환
 */
export function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (m) => m.toLowerCase());
}

/**
 * 스네이크케이스로 변환  
 */
export function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * 문자열을 지정된 길이만큼 왼쪽에 특정 문자로 채움 (lpad)
 */
export function lpad(str, length, char = ' ') {
  if (!str) str = '';
  const numLength = parseInt(length, 10);
  if (isNaN(numLength) || numLength <= 0) return str.toString();
  if (!char || char === '') char = ' ';
  return str.toString().padStart(numLength, char);
}

/**
 * 문자열을 지정된 길이만큼 오른쪽에 특정 문자로 채움 (rpad)
 */
export function rpad(str, length, char = ' ') {
  if (!str) str = '';
  const numLength = parseInt(length, 10);
  if (isNaN(numLength) || numLength <= 0) return str.toString();
  if (!char || char === '') char = ' ';
  return str.toString().padEnd(numLength, char);
}

// =============== 인코딩/디코딩 함수들 ===============

/**
 * Base64 인코딩
 */
export function encodeBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return 'Base64 인코딩 오류';
  }
}

/**
 * Base64 디코딩
 */
export function decodeBase64(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return 'Base64 디코딩 오류';
  }
}

/**
 * URL 인코딩
 */
export function encodeURL(str) {
  return encodeURIComponent(str);
}

/**
 * URL 디코딩
 */
export function decodeURL(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return 'URL 디코딩 오류';
  }
}

/**
 * HEX 인코딩
 */
export function encodeHex(str) {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

/**
 * HEX 디코딩
 */
export function decodeHex(str) {
  try {
    return str.replace(/(..)/g, (m, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
  } catch {
    return 'HEX 디코딩 오류';
  }
}

/**
 * Unicode 인코딩
 */
export function encodeUnicode(str) {
  return Array.from(str)
    .map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('');
}

/**
 * Unicode 디코딩
 */
export function decodeUnicode(str) {
  try {
    return str.replace(/\\u([\dA-Fa-f]{4})/g, (m, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
  } catch {
    return 'Unicode 디코딩 오류';
  }
}

// =============== 공백/특수문자 처리 함수들 ===============

/**
 * 모든 공백 제거 (스페이스, 탭, 줄바꿈 등)
 */
export function removeAllSpaces(str) {
  if (!str) return '';
  return str.replace(/\s+/g, '');
}

/**
 * 여러 공백을 하나로 변환
 */
export function normalizeSpaces(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * 특수문자 제거 (알파벳, 숫자, 한글, 공백만 남김)
 */
export function removeSpecialChars(str) {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9가-힣\s]/g, '');
}

/**
 * 숫자만 추출
 */
export function extractNumbers(str) {
  if (!str) return '';
  return str.replace(/[^0-9]/g, '');
}

/**
 * 영문자만 추출
 */
export function extractAlphabets(str) {
  if (!str) return '';
  return str.replace(/[^a-zA-Z]/g, '');
}

/**
 * 한글만 추출
 */
export function extractKorean(str) {
  if (!str) return '';
  return str.replace(/[^가-힣]/g, '');
}

// =============== 정규식 테스트 함수들 ===============

/**
 * 정규식 매칭 테스트
 */
export function regexTest(str, pattern, flags = 'g') {
  try {
    if (!str || !pattern) return { success: false, error: '문자열과 패턴을 입력해주세요.' };
    
    const regex = new RegExp(pattern, flags);
    const matches = str.match(regex);
    const isMatch = regex.test(str);
    
    return {
      success: true,
      isMatch,
      matches: matches || [],
      matchCount: matches ? matches.length : 0
    };
  } catch (error) {
    return {
      success: false,
      error: `정규식 오류: ${error.message}`
    };
  }
}

/**
 * 정규식으로 문자열 치환
 */
export function regexReplace(str, pattern, replacement, flags = 'g') {
  try {
    if (!str || !pattern) return { success: false, error: '문자열과 패턴을 입력해주세요.' };
    
    const regex = new RegExp(pattern, flags);
    const result = str.replace(regex, replacement || '');
    
    return {
      success: true,
      result
    };
  } catch (error) {
    return {
      success: false,
      error: `정규식 오류: ${error.message}`
    };
  }
}
