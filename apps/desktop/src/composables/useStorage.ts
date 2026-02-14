import { ref, watch, type Ref, type WatchSource } from 'vue'

type StorageType = 'local' | 'session'

function getStorage(type: StorageType): Storage {
  return type === 'local' ? localStorage : sessionStorage
}

export function useStorage<T>(key: string, defaultValue: T, type: StorageType = 'local'): Ref<T> {
  const storage = getStorage(type)
  const storedValue = storage.getItem(key)
  const initialValue = storedValue !== null ? JSON.parse(storedValue) : defaultValue
  const data = ref<T>(initialValue) as Ref<T>

  watch(data, (newValue) => {
    if (newValue === null || newValue === undefined) {
      storage.removeItem(key)
    } else {
      storage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })

  return data
}

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  return useStorage(key, defaultValue, 'local')
}

export function useSessionStorage<T>(key: string, defaultValue: T): Ref<T> {
  return useStorage(key, defaultValue, 'session')
}

export default useStorage
