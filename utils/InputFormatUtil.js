// InputFormatUtil.js - 입력 포맷팅 유틸리티 함수들

/**
 * YYYY-MM-DD 형식으로 자동 포맷팅
 */
export function formatDateInput(val) {
  let digits = val.replace(/\D/g, '');
  if (digits.length > 8) digits = digits.slice(0, 8);
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (digits.length > 4 && digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return digits;
}

/**
 * HH:mm:ss 형식으로 자동 포맷팅
 */
export function formatTimeInput(val) {
  let digits = val.replace(/\D/g, '');
  if (digits.length > 6) digits = digits.slice(0, 6);
  if (digits.length >= 6) {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
  }
  if (digits.length >= 4) {
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}`;
  }
  return digits;
}
