import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce, useDebounceFn, useThrottle, useThrottleFn } from '@/composables/useDebounce'
import { useStorage, useLocalStorage, useSessionStorage } from '@/composables/useStorage'

vi.mock('localStorage', () => {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
  }
})

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('debounces value changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)
    
    expect(debouncedValue.value).toBe('initial')
    
    value.value = 'changed'
    expect(debouncedValue.value).toBe('initial')
    
    vi.advanceTimersByTime(300)
    expect(debouncedValue.value).toBe('changed')
  })
})

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('debounces function calls', () => {
    const fn = vi.fn()
    const debouncedFn = useDebounceFn(fn, 300)
    
    debouncedFn()
    debouncedFn()
    debouncedFn()
    
    expect(fn).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancels pending calls', () => {
    const fn = vi.fn()
    const debouncedFn = useDebounceFn(fn, 300)
    
    debouncedFn()
    debouncedFn.cancel()
    
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('throttles value changes', () => {
    const value = ref(0)
    const throttledValue = useThrottle(value, 300)
    
    expect(throttledValue.value).toBe(0)
    
    value.value = 1
    expect(throttledValue.value).toBe(1)
    
    value.value = 2
    expect(throttledValue.value).toBe(1)
    
    vi.advanceTimersByTime(300)
    expect(throttledValue.value).toBe(2)
  })
})

describe('useThrottleFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('throttles function calls', () => {
    const fn = vi.fn()
    const throttledFn = useThrottleFn(fn, 300)
    
    throttledFn()
    throttledFn()
    throttledFn()
    
    expect(fn).toHaveBeenCalledTimes(1)
    
    vi.advanceTimersByTime(300)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('useStorage', () => {
  it('returns default value when not set', () => {
    const value = useStorage('test-key', 'default')
    expect(value.value).toBe('default')
  })

  it('persists value to storage', () => {
    const value = useStorage('test-key-2', 'initial')
    value.value = 'changed'
    
    const value2 = useStorage('test-key-2', 'default')
    expect(value2.value).toBe('changed')
  })
})

describe('useLocalStorage', () => {
  it('creates a local storage ref', () => {
    const value = useLocalStorage('local-test', 'default')
    expect(value.value).toBe('default')
  })
})

describe('useSessionStorage', () => {
  it('creates a session storage ref', () => {
    const value = useSessionStorage('session-test', 'default')
    expect(value.value).toBe('default')
  })
})
