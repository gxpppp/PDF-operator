import client from './client'
import type { 
  PdfMetadata, 
  PdfPage, 
  MergeOptions, 
  SplitOptions,
  WatermarkOptions,
  CompressOptions 
} from './types/pdf.types'

export const pdfApi = {
  async upload(file: File): Promise<{ path: string; filename: string; metadata: PdfMetadata }> {
    const formData = new FormData()
    formData.append('file', file)
    return client.post('/pdf/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  async merge(inputPaths: string[], outputPath: string): Promise<{ success: boolean; output_path: string }> {
    return client.post('/pdf/merge', { input_paths: inputPaths, output_path: outputPath })
  },

  async split(options: SplitOptions): Promise<{ success: boolean; output_files: string[] }> {
    return client.post('/pdf/split', options)
  },

  async getMetadata(filePath: string): Promise<PdfMetadata> {
    return client.get(`/pdf/metadata/${encodeURIComponent(filePath)}`)
  },

  async rotatePages(
    inputPath: string,
    outputPath: string,
    pages: number[],
    degrees: number
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/pdf/rotate', {
      input_path: inputPath,
      output_path: outputPath,
      pages,
      degrees
    })
  },

  async addWatermark(options: WatermarkOptions): Promise<{ success: boolean; output_path: string }> {
    return client.post('/pdf/watermark', options)
  },

  async compress(options: CompressOptions): Promise<{ success: boolean; output_path: string }> {
    return client.post('/pdf/compress', options)
  },

  async extractText(inputPath: string): Promise<{ text: string }> {
    return client.post('/pdf/extract/text', { input_path: inputPath })
  },

  async extractImages(inputPath: string, outputDir: string): Promise<{ images: string[] }> {
    return client.post('/pdf/extract/images', { input_path: inputPath, output_dir: outputDir })
  },

  async extractTables(inputPath: string): Promise<{ tables: any[][][] }> {
    return client.post('/pdf/extract/tables', { input_path: inputPath })
  },

  async renderPage(
    inputPath: string,
    pageNumber: number,
    zoom: number = 1,
    rotation: number = 0
  ): Promise<Blob> {
    return client.get(`/pdf/render/${encodeURIComponent(inputPath)}`, {
      params: { page: pageNumber, zoom, rotation },
      responseType: 'blob'
    })
  },

  async download(filePath: string): Promise<Blob> {
    return client.get(`/pdf/download/${encodeURIComponent(filePath)}`, {
      responseType: 'blob'
    })
  }
}

export default pdfApi
