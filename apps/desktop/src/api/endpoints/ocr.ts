import client from './client'

export interface OcrOptions {
  input_path: string
  output_path: string
  language: string
  output_format: 'text' | 'word' | 'pdf'
}

export interface OcrLanguage {
  code: string
  name: string
}

export const ocrApi = {
  async recognize(options: OcrOptions): Promise<{ success: boolean; output_path: string }> {
    return client.post('/ocr/recognize', options)
  },

  async batchRecognize(
    inputPaths: string[],
    outputDir: string,
    language: string
  ): Promise<{ success: boolean; results: string[] }> {
    return client.post('/ocr/batch', {
      input_paths: inputPaths,
      output_dir: outputDir,
      language
    })
  },

  async getLanguages(): Promise<{ languages: OcrLanguage[] }> {
    return client.get('/ocr/languages')
  },

  async makeSearchablePdf(
    inputPath: string,
    outputPath: string,
    language: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/ocr/pdf/searchable', {
      input_path: inputPath,
      output_path: outputPath,
      language
    })
  }
}

export default ocrApi
