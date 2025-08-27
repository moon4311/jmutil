<template>
  <div>
    <h2 class="text-xl font-bold mb-4">문자열 변환</h2>
    <div class="mb-4">
      <v-textarea
        v-model="input"
        placeholder="문자열을 입력하세요"
        rows="5"
        variant="solo-filled"
        density="comfortable"
        hide-details
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showBlue" title="대/소문자/Trim 변환" color="blue">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">대문자 결과</label>
              <CopyInput :model-value="upperResult" />
            </div>
            <div>
              <label class="block mb-1 font-semibold">소문자 결과</label>
              <CopyInput :model-value="lowerResult" />
            </div>
            <div>
              <label class="block mb-1 font-semibold">Trim 결과</label>
              <CopyInput :model-value="trimResult" />
            </div>
          </div>
        </GroupPanel>

        <GroupPanel v-model="showPurple" title="패딩(LPad/RPad)" color="purple">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">LPad 결과</label>
              <div class="flex gap-2 mb-1">
                <v-text-field 
                  v-model.number="lpadLen" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number" 
                  min="0"
                  max="100"
                  label="길이" 
                  placeholder="10"
                  style="max-width:80px" 
                />
                <v-text-field 
                  v-model="lpadChar" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  label="채울문자" 
                  placeholder="0"
                  maxlength="1"
                  style="max-width:80px" 
                />
              </div>
              <CopyInput :model-value="lpadResult" />
            </div>
            <div>
              <label class="block mb-1 font-semibold">RPad 결과</label>
              <div class="flex gap-2 mb-1">
                <v-text-field 
                  v-model.number="rpadLen" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  type="number" 
                  min="0"
                  max="100"
                  label="길이" 
                  placeholder="10"
                  style="max-width:80px" 
                />
                <v-text-field 
                  v-model="rpadChar" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  label="채울문자" 
                  placeholder=" "
                  maxlength="1"
                  style="max-width:80px" 
                />
              </div>
              <CopyInput :model-value="rpadResult" />
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showGreen" title="표기법 변환" color="green">
          <div class="space-y-4">
            <div>
              <label class="block mb-1 font-semibold">카멜표기 결과</label>
              <CopyInput :model-value="camelResult" />
            </div>
            <div>
              <label class="block mb-1 font-semibold">스네이크표기 결과</label>
              <CopyInput :model-value="snakeResult" />
            </div>
          </div>
        </GroupPanel>

        <GroupPanel v-model="showOrange" title="인코딩/디코딩" color="orange">
          <div class="space-y-4">
            <div class="mb-4">
              <label class="block mb-1 font-semibold">인코딩 방식</label>
              <v-select
                v-model="encodeType"
                :items="encodeTypes"
                variant="solo-filled"
                density="comfortable"
                hide-details
                class="w-full"
              />
            </div>
            <div>
              <label class="block mb-1 font-semibold">인코딩 결과</label>
              <CopyTextArea :model-value="encodedResult" rows="3" />
            </div>
            <div>
              <label class="block mb-1 font-semibold">디코딩 결과</label>
              <CopyTextArea :model-value="decodedResult" rows="3" />
            </div>
          </div>
        </GroupPanel>

        <GroupPanel v-model="showRed" title="공백/특수문자 처리" color="red">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold">모든 공백 제거</label>
                <CopyInput :model-value="removeAllSpacesResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">공백 정규화</label>
                <CopyInput :model-value="normalizeSpacesResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">특수문자 제거</label>
                <CopyInput :model-value="removeSpecialCharsResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">숫자만 추출</label>
                <CopyInput :model-value="extractNumbersResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">영문자만 추출</label>
                <CopyInput :model-value="extractAlphabetsResult" />
              </div>
              <div>
                <label class="block mb-1 font-semibold">한글만 추출</label>
                <CopyInput :model-value="extractKoreanResult" />
              </div>
            </div>
          </div>
        </GroupPanel>

        <GroupPanel v-model="showTeal" title="정규식 테스트" color="teal">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 font-semibold">정규식 패턴</label>
                <v-text-field 
                  v-model="regexPattern" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="예: \d+, [a-zA-Z]+, ^.*@.*\.com$"
                />
              </div>
              <div>
                <label class="block mb-1 font-semibold">플래그</label>
                <v-text-field 
                  v-model="regexFlags" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="g, i, m, s"
                />
              </div>
            </div>
            <div v-if="regexTestResult.success !== undefined">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block mb-1 font-semibold">매칭 여부</label>
                  <v-chip :color="regexTestResult.isMatch ? 'green' : 'red'" variant="elevated">
                    {{ regexTestResult.isMatch ? '매칭됨' : '매칭되지 않음' }}
                  </v-chip>
                </div>
                <div>
                  <label class="block mb-1 font-semibold">매칭 개수</label>
                  <span class="text-lg font-mono">{{ regexTestResult.matchCount }}</span>
                </div>
              </div>
              <div v-if="regexTestResult.matches && regexTestResult.matches.length > 0">
                <label class="block mb-1 font-semibold">매칭 결과</label>
                <CopyTextArea :model-value="regexTestResult.matches.join('\n')" rows="3" />
              </div>
            </div>
            <div v-if="regexTestResult.error" class="text-red-500">
              {{ regexTestResult.error }}
            </div>
            <div>
              <label class="block mb-1 font-semibold">치환 문자열</label>
              <v-text-field 
                v-model="regexReplacement" 
                variant="solo-filled"
                density="comfortable"
                hide-details
                placeholder="치환할 문자열 입력"
              />
            </div>
            <div v-if="regexReplaceResult.success">
              <label class="block mb-1 font-semibold">치환 결과</label>
              <CopyTextArea :model-value="regexReplaceResult.result" rows="3" />
            </div>
            <div v-if="regexReplaceResult.error" class="text-red-500">
              {{ regexReplaceResult.error }}
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
import { 
  toCamelCase, 
  toSnakeCase, 
  lpad, 
  rpad,
  encodeBase64,
  decodeBase64,
  encodeURL,
  decodeURL,
  encodeHex,
  decodeHex,
  encodeUnicode,
  decodeUnicode,
  removeAllSpaces,
  normalizeSpaces,
  removeSpecialChars,
  extractNumbers,
  extractAlphabets,
  extractKorean,
  regexTest,
  regexReplace
} from '@/utils/StringUtil.js';
import CopyInput from '@/components/CopyInput.vue';
import CopyTextArea from '@/components/CopyTextArea.vue';
import GroupPanel from '@/components/GroupPanel.vue';
import { useResponsive } from '@/composables/useResponsive.js';

const input = ref('');
// 반응형 상태 관리
const { createAccordionState } = useResponsive();
const accordionState = createAccordionState(6);
const showBlue = ref(accordionState[0]);
const showGreen = ref(accordionState[1]);
const showPurple = ref(accordionState[2]);
const showOrange = ref(accordionState[3]);
const showRed = ref(accordionState[4]);
const showTeal = ref(accordionState[5]);

const upperResult = computed(() => input.value.toUpperCase());
const lowerResult = computed(() => input.value.toLowerCase());
const trimResult = computed(() => input.value.trim());
const camelResult = computed(() => toCamelCase(input.value));
const snakeResult = computed(() => toSnakeCase(input.value));

// lpad, rpad 설정
const lpadLen = ref(10);
const lpadChar = ref('0');
const rpadLen = ref(10);
const rpadChar = ref('0');

const lpadResult = computed(() => {
  const len = parseInt(lpadLen.value, 10);
  const char = lpadChar.value || '0';
  if (isNaN(len) || len <= 0) return input.value;
  return lpad(input.value, len, char);
});

const rpadResult = computed(() => {
  const len = parseInt(rpadLen.value, 10);
  const char = rpadChar.value || ' ';
  if (isNaN(len) || len <= 0) return input.value;
  return rpad(input.value, len, char);
});

// 인코딩/디코딩 설정
const encodeTypes = [
  { title: 'Base64', value: 'base64' },
  { title: 'URL', value: 'url' },
  { title: 'HEX', value: 'hex' },
  { title: 'Unicode', value: 'unicode' },
];

const encodeType = ref('base64');

const encodedResult = computed(() => {
  if (!input.value) return '';
  
  try {
    switch (encodeType.value) {
      case 'base64': return encodeBase64(input.value);
      case 'url': return encodeURL(input.value);
      case 'hex': return encodeHex(input.value);
      case 'unicode': return encodeUnicode(input.value);
      default: return '';
    }
  } catch (error) {
    return error.message || '인코딩 오류';
  }
});

const decodedResult = computed(() => {
  if (!input.value) return '';
  
  try {
    switch (encodeType.value) {
      case 'base64': return decodeBase64(input.value);
      case 'url': return decodeURL(input.value);
      case 'hex': return decodeHex(input.value);
      case 'unicode': return decodeUnicode(input.value);
      default: return '';
    }
  } catch (error) {
    return error.message || '디코딩 오류';
  }
});

// 공백/특수문자 처리 결과
const removeAllSpacesResult = computed(() => removeAllSpaces(input.value));
const normalizeSpacesResult = computed(() => normalizeSpaces(input.value));
const removeSpecialCharsResult = computed(() => removeSpecialChars(input.value));
const extractNumbersResult = computed(() => extractNumbers(input.value));
const extractAlphabetsResult = computed(() => extractAlphabets(input.value));
const extractKoreanResult = computed(() => extractKorean(input.value));

// 정규식 테스트 설정
const regexPattern = ref('');
const regexFlags = ref('g');
const regexReplacement = ref('');

const regexTestResult = computed(() => {
  if (!input.value || !regexPattern.value) {
    return { success: undefined };
  }
  return regexTest(input.value, regexPattern.value, regexFlags.value);
});

const regexReplaceResult = computed(() => {
  if (!input.value || !regexPattern.value) {
    return { success: undefined };
  }
  return regexReplace(input.value, regexPattern.value, regexReplacement.value, regexFlags.value);
});
</script>
