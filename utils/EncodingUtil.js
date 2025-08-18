// EncodingUtil.js - 인코딩/디코딩 유틸리티 함수들

/**
 * Base64 인코딩
 */
export function encodeBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    throw new Error('Base64 인코딩 오류');
  }
}

/**
 * Base64 디코딩
 */
export function decodeBase64(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    throw new Error('Base64 디코딩 오류');
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
    throw new Error('URL 디코딩 오류');
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
    throw new Error('HEX 디코딩 오류');
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
    throw new Error('Unicode 디코딩 오류');
  }
}

/**
 * 통합 인코딩 함수
 */
export function encode(str, type) {
  switch (type) {
    case 'base64': return encodeBase64(str);
    case 'url': return encodeURL(str);
    case 'hex': return encodeHex(str);
    case 'unicode': return encodeUnicode(str);
    default: throw new Error('지원되지 않는 인코딩 타입');
  }
}

/**
 * 통합 디코딩 함수
 */
export function decode(str, type) {
  switch (type) {
    case 'base64': return decodeBase64(str);
    case 'url': return decodeURL(str);
    case 'hex': return decodeHex(str);
    case 'unicode': return decodeUnicode(str);
    default: throw new Error('지원되지 않는 디코딩 타입');
  }
}
