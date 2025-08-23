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
