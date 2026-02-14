import { ref, computed } from 'vue'

export interface DialogOptions {
  title?: string
  message: string
  type?: 'info' | 'warning' | 'error' | 'success' | 'question'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

export interface DialogInstance {
  id: string
  visible: boolean
  options: DialogOptions
  resolve: (value: boolean) => void
}

export function useDialog() {
  const dialogs = ref<DialogInstance[]>([])
  const hasOpenDialogs = computed(() => dialogs.value.length > 0)
  const topDialog = computed(() => dialogs.value[dialogs.value.length - 1] || null)

  function generateId(): string {
    return `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function show(options: DialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const dialog: DialogInstance = {
        id: generateId(),
        visible: true,
        options: {
          ...options,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          showCancel: options.showCancel ?? false
        },
        resolve
      }
      dialogs.value.push(dialog)
    })
  }

  function alert(message: string, title?: string): Promise<boolean> {
    return show({ message, title: title || 'Alert', type: 'info', showCancel: false })
  }

  function confirm(message: string, title?: string): Promise<boolean> {
    return show({ message, title: title || 'Confirm', type: 'question', showCancel: true })
  }

  function warning(message: string, title?: string): Promise<boolean> {
    return show({ message, title: title || 'Warning', type: 'warning', showCancel: false })
  }

  function error(message: string, title?: string): Promise<boolean> {
    return show({ message, title: title || 'Error', type: 'error', showCancel: false })
  }

  function success(message: string, title?: string): Promise<boolean> {
    return show({ message, title: title || 'Success', type: 'success', showCancel: false })
  }

  function handleConfirm(id: string): void {
    const index = dialogs.value.findIndex(d => d.id === id)
    if (index !== -1) {
      const dialog = dialogs.value[index]
      dialog.visible = false
      dialog.resolve(true)
      dialogs.value.splice(index, 1)
    }
  }

  function handleCancel(id: string): void {
    const index = dialogs.value.findIndex(d => d.id === id)
    if (index !== -1) {
      const dialog = dialogs.value[index]
      dialog.visible = false
      dialog.resolve(false)
      dialogs.value.splice(index, 1)
    }
  }

  function closeAll(): void {
    dialogs.value.forEach(dialog => {
      dialog.visible = false
      dialog.resolve(false)
    })
    dialogs.value = []
  }

  return {
    dialogs, hasOpenDialogs, topDialog,
    show, alert, confirm, warning, error, success,
    handleConfirm, handleCancel, closeAll
  }
}

export default useDialog
