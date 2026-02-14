import { ref, computed } from 'vue'
import { ocrApi } from '@/api'

export function useOcr() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)
  const languages = ref<Array<{ code: string; name: string }>>([])
  const result = ref<string | null>(null)

  async function loadLanguages() {
    try {
      const response = await ocrApi.getLanguages()
      languages.value = response.languages
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function recognize(
    inputPath: string,
    outputPath: string,
    language: string = 'chi_sim+eng',
    outputFormat: 'text' | 'word' | 'pdf' = 'text'
  ) {
    loading.value = true
    error.value = null
    progress.value = 0
    
    try {
      const response = await ocrApi.recognize({
        input_path: inputPath,
        output_path: outputPath,
        language,
        output_format: outputFormat
      })
      result.value = response.output_path
      progress.value = 100
      return response.output_path
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function batchRecognize(
    inputPaths: string[],
    outputDir: string,
    language: string = 'chi_sim+eng'
  ) {
    loading.value = true
    error.value = null
    progress.value = 0
    
    try {
      const response = await ocrApi.batchRecognize(inputPaths, outputDir, language)
      progress.value = 100
      return response.results
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    progress,
    languages,
    result,
    loadLanguages,
    recognize,
    batchRecognize
  }
}
