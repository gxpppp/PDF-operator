import type { OcrWorkerMessage, OcrWorkerResponse } from './types'

self.onmessage = async (e: MessageEvent<OcrWorkerMessage>) => {
  const { type, payload } = e.data

  try {
    switch (type) {
      case 'recognize':
        const { imagePath, language } = payload || {}
        if (!imagePath) {
          throw new Error('Image path is required')
        }
        
        self.postMessage({ 
          type: 'progress', 
          payload: { progress: 10 } 
        } as OcrWorkerResponse)
        
        const text = await recognizeImage(imagePath, language || 'chi_sim+eng')
        
        self.postMessage({ 
          type: 'recognized', 
          payload: { text } 
        } as OcrWorkerResponse)
        break

      case 'cancel':
        self.postMessage({ type: 'error', payload: { message: 'Cancelled' } } as OcrWorkerResponse)
        break
    }
  } catch (error: any) {
    self.postMessage({ 
      type: 'error', 
      payload: { message: error.message } 
    } as OcrWorkerResponse)
  }
}

async function recognizeImage(imagePath: string, language: string): Promise<string> {
  self.postMessage({ type: 'progress', payload: { progress: 30 } } as OcrWorkerResponse)
  
  await new Promise(resolve => setTimeout(resolve, 100))
  
  self.postMessage({ type: 'progress', payload: { progress: 60 } } as OcrWorkerResponse)
  
  await new Promise(resolve => setTimeout(resolve, 100))
  
  self.postMessage({ type: 'progress', payload: { progress: 90 } } as OcrWorkerResponse)
  
  return `[OCR Result for ${imagePath}]`
}

export {}
