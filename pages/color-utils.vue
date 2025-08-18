<template>
  <div>
    <h2 class="text-xl font-bold mb-4">색상 유틸리티</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- HEX to RGB -->
      <GroupPanel v-model="showHexToRgb" title="HEX → RGB 변환" color="blue">
        <div v-show="showHexToRgb" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">HEX 색상</label>
            <div class="flex space-x-2">
              <input
                v-model="hexToRgbInput"
                @input="processHexToRgb"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#FF5733 또는 #F53"
                maxlength="7"
              />
              <div 
                class="w-12 h-10 border border-gray-300 rounded-md"
                :style="{ backgroundColor: hexToRgbInput }"
              ></div>
            </div>
          </div>
          <CopyInput
            v-model="hexToRgbResult"
            label="RGB 결과"
            placeholder="결과가 여기에 표시됩니다"
          />
        </div>
      </GroupPanel>

      <!-- RGB to HEX -->
      <GroupPanel v-model="showRgbToHex" title="RGB → HEX 변환" color="green">
        <div v-show="showRgbToHex" class="space-y-4">
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-sm font-medium mb-1">R</label>
              <input
                v-model.number="rgbR"
                @input="processRgbToHex"
                type="number"
                min="0"
                max="255"
                class="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">G</label>
              <input
                v-model.number="rgbG"
                @input="processRgbToHex"
                type="number"
                min="0"
                max="255"
                class="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">B</label>
              <input
                v-model.number="rgbB"
                @input="processRgbToHex"
                type="number"
                min="0"
                max="255"
                class="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div 
            class="w-full h-8 border border-gray-300 rounded-md"
            :style="{ backgroundColor: `rgb(${rgbR}, ${rgbG}, ${rgbB})` }"
          ></div>
          <CopyInput
            v-model="rgbToHexResult"
            label="HEX 결과"
            placeholder="결과가 여기에 표시됩니다"
          />
        </div>
      </GroupPanel>

      <!-- 색상 밝게/어둡게 -->
      <GroupPanel v-model="showBrightness" title="색상 밝기 조절" color="purple">
        <div v-show="showBrightness" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">기준 색상</label>
            <div class="flex space-x-2">
              <input
                v-model="brightnessColor"
                @input="updateBrightnessResults"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#3498db"
              />
              <div 
                class="w-12 h-10 border border-gray-300 rounded-md"
                :style="{ backgroundColor: brightnessColor }"
              ></div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">조절 비율 (%)</label>
            <input
              v-model.number="brightnessPercent"
              @input="updateBrightnessResults"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="20"
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium mb-1">밝게 한 결과</label>
              <div class="flex space-x-2">
                <CopyInput
                  :model-value="lightenResult"
                  class="flex-1"
                />
                <div 
                  class="w-8 h-8 border border-gray-300 rounded"
                  :style="{ backgroundColor: lightenResult }"
                ></div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">어둡게 한 결과</label>
              <div class="flex space-x-2">
                <CopyInput
                  :model-value="darkenResult"
                  class="flex-1"
                />
                <div 
                  class="w-8 h-8 border border-gray-300 rounded"
                  :style="{ backgroundColor: darkenResult }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </GroupPanel>

      <!-- 랜덤 색상 생성 -->
      <GroupPanel v-model="showRandom" title="랜덤 색상 생성" color="yellow">
        <div v-show="showRandom" class="space-y-4">
          <button
            @click="generateRandomColors"
            class="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
          >
            랜덤 색상 5개 생성
          </button>
          <div class="grid grid-cols-1 gap-2">
            <div v-for="(color, index) in randomColors" :key="index" class="flex space-x-2">
              <div 
                class="w-12 h-10 border border-gray-300 rounded-md"
                :style="{ backgroundColor: color }"
              ></div>
              <CopyInput
                :model-value="color"
                class="flex-1"
              />
            </div>
          </div>
        </div>
      </GroupPanel>

      <!-- 색상 정보 -->
      <GroupPanel v-model="showAnalyze" title="색상 정보 분석" color="indigo">
        <div v-show="showAnalyze" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">분석할 색상</label>
            <div class="flex space-x-2">
              <input
                v-model="analyzeColor"
                @input="analyzeColorInfo"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#FF5733"
              />
              <div 
                class="w-12 h-10 border border-gray-300 rounded-md"
                :style="{ backgroundColor: analyzeColor }"
              ></div>
            </div>
          </div>
          <div v-if="colorInfo" class="space-y-2">
            <div class="text-sm">
              <strong>RGB:</strong> {{ colorInfo.rgb }}
            </div>
            <div class="text-sm">
              <strong>밝기:</strong> {{ colorInfo.brightness }}/255
            </div>
            <div class="text-sm">
              <strong>색상 타입:</strong> {{ colorInfo.lightType }}
            </div>
            <div class="text-sm">
              <strong>추천 텍스트 색상:</strong> 
              <span :style="{ color: colorInfo.contrastColor }">{{ colorInfo.contrastColor }}</span>
            </div>
            <div 
              class="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium"
              :style="{ backgroundColor: analyzeColor, color: colorInfo.contrastColor }"
            >
              샘플 텍스트
            </div>
          </div>
        </div>
      </GroupPanel>

    </div>

    <!-- 오류 메시지 -->
    <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
</script>

<script>
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
} from '~/utils/ColorUtil.js'
import GroupPanel from '~/components/GroupPanel.vue'
import CopyInput from '~/components/CopyInput.vue'

export default {
  name: 'ColorUtils',
  components: {
    GroupPanel,
    CopyInput
  },
  data() {
    return {
      // GroupPanel 상태
      showHexToRgb: true,
      showRgbToHex: true,
      showBrightness: true,
      showRandom: true,
      showAnalyze: true,
      
      // HEX to RGB
      hexToRgbInput: '#FF5733',
      hexToRgbResult: '',
      
      // RGB to HEX
      rgbR: 255,
      rgbG: 87,
      rgbB: 51,
      rgbToHexResult: '',
      
      // 밝기 조절
      brightnessColor: '#3498db',
      brightnessPercent: 20,
      lightenResult: '',
      darkenResult: '',
      
      // 랜덤 색상
      randomColors: [],
      
      // 색상 분석
      analyzeColor: '#FF5733',
      colorInfo: null,
      
      errorMessage: ''
    }
  },
  methods: {
    processHexToRgb() {
      try {
        this.errorMessage = ''
        if (!isValidHex(this.hexToRgbInput)) {
          throw new Error('유효하지 않은 HEX 색상입니다')
        }
        const rgb = hexToRgb(this.hexToRgbInput)
        this.hexToRgbResult = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      } catch (error) {
        this.errorMessage = `HEX→RGB 변환 오류: ${error.message}`
      }
    },
    
    processRgbToHex() {
      try {
        this.errorMessage = ''
        const hex = rgbToHex(this.rgbR, this.rgbG, this.rgbB)
        this.rgbToHexResult = hex
      } catch (error) {
        this.errorMessage = `RGB→HEX 변환 오류: ${error.message}`
      }
    },
    
    updateBrightnessResults() {
      this.processLighten()
      this.processDarken()
    },
    
    processLighten() {
      try {
        this.errorMessage = ''
        if (!isValidHex(this.brightnessColor)) {
          throw new Error('유효하지 않은 HEX 색상입니다')
        }
        this.lightenResult = lighten(this.brightnessColor, this.brightnessPercent)
      } catch (error) {
        this.errorMessage = `밝게 하기 오류: ${error.message}`
      }
    },
    
    processDarken() {
      try {
        this.errorMessage = ''
        if (!isValidHex(this.brightnessColor)) {
          throw new Error('유효하지 않은 HEX 색상입니다')
        }
        this.darkenResult = darken(this.brightnessColor, this.brightnessPercent)
      } catch (error) {
        this.errorMessage = `어둡게 하기 오류: ${error.message}`
      }
    },
    
    generateRandomColors() {
      this.randomColors = Array.from({ length: 5 }, () => randomColor())
    },
    
    analyzeColorInfo() {
      try {
        this.errorMessage = ''
        if (!isValidHex(this.analyzeColor)) {
          throw new Error('유효하지 않은 HEX 색상입니다')
        }
        
        const rgb = hexToRgb(this.analyzeColor)
        const brightness = getBrightness(this.analyzeColor)
        const lightType = isLightColor(this.analyzeColor) ? '밝은 색상' : '어두운 색상'
        const contrastColor = getContrastColor(this.analyzeColor)
        
        this.colorInfo = {
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          brightness,
          lightType,
          contrastColor
        }
      } catch (error) {
        this.errorMessage = `색상 분석 오류: ${error.message}`
      }
    }
  },
  
  mounted() {
    // 초기값들로 실행
    this.processHexToRgb()
    this.processRgbToHex()
    this.generateRandomColors()
    this.analyzeColorInfo()
  }
}
</script>
