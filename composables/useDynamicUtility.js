// 경량화된 동적 유틸리티 로더
import { ref } from 'vue';

class SimpleUtilityLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadUtility(utilityName) {
    if (this.cache.has(utilityName)) {
      return this.cache.get(utilityName);
    }

    const moduleMap = {
      json: () => import('~/utils/JsonUtil.js'),
      string: () => import('~/utils/StringUtil.js'),
      array: () => import('~/utils/ArrayUtil.js'),
      date: () => import('~/utils/DateUtil.js'),
      csv: () => import('~/utils/CsvUtil.js'),
      color: () => import('~/utils/ColorUtil.js'),
    };

    const loader = moduleMap[utilityName];
    if (!loader) return null;

    try {
      const module = await loader();
      const utility = module.default || module;
      this.cache.set(utilityName, utility);
      return utility;
    } catch (error) {
      console.warn(`Failed to load ${utilityName}:`, error);
      return null;
    }
  }

  async preloadUtilities(utilities, delay = 0) {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    utilities.forEach(utility => {
      this.loadUtility(utility).catch(() => {});
    });
  }
}

export const utilityLoader = new SimpleUtilityLoader();

/**
 * 간단한 동적 유틸리티 사용 composable
 */
export function useDynamicUtility(utilityName) {
  const utility = ref(null);
  const loading = ref(false);

  const load = async () => {
    if (utility.value) return utility.value;
    
    loading.value = true;
    try {
      utility.value = await utilityLoader.loadUtility(utilityName);
      return utility.value;
    } finally {
      loading.value = false;
    }
  };

  load();

  return { utility, loading };
}