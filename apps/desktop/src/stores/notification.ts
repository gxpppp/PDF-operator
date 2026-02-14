import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration: number
  position: NotificationPosition
  timestamp: number
  isRead: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  handler: () => void
}

export interface NotificationOptions {
  type?: NotificationType
  title: string
  message?: string
  duration?: number
  position?: NotificationPosition
  actions?: NotificationAction[]
}

const DEFAULT_DURATION = 5000
const MAX_NOTIFICATIONS = 50

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const position = ref<NotificationPosition>('top-right')

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  )
  const hasUnread = computed(() => unreadCount.value > 0)
  const recentNotifications = computed(() => notifications.value.slice(0, 10))

  function generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function show(options: NotificationOptions): Notification {
    const notification: Notification = {
      id: generateId(),
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? DEFAULT_DURATION,
      position: options.position || position.value,
      timestamp: Date.now(),
      isRead: false,
      actions: options.actions
    }

    notifications.value.unshift(notification)

    if (notifications.value.length > MAX_NOTIFICATIONS) {
      notifications.value = notifications.value.slice(0, MAX_NOTIFICATIONS)
    }

    if (notification.duration > 0) {
      setTimeout(() => {
        dismiss(notification.id)
      }, notification.duration)
    }

    return notification
  }

  function info(title: string, message?: string, options?: Partial<NotificationOptions>): Notification {
    return show({ type: 'info', title, message, ...options })
  }

  function success(title: string, message?: string, options?: Partial<NotificationOptions>): Notification {
    return show({ type: 'success', title, message, ...options })
  }

  function warning(title: string, message?: string, options?: Partial<NotificationOptions>): Notification {
    return show({ type: 'warning', title, message, ...options })
  }

  function error(title: string, message?: string, options?: Partial<NotificationOptions>): Notification {
    return show({ type: 'error', title, message, duration: 0, ...options })
  }

  function dismiss(id: string): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function dismissAll(): void {
    notifications.value = []
  }

  function markAsRead(id: string): void {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  function markAllAsRead(): void {
    notifications.value.forEach(n => {
      n.isRead = true
    })
  }

  function setPosition(newPosition: NotificationPosition): void {
    position.value = newPosition
  }

  function getByType(type: NotificationType): Notification[] {
    return notifications.value.filter(n => n.type === type)
  }

  function getUnread(): Notification[] {
    return notifications.value.filter(n => !n.isRead)
  }

  return {
    notifications,
    position,
    unreadCount,
    hasUnread,
    recentNotifications,
    show,
    info,
    success,
    warning,
    error,
    dismiss,
    dismissAll,
    markAsRead,
    markAllAsRead,
    setPosition,
    getByType,
    getUnread
  }
})

export default useNotificationStore
