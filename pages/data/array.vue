<template>
  <div>
    <h2 class="text-xl font-bold mb-4">배열 유틸리티</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <!-- 중복 제거 -->
        <GroupPanel v-model="panelStates[0]" title="중복 요소 제거" color="blue">
          <div v-show="panelStates[0]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">입력 배열 (쉼표로 구분)</label>
              <v-textarea
                v-model="uniqueInput"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="3"
                @input="processUnique"
                placeholder="1,2,3,2,4,3,5,1"
              />
            </div>
            <CopyTextArea
              :model-value="uniqueResult"
              label="중복 제거 결과"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 배열 분할 -->
        <GroupPanel v-model="panelStates[1]" title="배열 분할" color="purple">
          <div v-show="panelStates[1]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">입력 배열 (쉼표로 구분)</label>
              <v-textarea
                v-model="chunkInput"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="3"
                @input="processChunk"
                placeholder="1,2,3,4,5,6,7,8,9,10"
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold">분할 크기</label>
              <v-text-field
                v-model.number="chunkSize"
                variant="solo-filled"
                density="comfortable"
                hide-details
                type="number"
                min="1"
                @input="processChunk"
                placeholder="3"
              />
            </div>
            <CopyTextArea
              :model-value="chunkResult"
              label="분할 결과"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 교집합 -->
        <GroupPanel v-model="panelStates[2]" title="교집합" color="indigo">
          <div v-show="panelStates[2]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">배열 1 (쉼표로 구분)</label>
              <v-textarea
                v-model="intersectionInput1"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="2"
                @input="processIntersection"
                placeholder="1,2,3,4,5"
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold">배열 2 (쉼표로 구분)</label>
              <v-textarea
                v-model="intersectionInput2"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="2"
                @input="processIntersection"
                placeholder="3,4,5,6,7"
              />
            </div>
            <CopyTextArea
              :model-value="intersectionResult"
              label="교집합 결과"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 객체 배열 그룹핑 -->
        <GroupPanel v-model="panelStates[3]" title="객체 배열 그룹핑" color="pink">
          <div v-show="panelStates[3]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">객체 배열 (JSON 형태로 입력)</label>
              <v-textarea
                v-model="groupByInput"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="4"
                @input="processGroupBy"
                placeholder='[{"name":"John","age":25},{"name":"Jane","age":25},{"name":"Bob","age":30}]'
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold">그룹핑 키</label>
              <v-text-field
                v-model="groupByKey"
                variant="solo-filled"
                density="comfortable"
                hide-details
                @input="processGroupBy"
                placeholder="age"
              />
            </div>
            <CopyTextArea
              :model-value="groupByResult"
              label="그룹핑 결과"
              placeholder="결과가 여기에 표시됩니다"
              :rows="8"
            />
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <!-- 배열 섞기 -->
        <GroupPanel v-model="panelStates[4]" title="배열 섞기" color="green">
          <div v-show="panelStates[4]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">입력 배열 (쉼표로 구분)</label>
              <v-textarea
                v-model="shuffleInput"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="3"
                placeholder="사과,바나나,체리,포도,오렌지"
              />
            </div>
            <v-btn
              @click="processShuffle"
              color="success"
              variant="elevated"
              size="large"
              class="w-full"
              prepend-icon="mdi-shuffle"
            >
              배열 섞기
            </v-btn>
            <CopyTextArea
              :model-value="shuffleResult"
              label="섞기 결과"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 배열 평탄화 -->
        <GroupPanel v-model="panelStates[5]" title="배열 평탄화" color="yellow">
          <div v-show="panelStates[5]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">중첩 배열 (JSON 형태로 입력)</label>
              <v-textarea
                v-model="flattenInput"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="3"
                @input="processFlatten"
                placeholder="[1, [2, 3], [4, [5, 6]], 7]"
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold">평탄화 깊이</label>
              <v-text-field
                v-model.number="flattenDepth"
                variant="solo-filled"
                density="comfortable"
                hide-details
                type="number"
                min="1"
                @input="processFlatten"
                placeholder="깊이 (비워두면 무제한)"
              />
            </div>
            <CopyTextArea
              :model-value="flattenResult"
              label="평탄화 결과"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 차집합 -->
        <GroupPanel v-model="panelStates[6]" title="차집합" color="red">
          <div v-show="panelStates[6]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">배열 1 (쉼표로 구분)</label>
              <v-textarea
                v-model="differenceInput1"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="2"
                @input="processDifference"
                placeholder="1,2,3,4,5"
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold">배열 2 (쉼표로 구분)</label>
              <v-textarea
                v-model="differenceInput2"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="2"
                @input="processDifference"
                placeholder="3,4,5,6,7"
              />
            </div>
            <CopyTextArea
              :model-value="differenceResult"
              label="차집합 결과 (배열1 - 배열2)"
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
        </GroupPanel>

        <!-- 배열 상태 체크 -->
        <GroupPanel v-model="panelStates[7]" title="배열 상태 체크" color="gray">
          <div v-show="panelStates[7]" class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">체크할 배열 (JSON 형태로 입력)</label>
              <v-textarea
                v-model="checkInput"
                variant="solo-filled"
                density="comfortable"
                hide-details
                rows="3"
                @input="processCheck"
                placeholder="[]"
              />
            </div>
            <div class="grid grid-cols-1 gap-2">
              <div class="p-3 bg-gray-50 rounded-md">
                <span class="block mb-1 font-semibold">빈 배열 여부:</span>
                <span :class="checkResults.isEmpty ? 'text-red-600' : 'text-green-600'">
                  {{ checkResults.isEmpty ? '예' : '아니오' }}
                </span>
              </div>
              <div class="p-3 bg-gray-50 rounded-md">
                <span class="block mb-1 font-semibold">배열 길이:</span>
                <span class="text-blue-600">{{ checkResults.length }}</span>
              </div>
              <div class="p-3 bg-gray-50 rounded-md">
                <span class="block mb-1 font-semibold">유효한 배열:</span>
                <span :class="checkResults.isValidArray ? 'text-green-600' : 'text-red-600'">
                  {{ checkResults.isValidArray ? '예' : '아니오' }}
                </span>
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
  unique, 
  flatten, 
  shuffle, 
  groupBy, 
  chunk, 
  intersection, 
  difference, 
  isEmpty 
} from '~/utils/ArrayUtil.js'
import GroupPanel from '~/components/GroupPanel.vue'
import CopyInput from '~/components/CopyInput.vue'
import CopyTextArea from '~/components/CopyTextArea.vue'

export default {
  name: 'ArrayUtils',
  components: {
    GroupPanel,
    CopyInput,
    CopyTextArea
  },
  data() {
    return {
      // GroupPanel 상태 (중복제거, 분할, 교집합, 그룹핑, 섞기, 평탄화, 차집합, 상태체크) - 모바일에서는 기본 닫힌 상태
      panelStates: this.$nuxt?.ssrContext ? [false, false, false, false, false, false, false, false] : 
                   (process.client && window.innerWidth < 768) ? [false, false, false, false, false, false, false, false] : [true, true, true, true, true, true, true, true],
      
      // 중복 제거
      uniqueInput: '1,2,3,2,4,3,5,1',
      uniqueResult: '',
      
      // 배열 섞기
      shuffleInput: '사과,바나나,체리,포도,오렌지',
      shuffleResult: '',
      
      // 배열 분할
      chunkInput: '1,2,3,4,5,6,7,8,9,10',
      chunkSize: 3,
      chunkResult: '',
      
      // 배열 평탄화
      flattenInput: '[1, [2, 3], [4, [5, 6]], 7]',
      flattenDepth: null,
      flattenResult: '',
      
      // 교집합
      intersectionInput1: '1,2,3,4,5',
      intersectionInput2: '3,4,5,6,7',
      intersectionResult: '',
      
      // 차집합
      differenceInput1: '1,2,3,4,5',
      differenceInput2: '3,4,5,6,7',
      differenceResult: '',
      
      // 객체 배열 그룹핑
      groupByInput: '[{"name":"John","age":25},{"name":"Jane","age":25},{"name":"Bob","age":30}]',
      groupByKey: 'age',
      groupByResult: '',
      
      // 배열 상태 체크
      checkInput: '[]',
      checkResults: {
        isEmpty: true,
        length: 0,
        isValidArray: true
      },
      
      errorMessage: ''
    }
  },
  methods: {
    parseArray(input) {
      try {
        // JSON 형태인 경우
        if (input.trim().startsWith('[')) {
          return JSON.parse(input)
        }
        // 쉼표로 구분된 문자열인 경우
        return input.split(',').map(item => {
          const trimmed = item.trim()
          // 숫자인지 확인
          if (!isNaN(trimmed) && trimmed !== '') {
            return Number(trimmed)
          }
          return trimmed
        }).filter(item => item !== '')
      } catch (error) {
        throw new Error('배열 파싱 실패')
      }
    },
    
    processUnique() {
      try {
        this.errorMessage = ''
        const arr = this.parseArray(this.uniqueInput)
        const result = unique(arr)
        this.uniqueResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `중복 제거 오류: ${error.message}`
      }
    },
    
    processShuffle() {
      try {
        this.errorMessage = ''
        const arr = this.parseArray(this.shuffleInput)
        const result = shuffle(arr)
        this.shuffleResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `배열 섞기 오류: ${error.message}`
      }
    },
    
    processChunk() {
      try {
        this.errorMessage = ''
        const arr = this.parseArray(this.chunkInput)
        const result = chunk(arr, this.chunkSize || 1)
        this.chunkResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `배열 분할 오류: ${error.message}`
      }
    },
    
    processFlatten() {
      try {
        this.errorMessage = ''
        const arr = JSON.parse(this.flattenInput)
        const depth = this.flattenDepth || Infinity
        const result = flatten(arr, depth)
        this.flattenResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `배열 평탄화 오류: ${error.message}`
      }
    },
    
    processIntersection() {
      try {
        this.errorMessage = ''
        const arr1 = this.parseArray(this.intersectionInput1)
        const arr2 = this.parseArray(this.intersectionInput2)
        const result = intersection(arr1, arr2)
        this.intersectionResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `교집합 오류: ${error.message}`
      }
    },
    
    processDifference() {
      try {
        this.errorMessage = ''
        const arr1 = this.parseArray(this.differenceInput1)
        const arr2 = this.parseArray(this.differenceInput2)
        const result = difference(arr1, arr2)
        this.differenceResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `차집합 오류: ${error.message}`
      }
    },
    
    processGroupBy() {
      try {
        this.errorMessage = ''
        const arr = JSON.parse(this.groupByInput)
        const result = groupBy(arr, this.groupByKey)
        this.groupByResult = JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = `객체 배열 그룹핑 오류: ${error.message}`
      }
    },
    
    processCheck() {
      try {
        this.errorMessage = ''
        let arr
        try {
          arr = JSON.parse(this.checkInput)
        } catch {
          arr = this.checkInput
        }
        
        this.checkResults = {
          isEmpty: isEmpty(arr),
          length: Array.isArray(arr) ? arr.length : 0,
          isValidArray: Array.isArray(arr)
        }
      } catch (error) {
        this.errorMessage = `배열 체크 오류: ${error.message}`
      }
    }
  },
  
  mounted() {
    // 초기값들로 실행
    this.processUnique()
    this.processShuffle()
    this.processChunk()
    this.processFlatten()
    this.processIntersection()
    this.processDifference()
    this.processGroupBy()
    this.processCheck()
  }
}
</script>
