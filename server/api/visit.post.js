import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data.json')

export default defineEventHandler(async (event) => {
  try {
    // 현재 데이터 읽기
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
    
    const now = new Date()
    const today = now.toISOString().split('T')[0] // YYYY-MM-DD
    
    // 방문 카운트 업데이트
    data.visitors.totalCount += 1
    data.visitors.lastVisitDate = now.toISOString()
    
    // 일별 통계 업데이트
    if (!data.visitors.dailyStats[today]) {
      data.visitors.dailyStats[today] = 0
    }
    
    // 오늘 방문자 수 계산
    data.visitors.dailyStats[today] += 1
    data.visitors.todayCount = data.visitors.dailyStats[today]
    
    // 30일 이전 데이터 정리
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    Object.keys(data.visitors.dailyStats).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete data.visitors.dailyStats[date]
      }
    })
    
    // 파일에 저장
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    console.log('방문 기록 성공:', data.visitors)
    return { success: true, visitors: data.visitors }
  } catch (error) {
    console.error('방문 기록 실패:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
