export { usePdf } from './usePdf'
export { useOcr } from './useOcr'
export { useAi } from './useAi'
export { useTheme } from './useTheme'
export { useShortcut } from './useShortcut'
export { useNotification } from './useNotification'
export { useHistory } from './useHistory'

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

export function useClipboard() {
  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }
  
  async function paste(): Promise<string> {
    try {
      return await navigator.clipboard.readText()
    } catch {
      return ''
    }
  }
  
  return { copy, paste }
}

export function useStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const value = ref<T>(stored ? JSON.parse(stored) : defaultValue)
  
  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return value
}

import { ref, watch } from 'vue'
