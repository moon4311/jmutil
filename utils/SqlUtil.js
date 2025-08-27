/**
 * SQL 유틸리티 함수들
 */

export class SqlUtil {
  /**
   * INSERT 쿼리 생성
   * @param {string} tableName - 테이블명
   * @param {Array} columns - 컬럼 정보 [{name, type}, ...]
   * @param {boolean} useParameters - 파라미터 사용 여부 (기본값: true)
   * @returns {Object} {query, parameters}
   */
  static generateInsertQuery(tableName, columns, useParameters = true) {
    if (!tableName || !columns || columns.length === 0) {
      throw new Error('테이블명과 컬럼 정보는 필수입니다.')
    }

    const columnNames = columns.map(col => col.name).join(', ')
    const values = useParameters 
      ? columns.map(() => '?').join(', ')
      : columns.map(col => this._getDefaultValue(col.type)).join(', ')
    
    const query = `INSERT INTO ${tableName} (\n    ${columnNames}\n) VALUES (\n    ${values}\n);`
    const parameters = columns.map(col => col.name)
    
    return { query, parameters }
  }

  /**
   * UPDATE 쿼리 생성
   * @param {string} tableName - 테이블명
   * @param {Array} columns - 컬럼 정보
   * @param {string} whereCondition - WHERE 조건
   * @returns {Object} {query, parameters}
   */
  static generateUpdateQuery(tableName, columns, whereCondition = 'id = ?') {
    if (!tableName || !columns || columns.length === 0) {
      throw new Error('테이블명과 컬럼 정보는 필수입니다.')
    }

    const setClause = columns.map(col => `    ${col.name} = ?`).join(',\n')
    const query = `UPDATE ${tableName}\nSET\n${setClause}\nWHERE ${whereCondition};`
    
    const whereParams = (whereCondition.match(/\?/g) || []).length
    const parameters = [...columns.map(col => col.name), ...Array(whereParams).fill('where_param')]
    
    return { query, parameters }
  }

  /**
   * SELECT 쿼리 생성
   * @param {string} tableName - 테이블명
   * @param {Array} columns - 컬럼 정보
   * @param {string} whereCondition - WHERE 조건 (선택사항)
   * @returns {Object} {query, parameters}
   */
  static generateSelectQuery(tableName, columns, whereCondition = '') {
    if (!tableName || !columns || columns.length === 0) {
      throw new Error('테이블명과 컬럼 정보는 필수입니다.')
    }

    const columnNames = columns.map(col => col.name).join(',\n    ')
    let query = `SELECT\n    ${columnNames}\nFROM ${tableName}`
    
    const parameters = []
    if (whereCondition.trim()) {
      query += `\nWHERE ${whereCondition}`
      const whereParams = (whereCondition.match(/\?/g) || []).length
      parameters.push(...Array(whereParams).fill('where_param'))
    }
    
    query += ';'
    return { query, parameters }
  }

  /**
   * MyBatis Mapper XML 생성
   * @param {Object} config - 설정 객체
   * @returns {string} XML 문자열
   */
  static generateMapperXml(config) {
    const { namespace, tableName, entityClassName, fields, methods } = config
    
    if (!namespace || !tableName || !entityClassName || !fields) {
      throw new Error('필수 설정 정보가 누락되었습니다.')
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="${namespace}">

    <!-- Result Map -->
    <resultMap id="${entityClassName}ResultMap" type="${entityClassName}">
`

    // Result Map 생성
    fields.forEach(field => {
      const tag = field.column === 'id' ? 'id' : 'result'
      xml += `        <${tag} column="${field.column}" property="${field.field}" />\n`
    })

    xml += `    </resultMap>

    <!-- Base Column List -->
    <sql id="Base_Column_List">
        ${fields.map(f => f.column).join(', ')}
    </sql>
`

    // 각 메소드별 쿼리 생성
    if (methods.insert) {
      xml += this._generateInsertMapperXml(tableName, entityClassName, fields)
    }
    
    if (methods.update) {
      xml += this._generateUpdateMapperXml(tableName, entityClassName, fields)
    }
    
    if (methods.selectById) {
      xml += this._generateSelectByIdMapperXml(tableName, entityClassName)
    }
    
    if (methods.selectAll) {
      xml += this._generateSelectAllMapperXml(tableName, entityClassName)
    }
    
    if (methods.delete) {
      xml += this._generateDeleteMapperXml(tableName, entityClassName)
    }

    xml += '\n</mapper>'
    return xml
  }

  /**
   * MyBatis Mapper Java Interface 생성
   * @param {Object} config - 설정 객체
   * @returns {string} Java 인터페이스 문자열
   */
  static generateMapperInterface(config) {
    const { namespace, entityClassName, methods } = config
    
    const packageName = namespace.substring(0, namespace.lastIndexOf('.'))
    const className = namespace.substring(namespace.lastIndexOf('.') + 1)
    
    let javaInterface = `package ${packageName};

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ${className} {

`

    if (methods.insert) {
      javaInterface += `    int insert${entityClassName}(${entityClassName} ${entityClassName.toLowerCase()});\n\n`
    }

    if (methods.update) {
      javaInterface += `    int update${entityClassName}(${entityClassName} ${entityClassName.toLowerCase()});\n\n`
    }

    if (methods.selectById) {
      javaInterface += `    ${entityClassName} select${entityClassName}ById(@Param("id") Long id);\n\n`
    }

    if (methods.selectAll) {
      javaInterface += `    List<${entityClassName}> selectAll${entityClassName}s();\n\n`
    }

    if (methods.delete) {
      javaInterface += `    int delete${entityClassName}(@Param("id") Long id);\n\n`
    }

    javaInterface += '}'
    return javaInterface
  }

  /**
   * SQL 쿼리 분석
   * @param {string} query - 분석할 쿼리
   * @returns {Object} 분석 결과
   */
  static analyzeQuery(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('유효한 쿼리를 입력해주세요.')
    }

    const cleanQuery = query.trim()
    const result = {
      type: this._getQueryType(cleanQuery),
      table: this._extractTableName(cleanQuery),
      columns: [],
      keyValuePairs: [],
      formatted: this._formatQuery(cleanQuery),
      statistics: this._getQueryStatistics(cleanQuery)
    }

    // 쿼리 타입별 상세 분석
    switch (result.type) {
      case 'INSERT':
        this._analyzeInsertQuery(cleanQuery, result)
        break
      case 'UPDATE':
        this._analyzeUpdateQuery(cleanQuery, result)
        break
      case 'SELECT':
        this._analyzeSelectQuery(cleanQuery, result)
        break
      case 'DELETE':
        this._analyzeDeleteQuery(cleanQuery, result)
        break
    }

    return result
  }

  /**
   * 쿼리 포맷팅
   * @param {string} query - 포맷팅할 쿼리
   * @returns {string} 포맷팅된 쿼리
   */
  static formatQuery(query) {
    return this._formatQuery(query)
  }

  // Private 메소드들
  static _getDefaultValue(type) {
    const upperType = type.toUpperCase()
    if (upperType.includes('INT') || upperType.includes('BIGINT') || upperType.includes('NUMBER')) {
      return '0'
    } else if (upperType.includes('VARCHAR') || upperType.includes('TEXT') || upperType.includes('CHAR')) {
      return "''"
    } else if (upperType.includes('DATE') || upperType.includes('TIMESTAMP')) {
      return 'NOW()'
    } else if (upperType.includes('BOOLEAN')) {
      return 'false'
    }
    return 'NULL'
  }

  static _generateInsertMapperXml(tableName, entityClassName, fields) {
    return `
    <!-- Insert -->
    <insert id="insert${entityClassName}" parameterType="${entityClassName}">
        INSERT INTO ${tableName} (
            ${fields.map(f => f.column).join(', ')}
        ) VALUES (
            ${fields.map(f => `#{${f.field}}`).join(', ')}
        )
    </insert>
`
  }

  static _generateUpdateMapperXml(tableName, entityClassName, fields) {
    const updateFields = fields.filter(f => f.column !== 'id')
    return `
    <!-- Update -->
    <update id="update${entityClassName}" parameterType="${entityClassName}">
        UPDATE ${tableName}
        SET
            ${updateFields.map(f => `${f.column} = #{${f.field}}`).join(',\n            ')}
        WHERE id = #{id}
    </update>
`
  }

  static _generateSelectByIdMapperXml(tableName, entityClassName) {
    return `
    <!-- Select by ID -->
    <select id="select${entityClassName}ById" parameterType="long" resultMap="${entityClassName}ResultMap">
        SELECT
            <include refid="Base_Column_List" />
        FROM ${tableName}
        WHERE id = #{id}
    </select>
`
  }

  static _generateSelectAllMapperXml(tableName, entityClassName) {
    return `
    <!-- Select All -->
    <select id="selectAll${entityClassName}s" resultMap="${entityClassName}ResultMap">
        SELECT
            <include refid="Base_Column_List" />
        FROM ${tableName}
        ORDER BY id DESC
    </select>
`
  }

  static _generateDeleteMapperXml(tableName, entityClassName) {
    return `
    <!-- Delete -->
    <delete id="delete${entityClassName}" parameterType="long">
        DELETE FROM ${tableName}
        WHERE id = #{id}
    </delete>
`
  }

  static _getQueryType(query) {
    const upperQuery = query.toUpperCase().trim()
    if (upperQuery.startsWith('INSERT')) return 'INSERT'
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE'
    if (upperQuery.startsWith('SELECT')) return 'SELECT'
    if (upperQuery.startsWith('DELETE')) return 'DELETE'
    if (upperQuery.startsWith('CREATE')) return 'CREATE'
    if (upperQuery.startsWith('DROP')) return 'DROP'
    if (upperQuery.startsWith('ALTER')) return 'ALTER'
    return 'UNKNOWN'
  }

  static _extractTableName(query) {
    const patterns = [
      /INSERT\s+INTO\s+(\w+)/i,
      /UPDATE\s+(\w+)/i,
      /FROM\s+(\w+)/i,
      /DELETE\s+FROM\s+(\w+)/i,
      /CREATE\s+TABLE\s+(\w+)/i,
      /DROP\s+TABLE\s+(\w+)/i,
      /ALTER\s+TABLE\s+(\w+)/i
    ]

    for (const pattern of patterns) {
      const match = query.match(pattern)
      if (match) return match[1]
    }
    
    return ''
  }

  static _formatQuery(query) {
    return query
      .replace(/\bSELECT\b/gi, 'SELECT\n    ')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bINSERT\s+INTO\b/gi, 'INSERT INTO')
      .replace(/\bVALUES?\b/gi, '\nVALUES')
      .replace(/\bUPDATE\b/gi, 'UPDATE')
      .replace(/\bSET\b/gi, '\nSET\n    ')
      .replace(/\bORDER\s+BY\b/gi, '\nORDER BY')
      .replace(/\bGROUP\s+BY\b/gi, '\nGROUP BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bLIMIT\b/gi, '\nLIMIT')
      .replace(/,\s*(?![^()]*\))/g, ',\n    ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  static _analyzeInsertQuery(query, result) {
    const columnMatch = query.match(/\(([^)]+)\)\s*VALUES?\s*\(([^)]+)\)/i)
    if (columnMatch) {
      const columns = this._parseColumnList(columnMatch[1])
      const values = this._parseValueList(columnMatch[2])
      
      result.columns = columns.map(col => ({ name: col.trim(), type: 'Unknown' }))
      
      if (columns.length === values.length) {
        result.keyValuePairs = columns.map((col, index) => ({
          key: col.trim(),
          value: values[index].trim()
        }))
      }
    }
  }

  static _analyzeUpdateQuery(query, result) {
    const setMatch = query.match(/SET\s+(.*?)(?:\s+WHERE|$)/i)
    if (setMatch) {
      const setPairs = this._parseSetClause(setMatch[1])
      result.keyValuePairs = setPairs
      result.columns = setPairs.map(pair => ({ name: pair.key, type: 'Unknown' }))
    }
  }

  static _analyzeSelectQuery(query, result) {
    const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i)
    if (selectMatch) {
      const columnsPart = selectMatch[1].trim()
      if (columnsPart !== '*') {
        const columns = this._parseColumnList(columnsPart)
        result.columns = columns.map(col => ({ name: col.trim(), type: 'Unknown' }))
      }
    }
  }

  static _analyzeDeleteQuery(query, result) {
    // DELETE 쿼리는 일반적으로 컬럼 정보를 포함하지 않음
    const whereMatch = query.match(/WHERE\s+(.+)/i)
    if (whereMatch) {
      result.whereClause = whereMatch[1].trim()
    }
  }

  static _parseColumnList(columnStr) {
    return columnStr.split(',').map(col => col.trim()).filter(col => col)
  }

  static _parseValueList(valueStr) {
    const values = []
    let current = ''
    let inQuotes = false
    let quoteChar = ''
    let parentheses = 0

    for (let i = 0; i < valueStr.length; i++) {
      const char = valueStr[i]
      
      if (!inQuotes && (char === "'" || char === '"')) {
        inQuotes = true
        quoteChar = char
        current += char
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false
        current += char
      } else if (!inQuotes && char === '(') {
        parentheses++
        current += char
      } else if (!inQuotes && char === ')') {
        parentheses--
        current += char
      } else if (!inQuotes && char === ',' && parentheses === 0) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    if (current.trim()) {
      values.push(current.trim())
    }
    
    return values
  }

  static _parseSetClause(setStr) {
    return setStr.split(',').map(pair => {
      const parts = pair.split('=')
      if (parts.length >= 2) {
        return {
          key: parts[0].trim(),
          value: parts.slice(1).join('=').trim()
        }
      }
      return null
    }).filter(pair => pair !== null)
  }

  static _getQueryStatistics(query) {
    return {
      length: query.length,
      lines: query.split('\n').length,
      words: query.split(/\s+/).length,
      parameters: (query.match(/\?/g) || []).length
    }
  }
}

export default SqlUtil
