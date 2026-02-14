import { ref } from 'vue'

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
  file?: File
}

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window
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
      let result: FilePickerResult | null = null
      
      if (isTauri()) {
        const { open } = await import('@tauri-apps/plugin-dialog')
        const selected = await open({
          multiple: options.multiple || false,
          directory: options.directory || false,
          filters: options.filters,
          defaultPath: options.defaultPath,
          title: options.title
        })
        if (selected && !options.directory) {
          const path = selected as string
          result = createFileResult(path)
          selectedFiles.value = [result]
        }
      } else {
        result = await pickFileWeb(options)
      }
      
      return result
    } catch (err) {
      error.value = (err as Error).message
      console.error('pickFile error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  function pickFileWeb(options: FilePickerOptions = {}): Promise<FilePickerResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.style.cssText = 'position: absolute; top: -9999px; left: -9999px; opacity: 0;'
      
      if (options.multiple) {
        input.multiple = true
      }
      
      if (options.filters && options.filters.length > 0) {
        const acceptTypes = options.filters
          .flatMap(f => f.extensions.map(ext => ext === '*' ? '' : `.${ext}`))
          .filter(Boolean)
          .join(',')
        if (acceptTypes) {
          input.accept = acceptTypes
        }
      }

      let resolved = false

      const cleanup = () => {
        if (!resolved) {
          resolved = true
          document.body.removeChild(input)
        }
      }

      input.onchange = (event) => {
        if (resolved) return
        resolved = true
        
        const files = (event.target as HTMLInputElement).files
        console.log('Files selected:', files)
        
        if (!files || files.length === 0) {
          cleanup()
          resolve(null)
          return
        }

        const file = files[0]
        const result: FilePickerResult = {
          path: file.name,
          name: file.name,
          extension: file.name.includes('.') ? file.name.split('.').pop() || '' : '',
          file: file
        }
        selectedFiles.value = [result]
        console.log('File result:', result)
        cleanup()
        resolve(result)
      }

      input.oncancel = () => {
        console.log('File picker cancelled')
        cleanup()
        resolve(null)
      }

      document.body.appendChild(input)
      
      setTimeout(() => input.click(), 0)
    })
  }

  async function pickFiles(options: Omit<FilePickerOptions, 'multiple'> = {}): Promise<FilePickerResult[]> {
    isLoading.value = true
    error.value = null
    
    try {
      let results: FilePickerResult[] = []
      
      if (isTauri()) {
        const { open } = await import('@tauri-apps/plugin-dialog')
        const selected = await open({
          multiple: true,
          directory: false,
          filters: options.filters,
          defaultPath: options.defaultPath,
          title: options.title
        })
        if (selected) {
          const paths = Array.isArray(selected) ? selected : [selected]
          results = paths.map(createFileResult)
          selectedFiles.value = results
        }
      } else {
        results = await pickFilesWeb(options)
      }
      
      return results
    } catch (err) {
      error.value = (err as Error).message
      return []
    } finally {
      isLoading.value = false
    }
  }

  function pickFilesWeb(options: Omit<FilePickerOptions, 'multiple'> = {}): Promise<FilePickerResult[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.style.cssText = 'position: absolute; top: -9999px; left: -9999px; opacity: 0;'
      input.multiple = true
      
      if (options.filters && options.filters.length > 0) {
        const acceptTypes = options.filters
          .flatMap(f => f.extensions.map(ext => ext === '*' ? '' : `.${ext}`))
          .filter(Boolean)
          .join(',')
        if (acceptTypes) {
          input.accept = acceptTypes
        }
      }

      let resolved = false

      const cleanup = () => {
        if (!resolved) {
          resolved = true
          document.body.removeChild(input)
        }
      }

      input.onchange = (event) => {
        if (resolved) return
        resolved = true
        
        const files = (event.target as HTMLInputElement).files
        if (!files || files.length === 0) {
          cleanup()
          resolve([])
          return
        }

        const results: FilePickerResult[] = Array.from(files).map(file => ({
          path: file.name,
          name: file.name,
          extension: file.name.includes('.') ? file.name.split('.').pop() || '' : '',
          file: file
        }))
        selectedFiles.value = results
        cleanup()
        resolve(results)
      }

      input.oncancel = () => {
        cleanup()
        resolve([])
      }

      document.body.appendChild(input)
      setTimeout(() => input.click(), 0)
    })
  }

  async function pickDirectory(options: Omit<FilePickerOptions, 'directory' | 'multiple'> = {}): Promise<string | null> {
    isLoading.value = true
    error.value = null
    try {
      if (isTauri()) {
        const { open } = await import('@tauri-apps/plugin-dialog')
        const selected = await open({
          directory: true,
          multiple: false,
          defaultPath: options.defaultPath,
          title: options.title || 'Select Directory'
        })
        if (!selected) return null
        selectedDirectory.value = selected as string
        return selected as string
      } else {
        error.value = 'Directory picker is not supported in web mode'
        return null
      }
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
