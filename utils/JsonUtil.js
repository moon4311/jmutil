// JsonUtil.js - JSON 관련 유틸리티 함수들
import { pad2 } from './CommonUtil.js';

/**
 * JSON 문자열을 포맷팅 (들여쓰기 적용)
 * @param {string} jsonStr - 포맷팅할 JSON 문자열
 * @returns {string} 포맷팅된 JSON 문자열
 * @throws {Error} JSON 파싱 오류 시 예외 발생
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

/**
 * JSON을 CSV로 변환
 */
export function jsonToCsv(jsonStr) {
  try {
    if (!jsonStr || jsonStr.trim() === '') {
      throw new Error('입력된 JSON이 비어있습니다.');
    }

    const jsonData = JSON.parse(jsonStr);
    
    // 배열이 아닌 경우 배열로 감싸기
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    if (dataArray.length === 0) {
      throw new Error('빈 데이터입니다.');
    }
    
    // 첫 번째 객체에서 헤더 순서를 정의하고, 나머지 객체에서 추가 키들을 수집
    const headers = new Set();
    
    // 첫 번째 객체의 키 순서를 먼저 추가
    if (dataArray[0] && typeof dataArray[0] === 'object') {
      Object.keys(dataArray[0]).forEach(key => headers.add(key));
    }
    
    // 나머지 객체들에서 추가 키들 수집
    dataArray.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => headers.add(key));
      }
    });
    
    const headerArray = Array.from(headers);
    
    // CSV 헤더 생성 (BOM 추가로 한글 깨짐 방지)
    let csv = '\uFEFF' + headerArray.join(',') + '\n';
    
    // 각 행 데이터 생성
    dataArray.forEach(item => {
      if (typeof item !== 'object' || item === null) {
        // 객체가 아닌 경우 빈 행 추가
        csv += headerArray.map(() => '').join(',') + '\n';
        return;
      }
      
      const row = headerArray.map(header => {
        const value = item[header];
        
        if (value === null || value === undefined) {
          return '';
        }
        
        // 모든 값을 문자열로 변환
        let stringValue = String(value).trim();
        
        // 빈 문자열인 경우
        if (stringValue === '') {
          return '';
        }
        
        // CSV에서 특별히 처리해야 하는 문자들이 포함된 경우 따옴표로 감싸기
        if (stringValue.includes(',') || 
            stringValue.includes('"') || 
            stringValue.includes('\n') || 
            stringValue.includes('\r') ||
            stringValue.startsWith(' ') || 
            stringValue.endsWith(' ')) {
          // 따옴표 이스케이프 처리
          stringValue = stringValue.replace(/"/g, '""');
          return `"${stringValue}"`;
        }
        
        return stringValue;
      });
      
      csv += row.join(',') + '\n';
    });
    
    return csv;
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
