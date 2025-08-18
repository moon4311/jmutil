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
  return str.toString().padStart(length, char);
}

/**
 * 문자열을 지정된 길이만큼 오른쪽에 특정 문자로 채움 (rpad)
 */
export function rpad(str, length, char = ' ') {
  return str.toString().padEnd(length, char);
}
