// ColorUtil.js - 색상 관련 유틸리티 함수들

/**
 * HEX 색상을 RGB로 변환
 */
export function hexToRgb(hex) {
  // # 제거
  const cleanHex = hex.replace('#', '');
  
  // 3자리 HEX를 6자리로 확장
  const fullHex = cleanHex.length === 3 
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;
  
  const r = parseInt(fullHex.substr(0, 2), 16);
  const g = parseInt(fullHex.substr(2, 2), 16);
  const b = parseInt(fullHex.substr(4, 2), 16);
  
  return { r, g, b };
}

/**
 * RGB 색상을 HEX로 변환
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 색상을 밝게 만들기
 */
export function lighten(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.round(255 * (percent / 100));
  
  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

/**
 * 색상을 어둡게 만들기
 */
export function darken(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.round(255 * (percent / 100));
  
  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount)
  );
}

/**
 * 랜덤 HEX 색상 생성
 */
export function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

/**
 * 색상의 밝기 계산 (0-255)
 */
export function getBrightness(hex) {
  const { r, g, b } = hexToRgb(hex);
  return Math.round((r * 299 + g * 587 + b * 114) / 1000);
}

/**
 * 색상이 밝은지 어두운지 판단
 */
export function isLightColor(hex) {
  return getBrightness(hex) > 127;
}

/**
 * 대비되는 텍스트 색상 (흰색 또는 검은색) 반환
 */
export function getContrastColor(hex) {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
}

/**
 * HEX 색상이 유효한지 검증
 */
export function isValidHex(hex) {
  return /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i.test(hex);
}
