import { ref, computed, type Ref } from 'vue'
import { batchApi } from '@/api'
import type {
  BatchTask,
  BatchTaskType,
  BatchCreateOptions,
  BatchProgress,
  BatchResult,
  BatchListOptions,
  BatchListResult
} from '@/api/types/batch.types'

export interface UseBatchOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  onTaskComplete?: (task: BatchTask) => void
  onTaskError?: (task: BatchTask, error: string) => void
  onProgress?: (taskId: string, progress: BatchProgress) => void
}

export function useBatch(options: UseBatchOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 2000,
    onTaskComplete,
    onTaskError,
    onProgress
  } = options

  const tasks = ref<BatchTask[]>([])
  const currentTask = ref<BatchTask | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeTasks = computed(() => 
    tasks.value.filter(t => t.status === 'running' || t.status === 'pending')
  )
  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status === 'completed')
  )
  const failedTasks = computed(() => 
    tasks.value.filter(t => t.status === 'failed')
  )
  const hasActiveTasks = computed(() => activeTasks.value.length > 0)

  let refreshTimer: ReturnType<typeof setInterval> | null = null

  async function fetchTasks(listOptions?: BatchListOptions): Promise<BatchListResult> {
    isLoading.value = true
    error.value = null

    try {
      const result = await batchApi.list(listOptions)
      tasks.value = result.tasks
      return result
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(createOptions: BatchCreateOptions): Promise<BatchTask> {
    isLoading.value = true
    error.value = null

    try {
      const task = await batchApi.create(createOptions)
      tasks.value.unshift(task)

      if (createOptions.autoStart) {
        await startTask(task.id)
      }

      return task
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function getTask(taskId: string): Promise<BatchTask> {
    try {
      const task = await batchApi.get(taskId)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = task
      }
      return task
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function startTask(taskId: string): Promise<void> {
    try {
      await batchApi.start(taskId)
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.status = 'running'
        currentTask.value = task
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function pauseTask(taskId: string): Promise<void> {
    try {
      await batchApi.pause(taskId)
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.status = 'pending'
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function cancelTask(taskId: string): Promise<void> {
    try {
      await batchApi.cancel(taskId)
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.status = 'cancelled'
      }
      if (currentTask.value?.id === taskId) {
        currentTask.value = null
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function retryTask(taskId: string): Promise<void> {
    try {
      await batchApi.retry(taskId)
      const task = tasks.value.find(t => t.id === taskId)
      if (task) {
        task.status = 'pending'
      }
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function deleteTask(taskId: string): Promise<void> {
    try {
      await batchApi.delete(taskId)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  async function refreshTask(taskId: string): Promise<BatchTask> {
    const task = await getTask(taskId)
    
    if (task.status === 'completed') {
      onTaskComplete?.(task)
      if (currentTask.value?.id === taskId) {
        currentTask.value = null
      }
    } else if (task.status === 'failed') {
      onTaskError?.(task, task.result?.errors[0]?.error || 'Unknown error')
      if (currentTask.value?.id === taskId) {
        currentTask.value = null
      }
    } else if (task.status === 'running') {
      onProgress?.(taskId, task.progress)
    }

    return task
  }

  function startAutoRefresh(): void {
    if (refreshTimer) return

    refreshTimer = setInterval(async () => {
      if (!hasActiveTasks.value) return

      for (const task of activeTasks.value) {
        try {
          await refreshTask(task.id)
        } catch (err) {
          console.error(`Failed to refresh task ${task.id}:`, err)
        }
      }
    }, refreshInterval)
  }

  function stopAutoRefresh(): void {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  function clearCompleted(): void {
    tasks.value = tasks.value.filter(t => t.status !== 'completed')
  }

  function clearFailed(): void {
    tasks.value = tasks.value.filter(t => t.status !== 'failed')
  }

  if (autoRefresh) {
    startAutoRefresh()
  }

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    activeTasks,
    completedTasks,
    failedTasks,
    hasActiveTasks,
    fetchTasks,
    createTask,
    getTask,
    startTask,
    pauseTask,
    cancelTask,
    retryTask,
    deleteTask,
    refreshTask,
    startAutoRefresh,
    stopAutoRefresh,
    clearCompleted,
    clearFailed
  }
}

export default useBatch
