// NumberUtil.js - 숫자 관련 유틸리티 함수들

/**
 * 10진수를 2진수로 변환
 */
export function toBinary(num) {
  return parseInt(num, 10).toString(2);
}

/**
 * 10진수를 16진수로 변환
 */
export function toHex(num) {
  return parseInt(num, 10).toString(16).toUpperCase();
}

/**
 * 지정된 범위에서 랜덤 정수 생성
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 지정된 범위에서 지정된 개수만큼 랜덤 정수 배열 생성
 */
export function getRandomInts(min, max, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(getRandomInt(min, max));
  }
  return result;
}
