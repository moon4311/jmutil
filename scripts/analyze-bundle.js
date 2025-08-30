import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * 번들 크기 분석 스크립트
 */
const analyzeBuild = () => {
  console.log('🔍 번들 크기 분석 시작...')
  
  try {
    // .output 폴더 확인
    const outputDir = '.output/public'
    if (!fs.existsSync(outputDir)) {
      console.error('❌ 빌드 결과를 찾을 수 없습니다. pnpm build를 먼저 실행하세요.')
      return
    }

    // 파일 크기 분석
    const analyzeDirectory = (dir, basePath = '') => {
      const files = fs.readdirSync(dir)
      const results = []

      files.forEach(file => {
        const filePath = path.join(dir, file)
        const relativePath = path.join(basePath, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
          results.push(...analyzeDirectory(filePath, relativePath))
        } else {
          results.push({
            name: relativePath,
            size: stats.size,
            type: path.extname(file)
          })
        }
      })

      return results
    }

    const files = analyzeDirectory(outputDir)
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    console.log('\n📊 번들 분석 결과:')
    console.log(`전체 크기: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

    // 큰 파일들 표시 (100KB 이상)
    const largeFiles = files
      .filter(file => file.size > 100 * 1024)
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)

    if (largeFiles.length > 0) {
      console.log('\n🔍 큰 파일들 (100KB 이상):')
      largeFiles.forEach(file => {
        console.log(`  ${file.name}: ${(file.size / 1024).toFixed(2)} KB`)
      })
    }

    // 파일 타입별 통계
    const typeStats = {}
    files.forEach(file => {
      const type = file.type || 'no-extension'
      if (!typeStats[type]) {
        typeStats[type] = { count: 0, size: 0 }
      }
      typeStats[type].count++
      typeStats[type].size += file.size
    })

    console.log('\n📈 파일 타입별 통계:')
    Object.entries(typeStats)
      .sort((a, b) => b[1].size - a[1].size)
      .forEach(([type, stats]) => {
        console.log(`  ${type}: ${stats.count}개, ${(stats.size / 1024).toFixed(2)} KB`)
      })

    // JavaScript 번들 분석
    const jsFiles = files.filter(file => file.type === '.js')
    if (jsFiles.length > 0) {
      console.log('\n📦 JavaScript 번들:')
      jsFiles
        .sort((a, b) => b.size - a.size)
        .slice(0, 10)
        .forEach(file => {
          console.log(`  ${file.name}: ${(file.size / 1024).toFixed(2)} KB`)
        })
    }

    // CSS 파일 분석
    const cssFiles = files.filter(file => file.type === '.css')
    if (cssFiles.length > 0) {
      console.log('\n🎨 CSS 파일:')
      cssFiles
        .sort((a, b) => b.size - a.size)
        .forEach(file => {
          console.log(`  ${file.name}: ${(file.size / 1024).toFixed(2)} KB`)
        })
    }

    // 최적화 제안
    console.log('\n💡 최적화 제안:')
    
    const jsSize = jsFiles.reduce((sum, file) => sum + file.size, 0)
    if (jsSize > 500 * 1024) {
      console.log('  - JavaScript 번들이 큽니다. 코드 스플리팅을 고려해보세요.')
    }
    
    const cssSize = cssFiles.reduce((sum, file) => sum + file.size, 0)
    if (cssSize > 100 * 1024) {
      console.log('  - CSS 파일이 큽니다. 사용하지 않는 CSS를 제거하세요.')
    }
    
    const imageFiles = files.filter(file => ['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(file.type))
    const imageSize = imageFiles.reduce((sum, file) => sum + file.size, 0)
    if (imageSize > 1024 * 1024) {
      console.log('  - 이미지 파일이 큽니다. 이미지 최적화를 고려해보세요.')
    }

    // 결과를 JSON 파일로 저장
    const reportPath = '.output/bundle-analysis.json'
    const report = {
      timestamp: new Date().toISOString(),
      totalSize,
      files: files.map(file => ({
        ...file,
        sizeKB: Math.round(file.size / 1024 * 100) / 100
      })),
      typeStats,
      largeFiles
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 상세 리포트가 ${reportPath}에 저장되었습니다.`)

  } catch (error) {
    console.error('❌ 번들 분석 실패:', error.message)
  }
}

analyzeBuild()
