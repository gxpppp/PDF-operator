export type PluginStatus = 'installed' | 'available' | 'updating' | 'error'

export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  homepage?: string
  repository?: string
  license: string
  status: PluginStatus
  installedVersion?: string
  latestVersion?: string
  enabled: boolean
  settings: PluginSetting[]
  permissions: PluginPermission[]
  installedAt?: string
  updatedAt?: string
  icon?: string
  screenshots?: string[]
  downloads?: number
  rating?: number
  tags?: string[]
}

export interface PluginSetting {
  key: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'file'
  label: string
  description?: string
  default: any
  options?: { value: any; label: string }[]
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface PluginPermission {
  type: 'filesystem' | 'network' | 'system' | 'clipboard'
  access: 'read' | 'write' | 'execute' | 'full'
  description?: string
}

export interface PluginInstallOptions {
  id: string
  version?: string
  source?: 'market' | 'file' | 'url'
  filePath?: string
  url?: string
  enableAfterInstall?: boolean
}

export interface PluginInstallResult {
  success: boolean
  plugin?: Plugin
  error?: string
}

export interface PluginUpdateOptions {
  id: string
  version?: string
}

export interface PluginUpdateResult {
  success: boolean
  previousVersion: string
  newVersion: string
  error?: string
}

export interface PluginListOptions {
  status?: PluginStatus[]
  enabled?: boolean
  search?: string
  tags?: string[]
  sortBy?: 'name' | 'downloads' | 'rating' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface PluginListResult {
  plugins: Plugin[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PluginMarketOptions {
  category?: string
  search?: string
  sortBy?: 'popular' | 'recent' | 'rating'
  page?: number
  pageSize?: number
}

export interface PluginMarketResult {
  plugins: Plugin[]
  categories: PluginCategory[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PluginCategory {
  id: string
  name: string
  description?: string
  icon?: string
  count: number
}

export interface PluginConfig {
  pluginId: string
  settings: Record<string, any>
}

export interface PluginLog {
  id: string
  pluginId: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: string
  details?: Record<string, any>
}

export interface PluginLogOptions {
  pluginId?: string
  level?: PluginLog['level'][]
  startTime?: string
  endTime?: string
  page?: number
  pageSize?: number
}

export interface PluginHook {
  name: string
  description?: string
  priority: number
}

export const PLUGIN_CATEGORIES: PluginCategory[] = [
  { id: 'productivity', name: '生产力', icon: 'briefcase', count: 0 },
  { id: 'conversion', name: '格式转换', icon: 'refresh', count: 0 },
  { id: 'editing', name: '编辑工具', icon: 'edit', count: 0 },
  { id: 'security', name: '安全加密', icon: 'shield', count: 0 },
  { id: 'ai', name: 'AI 功能', icon: 'cpu', count: 0 },
  { id: 'automation', name: '自动化', icon: 'zap', count: 0 },
  { id: 'integration', name: '集成', icon: 'link', count: 0 },
  { id: 'themes', name: '主题外观', icon: 'palette', count: 0 },
]
