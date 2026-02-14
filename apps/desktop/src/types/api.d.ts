export interface PdfFile {
  path: string
  name: string
  size: number
  pageCount: number
  metadata?: PdfMetadata
}

export interface PdfMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  creationDate?: string
  modificationDate?: string
  pages?: number
  encrypted?: boolean
  fileSize?: number
}

export interface PdfPage {
  number: number
  width: number
  height: number
  rotation: number
  text?: string
  images?: string[]
}

export interface PdfAnnotation {
  id: string
  type: 'text' | 'highlight' | 'underline' | 'strikeout' | 'stamp' | 'ink' | 'freetext' | 'line' | 'square' | 'circle' | 'polygon' | 'polyline' | 'fileattachment' | 'sound' | 'link'
  pageNumber: number
  bbox: [number, number, number, number]
  content?: string
  color?: string
  opacity?: number
  author?: string
  createdDate?: string
  modifiedDate?: string
}

export interface PdfBookmark {
  title: string
  pageNumber: number
  children?: PdfBookmark[]
  level: number
}

export interface PdfOutline {
  title: string
  destination?: string | number
  children?: PdfOutline[]
}

export interface PdfFormField {
  name: string
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature' | 'date'
  value?: string | boolean
  required?: boolean
  pageNumber: number
  bbox: [number, number, number, number]
}

export interface PdfSignature {
  name: string
  date?: string
  reason?: string
  location?: string
  isValid?: boolean
  certificateInfo?: {
    issuer: string
    subject: string
    validFrom: string
    validTo: string
  }
}

export interface MergeOptions {
  inputPaths: string[]
  outputPath: string
  preserveBookmarks?: boolean
  preserveMetadata?: boolean
  addPageNumbers?: boolean
}

export interface SplitOptions {
  inputPath: string
  outputDir: string
  mode: 'pages' | 'ranges' | 'bookmarks' | 'size'
  pages?: number[]
  ranges?: Array<{ start: number; end: number }>
  maxPages?: number
  maxSize?: number
}

export interface WatermarkOptions {
  type: 'text' | 'image'
  text?: string
  imagePath?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  opacity?: number
  rotation?: number
  position?: 'center' | 'tile' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  pages?: 'all' | 'first' | 'last' | number[]
}

export interface CompressOptions {
  inputPath: string
  outputPath: string
  quality: 'low' | 'medium' | 'high' | 'lossless'
  imageQuality?: number
  downsampleImages?: boolean
  maxDpi?: number
  removeMetadata?: boolean
  removeBookmarks?: boolean
  removeAnnotations?: boolean
}

export interface RotateOptions {
  inputPath: string
  outputPath: string
  pages: number[]
  degrees: 90 | 180 | 270
}

export interface CropOptions {
  inputPath: string
  outputPath: string
  pages?: number[]
  left: number
  right: number
  top: number
  bottom: number
}

export interface ExtractOptions {
  inputPath: string
  outputDir: string
  type: 'text' | 'images' | 'tables' | 'pages'
  pages?: number[]
  format?: 'txt' | 'json' | 'csv' | 'xlsx'
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
  outputFormat?: 'text' | 'json' | 'pdf' | 'pdf-with-text'
}

export interface ConvertOptions {
  inputPath: string
  outputPath: string
  format: 'pdf-to-word' | 'pdf-to-excel' | 'pdf-to-ppt' | 'pdf-to-image' | 'pdf-to-html' | 'pdf-to-txt' | 'word-to-pdf' | 'excel-to-pdf' | 'ppt-to-pdf' | 'image-to-pdf' | 'html-to-pdf' | 'markdown-to-pdf'
  quality?: 'low' | 'medium' | 'high' | 'lossless'
  dpi?: number
  pages?: number[]
  preserveFormatting?: boolean
  extractImages?: boolean
  ocrEnabled?: boolean
  ocrLanguage?: string
}

export interface SecurityOptions {
  inputPath: string
  outputPath: string
  userPassword?: string
  ownerPassword?: string
  permissions?: string[]
  algorithm?: 'aes-128' | 'aes-256' | 'rc4'
}
