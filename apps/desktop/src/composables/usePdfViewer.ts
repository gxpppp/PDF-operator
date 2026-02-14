import { ref, computed, watch, onUnmounted, type Ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

export interface UsePdfViewerOptions {
  source: Ref<string | ArrayBuffer | null>
  scale?: number
  rotation?: number
  enableTextLayer?: boolean
  enableAnnotationLayer?: boolean
}

export interface PdfViewerState {
  document: PDFDocumentProxy | null
  pages: PDFPageProxy[]
  currentPage: number
  totalPages: number
  scale: number
  rotation: number
  loading: boolean
  error: Error | null
  searchText: string
  searchResults: SearchResult[]
  currentSearchIndex: number
}

export interface SearchResult {
  pageNumber: number
  items: pdfjsLib.TextItem[]
}

export function usePdfViewer(options: UsePdfViewerOptions) {
  const {
    source,
    scale: initialScale = 1,
    rotation: initialRotation = 0,
    enableTextLayer = true,
    enableAnnotationLayer = true
  } = options

  const state = ref<PdfViewerState>({
    document: null,
    pages: [],
    currentPage: 1,
    totalPages: 0,
    scale: initialScale,
    rotation: initialRotation,
    loading: false,
    error: null,
    searchText: '',
    searchResults: [],
    currentSearchIndex: -1
  })

  const pageTextContents = ref<Map<number, string>>(new Map())

  const canGoPrev = computed(() => state.value.currentPage > 1)
  const canGoNext = computed(() => state.value.currentPage < state.value.totalPages)
  const progress = computed(() => {
    if (state.value.totalPages === 0) return 0
    return (state.value.currentPage / state.value.totalPages) * 100
  })

  async function loadDocument(): Promise<void> {
    if (!source.value) return

    state.value.loading = true
    state.value.error = null

    try {
      const loadingTask = pdfjsLib.getDocument(source.value)
      const document = await loadingTask.promise

      state.value.document = document
      state.value.totalPages = document.numPages
      state.value.pages = []

      for (let i = 1; i <= document.numPages; i++) {
        const page = await document.getPage(i)
        state.value.pages.push(page)
      }

      if (enableTextLayer) {
        await preloadTextContents()
      }
    } catch (error) {
      state.value.error = error as Error
      console.error('Failed to load PDF:', error)
    } finally {
      state.value.loading = false
    }
  }

  async function preloadTextContents(): Promise<void> {
    if (!state.value.document) return

    for (let i = 1; i <= state.value.totalPages; i++) {
      const page = state.value.pages[i - 1]
      const textContent = await page.getTextContent()
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      pageTextContents.value.set(i, text)
    }
  }

  async function renderPage(
    pageNumber: number,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    if (!state.value.document || pageNumber < 1 || pageNumber > state.value.totalPages) return

    const page = state.value.pages[pageNumber - 1]
    const viewport = page.getViewport({
      scale: state.value.scale,
      rotation: state.value.rotation
    })

    canvas.width = viewport.width
    canvas.height = viewport.height

    const context = canvas.getContext('2d')
    if (!context) return

    await page.render({
      canvasContext: context,
      viewport
    }).promise
  }

  function goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= state.value.totalPages) {
      state.value.currentPage = pageNumber
    }
  }

  function goPrev(): void {
    if (canGoPrev.value) {
      state.value.currentPage--
    }
  }

  function goNext(): void {
    if (canGoNext.value) {
      state.value.currentPage++
    }
  }

  function setScale(newScale: number): void {
    state.value.scale = Math.max(0.1, Math.min(5, newScale))
  }

  function zoomIn(delta: number = 0.1): void {
    setScale(state.value.scale + delta)
  }

  function zoomOut(delta: number = 0.1): void {
    setScale(state.value.scale - delta)
  }

  function fitToWidth(containerWidth: number): void {
    if (!state.value.document || state.value.pages.length === 0) return

    const page = state.value.pages[state.value.currentPage - 1]
    const viewport = page.getViewport({ scale: 1 })
    state.value.scale = containerWidth / viewport.width
  }

  function fitToPage(containerWidth: number, containerHeight: number): void {
    if (!state.value.document || state.value.pages.length === 0) return

    const page = state.value.pages[state.value.currentPage - 1]
    const viewport = page.getViewport({ scale: 1 })
    
    const scaleX = containerWidth / viewport.width
    const scaleY = containerHeight / viewport.height
    state.value.scale = Math.min(scaleX, scaleY)
  }

  function setRotation(degrees: number): void {
    state.value.rotation = ((degrees % 360) + 360) % 360
  }

  function rotateClockwise(): void {
    setRotation(state.value.rotation + 90)
  }

  function rotateCounterClockwise(): void {
    setRotation(state.value.rotation - 90)
  }

  async function search(text: string): Promise<SearchResult[]> {
    if (!text) {
      state.value.searchResults = []
      state.value.currentSearchIndex = -1
      return []
    }

    state.value.searchText = text
    const results: SearchResult[] = []
    const lowerText = text.toLowerCase()

    for (const [pageNumber, content] of pageTextContents.value) {
      if (content.toLowerCase().includes(lowerText)) {
        const page = state.value.pages[pageNumber - 1]
        const textContent = await page.getTextContent()
        
        const matchingItems = textContent.items.filter((item: any) =>
          item.str.toLowerCase().includes(lowerText)
        )

        if (matchingItems.length > 0) {
          results.push({
            pageNumber,
            items: matchingItems as pdfjsLib.TextItem[]
          })
        }
      }
    }

    state.value.searchResults = results
    state.value.currentSearchIndex = results.length > 0 ? 0 : -1

    return results
  }

  function goToNextSearchResult(): void {
    if (state.value.searchResults.length === 0) return
    state.value.currentSearchIndex = (state.value.currentSearchIndex + 1) % state.value.searchResults.length
    const result = state.value.searchResults[state.value.currentSearchIndex]
    goToPage(result.pageNumber)
  }

  function goToPrevSearchResult(): void {
    if (state.value.searchResults.length === 0) return
    state.value.currentSearchIndex = state.value.currentSearchIndex === 0 
      ? state.value.searchResults.length - 1 
      : state.value.currentSearchIndex - 1
    const result = state.value.searchResults[state.value.currentSearchIndex]
    goToPage(result.pageNumber)
  }

  function cleanup(): void {
    if (state.value.document) {
      state.value.document.destroy()
      state.value.document = null
    }
    state.value.pages = []
    pageTextContents.value.clear()
  }

  watch(source, () => {
    cleanup()
    loadDocument()
  })

  onUnmounted(cleanup)

  return {
    state,
    canGoPrev,
    canGoNext,
    progress,
    loadDocument,
    renderPage,
    goToPage,
    goPrev,
    goNext,
    setScale,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    setRotation,
    rotateClockwise,
    rotateCounterClockwise,
    search,
    goToNextSearchResult,
    goToPrevSearchResult,
    cleanup
  }
}

export default usePdfViewer
