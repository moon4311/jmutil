/**
 * 간단한 A/B Variant 선택
 * - localStorage 유지로 사용자별 일관성 보장
 */
export function useABVariant(key, variants = ['A', 'B']) {
  const storageKey = `ab:${key}`
  let chosen = null
  if (typeof window !== 'undefined') {
    chosen = window.localStorage.getItem(storageKey)
    if (!chosen || !variants.includes(chosen)) {
      // 균등 랜덤
      chosen = variants[Math.floor(Math.random() * variants.length)]
      window.localStorage.setItem(storageKey, chosen)
    }
  } else {
    chosen = variants[0]
  }
  return chosen
}
