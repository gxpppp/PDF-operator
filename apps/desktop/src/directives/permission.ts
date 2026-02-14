import type { Directive, DirectiveBinding } from 'vue'

interface PermissionOptions {
  value: string | string[]
  mode?: 'any' | 'all'
}

const checkPermission = (
  required: string | string[],
  current: string[],
  mode: 'any' | 'all' = 'any'
): boolean => {
  const requiredArray = Array.isArray(required) ? required : [required]
  
  if (mode === 'all') {
    return requiredArray.every(p => current.includes(p))
  }
  
  return requiredArray.some(p => current.includes(p))
}

let userPermissions: string[] = []

export const setPermissions = (permissions: string[]) => {
  userPermissions = permissions
}

export const permission: Directive<HTMLElement, PermissionOptions> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionOptions>) {
    const { value, mode = 'any' } = binding.value || {}
    
    if (!value) return
    
    const hasPermission = checkPermission(value, userPermissions, mode)
    
    if (!hasPermission) {
      el.style.display = 'none'
      el.setAttribute('data-permission-hidden', 'true')
    }
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionOptions>) {
    const { value, mode = 'any' } = binding.value || {}
    
    if (!value) return
    
    const hasPermission = checkPermission(value, userPermissions, mode)
    
    if (!hasPermission) {
      el.style.display = 'none'
      el.setAttribute('data-permission-hidden', 'true')
    } else {
      el.style.display = ''
      el.removeAttribute('data-permission-hidden')
    }
  }
}

export default permission
