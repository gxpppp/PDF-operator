export interface PdfWorkerMessage {
  type: 'load' | 'renderPage' | 'extractText' | 'close'
  payload?: any
}

export interface PdfWorkerResponse {
  type: 'loaded' | 'pageRendered' | 'textExtracted' | 'closed' | 'error'
  payload?: any
}

export interface OcrWorkerMessage {
  type: 'recognize' | 'cancel'
  payload?: {
    imagePath?: string
    language?: string
  }
}

export interface OcrWorkerResponse {
  type: 'recognized' | 'progress' | 'error'
  payload?: {
    text?: string
    progress?: number
    message?: string
  }
}

export interface CompressWorkerMessage {
  type: 'compress'
  payload?: {
    inputPath?: string
    outputPath?: string
    level?: 'low' | 'medium' | 'high'
  }
}

export interface CompressWorkerResponse {
  type: 'compressed' | 'progress' | 'error'
  payload?: {
    outputPath?: string
    progress?: number
    message?: string
  }
}
