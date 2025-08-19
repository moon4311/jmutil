<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">QR코드 생성</h1>
    
    <div class="max-w-4xl mx-auto">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- 입력 영역 -->
        <div>
          <v-card class="p-6">
            <h2 class="text-xl font-semibold mb-4">QR코드 설정</h2>
            
            <!-- 텍스트/URL 입력 -->
            <div class="mb-6">
              <v-textarea
                v-model="inputText"
                label="텍스트 또는 URL"
                placeholder="QR코드로 변환할 텍스트나 URL을 입력하세요"
                variant="outlined"
                rows="4"
                counter
                maxlength="2000"
              />
            </div>
            
            <!-- QR코드 옵션 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">크기</label>
                <v-slider
                  v-model="qrSize"
                  min="128"
                  max="512"
                  step="32"
                  show-ticks
                  tick-size="4"
                  :tick-labels="['128', '256', '384', '512']"
                />
                <div class="text-sm text-gray-600">{{ qrSize }}px</div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">오류 정정 레벨</label>
                <v-radio-group v-model="errorCorrectionLevel" inline>
                  <v-radio label="Low (7%)" value="L" />
                  <v-radio label="Medium (15%)" value="M" />
                  <v-radio label="Quartile (25%)" value="Q" />
                  <v-radio label="High (30%)" value="H" />
                </v-radio-group>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">전경색</label>
                  <input
                    v-model="foregroundColor"
                    type="color"
                    class="w-full h-10 rounded border"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">배경색</label>
                  <input
                    v-model="backgroundColor"
                    type="color"
                    class="w-full h-10 rounded border"
                  />
                </div>
              </div>
            </div>
            
            <!-- 빠른 설정 -->
            <div class="mt-6">
              <h3 class="text-lg font-semibold mb-3">빠른 설정</h3>
              <div class="grid grid-cols-2 gap-2">
                <v-btn
                  @click="setQuickText('WiFi')"
                  variant="outlined"
                  size="small"
                >
                  WiFi 정보
                </v-btn>
                <v-btn
                  @click="setQuickText('Contact')"
                  variant="outlined"
                  size="small"
                >
                  연락처
                </v-btn>
                <v-btn
                  @click="setQuickText('Email')"
                  variant="outlined"
                  size="small"
                >
                  이메일
                </v-btn>
                <v-btn
                  @click="setQuickText('SMS')"
                  variant="outlined"
                  size="small"
                >
                  SMS
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>
        
        <!-- QR코드 미리보기 및 다운로드 -->
        <div>
          <v-card class="p-6">
            <h2 class="text-xl font-semibold mb-4">미리보기</h2>
            
            <ClientOnly>
              <div class="text-center">
                <div
                  v-if="inputText.trim()"
                  class="inline-block p-4 bg-white rounded-lg shadow-inner mb-4"
                >
                  <canvas
                    ref="qrCanvas"
                    :width="qrSize"
                    :height="qrSize"
                    class="border"
                  />
                </div>
                
                <div v-else class="py-20 text-gray-500">
                  텍스트를 입력하면 QR코드가 여기에 표시됩니다
                </div>
                
                <div v-if="inputText.trim()" class="space-y-2">
                  <v-btn
                    @click="downloadQR"
                    color="primary"
                    block
                    prepend-icon="mdi-download"
                  >
                    PNG로 다운로드
                  </v-btn>
                  
                  <v-btn
                    @click="copyToClipboard"
                    variant="outlined"
                    block
                    prepend-icon="mdi-content-copy"
                  >
                    클립보드에 복사
                  </v-btn>
                </div>
              </div>
              <template #fallback>
                <div class="text-center py-20 text-gray-500">
                  QR코드 생성기 로딩 중...
                </div>
              </template>
            </ClientOnly>
          </v-card>
          
          <!-- 생성된 QR코드 정보 -->
          <ClientOnly>
            <v-card v-if="qrInfo" class="p-4 mt-4">
              <h3 class="font-semibold mb-2">QR코드 정보</h3>
              <div class="text-sm space-y-1">
                <div><strong>데이터 길이:</strong> {{ qrInfo.dataLength }}자</div>
                <div><strong>버전:</strong> {{ qrInfo.version }}</div>
                <div><strong>오류 정정:</strong> {{ qrInfo.errorCorrection }}</div>
              </div>
            </v-card>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import QRCode from 'qrcode'

// 반응형 데이터
const inputText = ref('')
const qrSize = ref(256)
const errorCorrectionLevel = ref('M')
const foregroundColor = ref('#000000')
const backgroundColor = ref('#ffffff')
const qrCanvas = ref(null)
const qrInfo = ref(null)

// QR코드 생성 함수
const generateQR = async () => {
  if (!inputText.value.trim() || !qrCanvas.value) return
  
  try {
    const canvas = qrCanvas.value
    
    // QR코드 생성
    await QRCode.toCanvas(canvas, inputText.value, {
      width: qrSize.value,
      height: qrSize.value,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value
      },
      errorCorrectionLevel: errorCorrectionLevel.value,
      margin: 2
    })
    
    // QR코드 정보 업데이트
    qrInfo.value = {
      dataLength: inputText.value.length,
      version: 'Auto',
      errorCorrection: getErrorCorrectionText(errorCorrectionLevel.value)
    }
  } catch (error) {
    console.error('QR코드 생성 실패:', error)
  }
}

// 오류 정정 레벨 텍스트 변환
const getErrorCorrectionText = (level) => {
  const levels = {
    'L': 'Low (7%)',
    'M': 'Medium (15%)',
    'Q': 'Quartile (25%)',
    'H': 'High (30%)'
  }
  return levels[level] || level
}

// QR코드 다운로드
const downloadQR = () => {
  if (!qrCanvas.value) return
  
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrCanvas.value.toDataURL()
  link.click()
}

// 클립보드에 복사
const copyToClipboard = async () => {
  if (!qrCanvas.value) return
  
  try {
    const canvas = qrCanvas.value
    canvas.toBlob(async (blob) => {
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])
      // 성공 메시지 (실제 구현에서는 toast 등 사용)
      alert('QR코드가 클립보드에 복사되었습니다!')
    })
  } catch (error) {
    console.error('클립보드 복사 실패:', error)
    alert('클립보드 복사에 실패했습니다.')
  }
}

// 빠른 설정
const setQuickText = (type) => {
  switch (type) {
    case 'WiFi':
      inputText.value = 'WIFI:T:WPA;S:네트워크이름;P:비밀번호;;'
      break
    case 'Contact':
      inputText.value = 'BEGIN:VCARD\nVERSION:3.0\nFN:홍길동\nORG:회사명\nTEL:010-1234-5678\nEMAIL:example@email.com\nEND:VCARD'
      break
    case 'Email':
      inputText.value = 'mailto:example@email.com?subject=제목&body=내용'
      break
    case 'SMS':
      inputText.value = 'sms:010-1234-5678?body=메시지 내용'
      break
  }
}

// QR 라이브러리 로드 (더 이상 필요 없음 - npm 패키지 직접 import)

// 감시자 설정
watch([inputText, qrSize, errorCorrectionLevel, foregroundColor, backgroundColor], () => {
  nextTick(() => {
    generateQR()
  })
}, { immediate: false })

// 컴포넌트 마운트 시 초기 설정
onMounted(async () => {
  // 초기 QR코드 생성
  if (inputText.value.trim()) {
    await nextTick()
    generateQR()
  }
})

// 페이지 메타
definePageMeta({
  title: 'QR코드 생성'
})
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}

input[type="color"] {
  cursor: pointer;
}
</style>
