import client from './client'

export interface SummaryRequest {
  text: string
  max_length?: number
}

export interface TranslateRequest {
  text: string
  source_lang?: string
  target_lang?: string
}

export interface ChatRequest {
  message: string
  context?: string
  conversation_id?: string
}

export const aiApi = {
  async summarize(text: string, maxLength: number = 200): Promise<{ summary: string }> {
    return client.post('/ai/summary', { text, max_length: maxLength })
  },

  async translate(
    text: string,
    sourceLang: string = 'auto',
    targetLang: string = 'zh'
  ): Promise<{ translated_text: string }> {
    return client.post('/ai/translate', {
      text,
      source_lang: sourceLang,
      target_lang: targetLang
    })
  },

  async chat(
    message: string,
    context?: string,
    conversationId?: string
  ): Promise<{ response: string }> {
    return client.post('/ai/chat', {
      message,
      context,
      conversation_id: conversationId
    })
  },

  async extract(text: string, extractType: string = 'keywords'): Promise<{ result: string[] }> {
    return client.post('/ai/extract', { text, extract_type: extractType })
  },

  async summarizePdf(filePath: string, maxLength: number = 500): Promise<{ summary: string }> {
    return client.post('/ai/pdf/summary', null, {
      params: { file_path: filePath, max_length: maxLength }
    })
  },

  async pdfQa(filePath: string, question: string): Promise<{ answer: string }> {
    return client.post('/ai/pdf/qa', null, {
      params: { file_path: filePath, question }
    })
  },

  async classifyPdf(filePath: string): Promise<{ category: string }> {
    return client.post('/ai/pdf/classify', null, {
      params: { file_path: filePath }
    })
  }
}

export default aiApi
