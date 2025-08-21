<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-2">문자열 저장</h2>
        <p class="text-red-600 text-xs mb-4 font-medium">서버에 저장되지 않고, 사용자 기기에 암호화 되어 저장 됩니다.</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 일반 텍스트 영역 -->
            <div>
                <h2 class="font-semibold mb-3">일반 텍스트</h2>
                <form @submit.prevent="saveTextItem" class="mb-4">
                    <div class="flex flex-col sm:flex-row gap-2 mb-2">
                        <input v-model="textKey" placeholder="키" class="border rounded px-3 py-2 flex-1 min-w-0" required />
                        <input v-model="textValue" placeholder="값" class="border rounded px-3 py-2 flex-1 min-w-0" required />
                    </div>
                    <div class="flex gap-2">
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded flex-1 sm:flex-initial">저장</button>
                        <button type="button" @click="clearAllTextItems" class="bg-red-500 text-white px-4 py-2 rounded flex-1 sm:flex-initial">전체삭제</button>
                    </div>
                </form>
                <div v-if="sortedTextItems.length" class="space-y-3">
                    <div v-for="item in sortedTextItems" :key="item.key" class="border rounded-lg p-3 bg-gray-50">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-mono text-sm font-semibold truncate pr-2" @click="copyValue(item.key)">
                            {{ item.key.replace(TEXT_PREFIX, '') }}
                        </span>
                        <button @click="copyValue(item.key)" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">키복사</button>
                    </div>
                    <template v-if="editTextKey === item.key">
                        <textarea v-model="editTextValue" class="w-full font-mono text-sm border rounded px-2 py-2 mb-2 resize-none" rows="2" @keyup.enter.ctrl="saveEditText(item.key)"></textarea>
                        <div class="flex gap-2">
                            <button @click="saveEditText(item.key)" class="text-xs bg-blue-500 text-white px-3 py-1 rounded flex-1">저장</button>
                            <button @click="cancelEditText" class="text-xs bg-gray-400 text-white px-3 py-1 rounded flex-1">취소</button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="font-mono text-sm break-all mb-2 p-2 bg-white rounded border cursor-pointer" @click="copyValue(item.value)">
                            {{ item.value }}
                        </div>
                        <div class="flex gap-2">
                            <button @click="copyValue(item.value)" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex-1">값복사</button>
                            <button @click="startEditText(item.key, item.value)" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex-1">수정</button>
                            <button @click="removeTextItem(item.key)" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex-1">삭제</button>
                        </div>
                    </template>
                    </div>
                </div>
                <div v-else class="text-gray-400 text-sm">저장된 항목이 없습니다.</div>
            </div>
            <!-- 패스워드 영역 -->
            <div>
                <h2 class="font-semibold mb-3">패스워드(암호화)</h2>
                <form @submit.prevent="savePwItem" class="mb-4">
                    <div class="flex flex-col sm:flex-row gap-2 mb-2">
                        <input v-model="pwKey" placeholder="키" class="border rounded px-3 py-2 flex-1 min-w-0" required />
                        <input v-model="pwValue" type="password" placeholder="값(암호화 저장)" class="border rounded px-3 py-2 flex-1 min-w-0" required />
                    </div>
                    <div class="flex gap-2">
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded flex-1 sm:flex-initial">저장</button>
                        <button type="button" @click="clearAllPwItems" class="bg-red-500 text-white px-4 py-2 rounded flex-1 sm:flex-initial">전체삭제</button>
                    </div>
                </form>
                <div v-if="sortedPwItems.length" class="space-y-3">
                    <div v-for="item in sortedPwItems" :key="item.key" class="border rounded-lg p-3 bg-gray-50">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-mono text-sm font-semibold truncate pr-2" @click="copyValue(item.key)">
                                {{ item.key.replace(PW_PREFIX, '') }}
                            </span>
                            <!-- <button @click="copyValue(item.key)" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">키복사</button> -->
                        </div>
                        <div class="mb-2 p-2 bg-white rounded border">
                            <input type="password" value="••••••••••••" readonly class="w-full font-mono text-sm bg-transparent cursor-not-allowed" style="outline: none;" />
                        </div>
                        <div class="flex gap-2">
                            <button @click="() => copyDecryptedPwValue(item.key, item.value)" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex-1">값복사</button>
                            <button @click="removePwItem(item.key)" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded flex-1">삭제</button>
                        </div>
                    </div>
                </div>
            <div v-else class="text-gray-400 text-sm">저장된 항목이 없습니다.</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CryptoJS from 'crypto-js';

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