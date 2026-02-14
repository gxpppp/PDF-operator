import { ref, computed, type Ref } from 'vue'
import { convertApi } from '@/api'
import type { 
  ConvertFormat, 
  ConvertOptions, 
  ConvertResult, 
  ConvertProgress,
  SUPPORTED_FORMATS 
} from '@/api/types/convert.types'

export interface UseConvertOptions {
  onProgress?: (progress: ConvertProgress) => void
  onComplete?: (result: ConvertResult) => void
  onError?: (error: Error) => void
}

export function useConvert(options: UseConvertOptions = {}) {
  const { onProgress, onComplete, onError } = options

  const isConverting = ref(false)
  const currentTask = ref<ConvertProgress | null>(null)
  const queue = ref<Array<{ id: string; options: ConvertOptions }>>([])
  const results = ref<ConvertResult[]>([])
  const errors = ref<Array<{ inputPath: string; error: string }>>([])

  const hasQueue = computed(() => queue.value.length > 0)
  const queueLength = computed(() => queue.value.length)

  async function convert(convertOptions: ConvertOptions): Promise<ConvertResult> {
    isConverting.value = true
    currentTask.value = {
      taskId: generateTaskId(),
      status: 'pending',
      progress: 0,
      currentPage: 0,
      totalPages: 0
    }

    try {
      const result = await convertApi.convert(convertOptions, (progress) => {
        currentTask.value = progress
        onProgress?.(progress)
      })

      results.value.push(result)
      onComplete?.(result)

      return result
    } catch (error) {
      const err = error as Error
      errors.value.push({
        inputPath: convertOptions.inputPath,
        error: err.message
      })
      onError?.(err)
      throw error
    } finally {
      isConverting.value = false
      currentTask.value = null
    }
  }

  function addToQueue(convertOptions: ConvertOptions): string {
    const id = generateTaskId()
    queue.value.push({ id, options: convertOptions })
    return id
  }

  function removeFromQueue(id: string): void {
    const index = queue.value.findIndex(item => item.id === id)
    if (index !== -1) {
      queue.value.splice(index, 1)
    }
  }

  async function processQueue(): Promise<ConvertResult[]> {
    const results: ConvertResult[] = []

    while (queue.value.length > 0) {
      const item = queue.value.shift()!
      try {
        const result = await convert(item.options)
        results.push(result)
      } catch (error) {
        console.error(`Failed to convert ${item.options.inputPath}:`, error)
      }
    }

    return results
  }

  function clearQueue(): void {
    queue.value = []
  }

  function clearResults(): void {
    results.value = []
    errors.value = []
  }

  function generateTaskId(): string {
    return `convert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function getSupportedFormats(): typeof SUPPORTED_FORMATS {
    return SUPPORTED_FORMATS
  }

  function getFormatForExtension(ext: string): ConvertFormat | null {
    const formats = getSupportedFormats()
    const match = formats.find(f => 
      f.inputExt.includes(ext.toLowerCase()) || f.outputExt === ext.toLowerCase()
    )
    return match?.format || null
  }

  return {
    isConverting,
    currentTask,
    queue,
    results,
    errors,
    hasQueue,
    queueLength,
    convert,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue,
    clearResults,
    getSupportedFormats,
    getFormatForExtension
  }
}

export default useConvert
