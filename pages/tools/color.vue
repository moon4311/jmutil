<template>
  <div>
    <h2 class="text-xl font-bold mb-4">색상 유틸리티</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <!-- HEX to RGB -->
        <GroupPanel v-model="panelStates[0]" title="HEX → RGB 변환" color="blue">
          <div v-show="panelStates[0]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">HEX 색상</label>
              <div class="flex gap-2">
                <v-text-field
                  v-model="hexToRgbInput"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  class="flex-1"
                  placeholder="#FF5733"
                  maxlength="7"
                  @input="processHexToRgb"
                />
                <div 
                  class="w-16 h-12 border rounded-md"
                  :style="{ backgroundColor: hexToRgbInput }"
                ></div>
              </div>
            </div>
            <CopyInput
              :model-value="hexToRgbResult"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 색상 밝게/어둡게 -->
        <GroupPanel v-model="panelStates[1]" title="색상 밝기 조절" color="purple">
          <div v-show="panelStates[1]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">기준 색상</label>
              <div class="flex gap-2">
                <v-text-field
                  v-model="brightnessColor"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  class="flex-1"
                  placeholder="#3498db"
                  @input="updateBrightnessResults"
                />
                <div 
                  class="w-16 h-12 border rounded-md"
                  :style="{ backgroundColor: brightnessColor }"
                ></div>
              </div>
            </div>
            <div>
              <label class="block mb-1 font-semibold">조절 비율 (%)</label>
              <v-text-field
                v-model.number="brightnessPercent"
                variant="solo-filled"
                density="comfortable"
                hide-details
                type="number"
                min="0"
                max="100"
                placeholder="20"
                @input="updateBrightnessResults"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block mb-1 font-semibold">밝게 한 결과</label>
                <div class="flex gap-2">
                  <CopyInput
                    :model-value="lightenResult"
                    class="flex-1"
                  />
                  <div 
                    class="w-12 h-12 border rounded"
                    :style="{ backgroundColor: lightenResult }"
                  ></div>
                </div>
              </div>
              <div>
                <label class="block mb-1 font-semibold">어둡게 한 결과</label>
                <div class="flex gap-2">
                  <CopyInput
                    :model-value="darkenResult"
                    class="flex-1"
                  />
                  <div 
                    class="w-12 h-12 border rounded"
                    :style="{ backgroundColor: darkenResult }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </GroupPanel>

        <!-- 색상 정보 -->
        <GroupPanel v-model="panelStates[2]" title="색상 정보 분석" color="indigo">
          <div v-show="panelStates[2]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">분석할 색상</label>
              <div class="flex gap-2">
                <v-text-field
                  v-model="analyzeColor"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  class="flex-1"
                  placeholder="#FF5733"
                  @input="analyzeColorInfo"
                />
                <div 
                  class="w-16 h-12 border rounded-md"
                  :style="{ backgroundColor: analyzeColor }"
                ></div>
              </div>
            </div>
            <div v-if="colorInfo" class="space-y-2">
              <div class="p-3 bg-gray-50 rounded-md">
                <span class="block mb-1 font-semibold">RGB 값:</span>
                <span>R: {{ colorInfo.rgb.r }}, G: {{ colorInfo.rgb.g }}, B: {{ colorInfo.rgb.b }}</span>
              </div>
              <div class="p-3 bg-gray-50 rounded-md">
                <span class="block mb-1 font-semibold">밝기:</span>
                <span>{{ colorInfo.brightness.toFixed(2) }} ({{ colorInfo.lightType }})</span>
              </div>
              <div class="p-3 bg-gray-50 rounded-md">
                <span class="block mb-1 font-semibold">대비 색상:</span>
                <div class="flex items-center gap-2">
                  <span>{{ colorInfo.contrastColor }}</span>
                  <div 
                    class="w-8 h-8 border rounded"
                    :style="{ backgroundColor: colorInfo.contrastColor }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <!-- RGB to HEX -->
        <GroupPanel v-model="panelStates[3]" title="RGB → HEX 변환" color="green">
          <div v-show="panelStates[3]" class="space-y-4">
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block mb-1 font-semibold">R</label>
                <v-text-field
                  v-model.number="rgbR"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number"
                  min="0"
                  max="255"
                  @input="processRgbToHex"
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">G</label>
                <v-text-field
                  v-model.number="rgbG"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number"
                  min="0"
                  max="255"
                  @input="processRgbToHex"
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">B</label>
                <v-text-field
                  v-model.number="rgbB"
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number"
                  min="0"
                  max="255"
                  @input="processRgbToHex"
                />
              </div>
            </div>
            <div 
              class="w-full h-16 border rounded-md"
              :style="{ backgroundColor: `rgb(${rgbR}, ${rgbG}, ${rgbB})` }"
            ></div>
            <CopyInput
              :model-value="rgbToHexResult"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 랜덤 색상 생성 -->
        <GroupPanel v-model="panelStates[4]" title="랜덤 색상 생성" color="yellow">
          <div v-show="panelStates[4]" class="space-y-4">
            <v-btn
              @click="generateRandomColors"
              color="warning"
              variant="elevated"
              size="large"
              class="w-full"
              prepend-icon="mdi-palette"
            >
              랜덤 색상 5개 생성
            </v-btn>
            <div v-if="randomColors.length" class="grid grid-cols-1 gap-2">
              <div v-for="(color, index) in randomColors" :key="index" class="flex items-center gap-2">
                <div 
                  class="w-12 h-12 border rounded"
                  :style="{ backgroundColor: color }"
                ></div>
                <CopyInput :model-value="color" class="flex-1" />
              </div>
            </div>
          </div>
        </GroupPanel>
      </div>

    </div>

    <!-- 오류 메시지 -->
    <v-alert v-if="errorMessage" type="error" class="mt-6">
      {{ errorMessage }}
    </v-alert>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
const config = useRuntimeConfig()
const siteUrl = config.public?.siteUrl || 'https://www.web-util.com'
useHead({
  title: '색상 유틸리티 · HEX/RGB 변환·밝기/대비 분석 | Web-Util',
  meta: [
    { name: 'description', content: 'HEX↔RGB 변환, 색상 밝기 조절, 대비 색상 추천, 무작위 색상 생성 등 색상 관련 기능을 제공합니다.' },
    { property: 'og:title', content: '색상 유틸리티 - Web-Util' },
    { property: 'og:description', content: 'HEX/RGB 변환과 밝기·대비 분석으로 UI 색상 결정을 도와드립니다.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl + '/tools/color' }
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/tools/color' }]
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: '색상 유틸리티',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl + '/tools/color',
        description: 'HEX↔RGB 변환, 밝기 조절, 대비 색상 분석을 제공하는 무료 웹 도구.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
      })
    }
  ]
})

import { ref, computed, onMounted } from 'vue'
import { 
  hexToRgb, 
  rgbToHex, 
  lighten, 
  darken, 
  randomColor, 
  getBrightness, 
  isLightColor, 
  getContrastColor, 
  isValidHex 
} from '@/utils/ColorUtil.js'
import GroupPanel from '@/components/GroupPanel.vue'
import CopyInput from '@/components/CopyInput.vue'
import { useResponsive } from '@/composables/useResponsive.js'
import { useErrorHandler } from '@/composables/useErrorHandler.js'

// 반응형 상태 관리
const { createAccordionState } = useResponsive()
const panelStates = ref(createAccordionState(5))

// 에러 처리
const { safeSyncExecute } = useErrorHandler()

// HEX to RGB
const hexToRgbInput = ref('#FF5733')
const hexToRgbResult = ref('')

// RGB to HEX
const rgbR = ref(255)
const rgbG = ref(87)
const rgbB = ref(51)
const rgbToHexResult = ref('')

// 밝기 조절
const brightnessColor = ref('#3498db')
const brightnessPercent = ref(20)
const lightenResult = ref('')
const darkenResult = ref('')

// 랜덤 색상
const randomColors = ref([])

// 색상 분석
const analyzeColor = ref('#FF5733')
const colorInfo = ref(null)

// 에러 메시지
const errorMessage = ref('')

// 메서드들
const processHexToRgb = () => {
  safeSyncExecute(() => {
    if (!isValidHex(hexToRgbInput.value)) {
      hexToRgbResult.value = '올바른 HEX 색상을 입력하세요'
      return
    }
    const rgb = hexToRgb(hexToRgbInput.value)
    hexToRgbResult.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }, 'HEX→RGB 변환', () => {
    hexToRgbResult.value = 'HEX→RGB 변환 오류'
  })
}

const processRgbToHex = () => {
  safeSyncExecute(() => {
    const hex = rgbToHex(rgbR.value, rgbG.value, rgbB.value)
    rgbToHexResult.value = hex
  }, 'RGB→HEX 변환', () => {
    rgbToHexResult.value = 'RGB→HEX 변환 오류'
  })
}

const updateBrightnessResults = () => {
  processLighten()
  processDarken()
}

const processLighten = () => {
  safeSyncExecute(() => {
    if (!isValidHex(brightnessColor.value)) {
      lightenResult.value = '올바른 HEX 색상을 입력하세요'
      return
    }
    lightenResult.value = lighten(brightnessColor.value, brightnessPercent.value)
  }, '밝게 하기', () => {
    lightenResult.value = '밝게 하기 오류'
  })
}

const processDarken = () => {
  safeSyncExecute(() => {
    if (!isValidHex(brightnessColor.value)) {
      darkenResult.value = '올바른 HEX 색상을 입력하세요'
      return
    }
    darkenResult.value = darken(brightnessColor.value, brightnessPercent.value)
  }, '어둡게 하기', () => {
    darkenResult.value = '어둡게 하기 오류'
  })
}

const generateRandomColors = () => {
  safeSyncExecute(() => {
    randomColors.value = Array.from({ length: 5 }, () => randomColor())
  }, '랜덤 색상 생성', () => {
    randomColors.value = []
  })
}

const analyzeColorInfo = () => {
  safeSyncExecute(() => {
    if (!isValidHex(analyzeColor.value)) {
      colorInfo.value = null
      return
    }
    
    const rgb = hexToRgb(analyzeColor.value)
    const brightness = getBrightness(analyzeColor.value)
    const lightType = isLightColor(analyzeColor.value) ? '밝은 색상' : '어두운 색상'
    const contrastColor = getContrastColor(analyzeColor.value)
    
    colorInfo.value = {
      rgb,
      brightness,
      lightType,
      contrastColor
    }
  }, '색상 분석', () => {
    colorInfo.value = null
  })
}

// 초기화
onMounted(() => {
  processHexToRgb()
  processRgbToHex()
  generateRandomColors()
  analyzeColorInfo()
})
</script>
