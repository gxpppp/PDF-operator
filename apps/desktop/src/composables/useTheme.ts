import { ref, computed, watch } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const prefersDark = usePreferredDark()
  const storedTheme = useStorage<Theme>('theme', 'system')
  
  const theme = computed<Theme>({
    get: () => storedTheme.value,
    set: (value) => {
      storedTheme.value = value
    }
  })
  
  const isDark = computed(() => {
    if (theme.value === 'system') {
      return prefersDark.value
    }
    return theme.value === 'dark'
  })
  
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }
  
  function toggleTheme() {
    if (theme.value === 'system') {
      theme.value = prefersDark.value ? 'light' : 'dark'
    } else {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }
  }
  
  watch(isDark, (dark) => {
    document.documentElement.classList.toggle('dark', dark)
  }, { immediate: true })
  
  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}
