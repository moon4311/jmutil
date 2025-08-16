<template>
  <div>
    <h2 class="text-xl font-bold mb-4">인코딩/디코딩 유틸리티</h2>
    <div class="flex gap-4 items-center">
      <!-- 좌측: 인코딩 입력 -->
      <div class="flex-1">
        <label class="block mb-1 font-semibold">인코딩</label>
        <v-select
          v-model="encodeType"
          :items="encodeTypes"
          class="mb-2"
          label="인코딩 방식"
        />
        <v-textarea
          v-model="encodeInput"
          placeholder="인코딩할 텍스트 입력"
          rows="8"
          @input="onEncodeInput"
        />
      </div>
      <!-- 우측: 디코딩 입력 -->
      <div class="flex-1">
        <label class="block mb-1 font-semibold">디코딩</label>
        <v-select
          v-model="decodeType"
          :items="decodeTypes"
          class="mb-2"
          label="디코딩 방식"
        />
        <v-textarea
          v-model="decodeInput"
          placeholder="디코딩할 텍스트 입력"
          rows="8"
          @input="onDecodeInput"
        />
      </div>
    </div>
    <div class="flex gap-4 mt-4">
      <div class="flex-1">
        <label class="block mb-1 font-semibold">인코딩 결과</label>
        <v-textarea :value="encoded" readonly rows="4" />
      </div>
      <div class="flex-1">
        <label class="block mb-1 font-semibold">디코딩 결과</label>
        <v-textarea :value="decoded" readonly rows="4" />
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref } from 'vue';

const encodeInput = ref('');
const decodeInput = ref('');
const encoded = ref('');
const decoded = ref('');

const encodeTypes = [
  { title: 'Base64', value: 'base64' },
  { title: 'URL', value: 'url' },
  { title: 'HEX', value: 'hex' },
  { title: 'Unicode', value: 'unicode' },
];
const decodeTypes = encodeTypes;

const encodeType = ref('base64');
const decodeType = ref('base64');

const onEncodeInput = () => {
  try {
    switch (encodeType.value) {
      case 'base64':
        encoded.value = btoa(unescape(encodeURIComponent(encodeInput.value)));
        break;
      case 'url':
        encoded.value = encodeURIComponent(encodeInput.value);
        break;
      case 'hex':
        encoded.value = Array.from(encodeInput.value)
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
        break;
      case 'unicode':
        encoded.value = Array.from(encodeInput.value)
          .map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
          .join('');
        break;
      default:
        encoded.value = '';
    }
  } catch {
    encoded.value = '';
  }
};

const onDecodeInput = () => {
  try {
    switch (decodeType.value) {
      case 'base64':
        decoded.value = decodeURIComponent(escape(atob(decodeInput.value)));
        break;
      case 'url':
        decoded.value = decodeURIComponent(decodeInput.value);
        break;
      case 'hex':
        decoded.value = decodeInput.value.replace(/(..)/g, (m, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        );
        break;
      case 'unicode':
        decoded.value = decodeInput.value.replace(/\\u([\dA-Fa-f]{4})/g, (m, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        );
        break;
      default:
        decoded.value = '';
    }
  } catch {
    decoded.value = '디코딩 오류';
  }
};
</script>
