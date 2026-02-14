import { ref, computed } from 'vue'
import { pdfApi } from '@/api'
import type { PdfMetadata, PdfPage } from '@/api/types/pdf.types'

export function usePdf() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filePath = ref<string | null>(null)
  const metadata = ref<PdfMetadata | null>(null)
  const pages = ref<PdfPage[]>([])

  const isLoaded = computed(() => filePath.value !== null)
  const pageCount = computed(() => metadata.value?.page_count || 0)

  async function load(path: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await pdfApi.getMetadata(path)
      metadata.value = result
      filePath.value = path
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function merge(inputPaths: string[], outputPath: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await pdfApi.merge(inputPaths, outputPath)
      return result.output_path
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function split(options: any) {
    loading.value = true
    error.value = null
    
    try {
      const result = await pdfApi.split(options)
      return result.output_files
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function extractText() {
    if (!filePath.value) return null
    
    loading.value = true
    error.value = null
    
    try {
      const result = await pdfApi.extractText(filePath.value)
      return result.text
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  function clear() {
    filePath.value = null
    metadata.value = null
    pages.value = []
    error.value = null
  }

  return {
    loading,
    error,
    filePath,
    metadata,
    pages,
    isLoaded,
    pageCount,
    load,
    merge,
    split,
    extractText,
    clear
  }
}
