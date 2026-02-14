export * from './types'

export function createPdfWorker(): Worker {
  return new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' })
}

export function createOcrWorker(): Worker {
  return new Worker(new URL('./ocr.worker.ts', import.meta.url), { type: 'module' })
}

export function createCompressWorker(): Worker {
  return new Worker(new URL('./compress.worker.ts', import.meta.url), { type: 'module' })
}
