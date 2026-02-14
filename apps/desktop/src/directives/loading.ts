import type { Directive, DirectiveBinding } from 'vue'

interface LoadingOptions {
  text?: string
  background?: string
  spinner?: boolean
  fullscreen?: boolean
}

const createLoadingElement = (options: LoadingOptions): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'v-loading-wrapper'
  wrapper.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${options.background || 'rgba(255, 255, 255, 0.9)'};
    z-index: 1000;
  `
  
  if (options.spinner !== false) {
    const spinner = document.createElement('div')
    spinner.className = 'v-loading-spinner'
    spinner.style.cssText = `
      width: 32px;
      height: 32px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `
    wrapper.appendChild(spinner)
  }
  
  if (options.text) {
    const text = document.createElement('div')
    text.className = 'v-loading-text'
    text.textContent = options.text
    text.style.cssText = `
      margin-top: 8px;
      color: #666;
      font-size: 14px;
    `
    wrapper.appendChild(text)
  }
  
  return wrapper
}

const loadingElements = new WeakMap<HTMLElement, HTMLElement>()

export const loading: Directive<HTMLElement, LoadingOptions | boolean> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<LoadingOptions | boolean>) {
    const isLoading = binding.value !== false
    
    if (isLoading) {
      el.style.position = el.style.position || 'relative'
      
      const options = typeof binding.value === 'object' ? binding.value : {}
      const loadingEl = createLoadingElement(options)
      
      el.appendChild(loadingEl)
      loadingElements.set(el, loadingEl)
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<LoadingOptions | boolean>) {
    const isLoading = binding.value !== false
    const existingLoading = loadingElements.get(el)
    
    if (isLoading && !existingLoading) {
      el.style.position = el.style.position || 'relative'
      
      const options = typeof binding.value === 'object' ? binding.value : {}
      const loadingEl = createLoadingElement(options)
      
      el.appendChild(loadingEl)
      loadingElements.set(el, loadingEl)
    } else if (!isLoading && existingLoading) {
      el.removeChild(existingLoading)
      loadingElements.delete(el)
    }
  },
  
  unmounted(el: HTMLElement) {
    const loadingEl = loadingElements.get(el)
    if (loadingEl) {
      el.removeChild(loadingEl)
      loadingElements.delete(el)
    }
  }
}

export default loading
