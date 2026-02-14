import client from '../client'
import type { 
  Plugin, 
  PluginInstallOptions, 
  PluginInstallResult,
  PluginUpdateOptions,
  PluginUpdateResult,
  PluginListOptions,
  PluginListResult,
  PluginMarketOptions,
  PluginMarketResult,
  PluginConfig,
  PluginLog,
  PluginLogOptions
} from '../types/plugin.types'

export const pluginApi = {
  async list(options?: PluginListOptions): Promise<PluginListResult> {
    return client.get('/plugins', { params: options })
  },

  async get(id: string): Promise<Plugin> {
    return client.get(`/plugins/${id}`)
  },

  async install(options: PluginInstallOptions): Promise<PluginInstallResult> {
    if (options.source === 'file' && options.filePath) {
      const formData = new FormData()
      formData.append('file', await fetch(options.filePath).then(r => r.blob()))
      return client.post('/plugins/install/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    return client.post('/plugins/install', options)
  },

  async uninstall(id: string): Promise<{ success: boolean }> {
    return client.delete(`/plugins/${id}`)
  },

  async update(options: PluginUpdateOptions): Promise<PluginUpdateResult> {
    return client.post(`/plugins/${options.id}/update`, options)
  },

  async enable(id: string): Promise<{ success: boolean }> {
    return client.post(`/plugins/${id}/enable`)
  },

  async disable(id: string): Promise<{ success: boolean }> {
    return client.post(`/plugins/${id}/disable`)
  },

  async getConfig(id: string): Promise<PluginConfig> {
    return client.get(`/plugins/${id}/config`)
  },

  async updateConfig(id: string, settings: Record<string, any>): Promise<{ success: boolean }> {
    return client.put(`/plugins/${id}/config`, { settings })
  },

  async getLogs(options?: PluginLogOptions): Promise<{ logs: PluginLog[]; total: number }> {
    return client.get('/plugins/logs', { params: options })
  },

  async clearLogs(id?: string): Promise<{ success: boolean }> {
    return client.delete('/plugins/logs', { params: { pluginId: id } })
  },

  async market(options?: PluginMarketOptions): Promise<PluginMarketResult> {
    return client.get('/plugins/market', { params: options })
  },

  async checkUpdates(): Promise<{ updates: { id: string; currentVersion: string; latestVersion: string }[] }> {
    return client.get('/plugins/updates')
  },

  async updateAll(): Promise<{ results: PluginUpdateResult[] }> {
    return client.post('/plugins/update-all')
  }
}

export default pluginApi
