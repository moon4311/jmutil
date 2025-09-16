<template>
  <div v-if="showDebug" class="ad-debug-panel">
    <div class="debug-header">
      <h4>AdFit 디버그 정보</h4>
      <button @click="togglePanel" class="toggle-btn">{{ panelOpen ? '▼' : '▲' }}</button>
    </div>
    
    <div v-if="panelOpen" class="debug-content">
      <!-- 광고 차단 상태 -->
      <div class="debug-section">
        <h5>차단 감지</h5>
        <div class="status-item">
          <span>광고 차단기:</span>
          <span :class="adBlockDetected ? 'status-error' : 'status-success'">
            {{ adBlockDetected ? '감지됨' : '정상' }}
          </span>
        </div>
        <div class="status-item">
          <span>스크립트 로딩:</span>
          <span :class="adLoadSuccess ? 'status-success' : 'status-error'">
            {{ adLoadSuccess ? '성공' : '실패' }}
          </span>
        </div>
      </div>

      <!-- 통계 정보 -->
      <div class="debug-section">
        <h5>로딩 통계</h5>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">총 광고:</span>
            <span class="stat-value">{{ stats.totalAds }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">로딩 성공:</span>
            <span class="stat-value">{{ stats.loadedAds }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">로딩 실패:</span>
            <span class="stat-value">{{ stats.failedAds }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">차단됨:</span>
            <span class="stat-value">{{ stats.blockedAds }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">성공률:</span>
            <span class="stat-value">{{ stats.successRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">평균 로딩:</span>
            <span class="stat-value">{{ stats.avgLoadTime }}ms</span>
          </div>
        </div>
      </div>

      <!-- 최근 히스토리 -->
      <div class="debug-section">
        <h5>최근 로딩 히스토리</h5>
        <div class="history-list">
          <div 
            v-for="item in recentHistory" 
            :key="`${item.unitId}-${item.startTime}`"
            class="history-item"
          >
            <span class="unit-id">{{ item.unitId }}</span>
            <span :class="`status-${item.status}`">{{ getStatusText(item.status) }}</span>
            <span class="load-time">{{ item.loadTime || 0 }}ms</span>
          </div>
        </div>
      </div>

      <!-- 권장사항 -->
      <div v-if="recommendations.length > 0" class="debug-section">
        <h5>권장사항</h5>
        <ul class="recommendations">
          <li v-for="rec in recommendations" :key="rec">{{ rec }}</li>
        </ul>
      </div>

      <!-- 액션 버튼 -->
      <div class="debug-actions">
        <button @click="resetStats" class="action-btn">통계 초기화</button>
        <button @click="refreshReport" class="action-btn">리포트 새로고침</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useKakaoAds } from '@/composables/useKakaoAds.js'
import { useAdMonitoring } from '@/composables/useAdMonitoring.js'

const { adBlockDetected, adLoadSuccess } = useKakaoAds()
const { getAdStats, generateReport, resetStats: resetAdStats } = useAdMonitoring()

const showDebug = ref(false)
const panelOpen = ref(false)
const report = ref({})

// 개발 환경에서만 표시
onMounted(() => {
  showDebug.value = process.env.NODE_ENV === 'development' || 
                   localStorage.getItem('adDebug') === 'true'
  refreshReport()
})

const stats = computed(() => report.value.summary || getAdStats())
const recentHistory = computed(() => report.value.recentHistory || [])
const recommendations = computed(() => report.value.recommendations || [])

const togglePanel = () => {
  panelOpen.value = !panelOpen.value
}

const refreshReport = () => {
  report.value = generateReport()
}

const resetStats = () => {
  resetAdStats()
  refreshReport()
}

const getStatusText = (status) => {
  const statusMap = {
    'loading': '로딩중',
    'success': '성공',
    'failed': '실패',
    'blocked': '차단됨'
  }
  return statusMap[status] || status
}

// 주기적으로 리포트 업데이트
let intervalId
onMounted(() => {
  if (showDebug.value) {
    intervalId = setInterval(refreshReport, 5000)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.ad-debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #333;
  background: #1a1a1a;
  border-radius: 8px 8px 0 0;
}

.debug-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.debug-content {
  padding: 15px;
}

.debug-section {
  margin-bottom: 15px;
}

.debug-section h5 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #00ff00;
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.status-success { color: #00ff00; }
.status-error { color: #ff4444; }
.status-loading { color: #ffaa00; }
.status-blocked { color: #ff8800; }
.status-failed { color: #ff4444; }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.stat-label {
  font-size: 11px;
  color: #ccc;
}

.stat-value {
  font-weight: bold;
  color: #00ff00;
}

.history-list {
  max-height: 120px;
  overflow-y: auto;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  padding: 4px 8px;
  margin-bottom: 2px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 11px;
}

.unit-id {
  color: #ccc;
  overflow: hidden;
  text-overflow: ellipsis;
}

.load-time {
  color: #aaa;
  font-size: 10px;
}

.recommendations {
  margin: 0;
  padding-left: 15px;
  font-size: 11px;
  color: #ffaa00;
}

.recommendations li {
  margin-bottom: 4px;
}

.debug-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.action-btn {
  flex: 1;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #555;
}
</style>