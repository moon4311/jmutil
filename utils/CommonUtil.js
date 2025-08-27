// CommonUtil.js - 공통 유틸리티 함수들

/**
 * 2자리 0 패딩
 * @param {number|string} n - 패딩할 숫자
 * @returns {string} 2자리로 패딩된 문자열
 */
export function pad2(n) {
  return n.toString().padStart(2, '0');
}

/**
 * Date 객체를 YYYY-MM-DD 문자열로 변환 (CommonUtil 내부 구현)
 * @param {Date} d - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식 문자열
 */
function _formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Date 객체를 YYYY-MM-DD HH:mm:ss 문자열로 변환 (CommonUtil 내부 구현)
 * @param {Date} d - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD HH:mm:ss 형식 문자열
 */
function _formatDateTime(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * Date 객체를 HH:mm:ss 문자열로 변환 (CommonUtil 내부 구현)
 * @param {Date} d - 변환할 Date 객체
 * @returns {string} HH:mm:ss 형식 문자열
 */
function _formatTime(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} YYYY-MM-DD 형식의 오늘 날짜
 */
export function getToday() {
  return _formatDate(new Date());
}

/**
 * 현재 일시를 YYYY-MM-DD HH:mm:ss 형식으로 반환
 * @returns {string} YYYY-MM-DD HH:mm:ss 형식의 현재 일시
 */
export function getNow() {
  return _formatDateTime(new Date());
}

/**
 * 현재 시각을 HH:mm:ss 형식으로 반환
 * @returns {string} HH:mm:ss 형식의 현재 시각
 */
export function getNowTime() {
  return _formatTime(new Date());
}

/**
 * 현재 타임스탬프(ms) 반환
 * @returns {number} 현재 타임스탬프(밀리초)
 */
export function getNowTimestamp() {
  return Date.now();
}

/**
 * datetime-local 형식 문자열 생성 (YYYY-MM-DDTHH:mm)
 * @param {Date} [date] - 변환할 Date 객체 (기본값: 현재 시간)
 * @returns {string} YYYY-MM-DDTHH:mm 형식의 문자열
 */
export function toDatetimeLocal(date) {
  const d = date || new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
