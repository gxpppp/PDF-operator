<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { usePdfStore } from '@/stores/pdf'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

const pdfStore = usePdfStore()
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())
const pdfDoc = ref<pdfjsLib.PDFDocumentProxy | null>(null)
const rendering = ref<Set<number>>(new Set())

const visiblePages = computed(() => {
  const start = Math.max(1, pdfStore.currentPage - 2)
  const end = Math.min(pdfStore.pageCount, pdfStore.currentPage + 5)
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

onMounted(async () => {
  if (pdfStore.filePath) {
    await loadPdf(pdfStore.filePath)
  }
})

watch(() => pdfStore.filePath, async (newPath) => {
  if (newPath) {
    await loadPdf(newPath)
  }
})

watch(() => pdfStore.zoom, () => {
  visiblePages.value.forEach(page => renderPage(page))
})

watch(() => pdfStore.rotation, () => {
  visiblePages.value.forEach(page => renderPage(page))
})

async function loadPdf(filePath: string) {
  try {
    const loadingTask = pdfjsLib.getDocument(filePath)
    pdfDoc.value = await loadingTask.promise
    
    const pages: any[] = []
    for (let i = 1; i <= pdfDoc.value.numPages; i++) {
      const page = await pdfDoc.value.getPage(i)
      pages.push({
        number: i,
        width: page.view[2],
        height: page.view[3],
        rotation: page.rotate,
      })
    }
    
    pdfStore.setPages(pages)
    pdfStore.setMetadata({
      pageCount: pdfDoc.value.numPages,
      fileSize: 0,
    })
    
    await renderPage(1)
  } catch (error) {
    console.error('Failed to load PDF:', error)
  }
}

async function renderPage(pageNumber: number) {
  if (!pdfDoc.value || rendering.value.has(pageNumber)) return
  
  const canvas = canvasRefs.value.get(pageNumber)
  if (!canvas) return
  
  rendering.value.add(pageNumber)
  
  try {
    const page = await pdfDoc.value.getPage(pageNumber)
    const viewport = page.getViewport({
      scale: pdfStore.zoom,
      rotation: pdfStore.rotation + page.rotate,
    })
    
    canvas.width = viewport.width
    canvas.height = viewport.height
    
    const context = canvas.getContext('2d')
    if (context) {
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise
    }
  } catch (error) {
    console.error(`Failed to render page ${pageNumber}:`, error)
  } finally {
    rendering.value.delete(pageNumber)
  }
}

function setCanvasRef(pageNumber: number, el: any) {
  if (el) {
    canvasRefs.value.set(pageNumber, el)
    renderPage(pageNumber)
  }
}

function scrollToPage(pageNumber: number) {
  pdfStore.setCurrentPage(pageNumber)
}
</script>

<template>
  <div ref="containerRef" class="pdf-viewer">
    <div class="pages-container">
      <div
        v-for="pageNumber in visiblePages"
        :key="pageNumber"
        class="page-wrapper"
        :class="{ active: pageNumber === pdfStore.currentPage }"
        @click="scrollToPage(pageNumber)"
      >
        <canvas
          :ref="(el: any) => setCanvasRef(pageNumber, el)"
          class="page-canvas"
        />
        <div class="page-number">{{ pageNumber }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #525659;
}

.pages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 16px;
}

.page-wrapper {
  position: relative;
  background-color: white;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.page-wrapper:hover {
  transform: scale(1.01);
}

.page-wrapper.active {
  outline: 3px solid var(--primary-color);
}

.page-canvas {
  display: block;
}

.page-number {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
