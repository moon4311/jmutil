// JsonUtil.js - JSON 관련 유틸리티 함수들
import { pad2 } from './CommonUtil.js';

// 성능 최적화를 위한 캐시
const parseCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * 캐시된 JSON 파싱
 * @param {string} jsonStr - 파싱할 JSON 문자열
 * @returns {any} 파싱된 객체
 */
function cachedJsonParse(jsonStr) {
  if (!jsonStr || typeof jsonStr !== 'string') {
    throw new Error('유효하지 않은 JSON 문자열입니다.');
  }

  // 캐시 확인
  if (parseCache.has(jsonStr)) {
    return parseCache.get(jsonStr);
  }

  // 파싱
  const parsed = JSON.parse(jsonStr);
  
  // 캐시 크기 제한
  if (parseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = parseCache.keys().next().value;
    parseCache.delete(firstKey);
  }
  
  parseCache.set(jsonStr, parsed);
  return parsed;
}

/**
 * JSON 문자열을 포맷팅 (들여쓰기 적용)
 * @param {string} jsonStr - 포맷팅할 JSON 문자열
 * @returns {string} 포맷팅된 JSON 문자열
 * @throws {Error} JSON 파싱 오류 시 예외 발생
 */
export function formatJson(jsonStr) {
  if (!jsonStr?.trim()) {
    throw new Error('JSON 데이터가 비어있습니다.');
  }
  
  try {
    const parsed = cachedJsonParse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error('JSON 파싱 오류: ' + error.message);
  }
}

/**
 * JSON 문자열을 압축 (공백 제거)
 * @param {string} jsonStr - 압축할 JSON 문자열
 * @returns {string} 압축된 JSON 문자열
 * @throws {Error} JSON 파싱 오류 시 예외 발생
 */
export function minifyJson(jsonStr) {
  if (!jsonStr?.trim()) {
    throw new Error('JSON 데이터가 비어있습니다.');
  }
  
  try {
    const parsed = cachedJsonParse(jsonStr);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('JSON 파싱 오류: ' + error.message);
  }
}

/**
 * JSON 문자열이 유효한지 검증
 * @param {string} jsonStr - 검증할 JSON 문자열
 * @returns {boolean} 유효성 검사 결과
 */
export function isValidJson(jsonStr) {
  if (!jsonStr || typeof jsonStr !== 'string') {
    return false;
  }
  
  try {
    cachedJsonParse(jsonStr);
    return true;
  } catch {
    return false;
  }
}

/**
 * JSON을 CSV로 변환 (성능 최적화 버전)
 * @param {string} jsonStr - 변환할 JSON 문자열
 * @returns {string} CSV 문자열
 * @throws {Error} 변환 오류 시 예외 발생
 */
export function jsonToCsv(jsonStr) {
  if (!jsonStr?.trim()) {
    throw new Error('입력된 JSON이 비어있습니다.');
  }

  try {
    const jsonData = cachedJsonParse(jsonStr);
    
    // 배열이 아닌 경우 배열로 감싸기
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    if (dataArray.length === 0) {
      throw new Error('빈 데이터입니다.');
    }
    
    // 헤더 수집 최적화 - Set 사용
    const headerSet = new Set();
    
    // 첫 번째 객체의 키 순서를 먼저 추가
    const firstItem = dataArray[0];
    if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
      Object.keys(firstItem).forEach(key => headerSet.add(key));
    }
    
    // 나머지 객체들에서 추가 키들 수집 (성능 최적화)
    for (let i = 1; i < dataArray.length; i++) {
      const item = dataArray[i];
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => headerSet.add(key));
      }
    }
    
    const headerArray = Array.from(headerSet);
    
    // CSV 생성 - StringBuilder 패턴 사용
    const csvLines = [];
    csvLines.push('\uFEFF' + headerArray.join(',')); // BOM 추가
    
    // 각 행 데이터 생성 (성능 최적화)
    for (const item of dataArray) {
      if (typeof item !== 'object' || item === null) {
        csvLines.push(headerArray.map(() => '').join(','));
        continue;
      }
      
      const row = headerArray.map(header => {
        const value = item[header];
        
        if (value == null) return '';
        
        let stringValue = String(value).trim();
        
        if (stringValue === '') return '';
        
        // CSV 이스케이프 처리
        if (stringValue.includes(',') || 
            stringValue.includes('"') || 
            stringValue.includes('\n') || 
            stringValue.includes('\r') ||
            stringValue.startsWith(' ') || 
            stringValue.endsWith(' ')) {
          stringValue = `"${stringValue.replace(/"/g, '""')}"`;
        }
        
        return stringValue;
      });
      
      csvLines.push(row.join(','));
    }
    
    return csvLines.join('\n');
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('JSON 형식이 올바르지 않습니다: ' + error.message);
    }
    throw new Error('CSV 변환 오류: ' + error.message);
  }
}

/**
 * 현재 날짜/시간 기반 파일명 생성 (YYYYMMDDHHMMSS.csv)
 * @returns {string} YYYYMMDDHHMMSS.csv 형식의 파일명
 */
export function generateCsvFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad2(now.getMonth() + 1);
  const day = pad2(now.getDate());
  const hours = pad2(now.getHours());
  const minutes = pad2(now.getMinutes());
  const seconds = pad2(now.getSeconds());
  
  return `${year}${month}${day}${hours}${minutes}${seconds}.csv`;
}

// =============== JSON 고급 기능들 ===============

/**
 * JSON 데이터에서 사용 가능한 키 목록 추출
 * @param {string} jsonStr - JSON 문자열
 * @returns {string[]} 키 목록 배열
 */
export function extractKeys(jsonStr) {
  try {
    if (!jsonStr) return [];

    const jsonData = JSON.parse(jsonStr);
    const keys = new Set();
    
    if (Array.isArray(jsonData)) {
      // 배열인 경우 모든 객체의 키를 수집
      jsonData.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => keys.add(key));
        }
      });
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // 단일 객체인 경우
      Object.keys(jsonData).forEach(key => keys.add(key));
    }
    
    return Array.from(keys).sort();
  } catch (error) {
    return [];
  }
}

/**
 * JSON 배열에서 특정 키들만 선택해서 추출
 * @param {string} jsonStr - JSON 문자열
 * @param {string[]} keys - 추출할 키 배열
 * @returns {string} 필터링된 JSON 문자열
 */
export function selectKeys(jsonStr, keys) {
  try {
    if (!jsonStr || !keys || keys.length === 0) {
      throw new Error('JSON 데이터와 키를 입력해주세요.');
    }

    const jsonData = JSON.parse(jsonStr);
    
    if (Array.isArray(jsonData)) {
      const filteredData = jsonData.map(item => {
        const filteredItem = {};
        keys.forEach(key => {
          if (item.hasOwnProperty(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });
      return JSON.stringify(filteredData, null, 2);
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      const filteredData = {};
      keys.forEach(key => {
        if (jsonData.hasOwnProperty(key)) {
          filteredData[key] = jsonData[key];
        }
      });
      return JSON.stringify(filteredData, null, 2);
    } else {
      throw new Error('JSON 데이터는 객체 또는 객체 배열이어야 합니다.');
    }
  } catch (error) {
    throw new Error(`키 선택 오류: ${error.message}`);
  }
}

/**
 * JSON 배열에서 다중 조건을 만족하는 객체 찾기
 * @param {string} jsonStr - JSON 문자열
 * @param {array} conditions - 조건 배열 [{ key, operator, value }, ...]
 * @param {string} logicalOperator - 논리 연산자 ('AND' 또는 'OR')
 * @returns {string} 조건에 맞는 객체들의 JSON 문자열
 */
export function filterObjectsMultiple(jsonStr, conditions, logicalOperator = 'AND') {
  try {
    if (!jsonStr || !conditions || conditions.length === 0) {
      throw new Error('JSON 데이터와 조건을 입력해주세요.');
    }

    const jsonData = JSON.parse(jsonStr);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON 데이터는 배열이어야 합니다.');
    }

    // 유효한 조건만 필터링
    const validConditions = conditions.filter(condition => 
      condition.key && condition.value !== undefined && condition.value !== ''
    );

    if (validConditions.length === 0) {
      throw new Error('유효한 조건이 없습니다.');
    }

    const filteredData = jsonData.filter(item => {
      const conditionResults = validConditions.map(condition => {
        if (!item.hasOwnProperty(condition.key)) {
          return false;
        }

        const itemValue = item[condition.key];
        const compareValue = condition.value;

        // 숫자 비교를 위한 변환
        const numItemValue = Number(itemValue);
        const numCompareValue = Number(compareValue);
        const isNumericComparison = !isNaN(numItemValue) && !isNaN(numCompareValue);

        switch (condition.operator) {
          case '=':
          case '==':
            return itemValue == compareValue;
          case '!=':
            return itemValue != compareValue;
          case '>':
            return isNumericComparison ? numItemValue > numCompareValue : String(itemValue) > String(compareValue);
          case '<':
            return isNumericComparison ? numItemValue < numCompareValue : String(itemValue) < String(compareValue);
          case '>=':
            return isNumericComparison ? numItemValue >= numCompareValue : String(itemValue) >= String(compareValue);
          case '<=':
            return isNumericComparison ? numItemValue <= numCompareValue : String(itemValue) <= String(compareValue);
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(compareValue).toLowerCase());
          case 'startsWith':
            return String(itemValue).toLowerCase().startsWith(String(compareValue).toLowerCase());
          case 'endsWith':
            return String(itemValue).toLowerCase().endsWith(String(compareValue).toLowerCase());
          default:
            throw new Error(`지원하지 않는 연산자: ${condition.operator}`);
        }
      });

      // 논리 연산자에 따라 결과 결합
      if (logicalOperator === 'OR') {
        return conditionResults.some(result => result);
      } else { // AND
        return conditionResults.every(result => result);
      }
    });

    return JSON.stringify(filteredData, null, 2);
  } catch (error) {
    throw new Error(`필터링 오류: ${error.message}`);
  }
}

/**
 * JSON 배열에서 특정 조건을 만족하는 객체 찾기 (기존 단일 조건)
 * @param {string} jsonStr - JSON 문자열
 * @param {string} key - 검색할 키
 * @param {string} operator - 비교 연산자 (=, !=, >, <, >=, <=, contains, startsWith, endsWith)
 * @param {string} value - 비교할 값
 * @returns {string} 조건에 맞는 객체들의 JSON 문자열
 */
export function filterObjects(jsonStr, key, operator, value) {
  try {
    if (!jsonStr || !key || !operator || value === undefined) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    const jsonData = JSON.parse(jsonStr);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON 데이터는 배열이어야 합니다.');
    }

    const filteredData = jsonData.filter(item => {
      if (!item.hasOwnProperty(key)) {
        return false;
      }

      const itemValue = item[key];
      const compareValue = value;

      // 숫자 비교를 위한 변환
      const numItemValue = Number(itemValue);
      const numCompareValue = Number(compareValue);
      const isNumericComparison = !isNaN(numItemValue) && !isNaN(numCompareValue);

      switch (operator) {
        case '=':
        case '==':
          return itemValue == compareValue;
        case '!=':
          return itemValue != compareValue;
        case '>':
          return isNumericComparison ? numItemValue > numCompareValue : String(itemValue) > String(compareValue);
        case '<':
          return isNumericComparison ? numItemValue < numCompareValue : String(itemValue) < String(compareValue);
        case '>=':
          return isNumericComparison ? numItemValue >= numCompareValue : String(itemValue) >= String(compareValue);
        case '<=':
          return isNumericComparison ? numItemValue <= numCompareValue : String(itemValue) <= String(compareValue);
        case 'contains':
          return String(itemValue).toLowerCase().includes(String(compareValue).toLowerCase());
        case 'startsWith':
          return String(itemValue).toLowerCase().startsWith(String(compareValue).toLowerCase());
        case 'endsWith':
          return String(itemValue).toLowerCase().endsWith(String(compareValue).toLowerCase());
        default:
          throw new Error(`지원하지 않는 연산자: ${operator}`);
      }
    });

    return JSON.stringify(filteredData, null, 2);
  } catch (error) {
    throw new Error(`필터링 오류: ${error.message}`);
  }
}

/**
 * JSON 배열을 특정 키로 정렬
 * @param {string} jsonStr - JSON 문자열
 * @param {string} key - 정렬할 키
 * @param {string} order - 정렬 순서 ('asc' 또는 'desc')
 * @param {string} type - 데이터 타입 ('string', 'number', 'date')
 * @returns {string} 정렬된 JSON 문자열
 */
export function sortObjects(jsonStr, key, order = 'asc', type = 'string') {
  try {
    if (!jsonStr || !key) {
      throw new Error('JSON 데이터와 정렬 키를 입력해주세요.');
    }

    const jsonData = JSON.parse(jsonStr);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON 데이터는 배열이어야 합니다.');
    }

    const sortedData = [...jsonData].sort((a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      let valueA = a[key];
      let valueB = b[key];

      // 데이터 타입에 따른 변환
      switch (type) {
        case 'number':
          valueA = Number(valueA);
          valueB = Number(valueB);
          if (isNaN(valueA)) valueA = 0;
          if (isNaN(valueB)) valueB = 0;
          break;
        case 'date':
          valueA = new Date(valueA);
          valueB = new Date(valueB);
          if (isNaN(valueA.getTime())) valueA = new Date(0);
          if (isNaN(valueB.getTime())) valueB = new Date(0);
          break;
        default: // 'string'
          valueA = String(valueA).toLowerCase();
          valueB = String(valueB).toLowerCase();
          break;
      }

      let result = 0;
      if (valueA < valueB) {
        result = -1;
      } else if (valueA > valueB) {
        result = 1;
      }

      return order === 'desc' ? -result : result;
    });

    return JSON.stringify(sortedData, null, 2);
  } catch (error) {
    throw new Error(`정렬 오류: ${error.message}`);
  }
}

/**
 * JSON 배열의 통계 정보 계산
 * @param {string} jsonStr - JSON 문자열
 * @param {string} key - 계산할 키 (숫자형 데이터)
 * @returns {object} 통계 정보 (count, sum, avg, min, max)
 */
export function calculateStats(jsonStr, key) {
  try {
    if (!jsonStr || !key) {
      throw new Error('JSON 데이터와 키를 입력해주세요.');
    }

    const jsonData = JSON.parse(jsonStr);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON 데이터는 배열이어야 합니다.');
    }

    const values = jsonData
      .filter(item => item.hasOwnProperty(key))
      .map(item => Number(item[key]))
      .filter(value => !isNaN(value));

    if (values.length === 0) {
      return {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
        error: '유효한 숫자 데이터가 없습니다.'
      };
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      sum: sum,
      avg: Number(avg.toFixed(2)),
      min: min,
      max: max
    };
  } catch (error) {
    return {
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
      error: `통계 계산 오류: ${error.message}`
    };
  }
}
