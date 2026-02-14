import { ref } from 'vue'
import { aiApi } from '@/api'

export function useAi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const conversationId = ref<string | null>(null)
  const messages = ref<Array<{ role: string; content: string }>>([])

  async function summarize(text: string, maxLength: number = 200) {
    loading.value = true
    error.value = null
    
    try {
      const response = await aiApi.summarize(text, maxLength)
      return response.summary
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function translate(
    text: string,
    sourceLang: string = 'auto',
    targetLang: string = 'zh'
  ) {
    loading.value = true
    error.value = null
    
    try {
      const response = await aiApi.translate(text, sourceLang, targetLang)
      return response.translated_text
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function chat(message: string, context?: string) {
    loading.value = true
    error.value = null
    
    try {
      messages.value.push({ role: 'user', content: message })
      
      const response = await aiApi.chat(message, context, conversationId.value || undefined)
      
      if (!conversationId.value) {
        conversationId.value = Date.now().toString()
      }
      
      messages.value.push({ role: 'assistant', content: response.response })
      
      return response.response
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function summarizePdf(filePath: string, maxLength: number = 500) {
    loading.value = true
    error.value = null
    
    try {
      const response = await aiApi.summarizePdf(filePath, maxLength)
      return response.summary
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function pdfQa(filePath: string, question: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await aiApi.pdfQa(filePath, question)
      return response.answer
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  function clearConversation() {
    conversationId.value = null
    messages.value = []
  }

  return {
    loading,
    error,
    messages,
    summarize,
    translate,
    chat,
    summarizePdf,
    pdfQa,
    clearConversation
  }
}
