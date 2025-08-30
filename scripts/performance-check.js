import fs from 'fs'
import path from 'path'

/**
 * 성능 체크 스크립트
 */
const checkPerformance = () => {
  console.log('🔍 성능 분석 시작...')

  const results = {
    timestamp: new Date().toISOString(),
    checks: []
  }

  // 1. 파일 크기 체크
  console.log('\n📁 파일 크기 분석:')
  
  const checkFileSize = (filePath, maxSizeKB, description) => {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      const sizeKB = Math.round(stats.size / 1024 * 100) / 100
      const isOptimal = sizeKB <= maxSizeKB
      
      console.log(`  ${description}: ${sizeKB} KB ${isOptimal ? '✅' : '⚠️'}`)
      
      results.checks.push({
        type: 'fileSize',
        file: filePath,
        size: sizeKB,
        maxSize: maxSizeKB,
        optimal: isOptimal,
        description
      })
      
      return isOptimal
    }
    return true
  }

  // 주요 파일들 체크 (새로운 리팩토링된 파일들 포함)
  checkFileSize('utils/JsonUtil.js', 50, 'JsonUtil.js (기존)')
  checkFileSize('utils/JsonUtilNew.js', 50, 'JsonUtilNew.js (리팩토링)')
  checkFileSize('utils/StringUtil.js', 30, 'StringUtil.js (기존)')
  checkFileSize('utils/StringUtilNew.js', 30, 'StringUtilNew.js (리팩토링)')
  checkFileSize('utils/ArrayUtil.js', 20, 'ArrayUtil.js (기존)')
  checkFileSize('utils/ArrayUtilNew.js', 20, 'ArrayUtilNew.js (리팩토링)')
  checkFileSize('utils/BaseUtil.js', 15, 'BaseUtil.js (새로운 기본 클래스)')
  checkFileSize('components/SideBar.vue', 15, 'SideBar.vue')
  
  // 2. 코드 복잡도 체크
  console.log('\n🧮 코드 복잡도 분석:')
  
  const analyzeComplexity = (filePath) => {
    if (!fs.existsSync(filePath)) return null
    
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    // 간단한 복잡도 메트릭
    const metrics = {
      totalLines: lines.length,
      codeLines: lines.filter(line => line.trim() && !line.trim().startsWith('//')).length,
      functions: (content.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length,
      classes: (content.match(/class\s+\w+/g) || []).length,
      imports: (content.match(/import\s+/g) || []).length,
      exports: (content.match(/export\s+/g) || []).length
    }
    
    console.log(`  ${path.basename(filePath)}:`)
    console.log(`    전체 라인: ${metrics.totalLines}`)
    console.log(`    코드 라인: ${metrics.codeLines}`)
    console.log(`    함수: ${metrics.functions}`)
    console.log(`    클래스: ${metrics.classes}`)
    
    results.checks.push({
      type: 'complexity',
      file: filePath,
      metrics,
      description: `코드 복잡도 분석`
    })
    
    return metrics
  }

  // 주요 유틸리티 파일들 분석 (리팩토링된 파일들 포함)
  analyzeComplexity('utils/JsonUtil.js')
  analyzeComplexity('utils/JsonUtilNew.js')
  analyzeComplexity('utils/StringUtil.js')
  analyzeComplexity('utils/StringUtilNew.js')
  analyzeComplexity('utils/ArrayUtil.js')
  analyzeComplexity('utils/ArrayUtilNew.js')
  analyzeComplexity('utils/BaseUtil.js')

  // 3. 의존성 분석
  console.log('\n📦 의존성 분석:')
  
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const deps = Object.keys(packageJson.dependencies || {})
    const devDeps = Object.keys(packageJson.devDependencies || {})
    
    console.log(`  운영 의존성: ${deps.length}개`)
    console.log(`  개발 의존성: ${devDeps.length}개`)
    
    // 큰 의존성들 체크
    const heavyPackages = ['moment', 'lodash', 'jquery', 'bootstrap']
    const foundHeavy = deps.filter(dep => heavyPackages.some(heavy => dep.includes(heavy)))
    
    if (foundHeavy.length > 0) {
      console.log(`  ⚠️ 무거운 패키지 발견: ${foundHeavy.join(', ')}`)
    }
    
    results.checks.push({
      type: 'dependencies',
      dependencies: deps.length,
      devDependencies: devDeps.length,
      heavyPackages: foundHeavy,
      description: '의존성 분석'
    })
  }

  // 4. 캐싱 효율성 체크
  console.log('\n💾 캐싱 분석:')
  
  const checkCachingImplementation = (filePath) => {
    if (!fs.existsSync(filePath)) return
    
    const content = fs.readFileSync(filePath, 'utf8')
    const hasCaching = content.includes('cache') || content.includes('Cache')
    const hasMap = content.includes('Map()')
    const hasWeakMap = content.includes('WeakMap()')
    
    console.log(`  ${path.basename(filePath)}: ${hasCaching ? '✅ 캐싱 구현됨' : '❌ 캐싱 없음'}`)
    
    results.checks.push({
      type: 'caching',
      file: filePath,
      hasCaching,
      hasMap,
      hasWeakMap,
      description: '캐싱 구현 체크'
    })
  }

  checkCachingImplementation('utils/JsonUtil.js')
  checkCachingImplementation('utils/JsonUtilNew.js')
  checkCachingImplementation('utils/StringUtil.js')
  checkCachingImplementation('utils/StringUtilNew.js')
  checkCachingImplementation('utils/ArrayUtil.js')
  checkCachingImplementation('utils/ArrayUtilNew.js')
  checkCachingImplementation('utils/BaseUtil.js')

  // 5. 성능 최적화 제안
  console.log('\n💡 최적화 제안:')
  
  const suggestions = []
  
  // 파일 크기 기반 제안
  const largeFiles = results.checks
    .filter(check => check.type === 'fileSize' && !check.optimal)
  
  if (largeFiles.length > 0) {
    suggestions.push('큰 파일들을 더 작은 모듈로 분할하는 것을 고려하세요.')
  }
  
  // 캐싱 기반 제안
  const noCacheFiles = results.checks
    .filter(check => check.type === 'caching' && !check.hasCaching)
  
  if (noCacheFiles.length > 0) {
    suggestions.push('캐싱이 구현되지 않은 유틸리티들에 캐싱을 추가하세요.')
  }
  
  // 복잡도 기반 제안
  const complexFiles = results.checks
    .filter(check => check.type === 'complexity' && check.metrics.codeLines > 300)
  
  if (complexFiles.length > 0) {
    suggestions.push('복잡한 파일들을 더 작은 함수로 분할하는 것을 고려하세요.')
  }

  suggestions.forEach((suggestion, index) => {
    console.log(`  ${index + 1}. ${suggestion}`)
  })

  // 결과 저장
  results.suggestions = suggestions
  fs.writeFileSync('.output/performance-report.json', JSON.stringify(results, null, 2))
  
  console.log('\n📄 상세 리포트가 .output/performance-report.json에 저장되었습니다.')
  console.log('\n✅ 성능 분석 완료!')
}

// .output 디렉토리 생성
if (!fs.existsSync('.output')) {
  fs.mkdirSync('.output')
}

checkPerformance()
