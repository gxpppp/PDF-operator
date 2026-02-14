import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type EditorTool = 'select' | 'text' | 'image' | 'shape' | 'draw' | 'eraser' | 'highlight' | 'comment'
export type EditorMode = 'view' | 'edit' | 'annotate' | 'sign' | 'form'

export interface EditorState {
  mode: EditorMode
  tool: EditorTool
  zoom: number
  rotation: number
  currentPage: number
  totalPages: number
  viewMode: 'single' | 'continuous' | 'two-page'
  showThumbnails: boolean
  showOutline: boolean
  showAnnotations: boolean
  showSearch: boolean
  searchText: string
  searchResults: number[]
  currentSearchIndex: number
}

export interface Selection {
  type: 'text' | 'image' | 'annotation' | 'form-field'
  pageNumber: number
  bbox: [number, number, number, number]
  content?: string
}

export const useEditorStore = defineStore('editor', () => {
  const state = ref<EditorState>({
    mode: 'view',
    tool: 'select',
    zoom: 1,
    rotation: 0,
    currentPage: 1,
    totalPages: 0,
    viewMode: 'continuous',
    showThumbnails: true,
    showOutline: false,
    showAnnotations: false,
    showSearch: false,
    searchText: '',
    searchResults: [],
    currentSearchIndex: -1
  })

  const selection = ref<Selection | null>(null)
  const isDirty = ref(false)
  const canUndo = ref(false)
  const canRedo = ref(false)

  const isEditing = computed(() => state.value.mode === 'edit')
  const isAnnotating = computed(() => state.value.mode === 'annotate')
  const hasSelection = computed(() => !!selection.value)
  const searchResultCount = computed(() => state.value.searchResults.length)

  function setMode(mode: EditorMode): void {
    state.value.mode = mode
  }

  function setTool(tool: EditorTool): void {
    state.value.tool = tool
  }

  function setZoom(zoom: number): void {
    state.value.zoom = Math.max(0.1, Math.min(5, zoom))
  }

  function zoomIn(delta: number = 0.1): void {
    setZoom(state.value.zoom + delta)
  }

  function zoomOut(delta: number = 0.1): void {
    setZoom(state.value.zoom - delta)
  }

  function fitToWidth(): void {
    state.value.zoom = 0
  }

  function fitToPage(): void {
    state.value.zoom = -1
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

  function setCurrentPage(page: number): void {
    if (page >= 1 && page <= state.value.totalPages) {
      state.value.currentPage = page
    }
  }

  function setTotalPages(total: number): void {
    state.value.totalPages = total
    if (state.value.currentPage > total) {
      state.value.currentPage = Math.max(1, total)
    }
  }

  function nextPage(): void {
    if (state.value.currentPage < state.value.totalPages) {
      state.value.currentPage++
    }
  }

  function prevPage(): void {
    if (state.value.currentPage > 1) {
      state.value.currentPage--
    }
  }

  function goToFirstPage(): void {
    state.value.currentPage = 1
  }

  function goToLastPage(): void {
    state.value.currentPage = state.value.totalPages
  }

  function setViewMode(mode: 'single' | 'continuous' | 'two-page'): void {
    state.value.viewMode = mode
  }

  function toggleThumbnails(): void {
    state.value.showThumbnails = !state.value.showThumbnails
  }

  function toggleOutline(): void {
    state.value.showOutline = !state.value.showOutline
  }

  function toggleAnnotations(): void {
    state.value.showAnnotations = !state.value.showAnnotations
  }

  function toggleSearch(): void {
    state.value.showSearch = !state.value.showSearch
    if (!state.value.showSearch) {
      state.value.searchText = ''
      state.value.searchResults = []
      state.value.currentSearchIndex = -1
    }
  }

  function setSearchResults(results: number[], text: string): void {
    state.value.searchText = text
    state.value.searchResults = results
    state.value.currentSearchIndex = results.length > 0 ? 0 : -1
  }

  function nextSearchResult(): void {
    if (state.value.searchResults.length > 0) {
      state.value.currentSearchIndex = (state.value.currentSearchIndex + 1) % state.value.searchResults.length
      state.value.currentPage = state.value.searchResults[state.value.currentSearchIndex]
    }
  }

  function prevSearchResult(): void {
    if (state.value.searchResults.length > 0) {
      state.value.currentSearchIndex = state.value.currentSearchIndex === 0 
        ? state.value.searchResults.length - 1 
        : state.value.currentSearchIndex - 1
      state.value.currentPage = state.value.searchResults[state.value.currentSearchIndex]
    }
  }

  function setSelection(newSelection: Selection | null): void {
    selection.value = newSelection
  }

  function clearSelection(): void {
    selection.value = null
  }

  function markDirty(): void {
    isDirty.value = true
  }

  function markClean(): void {
    isDirty.value = false
  }

  function reset(): void {
    state.value = {
      mode: 'view',
      tool: 'select',
      zoom: 1,
      rotation: 0,
      currentPage: 1,
      totalPages: 0,
      viewMode: 'continuous',
      showThumbnails: true,
      showOutline: false,
      showAnnotations: false,
      showSearch: false,
      searchText: '',
      searchResults: [],
      currentSearchIndex: -1
    }
    selection.value = null
    isDirty.value = false
  }

  return {
    state,
    selection,
    isDirty,
    canUndo,
    canRedo,
    isEditing,
    isAnnotating,
    hasSelection,
    searchResultCount,
    setMode,
    setTool,
    setZoom,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    setRotation,
    rotateClockwise,
    rotateCounterClockwise,
    setCurrentPage,
    setTotalPages,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setViewMode,
    toggleThumbnails,
    toggleOutline,
    toggleAnnotations,
    toggleSearch,
    setSearchResults,
    nextSearchResult,
    prevSearchResult,
    setSelection,
    clearSelection,
    markDirty,
    markClean,
    reset
  }
})

export default useEditorStore
