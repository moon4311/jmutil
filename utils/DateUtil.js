// DateUtil.js - 날짜/타임스탬프 변환 공통 유틸리티
import { pad2 } from './CommonUtil.js';

/**
 * YYYY-MM-DD 포맷 문자열이 유효한지 검사
 * @param {string} str - 검증할 날짜 문자열
 * @returns {boolean} 유효성 여부
 */
export function isValidDate(str) {
  const m = str.match(/^\d{4}-\d{2}-\d{2}$/);
  if (!m) return false;
  const d = new Date(str);
  return !isNaN(d) && d.getFullYear() == str.slice(0,4) && (d.getMonth() + 1) == Number(str.slice(5,7)) && d.getDate() == Number(str.slice(8,10));
}

/**
 * HH:mm:ss 포맷 문자열이 유효한지 검사
 * @param {string} str - 검증할 시간 문자열
 * @returns {boolean} 유효성 여부
 */
export function isValidTime(str) {
  const m = str.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return false;
  const h = Number(m[1]), mi = Number(m[2]), s = Number(m[3]);
  return h >= 0 && h < 24 && mi >= 0 && mi < 60 && s >= 0 && s < 60;
}

/**
 * 날짜+시간이 유효한지 검사
 * @param {string} date - 날짜 문자열
 * @param {string} time - 시간 문자열
 * @returns {boolean} 유효성 여부
 */
export function isValidDatetime(date, time) {
  return isValidDate(date) && isValidTime(time);
}

/**
 * Date 객체를 YYYY-MM-DD 문자열로 변환
 * @param {Date} d - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식 문자열
 */
export function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Date 객체를 YYYY-MM-DD HH:mm:ss 문자열로 변환
 * @param {Date} d - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD HH:mm:ss 형식 문자열
 */
export function formatDateTime(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * Date 객체를 HH:mm:ss 문자열로 변환
 * @param {Date} d - 변환할 Date 객체
 * @returns {string} HH:mm:ss 형식 문자열
 */
export function formatTime(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * YYYY-MM-DD → timestamp(ms)
 */
export function dateToTimestamp(str) {
  if (!isValidDate(str)) return NaN;
  return new Date(str).getTime();
}

/**
 * YYYY-MM-DDTHH:mm:ss → timestamp(ms)
 */
export function datetimeToTimestamp(str) {
  const d = new Date(str);
  return isNaN(d) ? NaN : d.getTime();
}

/**
 * timestamp(ms) → YYYY-MM-DD HH:mm:ss
 */
export function timestampToDateTime(ts) {
  const d = new Date(Number(ts));
  return formatDateTime(d);
}

/**
 * timestamp(ms) → YYYY-MM-DD
 */
export function timestampToDate(ts) {
  const d = new Date(Number(ts));
  return formatDate(d);
}
