import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  autoUpdate: boolean
  checkUpdateInterval: number
  defaultOutputDir: string
  maxConcurrentJobs: number
  enableGpu: boolean
  enableTelemetry: boolean
  showWelcomeOnStartup: boolean
  confirmBeforeClose: boolean
  autoSaveWorkspace: boolean
  autoSaveInterval: number
  recentFilesLimit: number
  defaultPdfViewer: 'internal' | 'external'
  externalPdfViewer?: string
}

export interface ShortcutConfig {
  id: string
  name: string
  category: string
  defaultKey: string
  currentKey: string
  enabled: boolean
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  autoUpdate: true,
  checkUpdateInterval: 86400000,
  defaultOutputDir: '',
  maxConcurrentJobs: 4,
  enableGpu: true,
  enableTelemetry: false,
  showWelcomeOnStartup: true,
  confirmBeforeClose: true,
  autoSaveWorkspace: true,
  autoSaveInterval: 60000,
  recentFilesLimit: 20,
  defaultPdfViewer: 'internal'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...defaultSettings })
  const shortcuts = ref<ShortcutConfig[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isDarkMode = computed(() => {
    if (settings.value.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return settings.value.theme === 'dark'
  })

  function updateSettings(updates: Partial<AppSettings>): void {
    settings.value = { ...settings.value, ...updates }
    saveSettings()
  }

  function resetSettings(): void {
    settings.value = { ...defaultSettings }
    saveSettings()
  }

  function updateShortcut(id: string, key: string): void {
    const shortcut = shortcuts.value.find(s => s.id === id)
    if (shortcut) {
      shortcut.currentKey = key
    }
  }

  function resetShortcuts(): void {
    shortcuts.value.forEach(s => {
      s.currentKey = s.defaultKey
    })
  }

  function enableShortcut(id: string, enabled: boolean): void {
    const shortcut = shortcuts.value.find(s => s.id === id)
    if (shortcut) {
      shortcut.enabled = enabled
    }
  }

  async function loadSettings(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const stored = localStorage.getItem('app-settings')
      if (stored) {
        settings.value = { ...defaultSettings, ...JSON.parse(stored) }
      }
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  function saveSettings(): void {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings.value))
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  function exportSettings(): string {
    return JSON.stringify({
      settings: settings.value,
      shortcuts: shortcuts.value
    }, null, 2)
  }

  function importSettings(json: string): boolean {
    try {
      const data = JSON.parse(json)
      if (data.settings) {
        settings.value = { ...defaultSettings, ...data.settings }
      }
      if (data.shortcuts) {
        shortcuts.value = data.shortcuts
      }
      saveSettings()
      return true
    } catch {
      return false
    }
  }

  return {
    settings,
    shortcuts,
    isLoading,
    error,
    isDarkMode,
    updateSettings,
    resetSettings,
    updateShortcut,
    resetShortcuts,
    enableShortcut,
    loadSettings,
    saveSettings,
    exportSettings,
    importSettings
  }
})

export default useSettingsStore
