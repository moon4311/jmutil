<template>
  <div>
    <h2 class="text-xl font-bold mb-4">QR코드 생성</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showBlue" title="QR코드 설정" color="blue">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">텍스트 또는 URL</label>
              <v-textarea
                v-model="inputText"
                variant="solo-filled"
                density="comfortable"
                hide-details
                placeholder="QR코드로 변환할 텍스트나 URL을 입력하세요"
                rows="4"
                counter
                maxlength="2000"
              />
            </div>
            
            <div>
              <label class="block mb-2 font-semibold">크기</label>
              <v-slider
                v-model="qrSize"
                min="128"
                max="512"
                step="32"
                show-ticks
                tick-size="4"
                :tick-labels="['128', '256', '384', '512']"
                hide-details
              />
              <div class="text-sm text-gray-600 mt-1">{{ qrSize }}px</div>
            </div>
            
            <div>
              <label class="block mb-2 font-semibold">오류 정정 레벨</label>
              <v-radio-group v-model="errorCorrectionLevel" inline hide-details>
                <v-radio label="Low (7%)" value="L" />
                <v-radio label="Medium (15%)" value="M" />
                <v-radio label="Quartile (25%)" value="Q" />
                <v-radio label="High (30%)" value="H" />
              </v-radio-group>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold">전경색</label>
                <input
                  v-model="foregroundColor"
                  type="color"
                  class="w-full h-10 rounded border"
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">배경색</label>
                <input
                  v-model="backgroundColor"
                  type="color"
                  class="w-full h-10 rounded border"
                />
              </div>
            </div>
          </div>
        </GroupPanel>

        <GroupPanel v-model="showGreen" title="빠른 설정" color="green">
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <v-btn
                @click="setQuickText('WiFi')"
                variant="elevated"
                size="large"
                color="success"
              >
                WiFi 정보
              </v-btn>
              <v-btn
                @click="setQuickText('Contact')"
                variant="elevated"
                size="large"
                color="success"
              >
                연락처
              </v-btn>
              <v-btn
                @click="setQuickText('Email')"
                variant="elevated"
                size="large"
                color="success"
              >
                이메일
              </v-btn>
              <v-btn
                @click="setQuickText('SMS')"
                variant="elevated"
                size="large"
                color="success"
              >
                SMS
              </v-btn>
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showPurple" title="QR코드 미리보기" color="purple">
          <div class="space-y-4">
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
                    class="border max-w-full h-auto"
                  />
                </div>
                
                <div v-else class="py-20 text-gray-500">
                  텍스트를 입력하면 QR코드가 여기에 표시됩니다
                </div>
                
                <div v-if="inputText.trim()" class="space-y-2">
                  <v-btn
                    @click="downloadQR"
                    color="primary"
                    variant="elevated"
                    size="large"
                    prepend-icon="mdi-download"
                    block
                  >
                    PNG로 다운로드
                  </v-btn>
                  
                  <v-btn
                    @click="copyToClipboard"
                    variant="elevated"
                    size="large"
                    prepend-icon="mdi-content-copy"
                    block
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
          </div>
        </GroupPanel>

        <GroupPanel v-model="showOrange" title="QR코드 정보" color="orange">
          <div class="space-y-2">
            <ClientOnly>
              <div v-if="qrInfo" class="text-sm space-y-1">
                <div><strong>데이터 길이:</strong> {{ qrInfo.dataLength }}자</div>
                <div><strong>버전:</strong> {{ qrInfo.version }}</div>
                <div><strong>오류 정정:</strong> {{ qrInfo.errorCorrection }}</div>
              </div>
              <div v-else class="text-gray-500 text-sm">
                QR코드를 생성하면 정보가 여기에 표시됩니다
              </div>
            </ClientOnly>
          </div>
        </GroupPanel>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
// SEO 메타 및 구조화 데이터
const config = useRuntimeConfig()
const siteUrl = config.public?.siteUrl || 'https://www.web-util.com'
useHead({
  title: 'QR 코드 생성기 · 이미지 다운로드/에러보정 | Web-Util',
  meta: [
    { name: 'description', content: '텍스트로 QR 코드를 생성하고 크기, 색상, 에러 보정 수준을 조절한 뒤 이미지로 다운로드할 수 있습니다.' },
    { property: 'og:title', content: 'QR 코드 생성기 - Web-Util' },
    { property: 'og:description', content: '맞춤 크기/색상/에러 보정으로 QR 이미지를 빠르게 생성하세요.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl + '/tools/qr-generator' }
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/tools/qr-generator' }]
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'QR 코드 생성기',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl + '/tools/qr-generator',
        description: '텍스트 → QR 코드 이미지 생성 및 다운로드. 크기/색상/에러 보정 설정 지원.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
      })
    }
  ]
})
import { ref, watch, nextTick, onMounted } from 'vue'
import QRCode from 'qrcode'
import GroupPanel from '@/components/GroupPanel.vue'
import { useResponsive } from '@/composables/useResponsive.js'

// 반응형 상태 관리
const { createAccordionState } = useResponsive()
const accordionState = createAccordionState(4)
const showBlue = ref(accordionState[0])
const showGreen = ref(accordionState[1])
const showPurple = ref(accordionState[2])
const showOrange = ref(accordionState[3])

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
