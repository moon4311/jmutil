<template>
  <div>
    <h2 class="text-xl font-bold mb-4">숫자 유틸리티</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showBlue" title="진수 변환" color="blue">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">숫자 입력</label>
              <v-text-field 
                v-model="input" 
                variant="solo-filled"
                density="comfortable"
                hide-details
                type="number" 
                placeholder="숫자를 입력하세요"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold">2진수</label>
                <CopyInput :model-value="binaryResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">16진수</label>
                <CopyInput :model-value="hexResult" />
              </div>
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showGreen" title="랜덤수 생성" color="green">
          <div class="space-y-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <label class="block mb-1 font-semibold">범위 (최소 ~ 최대)</label>
                <div class="flex gap-2">
                  <v-text-field 
                    v-model.number="randMin" 
                    variant="solo-filled"
                    density="comfortable"
                    hide-details
                    type="number" 
                    placeholder="최소값" 
                  />
                  <span class="self-center">~</span>
                  <v-text-field 
                    v-model.number="randMax" 
                    variant="solo-filled"
                    density="comfortable"
                    hide-details
                    type="number" 
                    placeholder="최대값" 
                  />
                </div>
              </div>
              <div style="min-width:120px">
                <label class="block mb-1 font-semibold">갯수</label>
                <v-text-field 
                  v-model.number="randCount" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number" 
                  min="1" 
                  max="100" 
                  placeholder="갯수" 
                />
              </div>
              <div class="flex items-end">
                <v-btn 
                  color="green" 
                  variant="elevated"
                  size="large"
                  @click="generateRandomNumbers"
                >
                  생성
                </v-btn>
              </div>
            </div>
            <div v-if="randomNumbers.length > 0">
              <label class="block mb-1 font-semibold">결과 목록</label>
              <CopyInput :model-value="randomNumbers.join(', ')" />
            </div>
          </div>
        </GroupPanel>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref, computed } from 'vue';
import { toBinary, toHex, getRandomInts } from '@/utils/NumberUtil.js';
import CopyInput from '@/components/CopyInput.vue';
import GroupPanel from '@/components/GroupPanel.vue';

// 아코디언 상태
const showBlue = ref(true);
const showGreen = ref(true);

// 진수 변환
const input = ref('');
const binaryResult = computed(() => {
  const n = parseInt(input.value);
  return isNaN(n) ? '' : toBinary(n);
});
const hexResult = computed(() => {
  const n = parseInt(input.value);
  return isNaN(n) ? '' : toHex(n);
});

// 랜덤수 생성
const randMin = ref(1);
const randMax = ref(100);
const randCount = ref(5);
const randomNumbers = ref([]);

function generateRandomNumbers() {
  const min = Number(randMin.value);
  const max = Number(randMax.value);
  const count = Number(randCount.value);
  
  if (isNaN(min) || isNaN(max) || isNaN(count) || min > max || count < 1) {
    return;
  }
  
  randomNumbers.value = getRandomInts(min, max, count);
}
</script>
