export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ResponseMeta {
  timestamp: string
  requestId: string
  processingTime?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

export interface FileUploadResult {
  path: string
  filename: string
  size: number
  mimeType: string
  hash: string
}

export interface FileDownloadOptions {
  path: string
  filename?: string
}

export interface SystemInfo {
  version: string
  platform: 'windows' | 'macos' | 'linux'
  arch: 'x64' | 'arm64'
  cpuCores: number
  totalMemory: number
  freeMemory: number
  gpuAvailable: boolean
  gpuInfo?: GpuInfo
}

export interface GpuInfo {
  name: string
  vendor: string
  memory: number
  driver: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  autoUpdate: boolean
  checkUpdateInterval: number
  defaultOutputDir: string
  maxConcurrentJobs: number
  enableGpu: boolean
  enableTelemetry: boolean
}

export interface UpdateInfo {
  currentVersion: string
  latestVersion: string
  hasUpdate: boolean
  releaseNotes?: string
  releaseDate?: string
  downloadUrl?: string
  fileSize?: number
}

export interface UpdateProgress {
  status: 'checking' | 'downloading' | 'installing' | 'completed' | 'failed'
  progress: number
  downloadedBytes?: number
  totalBytes?: number
  error?: string
}

export interface Shortcut {
  id: string
  name: string
  description?: string
  category: string
  defaultKey: string
  currentKey: string
  enabled: boolean
}

export interface ShortcutCategory {
  id: string
  name: string
  shortcuts: Shortcut[]
}

export const SUPPORTED_LANGUAGES: { code: string; name: string; nativeName: string }[] = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
]

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  autoUpdate: true,
  checkUpdateInterval: 86400000,
  defaultOutputDir: '',
  maxConcurrentJobs: 4,
  enableGpu: true,
  enableTelemetry: false,
}
