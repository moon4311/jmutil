// NumberUtil.js - 숫자 관련 유틸리티 함수들

/**
 * 10진수를 2진수로 변환
 * @param {number|string} num - 변환할 숫자
 * @returns {string} 2진수 문자열
 */
export function toBinary(num) {
  return parseInt(num, 10).toString(2);
}

/**
 * 10진수를 16진수로 변환
 * @param {number|string} num - 변환할 숫자
 * @returns {string} 16진수 문자열 (대문자)
 */
export function toHex(num) {
  return parseInt(num, 10).toString(16).toUpperCase();
}

/**
 * 지정된 범위에서 랜덤 정수 생성
 * @param {number} min - 최솟값 (포함)
 * @param {number} max - 최댓값 (포함)
 * @returns {number} 랜덤 정수
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 지정된 범위에서 지정된 개수만큼 랜덤 정수 배열 생성
 * @param {number} min - 최솟값 (포함)
 * @param {number} max - 최댓값 (포함)  
 * @param {number} count - 생성할 숫자 개수
 * @returns {number[]} 랜덤 정수 배열
 */
export function getRandomInts(min, max, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(getRandomInt(min, max));
  }
  return result;
}
