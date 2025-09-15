<template>
  <div class="container mx-auto px-6 py-8">
    <!-- Search & Filter Section -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="relative">
        <input 
          v-model="localSearchQuery"
          type="text" 
          placeholder="도구 검색 (예: JSON, 문자열, 날짜...)"
          class="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        >
        <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      
      <!-- Category Filter -->
      <div class="flex flex-wrap justify-center gap-2 mt-4">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="tool in filteredTools"
        :key="tool.path"
        :to="tool.path"
        class="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
      >
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <v-icon :icon="tool.icon" class="text-blue-600" size="24"></v-icon>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ tool.title }}
            </h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">
              {{ tool.description }}
            </p>
            <div class="mt-3">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ getCategoryName(tool.category) }}
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- No Results -->
    <div v-if="filteredTools.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M6.343 6.343L17.657 17.657M3 3l18 18"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">검색 결과 없음</h3>
      <p class="mt-1 text-sm text-gray-500">다른 키워드로 검색해보세요.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tools: Array,
  searchQuery: String
})

// Reactive state
const localSearchQuery = ref(props.searchQuery || '')
const selectedCategory = ref('all')

// 카테고리 정의
const categories = [
  { id: 'all', name: '전체' },
  { id: 'data', name: '데이터' },
  { id: 'string', name: '문자열' },
  { id: 'tools', name: '도구' },
  { id: 'database', name: '데이터베이스' }
]

// 최적화된 필터링 (computed)
const filteredTools = computed(() => {
  let filtered = props.tools || []
  
  // 카테고리 필터
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(tool => tool.category === selectedCategory.value)
  }
  
  // 검색 필터
  if (localSearchQuery.value.trim()) {
    const query = localSearchQuery.value.toLowerCase()
    filtered = filtered.filter(tool => 
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// 디바운스된 검색
const { debounce } = usePerformance()
const handleSearch = debounce(() => {
  // 검색 로직 (이미 computed에서 처리됨)
}, 200)

// 카테고리 이름 조회
const getCategoryName = (categoryId) => {
  const category = categories.find(c => c.id === categoryId)
  return category?.name || categoryId
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
