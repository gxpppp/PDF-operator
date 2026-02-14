import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HistoryItem {
  id: string
  type: 'open' | 'edit' | 'convert' | 'merge' | 'split' | 'compress' | 'ocr' | 'other'
  action: string
  filePath: string
  outputPath?: string
  timestamp: number
  metadata?: Record<string, any>
}

const MAX_HISTORY = 100

export const useHistoryStore = defineStore('history', () => {
  const items = ref<HistoryItem[]>([])
  const isLoading = ref(false)

  const recentItems = computed(() => items.value.slice(0, 10))
  const totalCount = computed(() => items.value.length)

  function generateId(): string {
    return `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function addItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
    const historyItem: HistoryItem = {
      ...item,
      id: generateId(),
      timestamp: Date.now()
    }
    items.value.unshift(historyItem)
    if (items.value.length > MAX_HISTORY) {
      items.value = items.value.slice(0, MAX_HISTORY)
    }
    saveHistory()
    return historyItem
  }

  function removeItem(id: string): void {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveHistory()
    }
  }

  function clearHistory(): void {
    items.value = []
    saveHistory()
  }

  function loadHistory(): void {
    isLoading.value = true
    try {
      const stored = localStorage.getItem('app-history')
      if (stored) items.value = JSON.parse(stored)
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      isLoading.value = false
    }
  }

  function saveHistory(): void {
    try {
      localStorage.setItem('app-history', JSON.stringify(items.value))
    } catch (err) {
      console.error('Failed to save history:', err)
    }
  }

  return {
    items, isLoading, recentItems, totalCount,
    addItem, removeItem, clearHistory, loadHistory, saveHistory
  }
})

export default useHistoryStore
