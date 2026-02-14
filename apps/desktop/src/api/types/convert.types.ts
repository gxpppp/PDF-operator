export type ConvertFormat = 
  | 'pdf-to-word' 
  | 'pdf-to-excel' 
  | 'pdf-to-ppt' 
  | 'pdf-to-image' 
  | 'pdf-to-html' 
  | 'pdf-to-txt'
  | 'word-to-pdf' 
  | 'excel-to-pdf' 
  | 'ppt-to-pdf' 
  | 'image-to-pdf' 
  | 'html-to-pdf'
  | 'markdown-to-pdf'

export interface ConvertOptions {
  inputPath: string
  outputPath: string
  format: ConvertFormat
  quality?: 'low' | 'medium' | 'high' | 'lossless'
  dpi?: number
  pages?: number[]
  preserveFormatting?: boolean
  extractImages?: boolean
  ocrEnabled?: boolean
  ocrLanguage?: string
}

export interface PdfToImageOptions extends ConvertOptions {
  format: 'pdf-to-image'
  imageFormat: 'png' | 'jpg' | 'tiff' | 'webp'
  dpi?: number
  pages?: number[]
  backgroundColor?: string
}

export interface ImageToPdfOptions extends ConvertOptions {
  format: 'image-to-pdf'
  pageSize?: 'a4' | 'letter' | 'fit' | 'custom'
  customWidth?: number
  customHeight?: number
  orientation?: 'portrait' | 'landscape'
  margin?: number
  align?: 'left' | 'center' | 'right'
}

export interface PdfToWordOptions extends ConvertOptions {
  format: 'pdf-to-word'
  preserveFormatting?: boolean
  extractImages?: boolean
  ocrEnabled?: boolean
  ocrLanguage?: string
}

export interface PdfToExcelOptions extends ConvertOptions {
  format: 'pdf-to-excel'
  detectTables?: boolean
  preserveFormatting?: boolean
  sheetPerTable?: boolean
}

export interface ConvertResult {
  success: boolean
  outputPath: string
  format: ConvertFormat
  pageCount?: number
  fileSize?: number
  processingTime: number
}

export interface ConvertProgress {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  currentPage: number
  totalPages: number
  message?: string
}

export interface ConvertBatchOptions {
  inputPaths: string[]
  outputDir: string
  format: ConvertFormat
  options?: Partial<ConvertOptions>
}

export interface ConvertBatchResult {
  success: boolean
  results: ConvertResult[]
  failed: string[]
  totalTime: number
}

export const SUPPORTED_FORMATS: { format: ConvertFormat; name: string; inputExt: string[]; outputExt: string }[] = [
  { format: 'pdf-to-word', name: 'PDF 转 Word', inputExt: ['.pdf'], outputExt: '.docx' },
  { format: 'pdf-to-excel', name: 'PDF 转 Excel', inputExt: ['.pdf'], outputExt: '.xlsx' },
  { format: 'pdf-to-ppt', name: 'PDF 转 PPT', inputExt: ['.pdf'], outputExt: '.pptx' },
  { format: 'pdf-to-image', name: 'PDF 转图片', inputExt: ['.pdf'], outputExt: '.png' },
  { format: 'pdf-to-html', name: 'PDF 转 HTML', inputExt: ['.pdf'], outputExt: '.html' },
  { format: 'pdf-to-txt', name: 'PDF 转文本', inputExt: ['.pdf'], outputExt: '.txt' },
  { format: 'word-to-pdf', name: 'Word 转 PDF', inputExt: ['.doc', '.docx'], outputExt: '.pdf' },
  { format: 'excel-to-pdf', name: 'Excel 转 PDF', inputExt: ['.xls', '.xlsx'], outputExt: '.pdf' },
  { format: 'ppt-to-pdf', name: 'PPT 转 PDF', inputExt: ['.ppt', '.pptx'], outputExt: '.pdf' },
  { format: 'image-to-pdf', name: '图片转 PDF', inputExt: ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'], outputExt: '.pdf' },
  { format: 'html-to-pdf', name: 'HTML 转 PDF', inputExt: ['.html', '.htm'], outputExt: '.pdf' },
  { format: 'markdown-to-pdf', name: 'Markdown 转 PDF', inputExt: ['.md'], outputExt: '.pdf' },
]
