<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">타이머 & 스탑워치</h1>
    
    <div class="max-w-md mx-auto">
      <!-- 탭 -->
      <v-tabs v-model="activeTab" class="mb-6" bg-color="primary">
        <v-tab value="timer">
          <v-icon left>mdi-timer</v-icon>
          타이머
        </v-tab>
        <v-tab value="stopwatch">
          <v-icon left>mdi-timer-outline</v-icon>
          스탑워치
        </v-tab>
      </v-tabs>
      
      <!-- 탭 내용 -->
      <v-window v-model="activeTab">
        <!-- 타이머 탭 -->
        <v-window-item value="timer">
          <v-card class="p-6">
            <div class="text-center">
              <!-- 시간 표시 -->
              <div class="text-6xl font-mono font-bold mb-6">
                {{ displayTime }}
              </div>
              
              <!-- 입력 필드 -->
              <div v-if="!isRunning" class="mb-6 space-y-4">
                <div class="grid grid-cols-3 gap-2">
                  <div>
                    <label class="block text-sm font-medium mb-1">시간</label>
                    <v-text-field
                      v-model.number="inputHours"
                      type="number"
                      min="0"
                      max="23"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">분</label>
                    <v-text-field
                      v-model.number="inputMinutes"
                      type="number"
                      min="0"
                      max="59"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">초</label>
                    <v-text-field
                      v-model.number="inputSeconds"
                      type="number"
                      min="0"
                      max="59"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </div>
                </div>
              </div>
              
              <!-- 제어 버튼 -->
              <div class="space-x-2">
                <v-btn
                  v-if="!isRunning"
                  @click="startTimer"
                  color="primary"
                  size="large"
                  :disabled="totalSeconds === 0"
                >
                  <v-icon left>mdi-play</v-icon>
                  시작
                </v-btn>
                
                <v-btn
                  v-if="isRunning"
                  @click="pauseTimer"
                  color="warning"
                  size="large"
                >
                  <v-icon left>mdi-pause</v-icon>
                  일시정지
                </v-btn>
                
                <v-btn
                  v-if="isRunning || isPaused"
                  @click="resetTimer"
                  color="error"
                  size="large"
                >
                  <v-icon left>mdi-stop</v-icon>
                  리셋
                </v-btn>
              </div>
              
              <!-- 상태 표시 -->
              <div class="mt-4">
                <v-chip
                  :color="getStatusColor()"
                  size="small"
                >
                  {{ getStatusText() }}
                </v-chip>
              </div>
            </div>
          </v-card>
          
          <!-- 빠른 설정 버튼 -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3">빠른 설정</h3>
            <div class="grid grid-cols-2 gap-2">
              <v-btn
                @click="setQuickTimer(1, 0, 0)"
                variant="outlined"
                :disabled="isRunning"
              >
                1분
              </v-btn>
              <v-btn
                @click="setQuickTimer(3, 0, 0)"
                variant="outlined"
                :disabled="isRunning"
              >
                3분
              </v-btn>
              <v-btn
                @click="setQuickTimer(5, 0, 0)"
                variant="outlined"
                :disabled="isRunning"
              >
                5분
              </v-btn>
              <v-btn
                @click="setQuickTimer(10, 0, 0)"
                variant="outlined"
                :disabled="isRunning"
              >
                10분
              </v-btn>
              <v-btn
                @click="setQuickTimer(25, 0, 0)"
                variant="outlined"
                :disabled="isRunning"
              >
                25분 (포모도로)
              </v-btn>
              <v-btn
                @click="setQuickTimer(30, 0, 0)"
                variant="outlined"
                :disabled="isRunning"
              >
                30분
              </v-btn>
            </div>
          </div>
        </v-window-item>
        
        <!-- 스탑워치 탭 -->
        <v-window-item value="stopwatch">
          <v-card class="p-6">
            <div class="text-center">
              <!-- 스탑워치 시간 표시 -->
              <div class="text-6xl font-mono font-bold mb-6">
                {{ displayStopwatchTime }}
              </div>
              
              <!-- 스탑워치 제어 버튼 -->
              <div class="space-x-2 mb-6">
                <v-btn
                  v-if="!stopwatchRunning"
                  @click="startStopwatch"
                  color="success"
                  size="large"
                >
                  <v-icon left>mdi-play</v-icon>
                  시작
                </v-btn>
                
                <v-btn
                  v-if="stopwatchRunning"
                  @click="pauseStopwatch"
                  color="warning"
                  size="large"
                >
                  <v-icon left>mdi-pause</v-icon>
                  정지
                </v-btn>
                
                <v-btn
                  v-if="stopwatchRunning"
                  @click="addLap"
                  color="info"
                  size="large"
                >
                  <v-icon left>mdi-flag</v-icon>
                  랩 타임
                </v-btn>
                
                <v-btn
                  @click="resetStopwatch"
                  color="error"
                  size="large"
                  :disabled="stopwatchRunning"
                >
                  <v-icon left>mdi-stop</v-icon>
                  리셋
                </v-btn>
              </div>
              
              <!-- 스탑워치 상태 표시 -->
              <div class="mt-4">
                <v-chip
                  :color="getStopwatchStatusColor()"
                  size="small"
                >
                  {{ getStopwatchStatusText() }}
                </v-chip>
              </div>
            </div>
          </v-card>
          
          <!-- 랩 타임 기록 -->
          <div v-if="lapTimes.length > 0" class="mt-6">
            <h3 class="text-lg font-semibold mb-3">랩 타임 기록</h3>
            <v-card class="p-4">
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="(lap, index) in lapTimes"
                  :key="index"
                  class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span class="font-medium">랩 {{ index + 1 }}</span>
                  <span class="font-mono text-lg">{{ formatStopwatchTime(lap.time) }}</span>
                  <span class="text-sm text-gray-500 font-mono">+{{ formatStopwatchTime(lap.split) }}</span>
                </div>
              </div>
              <div class="mt-4 text-center">
                <v-btn
                  @click="clearLaps"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-delete"
                >
                  랩 기록 삭제
                </v-btn>
              </div>
            </v-card>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'

// 탭 상태
const activeTab = ref('timer')

// 타이머 관련 반응형 데이터
const inputHours = ref(0)
const inputMinutes = ref(5)
const inputSeconds = ref(0)
const currentSeconds = ref(0)
const isRunning = ref(false)
const isPaused = ref(false)
let timerIntervalId = null

// 스탑워치 관련 반응형 데이터
const stopwatchTime = ref(0) // 밀리초 단위
const stopwatchRunning = ref(false)
const stopwatchPaused = ref(false)
const lapTimes = ref([])
let stopwatchIntervalId = null
let stopwatchStartTime = 0
let stopwatchPausedTime = 0

// 타이머 계산된 속성
const totalSeconds = computed(() => {
  return (inputHours.value || 0) * 3600 + (inputMinutes.value || 0) * 60 + (inputSeconds.value || 0)
})

const displayTime = computed(() => {
  const seconds = isRunning.value || isPaused.value ? currentSeconds.value : totalSeconds.value
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// 스탑워치 계산된 속성
const displayStopwatchTime = computed(() => {
  return formatStopwatchTime(stopwatchTime.value)
})

// 스탑워치 시간 포맷 함수
const formatStopwatchTime = (milliseconds) => {
  const totalMs = Math.floor(milliseconds)
  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const ms = Math.floor((totalMs % 1000) / 10)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

// 타이머 메서드
const startTimer = () => {
  if (totalSeconds.value === 0) return
  
  if (!isPaused.value) {
    currentSeconds.value = totalSeconds.value
  }
  
  isRunning.value = true
  isPaused.value = false
  
  timerIntervalId = setInterval(() => {
    if (currentSeconds.value > 0) {
      currentSeconds.value--
    } else {
      // 타이머 완료
      clearInterval(timerIntervalId)
      isRunning.value = false
      isPaused.value = false
      
      // 알림 (브라우저 알림)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('타이머 완료!', {
          body: '설정한 시간이 끝났습니다.',
          icon: '/favicon.ico'
        })
      }
      
      // 사운드 재생
      playNotificationSound()
    }
  }, 1000)
}

const pauseTimer = () => {
  clearInterval(timerIntervalId)
  isRunning.value = false
  isPaused.value = true
}

const resetTimer = () => {
  clearInterval(timerIntervalId)
  isRunning.value = false
  isPaused.value = false
  currentSeconds.value = 0
}

const setQuickTimer = (minutes, seconds = 0, hours = 0) => {
  if (isRunning.value) return
  
  inputHours.value = hours
  inputMinutes.value = minutes
  inputSeconds.value = seconds
}

const getStatusColor = () => {
  if (isRunning.value) return 'success'
  if (isPaused.value) return 'warning'
  return 'grey'
}

const getStatusText = () => {
  if (isRunning.value) return '실행 중'
  if (isPaused.value) return '일시정지'
  return '대기 중'
}

// 스탑워치 메서드
const startStopwatch = () => {
  if (!stopwatchPaused.value) {
    stopwatchStartTime = Date.now()
    stopwatchTime.value = 0
  } else {
    stopwatchStartTime = Date.now() - stopwatchPausedTime
  }
  
  stopwatchRunning.value = true
  stopwatchPaused.value = false
  
  stopwatchIntervalId = setInterval(() => {
    stopwatchTime.value = Date.now() - stopwatchStartTime
  }, 10) // 10ms 간격으로 업데이트
}

const pauseStopwatch = () => {
  clearInterval(stopwatchIntervalId)
  stopwatchRunning.value = false
  stopwatchPaused.value = true
  stopwatchPausedTime = stopwatchTime.value
}

const resetStopwatch = () => {
  clearInterval(stopwatchIntervalId)
  stopwatchRunning.value = false
  stopwatchPaused.value = false
  stopwatchTime.value = 0
  stopwatchPausedTime = 0
  lapTimes.value = []
}

const addLap = () => {
  if (!stopwatchRunning.value) return
  
  const currentTime = stopwatchTime.value
  const lastLapTime = lapTimes.value.length > 0 ? lapTimes.value[lapTimes.value.length - 1].time : 0
  const splitTime = currentTime - lastLapTime
  
  lapTimes.value.push({
    time: currentTime,
    split: splitTime
  })
}

const clearLaps = () => {
  lapTimes.value = []
}

const getStopwatchStatusColor = () => {
  if (stopwatchRunning.value) return 'success'
  if (stopwatchPaused.value) return 'warning'
  return 'grey'
}

const getStopwatchStatusText = () => {
  if (stopwatchRunning.value) return '실행 중'
  if (stopwatchPaused.value) return '일시정지'
  return '대기 중'
}

const playNotificationSound = () => {
  // 간단한 비프음 생성
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 1)
  } catch (error) {
    console.log('사운드 재생을 지원하지 않는 환경입니다.')
  }
}

// 알림 권한 요청
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

// 컴포넌트 언마운트 시 인터벌 정리
onUnmounted(() => {
  if (timerIntervalId) {
    clearInterval(timerIntervalId)
  }
  if (stopwatchIntervalId) {
    clearInterval(stopwatchIntervalId)
  }
})

// 페이지 메타
definePageMeta({
  title: '타이머 & 스탑워치'
})
</script>

<!-- timer.vue의 스타일은 이제 공통 CSS를 사용 -->
<style scoped>
/* 타이머 전용 스타일만 유지 */
</style>
