export interface MenuItem {
  id: string
  label: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  visible?: boolean
  children?: MenuItem[]
  action?: () => void
}

export interface ToolbarItem {
  id: string
  label: string
  icon?: string
  tooltip?: string
  disabled?: boolean
  visible?: boolean
  action?: () => void
  toggle?: boolean
  active?: boolean
}

export interface TabItem {
  id: string
  label: string
  icon?: string
  closable?: boolean
  disabled?: boolean
}

export interface TreeNode {
  id: string
  label: string
  icon?: string
  children?: TreeNode[]
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
  data?: any
}

export interface TableColumn {
  key: string
  label: string
  width?: number | string
  minWidth?: number
  maxWidth?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  fixed?: 'left' | 'right'
  render?: (row: any, column: TableColumn, index: number) => any
}

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: boolean
}

export interface FormField {
  key: string
  label: string
  type: 'text' | 'number' | 'password' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rules?: FormRule[]
  options?: { label: string; value: any }[]
  defaultValue?: any
}

export interface FormRule {
  type: 'required' | 'email' | 'url' | 'min' | 'max' | 'pattern' | 'custom'
  message: string
  value?: any
  validator?: (value: any) => boolean | string
}

export interface ModalConfig {
  title?: string
  width?: string | number
  fullscreen?: boolean
  closable?: boolean
  maskClosable?: boolean
  showHeader?: boolean
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  onClose?: () => void
}

export interface NotificationConfig {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export interface DropZoneConfig {
  accept?: string[]
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  onDrop?: (files: File[]) => void
  onReject?: (files: File[], reason: string) => void
}

export interface ColorValue {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  alpha?: number
}

export interface DateValue {
  year: number
  month: number
  day: number
  hours?: number
  minutes?: number
  seconds?: number
}

export interface FileItem {
  id: string
  name: string
  path: string
  size: number
  type: string
  extension: string
  lastModified: number
  status: 'pending' | 'uploading' | 'completed' | 'failed'
  progress?: number
  error?: string
}

export interface DragData {
  type: string
  data: any
  effect?: 'copy' | 'move' | 'link'
}
