import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface PdfPage {
  number: number
  width: number
  height: number
  rotation: number
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
  pageCount: number
  fileSize: number
}

export const usePdfStore = defineStore('pdf', () => {
  const file = ref<File | null>(null)
  const filePath = ref<string | null>(null)
  const pages = ref<PdfPage[]>([])
  const metadata = ref<PdfMetadata | null>(null)
  const currentPage = ref(1)
  const zoom = ref(1)
  const rotation = ref(0)
  const searchText = ref('')
  const searchResults = ref<number[]>([])
  const currentSearchIndex = ref(0)
  
  const isLoaded = computed(() => file.value !== null)
  const pageCount = computed(() => pages.value.length)

  function setFile(newFile: File | null, path: string | null) {
    file.value = newFile
    filePath.value = path
    if (!newFile) {
      pages.value = []
      metadata.value = null
      currentPage.value = 1
    }
  }

  function setPages(newPages: PdfPage[]) {
    pages.value = newPages
  }

  function setMetadata(newMetadata: PdfMetadata) {
    metadata.value = newMetadata
  }

  function setCurrentPage(page: number) {
    if (page >= 1 && page <= pageCount.value) {
      currentPage.value = page
    }
  }

  function setZoom(newZoom: number) {
    zoom.value = Math.max(0.1, Math.min(5, newZoom))
  }

  function setRotation(newRotation: number) {
    rotation.value = newRotation % 360
  }

  function rotatePage(pageNumber: number, degrees: number) {
    const page = pages.value.find(p => p.number === pageNumber)
    if (page) {
      page.rotation = (page.rotation + degrees) % 360
    }
  }

  function setSearchResults(results: number[]) {
    searchResults.value = results
    currentSearchIndex.value = results.length > 0 ? 0 : -1
  }

  function nextSearchResult() {
    if (searchResults.value.length > 0) {
      currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length
      return searchResults.value[currentSearchIndex.value]
    }
    return null
  }

  function prevSearchResult() {
    if (searchResults.value.length > 0) {
      currentSearchIndex.value = (currentSearchIndex.value - 1 + searchResults.value.length) % searchResults.value.length
      return searchResults.value[currentSearchIndex.value]
    }
    return null
  }

  return {
    file,
    filePath,
    pages,
    metadata,
    currentPage,
    zoom,
    rotation,
    searchText,
    searchResults,
    currentSearchIndex,
    isLoaded,
    pageCount,
    setFile,
    setPages,
    setMetadata,
    setCurrentPage,
    setZoom,
    setRotation,
    rotatePage,
    setSearchResults,
    nextSearchResult,
    prevSearchResult,
  }
})
