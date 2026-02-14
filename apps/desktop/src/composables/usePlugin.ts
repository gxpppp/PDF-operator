import { ref, computed } from 'vue'
import { pluginApi } from '@/api'
import type {
  Plugin,
  PluginInstallOptions,
  PluginInstallResult,
  PluginListOptions,
  PluginMarketOptions,
  PluginConfig
} from '@/api/types/plugin.types'

export interface UsePluginOptions {
  autoRefresh?: boolean
  onInstallComplete?: (plugin: Plugin) => void
  onUninstallComplete?: (pluginId: string) => void
  onUpdateComplete?: (plugin: Plugin) => void
  onError?: (error: Error) => void
}

export function usePlugin(options: UsePluginOptions = {}) {
  const { onInstallComplete, onUninstallComplete, onUpdateComplete, onError } = options

  const plugins = ref<Plugin[]>([])
  const installedPlugins = ref<Plugin[]>([])
  const isLoading = ref(false)
  const isInstalling = ref(false)
  const isUpdating = ref(false)
  const error = ref<string | null>(null)
  const currentPlugin = ref<Plugin | null>(null)

  const enabledPlugins = computed(() => installedPlugins.value.filter(p => p.enabled))
  const hasUpdates = computed(() => installedPlugins.value.some(p => p.latestVersion && p.latestVersion !== p.version))
  const updateCount = computed(() => installedPlugins.value.filter(p => p.latestVersion && p.latestVersion !== p.version).length)

  async function fetchPlugins(listOptions?: PluginListOptions): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result = await pluginApi.list(listOptions)
      plugins.value = result.plugins
    } catch (err) {
      error.value = (err as Error).message
      onError?.(err as Error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchInstalledPlugins(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const result = await pluginApi.list({ status: ['installed'] })
      installedPlugins.value = result.plugins
    } catch (err) {
      error.value = (err as Error).message
      onError?.(err as Error)
    } finally {
      isLoading.value = false
    }
  }

  async function installPlugin(installOptions: PluginInstallOptions): Promise<PluginInstallResult> {
    isInstalling.value = true
    error.value = null
    try {
      const result = await pluginApi.install(installOptions)
      if (result.success && result.plugin) {
        installedPlugins.value.push(result.plugin)
        onInstallComplete?.(result.plugin)
      }
      return result
    } catch (err) {
      error.value = (err as Error).message
      onError?.(err as Error)
      throw err
    } finally {
      isInstalling.value = false
    }
  }

  async function uninstallPlugin(pluginId: string): Promise<void> {
    try {
      await pluginApi.uninstall(pluginId)
      installedPlugins.value = installedPlugins.value.filter(p => p.id !== pluginId)
      onUninstallComplete?.(pluginId)
    } catch (err) {
      error.value = (err as Error).message
      onError?.(err as Error)
      throw err
    }
  }

  async function enablePlugin(pluginId: string): Promise<void> {
    try {
      await pluginApi.enable(pluginId)
      const plugin = installedPlugins.value.find(p => p.id === pluginId)
      if (plugin) plugin.enabled = true
    } catch (err) {
      error.value = (err as Error).message
      onError?.(err as Error)
      throw err
    }
  }

  async function disablePlugin(pluginId: string): Promise<void> {
    try {
      await pluginApi.disable(pluginId)
      const plugin = installedPlugins.value.find(p => p.id === pluginId)
      if (plugin) plugin.enabled = false
    } catch (err) {
      error.value = (err as Error).message
      onError?.(err as Error)
      throw err
    }
  }

  return {
    plugins, installedPlugins, isLoading, isInstalling, isUpdating, error, currentPlugin,
    enabledPlugins, hasUpdates, updateCount,
    fetchPlugins, fetchInstalledPlugins, installPlugin, uninstallPlugin, enablePlugin, disablePlugin
  }
}

export default usePlugin
