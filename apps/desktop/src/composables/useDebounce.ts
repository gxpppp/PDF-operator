import { ref, watch, type Ref, type WatchSource } from 'vue'

export function useDebounce<T>(value: Ref<T> | WatchSource<T>, delay: number = 300): Ref<T> {
  const debouncedValue = ref(value instanceof Function ? value() : value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => { debouncedValue.value = newValue }, delay)
  }, { immediate: true })

  return debouncedValue
}

export function useDebounceFn<T extends (...args: any[]) => any>(fn: T, delay: number = 300): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }) as T & { cancel: () => void }

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

export function useThrottle<T>(value: Ref<T> | WatchSource<T>, delay: number = 300): Ref<T> {
  const throttledValue = ref(value instanceof Function ? value() : value.value) as Ref<T>
  let lastTime = 0

  watch(value, (newValue) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      throttledValue.value = newValue
      lastTime = now
    }
  }, { immediate: true })

  return throttledValue
}

export function useThrottleFn<T extends (...args: any[]) => any>(fn: T, delay: number = 300): T & { cancel: () => void } {
  let lastTime = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn(...args)
      lastTime = now
    } else {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        fn(...args)
        lastTime = Date.now()
      }, delay - (now - lastTime))
    }
  }) as T & { cancel: () => void }

  throttled.cancel = () => {
    if (timeout) clearTimeout(timeout)
    timeout = null
  }

  return throttled
}

export default useDebounce
