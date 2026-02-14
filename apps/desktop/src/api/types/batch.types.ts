export type BatchTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface BatchTask {
  id: string
  name: string
  type: BatchTaskType
  status: BatchTaskStatus
  inputFiles: string[]
  outputDir: string
  options: Record<string, any>
  progress: BatchProgress
  createdAt: string
  startedAt?: string
  completedAt?: string
  result?: BatchResult
}

export type BatchTaskType = 
  | 'merge' 
  | 'split' 
  | 'convert' 
  | 'compress' 
  | 'ocr' 
  | 'watermark' 
  | 'encrypt' 
  | 'decrypt'

export interface BatchProgress {
  total: number
  completed: number
  failed: number
  percentage: number
  currentFile?: string
  estimatedTimeRemaining?: number
}

export interface BatchResult {
  success: boolean
  outputFiles: string[]
  failedFiles: string[]
  errors: BatchError[]
  totalProcessingTime: number
}

export interface BatchError {
  file: string
  error: string
  code?: string
}

export interface BatchCreateOptions {
  name: string
  type: BatchTaskType
  inputFiles: string[]
  outputDir: string
  options: Record<string, any>
  autoStart?: boolean
  parallelJobs?: number
  stopOnError?: boolean
}

export interface BatchUpdateOptions {
  name?: string
  priority?: number
  parallelJobs?: number
  stopOnError?: boolean
}

export interface BatchListOptions {
  status?: BatchTaskStatus[]
  type?: BatchTaskType[]
  page?: number
  pageSize?: number
  sortBy?: 'createdAt' | 'name' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface BatchListResult {
  tasks: BatchTask[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BatchTemplate {
  id: string
  name: string
  description: string
  type: BatchTaskType
  defaultOptions: Record<string, any>
  createdAt: string
}

export interface BatchSchedule {
  taskId: string
  cron?: string
  runAt?: string
  recurring?: boolean
  enabled: boolean
}

export const BATCH_TASK_TYPES: { type: BatchTaskType; name: string; description: string }[] = [
  { type: 'merge', name: '合并 PDF', description: '将多个 PDF 文件合并为一个' },
  { type: 'split', name: '拆分 PDF', description: '将 PDF 文件拆分为多个' },
  { type: 'convert', name: '格式转换', description: '转换 PDF 到其他格式' },
  { type: 'compress', name: '压缩 PDF', description: '减小 PDF 文件大小' },
  { type: 'ocr', name: 'OCR 识别', description: '识别 PDF 中的文字' },
  { type: 'watermark', name: '添加水印', description: '为 PDF 添加水印' },
  { type: 'encrypt', name: '加密 PDF', description: '为 PDF 添加密码保护' },
  { type: 'decrypt', name: '解密 PDF', description: '移除 PDF 密码保护' },
]
