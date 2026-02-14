import { ref, onMounted, onUnmounted } from 'vue'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  description?: string
}

export function useShortcut() {
  const shortcuts = ref<Map<string, ShortcutConfig>>(new Map())
  
  function getShortcutKey(event: KeyboardEvent): string {
    const parts: string[] = []
    if (event.ctrlKey) parts.push('ctrl')
    if (event.shiftKey) parts.push('shift')
    if (event.altKey) parts.push('alt')
    if (event.metaKey) parts.push('meta')
    parts.push(event.key.toLowerCase())
    return parts.join('+')
  }
  
  function register(config: ShortcutConfig) {
    const key = getShortcutKeyFromConfig(config)
    shortcuts.value.set(key, config)
  }
  
  function unregister(config: ShortcutConfig) {
    const key = getShortcutKeyFromConfig(config)
    shortcuts.value.delete(key)
  }
  
  function getShortcutKeyFromConfig(config: ShortcutConfig): string {
    const parts: string[] = []
    if (config.ctrl) parts.push('ctrl')
    if (config.shift) parts.push('shift')
    if (config.alt) parts.push('alt')
    if (config.meta) parts.push('meta')
    parts.push(config.key.toLowerCase())
    return parts.join('+')
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    const key = getShortcutKey(event)
    const config = shortcuts.value.get(key)
    
    if (config) {
      event.preventDefault()
      config.handler()
    }
  }
  
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
  
  return {
    shortcuts,
    register,
    unregister
  }
}
