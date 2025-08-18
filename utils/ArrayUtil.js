// ArrayUtil.js - 배열 관련 유틸리티 함수들

/**
 * 배열에서 중복 요소 제거
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * 중첩 배열을 평탄화
 */
export function flatten(arr, depth = Infinity) {
  if (depth === 1) {
    return arr.flat();
  }
  return arr.flat(depth);
}

/**
 * 배열을 무작위로 섞기 (Fisher-Yates 알고리즘)
 */
export function shuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 객체 배열을 특정 키로 그룹핑
 */
export function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * 배열을 지정된 크기로 분할
 */
export function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * 배열 교집합
 */
export function intersection(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

/**
 * 배열 차집합
 */
export function difference(arr1, arr2) {
  return arr1.filter(value => !arr2.includes(value));
}

/**
 * 빈 배열 체크
 */
export function isEmpty(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}
