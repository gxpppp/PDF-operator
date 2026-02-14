import { ref, onUnmounted } from 'vue'

interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration: number
}

export function useNotification() {
  const notifications = ref<NotificationItem[]>([])
  
  function show(
    type: NotificationItem['type'],
    title: string,
    message?: string,
    duration: number = 3000
  ) {
    const id = Date.now().toString()
    const notification: NotificationItem = {
      id,
      type,
      title,
      message,
      duration
    }
    
    notifications.value.push(notification)
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    
    return id
  }
  
  function success(title: string, message?: string, duration?: number) {
    return show('success', title, message, duration)
  }
  
  function error(title: string, message?: string, duration?: number) {
    return show('error', title, message, duration)
  }
  
  function warning(title: string, message?: string, duration?: number) {
    return show('warning', title, message, duration)
  }
  
  function info(title: string, message?: string, duration?: number) {
    return show('info', title, message, duration)
  }
  
  function remove(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  function clear() {
    notifications.value = []
  }
  
  return {
    notifications,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear
  }
}
