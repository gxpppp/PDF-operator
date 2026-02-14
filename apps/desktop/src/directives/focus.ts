import type { Directive, DirectiveBinding } from 'vue'

interface FocusOptions {
  select?: boolean
  delay?: number
}

export const focus: Directive<HTMLInputElement | HTMLTextAreaElement, FocusOptions> = {
  mounted(el: HTMLInputElement | HTMLTextAreaElement, binding: DirectiveBinding<FocusOptions>) {
    const options = binding.value || {}
    const delay = options.delay || 0
    
    const doFocus = () => {
      el.focus()
      if (options.select && el.select) {
        el.select()
      }
    }
    
    if (delay > 0) {
      setTimeout(doFocus, delay)
    } else {
      doFocus()
    }
  }
}

export default focus
