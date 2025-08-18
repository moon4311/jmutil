// CommonUtil.js - 공통 유틸리티 함수들

/**
 * 2자리 0 패딩
 */
export function pad2(n) {
  return n.toString().padStart(2, '0');
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * 현재 일시를 YYYY-MM-DD HH:mm:ss 형식으로 반환
 */
export function getNow() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * 현재 시각을 HH:mm:ss 형식으로 반환
 */
export function getNowTime() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * 현재 타임스탬프(ms) 반환
 */
export function getNowTimestamp() {
  return Date.now();
}

/**
 * datetime-local 형식 문자열 생성 (YYYY-MM-DDTHH:mm)
 */
export function toDatetimeLocal(date) {
  const d = date || new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
