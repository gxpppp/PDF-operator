import client from './client'

export interface ConvertRequest {
  input_path: string
  output_path: string
  output_format: string
  quality?: string
}

export const convertApi = {
  async pdfToWord(
    inputPath: string,
    outputPath: string,
    quality: string = 'high'
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/pdf/to/word', {
      input_path: inputPath,
      output_path: outputPath,
      quality
    })
  },

  async pdfToExcel(
    inputPath: string,
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/pdf/to/excel', {
      input_path: inputPath,
      output_path: outputPath
    })
  },

  async pdfToPpt(
    inputPath: string,
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/pdf/to/ppt', {
      input_path: inputPath,
      output_path: outputPath
    })
  },

  async pdfToImage(
    inputPath: string,
    outputDir: string,
    format: string = 'png',
    dpi: number = 150
  ): Promise<{ success: boolean; images: string[] }> {
    return client.post('/convert/pdf/to/image', null, {
      params: {
        input_path: inputPath,
        output_dir: outputDir,
        image_format: format,
        dpi
      }
    })
  },

  async pdfToHtml(
    inputPath: string,
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/pdf/to/html', {
      input_path: inputPath,
      output_path: outputPath
    })
  },

  async wordToPdf(
    inputPath: string,
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/word/to/pdf', {
      input_path: inputPath,
      output_path: outputPath
    })
  },

  async excelToPdf(
    inputPath: string,
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/excel/to/pdf', {
      input_path: inputPath,
      output_path: outputPath
    })
  },

  async imageToPdf(
    inputPaths: string[],
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/image/to/pdf', {
      input_paths: inputPaths,
      output_path: outputPath
    })
  },

  async htmlToPdf(
    inputPath: string,
    outputPath: string
  ): Promise<{ success: boolean; output_path: string }> {
    return client.post('/convert/html/to/pdf', {
      input_path: inputPath,
      output_path: outputPath
    })
  },

  async getSupportedFormats(): Promise<{
    input_formats: string[]
    output_formats: string[]
  }> {
    return client.get('/convert/formats')
  }
}

export default convertApi
