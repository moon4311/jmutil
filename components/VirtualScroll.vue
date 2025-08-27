<template>
  <div 
    ref="containerRef" 
    class="virtual-scroll-container"
    :style="{ height: containerHeight + 'px', overflow: 'auto' }"
    @scroll="onScroll"
  >
    <!-- 전체 높이를 유지하기 위한 스페이서 -->
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <!-- 가시 영역의 아이템들만 렌더링 -->
      <div
        :style="{
          position: 'absolute',
          top: offsetY + 'px',
          width: '100%'
        }"
      >
        <div
          v-for="(item, index) in visibleItems"
          :key="getItemKey(item, startIndex + index)"
          :style="{ height: itemHeight + 'px' }"
          class="virtual-scroll-item"
        >
          <slot 
            :item="item" 
            :index="startIndex + index"
            :actualIndex="startIndex + index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 대용량 데이터를 위한 Virtual Scrolling 컴포넌트
 * @component VirtualScroll
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { usePerformance } from '@/composables/usePerformance';

/**
 * 컴포넌트 Props
 */
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  itemHeight: {
    type: Number,
    required: true,
    default: 50
  },
  containerHeight: {
    type: Number,
    required: true,
    default: 400
  },
  buffer: {
    type: Number,
    default: 5
  },
  keyField: {
    type: String,
    default: 'id'
  }
});

const emit = defineEmits(['scroll', 'visible-range-change']);

const { throttle } = usePerformance();

const containerRef = ref(null);
const scrollTop = ref(0);

// 계산된 속성들
const totalHeight = computed(() => props.items.length * props.itemHeight);

const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight);
  return Math.max(0, index - props.buffer);
});

const endIndex = computed(() => {
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight);
  const index = startIndex.value + visibleCount + (props.buffer * 2);
  return Math.min(props.items.length - 1, index);
});

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1);
});

const offsetY = computed(() => startIndex.value * props.itemHeight);

/**
 * 아이템 키 생성
 */
const getItemKey = (item, index) => {
  if (typeof item === 'object' && item !== null && item[props.keyField]) {
    return item[props.keyField];
  }
  return `virtual-item-${index}`;
};

/**
 * 스크롤 이벤트 핸들러 (쓰로틀 적용)
 */
const onScroll = throttle((event) => {
  scrollTop.value = event.target.scrollTop;
  
  emit('scroll', {
    scrollTop: scrollTop.value,
    startIndex: startIndex.value,
    endIndex: endIndex.value
  });
}, 16); // 60fps

/**
 * 특정 인덱스로 스크롤
 * @param {number} index 
 */
const scrollToIndex = (index) => {
  if (!containerRef.value) return;
  
  const targetScrollTop = index * props.itemHeight;
  containerRef.value.scrollTop = targetScrollTop;
};

/**
 * 맨 위로 스크롤
 */
const scrollToTop = () => {
  scrollToIndex(0);
};

/**
 * 맨 아래로 스크롤
 */
const scrollToBottom = () => {
  scrollToIndex(props.items.length - 1);
};

// 가시 범위 변경 감지
watch([startIndex, endIndex], ([newStart, newEnd], [oldStart, oldEnd]) => {
  if (newStart !== oldStart || newEnd !== oldEnd) {
    emit('visible-range-change', {
      startIndex: newStart,
      endIndex: newEnd,
      visibleItems: visibleItems.value
    });
  }
});

// 외부에서 사용할 수 있도록 expose
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom,
  getVisibleRange: () => ({
    startIndex: startIndex.value,
    endIndex: endIndex.value
  })
});

onMounted(() => {
  // 초기 상태 emit
  emit('visible-range-change', {
    startIndex: startIndex.value,
    endIndex: endIndex.value,
    visibleItems: visibleItems.value
  });
});
</script>

<style scoped>
.virtual-scroll-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.virtual-scroll-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
}

/* 스크롤바 스타일링 */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
