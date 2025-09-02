<template>
  <div>
    <h2 class="text-xl font-bold mb-4">로컬 저장소 유틸리티</h2>
    <p class="text-red-600 text-sm mb-6 font-medium">서버에 저장되지 않고, 사용자 기기에 암호화 되어 저장 됩니다.</p>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 좌측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showBlue" title="일반 텍스트 저장" color="blue">
          <div class="space-y-4">
            <form @submit.prevent="saveTextItem" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <v-text-field 
                  v-model="textKey" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="키" 
                  required 
                />
                <v-text-field 
                  v-model="textValue" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="값" 
                  required 
                />
              </div>
              <div class="flex gap-2">
                <v-btn 
                  type="submit" 
                  color="blue" 
                  variant="elevated"
                  size="large"
                  class="flex-1"
                >
                  저장
                </v-btn>
                <v-btn 
                  type="button" 
                  @click="clearAllTextItems" 
                  color="red" 
                  variant="outlined"
                  size="large"
                  class="flex-1"
                >
                  전체삭제
                </v-btn>
              </div>
            </form>
            
            <div v-if="sortedTextItems.length" class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="item in sortedTextItems" :key="item.key" class="border rounded-lg p-3 bg-gray-50">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono text-sm font-semibold truncate pr-2 cursor-pointer" @click="copyValue(item.key)">
                    {{ item.key.replace(TEXT_PREFIX, '') }}
                  </span>
                  <v-btn
                    @click="copyValue(item.key)" 
                    size="x-small"
                    variant="tonal"
                    color="blue"
                  >
                    키복사
                  </v-btn>
                </div>
                
                <template v-if="editTextKey === item.key">
                  <v-textarea
                    v-model="editTextValue" 
                    variant="solo-filled"
                    density="comfortable"
                    hide-details
                    rows="2" 
                    class="mb-2 font-mono text-sm"
                    @keyup.enter.ctrl="saveEditText(item.key)"
                  />
                  <div class="flex gap-2">
                    <v-btn
                      @click="saveEditText(item.key)" 
                      color="blue"
                      variant="elevated"
                      size="small"
                      class="flex-1"
                    >
                      저장
                    </v-btn>
                    <v-btn
                      @click="cancelEditText" 
                      color="grey-lighten-1"
                      variant="outlined"
                      size="small"
                      class="flex-1"
                    >
                      취소
                    </v-btn>
                  </div>
                </template>
                
                <template v-else>
                  <div class="font-mono text-sm break-all mb-2 p-2 bg-white rounded border cursor-pointer" @click="copyValue(item.value)">
                    {{ item.value }}
                  </div>
                  <div class="flex gap-2">
                    <v-btn
                      @click="copyValue(item.value)" 
                      color="green"
                      variant="tonal"
                      size="small"
                      class="flex-1"
                    >
                      값복사
                    </v-btn>
                    <v-btn
                      @click="startEditText(item.key, item.value)" 
                      color="amber"
                      variant="tonal"
                      size="small"
                      class="flex-1"
                    >
                      수정
                    </v-btn>
                    <v-btn
                      @click="removeTextItem(item.key)" 
                      color="red"
                      variant="outlined"
                      size="small"
                      class="flex-1"
                    >
                      삭제
                    </v-btn>
                  </div>
                </template>
              </div>
            </div>
            
            <div v-else class="text-gray-500 text-center py-8">
              저장된 항목이 없습니다.
            </div>
          </div>
        </GroupPanel>
      </div>

      <!-- 우측 컬럼 -->
      <div class="space-y-6">
        <GroupPanel v-model="showGreen" title="패스워드 저장 (암호화)" color="green">
          <div class="space-y-4">
            <form @submit.prevent="savePwItem" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <v-text-field 
                  v-model="pwKey" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="키" 
                  required 
                />
                <v-text-field 
                  v-model="pwValue" 
                  type="password" 
                  variant="solo-filled"
                  density="comfortable"
                  hide-details
                  placeholder="값(암호화 저장)" 
                  required 
                />
              </div>
              <div class="flex gap-2">
                <v-btn 
                  type="submit" 
                  color="green" 
                  variant="elevated"
                  size="large"
                  class="flex-1"
                >
                  저장
                </v-btn>
                <v-btn 
                  type="button" 
                  @click="clearAllPwItems" 
                  color="red" 
                  variant="outlined"
                  size="large"
                  class="flex-1"
                >
                  전체삭제
                </v-btn>
              </div>
            </form>
            
            <div v-if="sortedPwItems.length" class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="item in sortedPwItems" :key="item.key" class="border rounded-lg p-3 bg-gray-50">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono text-sm font-semibold truncate pr-2">
                    {{ item.key.replace(PW_PREFIX, '') }}
                  </span>
                </div>
                
                <div class="mb-2 p-2 bg-white rounded border">
                  <v-text-field
                    value="••••••••••••" 
                    readonly 
                    variant="solo-filled"
                    density="comfortable"
                    hide-details
                    class="font-mono text-sm cursor-not-allowed" 
                    disabled
                  />
                </div>
                
                <div class="flex gap-2">
                  <v-btn
                    @click="() => copyDecryptedPwValue(item.key, item.value)" 
                    color="green"
                    variant="tonal"
                    size="small"
                    class="flex-1"
                  >
                    값복사
                  </v-btn>
                  <v-btn
                    @click="removePwItem(item.key)" 
                    color="red"
                    variant="outlined"
                    size="small"
                    class="flex-1"
                  >
                    삭제
                  </v-btn>
                </div>
              </div>
            </div>
            
            <div v-else class="text-gray-500 text-center py-8">
              저장된 항목이 없습니다.
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
  title: '문자열 저장소 · 로컬스토리지/암호화 | Web-Util',
  meta: [
    { name: 'description', content: '브라우저 로컬스토리지에 문자열을 저장·검색·관리하고 AES 암호화까지 지원하는 도구.' },
    { property: 'og:title', content: '문자열 저장소 - Web-Util' },
    { property: 'og:description', content: '로컬 저장 및 암호화를 지원하는 문자열 관리 도구.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl + '/string/storage' }
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/string/storage' }]
})
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: '문자열 저장소',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl + '/string/storage',
        description: '문자열 저장/검색/관리와 AES 암호화를 제공하는 무료 웹 도구.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' }
      })
    }
  ]
})
import { ref, computed, onMounted } from 'vue';
import CryptoJS from 'crypto-js';
import GroupPanel from '@/components/GroupPanel.vue';
import { useResponsive } from '@/composables/useResponsive.js';

// 반응형 상태 관리
const { createAccordionState } = useResponsive();
const accordionState = createAccordionState(2);
const showBlue = ref(accordionState[0]);
const showGreen = ref(accordionState[1]);

// 상수 정의 (스크립트에서만 사용)
const COPY_SUCCESS_MESSAGE = '복사되었습니다';
const DECRYPT_FAIL_MESSAGE = '복호화 실패';
const TEXT_PREFIX = 'jmutil_text_';
const PW_PREFIX = 'jmutil_pw_';

// 일반 텍스트 관리
const textKey = ref('');
const textValue = ref('');
const textItems = ref([]);
const editTextKey = ref(null);
const editTextValue = ref('');

// 패스워드 관리
const pwKey = ref('');
const pwValue = ref('');
const pwItems = ref([]);

function showNotification(message) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

// 정렬된 목록 계산 속성
const sortedTextItems = computed(() => {
  return textItems.value.slice().sort((a, b) => {
    const keyA = a.key.replace(TEXT_PREFIX, '');
    const keyB = b.key.replace(TEXT_PREFIX, '');
    return keyA.localeCompare(keyB);
  });
});

const sortedPwItems = computed(() => {
  return pwItems.value.slice().sort((a, b) => {
    const keyA = a.key.replace(PW_PREFIX, '');
    const keyB = b.key.replace(PW_PREFIX, '');
    return keyA.localeCompare(keyB);
  });
});

// 폼 초기화 함수
function clearTextForm() {
  textKey.value = '';
  textValue.value = '';
  // 편집 중인 항목도 초기화
  editTextKey.value = null;
  editTextValue.value = '';
}

function clearPwForm() {
  pwKey.value = '';
  pwValue.value = '';
}

// 전체 삭제 함수
function clearAllTextItems() {
  if (!confirm('일반 텍스트 항목을 모두 삭제하시겠습니까?')) return;
  
  // 모든 일반 텍스트 항목 삭제
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(TEXT_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // 폼과 편집 상태도 초기화
  clearTextForm();
  loadTextItems();
  showNotification('일반 텍스트 항목이 모두 삭제되었습니다.');
}

function clearAllPwItems() {
  if (!confirm('패스워드 항목을 모두 삭제하시겠습니까?')) return;
  
  // 모든 패스워드 항목 삭제
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PW_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // 폼도 초기화
  clearPwForm();
  loadPwItems();
  showNotification('패스워드 항목이 모두 삭제되었습니다.');
}

// 일반 텍스트 CRUD
function loadTextItems() {
  textItems.value = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(TEXT_PREFIX)) {
      textItems.value.push({ key: k, value: localStorage.getItem(k) });
    }
  }
}
function saveTextItem() {
  if (!textKey.value) return;
  localStorage.setItem(TEXT_PREFIX + textKey.value, textValue.value);
  textKey.value = '';
  textValue.value = '';
  loadTextItems();
}
function removeTextItem(k) {
  localStorage.removeItem(k);
  loadTextItems();
}
function startEditText(k, v) {
  editTextKey.value = k;
  editTextValue.value = v;
}
function cancelEditText() {
  editTextKey.value = null;
  editTextValue.value = '';
}
function saveEditText(k) {
  localStorage.setItem(k, editTextValue.value);
  editTextKey.value = null;
  editTextValue.value = '';
  loadTextItems();
}

// 패스워드(암호화) CRUD
function hash(str) {
  return CryptoJS.SHA256(str).toString();
}

function loadPwItems() {
  pwItems.value = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PW_PREFIX)) {
      let v = localStorage.getItem(k);
      pwItems.value.push({ key: k, value: v });
    }
  }
}

function savePwItem() {
  if (!pwKey.value || !pwValue.value) return;
  const encVal = CryptoJS.AES.encrypt(pwValue.value, pwKey.value).toString();
  localStorage.setItem(PW_PREFIX + pwKey.value, encVal);
  pwKey.value = '';
  pwValue.value = '';
  loadPwItems();
}
function copyDecryptedPwValue(key, encVal) {
  let decrypted = '';
  try {
    decrypted = CryptoJS.AES.decrypt(encVal, key.replace(PW_PREFIX, '')).toString(CryptoJS.enc.Utf8);
  } catch { decrypted = ''; }
  if (!decrypted) {
    showNotification(DECRYPT_FAIL_MESSAGE);
    return;
  }
  
  // 모바일 브라우저 호환성을 위한 클립보드 복사
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 현대적인 Clipboard API 사용
    navigator.clipboard.writeText(decrypted).then(() => {
      showNotification(COPY_SUCCESS_MESSAGE);
    }).catch(() => {
      // Clipboard API 실패 시 대체 방법 사용
      fallbackCopyTextToClipboard(decrypted);
    });
  } else {
    // Clipboard API를 지원하지 않는 경우 대체 방법 사용
    fallbackCopyTextToClipboard(decrypted);
  }
}
function removePwItem(k) {
  localStorage.removeItem(k);
  loadPwItems();
}

function copyValue(val) {
  // 모바일 브라우저 호환성을 위한 클립보드 복사 함수
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 현대적인 Clipboard API 사용
    navigator.clipboard.writeText(val).then(() => {
      showNotification(COPY_SUCCESS_MESSAGE);
    }).catch(() => {
      // Clipboard API 실패 시 대체 방법 사용
      fallbackCopyTextToClipboard(val);
    });
  } else {
    // Clipboard API를 지원하지 않는 경우 대체 방법 사용
    fallbackCopyTextToClipboard(val);
  }
}

function fallbackCopyTextToClipboard(text) {
  // 임시 textarea 요소 생성
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // 화면에 보이지 않게 설정
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  textArea.style.opacity = '0';
  textArea.style.pointerEvents = 'none';
  
  document.body.appendChild(textArea);
  
  // iOS 호환성을 위한 설정
  textArea.focus();
  textArea.select();
  
  // 텍스트 범위 선택 (모바일 브라우저 호환성)
  if (textArea.setSelectionRange) {
    textArea.setSelectionRange(0, 99999);
  }
  
  try {
    // execCommand를 사용하여 복사 실행
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification(COPY_SUCCESS_MESSAGE);
    } else {
      showNotification('복사에 실패했습니다.');
    }
  } catch (err) {
    console.error('복사 실패:', err);
    showNotification('복사에 실패했습니다.');
  } finally {
    // 임시 요소 제거
    document.body.removeChild(textArea);
  }
}

onMounted(() => {
  loadTextItems();
  loadPwItems();
});
</script>