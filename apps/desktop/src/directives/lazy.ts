import type { Directive, DirectiveBinding } from 'vue'

interface LazyOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  onLoad?: () => void
  onError?: () => void
}

const observers = new WeakMap<Element, IntersectionObserver>()

export const lazy: Directive<HTMLImageElement, LazyOptions> = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding<LazyOptions>) {
    const options = binding.value || {}
    const src = el.dataset.src || el.dataset.lazy
    
    if (!src) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            
            img.src = src
            
            img.onload = () => {
              options.onLoad?.()
              observer.unobserve(img)
            }
            
            img.onerror = () => {
              options.onError?.()
              observer.unobserve(img)
            }
          }
        })
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0.1
      }
    )
    
    observer.observe(el)
    observers.set(el, observer)
  },
  
  unmounted(el: HTMLImageElement) {
    const observer = observers.get(el)
    if (observer) {
      observer.unobserve(el)
      observers.delete(el)
    }
  }
}

export default lazy
