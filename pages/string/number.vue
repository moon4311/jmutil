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

        <GroupPanel v-model="showPurple" title="반올림/올림/내림" color="purple">
          <div class="space-y-4">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <label class="block mb-1 font-semibold">숫자 입력</label>
                <v-text-field 
                  v-model.number="roundInput" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number" 
                  step="any"
                  placeholder="예: 123.456789"
                />
              </div>
              <div style="min-width:120px">
                <label class="block mb-1 font-semibold">소수점 자리</label>
                <v-text-field 
                  v-model.number="decimals" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number" 
                  min="0" 
                  max="10" 
                  placeholder="2" 
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold">반올림 결과</label>
                <CopyInput :model-value="roundResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">올림 결과</label>
                <CopyInput :model-value="ceilResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">내림 결과</label>
                <CopyInput :model-value="floorResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">버림 결과</label>
                <CopyInput :model-value="truncResult" />
              </div>
            </div>
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
  title: '숫자 유틸 · 진법변환/랜덤/반올림 | Web-Util',
  meta: [
    { name: 'description', content: '2/16진수 변환, 랜덤 수 생성, 반올림·올림·내림·버림 계산을 제공하는 숫자 처리 도구.' },
    { property: 'og:title', content: '숫자 유틸리티 - Web-Util' },
    { property: 'og:description', content: '진법 변환과 수치 계산을 빠르게 처리하세요.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl + '/string/number' }
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/string/number' }]
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: '숫자 유틸리티',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl + '/string/number',
        description: '진법변환, 랜덤 수 생성, 반올림/올림/내림/버림을 제공하는 무료 웹 도구.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
      })
    }
  ]
})
import { ref, computed } from 'vue';
import { toBinary, toHex, getRandomInts, roundNumber, ceilNumber, floorNumber, truncNumber } from '@/utils/NumberUtil.js';
import CopyInput from '@/components/CopyInput.vue';
import GroupPanel from '@/components/GroupPanel.vue';
import { useResponsive } from '@/composables/useResponsive.js';

// 반응형 상태 관리
const { createAccordionState } = useResponsive();
const accordionState = createAccordionState(3);
const showBlue = ref(accordionState[0]);
const showGreen = ref(accordionState[1]);
const showPurple = ref(accordionState[2]);

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

// 반올림/올림/내림
const roundInput = ref(123.456789);
const decimals = ref(2);

const roundResult = computed(() => {
  const num = Number(roundInput.value);
  const dec = Number(decimals.value) || 0;
  return isNaN(num) ? '' : roundNumber(num, dec).toString();
});

const ceilResult = computed(() => {
  const num = Number(roundInput.value);
  const dec = Number(decimals.value) || 0;
  return isNaN(num) ? '' : ceilNumber(num, dec).toString();
});

const floorResult = computed(() => {
  const num = Number(roundInput.value);
  const dec = Number(decimals.value) || 0;
  return isNaN(num) ? '' : floorNumber(num, dec).toString();
});

const truncResult = computed(() => {
  const num = Number(roundInput.value);
  const dec = Number(decimals.value) || 0;
  return isNaN(num) ? '' : truncNumber(num, dec).toString();
});
</script>
