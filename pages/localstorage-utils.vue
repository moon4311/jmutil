<template>
    <h1 class="text-xl font-bold mb-4">문자열 저장</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 일반 텍스트 영역 -->
        <div>
        <h2 class="font-semibold mb-2">일반 텍스트</h2>
        <form @submit.prevent="saveTextItem" class="flex gap-2 mb-4">
            <input v-model="textKey" placeholder="키" class="border rounded px-2 py-1 flex-1" required />
            <input v-model="textValue" placeholder="값" class="border rounded px-2 py-1 flex-1" required />
            <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">저장</button>
            <button type="button" @click="clearAllTextItems" class="bg-red-500 text-white px-3 py-1 rounded">전체삭제</button>
        </form>
        <div v-if="sortedTextItems.length" class="space-y-2">
            <div v-for="item in sortedTextItems" :key="item.key" class="flex items-center gap-2 border-b pb-1">
            <span class="font-mono text-sm cursor-pointer" @click="copyValue(item.key)">{{ item.key.replace(TEXT_PREFIX, '') }}</span>
            <button @click="copyValue(item.key)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">키복사</button>
            <template v-if="editTextKey === item.key">
                <input v-model="editTextValue" class="flex-1 font-mono text-sm border rounded px-1 py-0.5" @keyup.enter="saveEditText(item.key)" />
                <button @click="saveEditText(item.key)" class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">저장</button>
                <button @click="cancelEditText" class="text-xs bg-gray-200 px-2 py-0.5 rounded">취소</button>
            </template>
            <template v-else>
                <span class="flex-1 font-mono text-sm break-all cursor-pointer" @click="copyValue(item.value)">{{ item.value }}</span>
                <button @click="copyValue(item.value)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">값복사</button>
                <button @click="startEditText(item.key, item.value)" class="text-xs bg-yellow-300 px-2 py-0.5 rounded">수정</button>
            </template>
            <button @click="removeTextItem(item.key)" class="text-xs text-red-500 px-2 py-1">삭제</button>
            </div>
        </div>
        <div v-else class="text-gray-400 text-sm">저장된 항목이 없습니다.</div>
        </div>
        <!-- 패스워드 영역 -->
        <div>
        <h2 class="font-semibold mb-2">패스워드(암호화)</h2>
    <form @submit.prevent="savePwItem" class="flex gap-2 mb-4">
      <input v-model="pwKey" placeholder="키" class="border rounded px-2 py-1 flex-1" required />
      <input v-model="pwValue" type="password" placeholder="값(암호화 저장)" class="border rounded px-2 py-1 flex-1" required />
      <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">저장</button>
      <button type="button" @click="clearAllPwItems" class="bg-red-500 text-white px-3 py-1 rounded">전체삭제</button>
    </form>
    <div v-if="sortedPwItems.length" class="space-y-2">
      <div v-for="item in sortedPwItems" :key="item.key" class="flex items-center gap-2 border-b pb-1">
        <span class="font-mono text-sm cursor-pointer" @click="copyValue(item.key)">{{ item.key.replace(PW_PREFIX, '') }}</span>
        <button @click="copyValue(item.key)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">키복사</button>
        <input type="password" :value="item.value" readonly class="flex-1 font-mono text-sm border-none bg-transparent break-all cursor-not-allowed" style="padding:0;" />
  <button @click="() => copyDecryptedPwValue(item.key, item.value)" class="text-xs bg-gray-200 px-1 py-0.5 rounded">값복사</button>
        <button @click="removePwItem(item.key)" class="text-xs text-red-500 px-2 py-1">삭제</button>
      </div>
    </div>
    <div v-else class="text-gray-400 text-sm">저장된 항목이 없습니다.</div>
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
  navigator.clipboard.writeText(decrypted);
  showNotification(COPY_SUCCESS_MESSAGE);
}
function removePwItem(k) {
  localStorage.removeItem(k);
  loadPwItems();
}

function copyValue(val) {
  navigator.clipboard.writeText(val);
  showNotification(COPY_SUCCESS_MESSAGE);
}

onMounted(() => {
  loadTextItems();
  loadPwItems();
});
</script>