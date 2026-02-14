import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface DragDropOptions {
  accept?: string[]
  multiple?: boolean
  onDrop?: (files: File[], event: DragEvent) => void
  onDragEnter?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
}

export function useDragDrop(options: DragDropOptions = {}) {
  const { accept = [], multiple = true, onDrop, onDragEnter, onDragLeave } = options

  const isDragging = ref(false)
  const dragCount = ref(0)
  const droppedFiles = ref<File[]>([])
  const error = ref<string | null>(null)

  function isAccepted(file: File): boolean {
    if (accept.length === 0) return true
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
    const mimeType = file.type.toLowerCase()
    return accept.some(pattern => {
      if (pattern.startsWith('.')) return extension === pattern.toLowerCase()
      if (pattern.includes('*')) {
        const [type] = pattern.toLowerCase().split('/')
        const [fileType] = mimeType.split('/')
        return type === fileType
      }
      return mimeType === pattern.toLowerCase()
    })
  }

  function handleDragEnter(event: DragEvent): void {
    event.preventDefault()
    dragCount.value++
    isDragging.value = true
    onDragEnter?.(event)
  }

  function handleDragLeave(event: DragEvent): void {
    event.preventDefault()
    dragCount.value--
    if (dragCount.value === 0) isDragging.value = false
    onDragLeave?.(event)
  }

  function handleDragOver(event: DragEvent): void {
    event.preventDefault()
  }

  function handleDrop(event: DragEvent): void {
    event.preventDefault()
    isDragging.value = false
    dragCount.value = 0
    error.value = null

    const files = Array.from(event.dataTransfer?.files || [])
    if (files.length === 0) return
    if (!multiple && files.length > 1) {
      error.value = 'Only one file is allowed'
      return
    }

    const acceptedFiles = files.filter(isAccepted)
    if (acceptedFiles.length === 0) {
      error.value = `Accepted file types: ${accept.join(', ') || 'all'}`
      return
    }

    droppedFiles.value = multiple ? acceptedFiles : [acceptedFiles[0]]
    onDrop?.(droppedFiles.value, event)
  }

  function bindEvents(element: HTMLElement): void {
    element.addEventListener('dragenter', handleDragEnter)
    element.addEventListener('dragleave', handleDragLeave)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
  }

  function unbindEvents(element: HTMLElement): void {
    element.removeEventListener('dragenter', handleDragEnter)
    element.removeEventListener('dragleave', handleDragLeave)
    element.removeEventListener('dragover', handleDragOver)
    element.removeEventListener('drop', handleDrop)
  }

  return { isDragging, droppedFiles, error, bindEvents, unbindEvents }
}

export default useDragDrop
