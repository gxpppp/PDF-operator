import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
  lastLoginAt?: string
}

export interface UserSettings {
  language: string
  theme: 'light' | 'dark' | 'system'
  autoSave: boolean
  autoSaveInterval: number
  defaultOutputDir: string
  maxConcurrentJobs: number
  enableGpu: boolean
  enableTelemetry: boolean
  shortcuts: Record<string, string>
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const settings = ref<UserSettings>({
    language: 'zh-CN',
    theme: 'system',
    autoSave: true,
    autoSaveInterval: 60000,
    defaultOutputDir: '',
    maxConcurrentJobs: 4,
    enableGpu: true,
    enableTelemetry: false,
    shortcuts: {}
  })

  function setUser(userData: User | null): void {
    user.value = userData
  }

  function updateUser(updates: Partial<User>): void {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  function updateSettings(newSettings: Partial<UserSettings>): void {
    settings.value = { ...settings.value, ...newSettings }
  }

  function resetSettings(): void {
    settings.value = {
      language: 'zh-CN',
      theme: 'system',
      autoSave: true,
      autoSaveInterval: 60000,
      defaultOutputDir: '',
      maxConcurrentJobs: 4,
      enableGpu: true,
      enableTelemetry: false,
      shortcuts: {}
    }
  }

  function logout(): void {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    settings,
    setUser,
    updateUser,
    updateSettings,
    resetSettings,
    logout
  }
})

export default useUserStore
