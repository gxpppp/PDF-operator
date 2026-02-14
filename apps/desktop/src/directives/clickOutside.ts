import type { Directive, DirectiveBinding } from 'vue'

type ClickOutsideHandler = (event: MouseEvent) => void

const handlers = new WeakMap<HTMLElement, ClickOutsideHandler>()

export const clickOutside: Directive<HTMLElement, ClickOutsideHandler> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ClickOutsideHandler>) {
    const handler: ClickOutsideHandler = (event) => {
      if (!el.contains(event.target as Node) && el !== event.target) {
        binding.value(event)
      }
    }
    
    handlers.set(el, handler)
    document.addEventListener('click', handler, { capture: true })
  },
  
  unmounted(el: HTMLElement) {
    const handler = handlers.get(el)
    if (handler) {
      document.removeEventListener('click', handler, { capture: true })
      handlers.delete(el)
    }
  }
}

export default clickOutside
