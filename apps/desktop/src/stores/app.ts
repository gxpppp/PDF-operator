import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const theme = ref<'light' | 'dark' | 'system'>('system')
  const sidebarCollapsed = ref(false)
  const currentFile = ref<string | null>(null)
  const recentFiles = ref<string[]>([])
  const loading = ref(false)
  
  const isDarkMode = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  function setTheme(newTheme: 'light' | 'dark' | 'system') {
    theme.value = newTheme
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setCurrentFile(file: string | null) {
    currentFile.value = file
    if (file && !recentFiles.value.includes(file)) {
      recentFiles.value.unshift(file)
      if (recentFiles.value.length > 10) {
        recentFiles.value.pop()
      }
    }
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  return {
    theme,
    sidebarCollapsed,
    currentFile,
    recentFiles,
    loading,
    isDarkMode,
    setTheme,
    toggleSidebar,
    setCurrentFile,
    setLoading,
  }
})
