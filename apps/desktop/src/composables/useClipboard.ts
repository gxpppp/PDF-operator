import { ref } from 'vue'
import { writeText, readText } from '@tauri-apps/plugin-clipboard'

export function useClipboard() {
  const text = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function write(content: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await writeText(content)
      text.value = content
      return true
    } catch (err) {
      error.value = (err as Error).message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function read(): Promise<string | null> {
    isLoading.value = true
    error.value = null
    try {
      const content = await readText()
      if (content) text.value = content
      return content
    } catch (err) {
      error.value = (err as Error).message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { text, isLoading, error, write, read }
}

export default useClipboard
