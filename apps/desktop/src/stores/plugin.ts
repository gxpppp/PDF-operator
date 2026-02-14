import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  enabled: boolean
  installed: boolean
  settings: Record<string, any>
}

export const usePluginStore = defineStore('plugin', () => {
  const plugins = ref<Plugin[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const installedPlugins = computed(() => 
    plugins.value.filter(p => p.installed)
  )
  const enabledPlugins = computed(() => 
    plugins.value.filter(p => p.enabled)
  )
  const hasPlugins = computed(() => plugins.value.length > 0)

  function getPlugin(id: string): Plugin | undefined {
    return plugins.value.find(p => p.id === id)
  }

  function addPlugin(plugin: Plugin): void {
    const existing = getPlugin(plugin.id)
    if (existing) {
      Object.assign(existing, plugin)
    } else {
      plugins.value.push(plugin)
    }
  }

  function removePlugin(id: string): void {
    const index = plugins.value.findIndex(p => p.id === id)
    if (index !== -1) {
      plugins.value.splice(index, 1)
    }
  }

  function enablePlugin(id: string): void {
    const plugin = getPlugin(id)
    if (plugin) {
      plugin.enabled = true
    }
  }

  function disablePlugin(id: string): void {
    const plugin = getPlugin(id)
    if (plugin) {
      plugin.enabled = false
    }
  }

  function updatePluginSettings(id: string, settings: Record<string, any>): void {
    const plugin = getPlugin(id)
    if (plugin) {
      plugin.settings = { ...plugin.settings, ...settings }
    }
  }

  function clearPlugins(): void {
    plugins.value = []
  }

  return {
    plugins,
    isLoading,
    error,
    installedPlugins,
    enabledPlugins,
    hasPlugins,
    getPlugin,
    addPlugin,
    removePlugin,
    enablePlugin,
    disablePlugin,
    updatePluginSettings,
    clearPlugins
  }
})

export default usePluginStore
