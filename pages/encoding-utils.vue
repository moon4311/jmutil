<template>
  <div>
    <h2 class="text-xl font-bold mb-4">인코딩/디코딩</h2>
    <v-select
      v-model="encodeType"
      :items="encodeTypes"
      class="mb-2"
      label="인코딩/디코딩 방식"
      />
    <GroupPanel v-model="showBlue" title="인코딩" color="blue">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">인코딩할 텍스트</label>
        <v-textarea
          v-model="encodeInput"
          placeholder="인코딩할 텍스트를 입력하세요"
          rows="6"
          @input="onEncodeInput"
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold">인코딩 결과</label>
        <CopyTextArea :model-value="encoded" rows="4" />
      </div>
    </GroupPanel>

    <GroupPanel v-model="showGreen" title="디코딩" color="green">
      <div class="mb-4">
        <label class="block mb-1 font-semibold">디코딩할 텍스트</label>
        <v-textarea
          v-model="decodeInput"
          placeholder="디코딩할 텍스트를 입력하세요"
          rows="6"
          @input="onDecodeInput"
        />
      </div>
      <div>
        <label class="block mb-1 font-semibold">디코딩 결과</label>
        <CopyTextArea :model-value="decoded" rows="4" />
      </div>
    </GroupPanel>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default' })
import { ref, watch } from 'vue';
import { encode, decode } from '@/utils/EncodingUtil.js';
import GroupPanel from '@/components/GroupPanel.vue';
import CopyTextArea from '@/components/CopyTextArea.vue';

const showBlue = ref(true);
const showGreen = ref(true);

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

const encodeType = ref('base64');

const onEncodeInput = () => {
  try {
    encoded.value = encode(encodeInput.value, encodeType.value);
  } catch (error) {
    encoded.value = error.message;
  }
};

const onDecodeInput = () => {
  try {
    decoded.value = decode(decodeInput.value, encodeType.value);
  } catch (error) {
    decoded.value = error.message;
  }
};

// encodeType이 변경될 때마다 인코딩/디코딩 재실행
watch(encodeType, () => {
  if (encodeInput.value) {
    onEncodeInput();
  }
  if (decodeInput.value) {
    onDecodeInput();
  }
});

</script>
