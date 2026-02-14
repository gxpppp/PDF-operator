import type { Directive, DirectiveBinding } from 'vue'

interface DragOptions {
  onDragStart?: (event: DragEvent) => void
  onDrag?: (event: DragEvent) => void
  onDragEnd?: (event: DragEvent) => void
  disabled?: boolean
}

interface DragElement extends HTMLElement {
  _dragData?: {
    startX: number
    startY: number
    initialLeft: number
    initialTop: number
    handle: HTMLElement | null
  }
}

export const drag: Directive<DragElement, DragOptions> = {
  mounted(el: DragElement, binding: DirectiveBinding<DragOptions>) {
    const options = binding.value || {}
    
    if (options.disabled) return
    
    el.style.cursor = 'move'
    el.style.userSelect = 'none'
    el.style.position = el.style.position || 'absolute'
    
    let isDragging = false
    let startX = 0
    let startY = 0
    let initialLeft = 0
    let initialTop = 0
    
    const handleMouseDown = (event: MouseEvent) => {
      if (options.disabled) return
      
      isDragging = true
      startX = event.clientX
      startY = event.clientY
      
      const rect = el.getBoundingClientRect()
      initialLeft = rect.left
      initialTop = rect.top
      
      el.style.zIndex = '1000'
      
      options.onDragStart?.(event as unknown as DragEvent)
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY
      
      el.style.left = `${initialLeft + deltaX}px`
      el.style.top = `${initialTop + deltaY}px`
      
      options.onDrag?.(event as unknown as DragEvent)
    }
    
    const handleMouseUp = (event: MouseEvent) => {
      if (!isDragging) return
      
      isDragging = false
      el.style.zIndex = ''
      
      options.onDragEnd?.(event as unknown as DragEvent)
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    el.addEventListener('mousedown', handleMouseDown)
    
    el._dragData = {
      startX: 0,
      startY: 0,
      initialLeft: 0,
      initialTop: 0,
      handle: null
    }
  },
  
  unmounted(el: DragElement) {
    el._dragData = undefined
  }
}

export default drag
