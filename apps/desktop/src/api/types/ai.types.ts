export type AiProvider = 'openai' | 'ollama' | 'anthropic'

export interface AiModel {
  id: string
  name: string
  provider: AiProvider
  contextWindow: number
  supportsVision: boolean
  supportsFunctionCalling: boolean
}

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  images?: string[]
}

export interface AiChatOptions {
  messages: AiChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AiChatResponse {
  id: string
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: string
}

export interface AiSummaryOptions {
  inputPath: string
  style?: 'brief' | 'detailed' | 'bullet-points'
  language?: string
  maxLength?: number
}

export interface AiSummaryResult {
  success: boolean
  summary: string
  keyPoints: string[]
  topics: string[]
  readingTime: number
}

export interface AiTranslateOptions {
  text: string
  sourceLanguage: string
  targetLanguage: string
  preserveFormatting?: boolean
}

export interface AiTranslateResult {
  success: boolean
  translatedText: string
  detectedLanguage?: string
  confidence: number
}

export interface AiExtractOptions {
  inputPath: string
  extractType: 'entities' | 'dates' | 'emails' | 'phones' | 'urls' | 'custom'
  customPattern?: string
}

export interface AiExtractResult {
  success: boolean
  entities: ExtractedEntity[]
}

export interface ExtractedEntity {
  type: string
  value: string
  position: { page: number; bbox: [number, number, number, number] }
  confidence: number
}

export interface AiRewriteOptions {
  text: string
  style?: 'formal' | 'casual' | 'academic' | 'simple'
  tone?: 'neutral' | 'friendly' | 'professional'
  preserveMeaning?: boolean
}

export interface AiRewriteResult {
  success: boolean
  rewrittenText: string
  changes: string[]
}

export interface AiClassifyOptions {
  inputPath: string
  categories: string[]
  multiLabel?: boolean
}

export interface AiClassifyResult {
  success: boolean
  categories: { label: string; confidence: number }[]
  suggestedCategory: string
}

export interface AiEmbeddingOptions {
  texts: string[]
  model?: string
}

export interface AiEmbeddingResult {
  success: boolean
  embeddings: number[][]
  model: string
  dimensions: number
}

export const AI_PROVIDERS: { id: AiProvider; name: string; requiresApiKey: boolean }[] = [
  { id: 'openai', name: 'OpenAI', requiresApiKey: true },
  { id: 'ollama', name: 'Ollama (Local)', requiresApiKey: false },
  { id: 'anthropic', name: 'Anthropic Claude', requiresApiKey: true },
]
