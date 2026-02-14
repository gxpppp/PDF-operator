export interface PdfMetadata {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  creation_date?: string
  modification_date?: string
  page_count: number
  file_size: number
}

export interface PdfPage {
  number: number
  width: number
  height: number
  rotation: number
}

export interface MergeOptions {
  input_paths: string[]
  output_path: string
}

export interface SplitOptions {
  input_path: string
  output_dir: string
  mode: 'all' | 'range' | 'pages'
  page_ranges?: string
  pages_per_file?: number
}

export interface WatermarkOptions {
  input_path: string
  output_path: string
  watermark_type: 'text' | 'image'
  watermark_text?: string
  watermark_image?: string
  font_size?: number
  font_color?: string
  opacity?: number
  rotation?: number
  position?: string
}

export interface CompressOptions {
  input_path: string
  output_path: string
  level: 'low' | 'medium' | 'high'
}

export interface RotateOptions {
  input_path: string
  output_path: string
  pages: number[]
  degrees: number
}
