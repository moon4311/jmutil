// JsonUtil.js - JSON 관련 유틸리티 함수들

/**
 * JSON 문자열을 포맷팅 (들여쓰기 적용)
 */
export function formatJson(jsonStr) {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2);
  } catch (error) {
    throw new Error('JSON 파싱 오류: ' + error.message);
  }
}

/**
 * JSON 문자열을 압축 (공백 제거)
 */
export function minifyJson(jsonStr) {
  try {
    return JSON.stringify(JSON.parse(jsonStr));
  } catch (error) {
    throw new Error('JSON 파싱 오류: ' + error.message);
  }
}

/**
 * JSON 문자열이 유효한지 검증
 */
export function isValidJson(jsonStr) {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch {
    return false;
  }
}
