export interface OcrLanguage {
  code: string
  name: string
  nativeName: string
}

export interface OcrEngine {
  id: string
  name: string
  version: string
  supportedLanguages: string[]
}

export interface OcrOptions {
  inputPath: string
  outputPath?: string
  language?: string
  engine?: 'paddleocr' | 'tesseract' | 'easyocr'
  dpi?: number
  enhance?: boolean
  deskew?: boolean
  denoise?: boolean
  binarize?: boolean
  preserveFormatting?: boolean
  outputFormat?: 'text' | 'json' | 'pdf' | 'pdf-with-text'
}

export interface OcrResult {
  success: boolean
  text: string
  pages: OcrPageResult[]
  confidence: number
  processingTime: number
}

export interface OcrPageResult {
  pageNumber: number
  text: string
  blocks: OcrTextBlock[]
  confidence: number
}

export interface OcrTextBlock {
  text: string
  bbox: [number, number, number, number]
  confidence: number
  fontSize?: number
  fontFamily?: string
}

export interface OcrProgress {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  currentPage: number
  totalPages: number
  message?: string
}

export interface OcrBatchOptions {
  inputPaths: string[]
  outputDir: string
  options: OcrOptions
}

export interface OcrBatchResult {
  success: boolean
  results: OcrResult[]
  failed: string[]
  totalTime: number
}

export const OCR_LANGUAGES: OcrLanguage[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
]
