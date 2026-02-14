export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived'
export type WorkflowRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface Workflow {
  id: string
  name: string
  description?: string
  status: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables: WorkflowVariable[]
  triggers: WorkflowTrigger[]
  createdAt: string
  updatedAt: string
  lastRunAt?: string
  runCount: number
}

export interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  name: string
  position: { x: number; y: number }
  config: Record<string, any>
  inputs: NodePort[]
  outputs: NodePort[]
}

export type WorkflowNodeType = 
  | 'start'
  | 'end'
  | 'condition'
  | 'parallel'
  | 'merge'
  | 'delay'
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-convert'
  | 'pdf-compress'
  | 'pdf-watermark'
  | 'pdf-encrypt'
  | 'pdf-decrypt'
  | 'ocr-process'
  | 'ai-summary'
  | 'ai-translate'
  | 'ai-extract'
  | 'file-read'
  | 'file-write'
  | 'http-request'
  | 'email-send'
  | 'script'

export interface NodePort {
  id: string
  name: string
  type: 'file' | 'text' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  description?: string
}

export interface WorkflowEdge {
  id: string
  source: string
  sourcePort: string
  target: string
  targetPort: string
  label?: string
  condition?: EdgeCondition
}

export interface EdgeCondition {
  type: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than'
  value: any
  variable?: string
}

export interface WorkflowVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'file' | 'array'
  value: any
  description?: string
  isInput: boolean
  isOutput: boolean
}

export interface WorkflowTrigger {
  id: string
  type: 'manual' | 'schedule' | 'file-watch' | 'webhook'
  config: Record<string, any>
  enabled: boolean
}

export interface WorkflowRun {
  id: string
  workflowId: string
  status: WorkflowRunStatus
  startedAt: string
  completedAt?: string
  inputs: Record<string, any>
  outputs: Record<string, any>
  nodeExecutions: NodeExecution[]
  error?: string
}

export interface NodeExecution {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startedAt?: string
  completedAt?: string
  inputs: Record<string, any>
  outputs: Record<string, any>
  error?: string
}

export interface WorkflowCreateOptions {
  name: string
  description?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables?: WorkflowVariable[]
  triggers?: WorkflowTrigger[]
}

export interface WorkflowUpdateOptions {
  name?: string
  description?: string
  status?: WorkflowStatus
  nodes?: WorkflowNode[]
  edges?: WorkflowEdge[]
  variables?: WorkflowVariable[]
  triggers?: WorkflowTrigger[]
}

export interface WorkflowRunOptions {
  workflowId: string
  inputs?: Record<string, any>
  async?: boolean
}

export interface WorkflowListOptions {
  status?: WorkflowStatus[]
  page?: number
  pageSize?: number
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'lastRunAt'
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface WorkflowListResult {
  workflows: Workflow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const WORKFLOW_NODE_TYPES: { type: WorkflowNodeType; name: string; category: string }[] = [
  { type: 'start', name: '开始', category: 'control' },
  { type: 'end', name: '结束', category: 'control' },
  { type: 'condition', name: '条件判断', category: 'control' },
  { type: 'parallel', name: '并行执行', category: 'control' },
  { type: 'merge', name: '合并', category: 'control' },
  { type: 'delay', name: '延迟', category: 'control' },
  { type: 'pdf-merge', name: 'PDF 合并', category: 'pdf' },
  { type: 'pdf-split', name: 'PDF 拆分', category: 'pdf' },
  { type: 'pdf-convert', name: 'PDF 转换', category: 'pdf' },
  { type: 'pdf-compress', name: 'PDF 压缩', category: 'pdf' },
  { type: 'pdf-watermark', name: 'PDF 水印', category: 'pdf' },
  { type: 'pdf-encrypt', name: 'PDF 加密', category: 'pdf' },
  { type: 'pdf-decrypt', name: 'PDF 解密', category: 'pdf' },
  { type: 'ocr-process', name: 'OCR 处理', category: 'ai' },
  { type: 'ai-summary', name: 'AI 摘要', category: 'ai' },
  { type: 'ai-translate', name: 'AI 翻译', category: 'ai' },
  { type: 'ai-extract', name: 'AI 提取', category: 'ai' },
  { type: 'file-read', name: '读取文件', category: 'io' },
  { type: 'file-write', name: '写入文件', category: 'io' },
  { type: 'http-request', name: 'HTTP 请求', category: 'io' },
  { type: 'email-send', name: '发送邮件', category: 'io' },
  { type: 'script', name: '脚本', category: 'advanced' },
]
