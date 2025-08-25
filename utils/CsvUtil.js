// CsvUtil.js - CSV 관련 유틸리티 함수들

/**
 * CSV 문자열을 JSON 배열로 변환
 * @param {string} csvString - CSV 문자열
 * @param {object} options - 변환 옵션
 * @returns {object} 변환 결과 { success: boolean, data?: array, error?: string }
 */
export function csvToJson(csvString, options = {}) {
  try {
    if (!csvString || typeof csvString !== 'string') {
      return { success: false, error: 'CSV 데이터가 없습니다.' };
    }

    const {
      delimiter = ',',
      hasHeader = true,
      skipEmptyLines = true
    } = options;

    // 줄바꿈으로 행 분리 (다양한 줄바꿈 문자 지원)
    const lines = csvString.split(/\r?\n/);
    
    if (skipEmptyLines) {
      lines.filter(line => line.trim() !== '');
    }

    if (lines.length === 0) {
      return { success: false, error: '유효한 CSV 데이터가 없습니다.' };
    }

    // CSV 파싱 (간단한 구현 - 따옴표 내 구분자 처리)
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++; // 다음 따옴표 건너뛰기
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const parsedLines = lines.map(parseCSVLine);
    
    if (hasHeader) {
      const headers = parsedLines[0];
      const dataRows = parsedLines.slice(1);
      
      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      return { success: true, data: jsonData };
    } else {
      // 헤더가 없는 경우 배열의 배열로 반환
      return { success: true, data: parsedLines };
    }
  } catch (error) {
    return { success: false, error: `CSV 파싱 오류: ${error.message}` };
  }
}

/**
 * JSON 배열을 CSV 문자열로 변환 (고급 버전)
 * @param {array} jsonArray - JSON 배열
 * @param {object} options - 변환 옵션
 * @returns {object} 변환 결과 { success: boolean, data?: string, error?: string }
 */
export function jsonArrayToCsv(jsonArray, options = {}) {
  try {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
      return { success: false, error: '유효한 JSON 배열이 아닙니다.' };
    }

    const {
      delimiter = ',',
      includeHeader = true,
      headers = null
    } = options;

    // 헤더 결정
    let csvHeaders;
    if (headers) {
      csvHeaders = headers;
    } else {
      // 첫 번째 객체의 키들을 헤더로 사용
      csvHeaders = Object.keys(jsonArray[0]);
    }

    // CSV 값 이스케이프 처리
    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return '';
      
      const stringValue = String(value);
      
      // 구분자, 따옴표, 줄바꿈이 포함된 경우 따옴표로 감싸기
      if (stringValue.includes(delimiter) || 
          stringValue.includes('"') || 
          stringValue.includes('\n') || 
          stringValue.includes('\r')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    };

    const csvLines = [];
    
    // 헤더 추가
    if (includeHeader) {
      csvLines.push(csvHeaders.map(escapeCSVValue).join(delimiter));
    }

    // 데이터 행 추가
    jsonArray.forEach(item => {
      const row = csvHeaders.map(header => escapeCSVValue(item[header]));
      csvLines.push(row.join(delimiter));
    });

    return { success: true, data: csvLines.join('\n') };
  } catch (error) {
    return { success: false, error: `JSON to CSV 변환 오류: ${error.message}` };
  }
}

/**
 * CSV 파일 다운로드를 위한 Blob 생성
 * @param {string} csvString - CSV 문자열
 * @param {string} filename - 파일명 (기본값: 'data.csv')
 * @returns {object} Blob 객체와 다운로드 URL
 */
export function createCSVDownload(csvString, filename = 'data.csv') {
  try {
    // BOM 추가 (Excel에서 한글 깨짐 방지)
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    return { blob, url, filename };
  } catch (error) {
    console.error('CSV 다운로드 생성 오류:', error);
    return null;
  }
}

/**
 * JSON 파일 다운로드를 위한 Blob 생성
 * @param {object|array} jsonData - JSON 데이터
 * @param {string} filename - 파일명 (기본값: 'data.json')
 * @returns {object} Blob 객체와 다운로드 URL
 */
export function createJSONDownload(jsonData, filename = 'data.json') {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    return { blob, url, filename };
  } catch (error) {
    console.error('JSON 다운로드 생성 오류:', error);
    return null;
  }
}
