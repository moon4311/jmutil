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
      // GroupPanel 상태 (HEX→RGB, 밝기조절, 색상분석, RGB→HEX, 랜덤색상)
      panelStates: [false, false, false, false, false],
      
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
          this.hexToRgbResult = '올바른 HEX 색상을 입력하세요'
          return
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
          this.lightenResult = '올바른 HEX 색상을 입력하세요'
          return
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
          this.darkenResult = '올바른 HEX 색상을 입력하세요'
          return
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
          this.colorInfo = null
          return
        }
        
        const rgb = hexToRgb(this.analyzeColor)
        const brightness = getBrightness(this.analyzeColor)
        const lightType = isLightColor(this.analyzeColor) ? '밝은 색상' : '어두운 색상'
        const contrastColor = getContrastColor(this.analyzeColor)
        
        this.colorInfo = {
          rgb,
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
