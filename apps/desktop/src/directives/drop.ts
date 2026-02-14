import type { Directive, DirectiveBinding } from 'vue'

interface DropOptions {
  onDragEnter?: (event: DragEvent) => void
  onDragLeave?: (event: DragEvent) => void
  onDragOver?: (event: DragEvent) => void
  onDrop?: (event: DragEvent) => void
  disabled?: boolean
}

export const drop: Directive<HTMLElement, DropOptions> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DropOptions>) {
    const options = binding.value || {}
    
    if (options.disabled) return
    
    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault()
      options.onDragEnter?.(event)
    }
    
    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault()
      options.onDragLeave?.(event)
    }
    
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      options.onDragOver?.(event)
    }
    
    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      options.onDrop?.(event)
    }
    
    el.addEventListener('dragenter', handleDragEnter)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('drop', handleDrop)
    
    ;(el as any)._dropHandlers = {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop
    }
  },
  
  unmounted(el: HTMLElement) {
    const handlers = (el as any)._dropHandlers
    if (handlers) {
      el.removeEventListener('dragenter', handlers.handleDragEnter)
      el.removeEventListener('dragleave', handlers.handleDragLeave)
      el.removeEventListener('dragover', handlers.handleDragOver)
      el.removeEventListener('drop', handlers.handleDrop)
    }
  }
}

export default drop
