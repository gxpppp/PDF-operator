import type { Directive, DirectiveBinding } from 'vue'

interface TooltipOptions {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}

const createTooltip = (content: string, placement: string): HTMLElement => {
  const tooltip = document.createElement('div')
  tooltip.className = 'v-tooltip'
  tooltip.textContent = content
  tooltip.style.cssText = `
    position: fixed;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 12px;
    border-radius: 4px;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    white-space: nowrap;
  `
  return tooltip
}

const getPosition = (
  el: HTMLElement,
  tooltip: HTMLElement,
  placement: string
): { top: number; left: number } => {
  const rect = el.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  
  const positions: Record<string, { top: number; left: number }> = {
    top: {
      top: rect.top - tooltipRect.height - 8,
      left: rect.left + (rect.width - tooltipRect.width) / 2
    },
    bottom: {
      top: rect.bottom + 8,
      left: rect.left + (rect.width - tooltipRect.width) / 2
    },
    left: {
      top: rect.top + (rect.height - tooltipRect.height) / 2,
      left: rect.left - tooltipRect.width - 8
    },
    right: {
      top: rect.top + (rect.height - tooltipRect.height) / 2,
      left: rect.right + 8
    }
  }
  
  return positions[placement] || positions.top
}

let currentTooltip: HTMLElement | null = null
let showTimeout: ReturnType<typeof setTimeout> | null = null

export const tooltip: Directive<HTMLElement, TooltipOptions | string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<TooltipOptions | string>) {
    const options = typeof binding.value === 'string' 
      ? { content: binding.value }
      : binding.value
    
    if (!options?.content || options.disabled) return
    
    const placement = options.placement || 'top'
    const delay = options.delay || 0
    
    const showTooltip = () => {
      if (currentTooltip) {
        document.body.removeChild(currentTooltip)
      }
      
      currentTooltip = createTooltip(options.content, placement)
      document.body.appendChild(currentTooltip)
      
      const position = getPosition(el, currentTooltip, placement)
      currentTooltip.style.top = `${position.top}px`
      currentTooltip.style.left = `${position.left}px`
      currentTooltip.style.opacity = '1'
    }
    
    const hideTooltip = () => {
      if (showTimeout) {
        clearTimeout(showTimeout)
        showTimeout = null
      }
      
      if (currentTooltip) {
        currentTooltip.style.opacity = '0'
        setTimeout(() => {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip)
            currentTooltip = null
          }
        }, 200)
      }
    }
    
    el.addEventListener('mouseenter', () => {
      if (delay > 0) {
        showTimeout = setTimeout(showTooltip, delay)
      } else {
        showTooltip()
      }
    })
    
    el.addEventListener('mouseleave', hideTooltip)
    
    ;(el as any)._tooltipHandlers = { showTooltip, hideTooltip }
  },
  
  unmounted(el: HTMLElement) {
    const handlers = (el as any)._tooltipHandlers
    if (handlers) {
      el.removeEventListener('mouseenter', handlers.showTooltip)
      el.removeEventListener('mouseleave', handlers.hideTooltip)
    }
  }
}

export default tooltip
