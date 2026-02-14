import { ref } from 'vue'
import { open } from '@tauri-apps/plugin-dialog'

export interface FilePickerOptions {
  multiple?: boolean
  directory?: boolean
  filters?: Array<{ name: string; extensions: string[] }>
  defaultPath?: string
  title?: string
}

export interface FilePickerResult {
  path: string
  name: string
  extension: string
}

export function useFilePicker() {
  const selectedFiles = ref<FilePickerResult[]>([])
  const selectedDirectory = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function pickFile(options: FilePickerOptions = {}): Promise<FilePickerResult | null> {
    isLoading.value = true
    error.value = null
    try {
      const selected = await open({
        multiple: options.multiple || false,
        directory: options.directory || false,
        filters: options.filters,
        defaultPath: options.defaultPath,
        title: options.title
      })
      if (!selected) return null

      if (options.directory) {
        selectedDirectory.value = selected as string
        return { path: selected as string, name: (selected as string).split(/[/\\]/).pop() || '', extension: '' }
      }

      const path = selected as string
      const result = createFileResult(path)
      selectedFiles.value = [result]
      return result
    } catch (err) {
      error.value = (err as Error).message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function pickFiles(options: Omit<FilePickerOptions, 'multiple'> = {}): Promise<FilePickerResult[]> {
    isLoading.value = true
    error.value = null
    try {
      const selected = await open({
        multiple: true,
        directory: false,
        filters: options.filters,
        defaultPath: options.defaultPath,
        title: options.title
      })
      if (!selected) return []
      const paths = Array.isArray(selected) ? selected : [selected]
      const results = paths.map(createFileResult)
      selectedFiles.value = results
      return results
    } catch (err) {
      error.value = (err as Error).message
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function pickDirectory(options: Omit<FilePickerOptions, 'directory' | 'multiple'> = {}): Promise<string | null> {
    isLoading.value = true
    error.value = null
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: options.defaultPath,
        title: options.title || 'Select Directory'
      })
      if (!selected) return null
      selectedDirectory.value = selected as string
      return selected as string
    } catch (err) {
      error.value = (err as Error).message
      return null
    } finally {
      isLoading.value = false
    }
  }

  function createFileResult(path: string): FilePickerResult {
    const name = path.split(/[/\\]/).pop() || ''
    const extension = name.includes('.') ? name.split('.').pop() || '' : ''
    return { path, name, extension }
  }

  function clear(): void {
    selectedFiles.value = []
    selectedDirectory.value = null
    error.value = null
  }

  return {
    selectedFiles, selectedDirectory, isLoading, error,
    pickFile, pickFiles, pickDirectory, clear
  }
}

export default useFilePicker
