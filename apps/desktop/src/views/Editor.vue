<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePdfStore } from '@/stores/pdf'
import PdfViewer from '@/components/pdf/Viewer/PdfViewer.vue'
import ThumbnailPanel from '@/components/pdf/Thumbnail/ThumbnailPanel.vue'
import OutlinePanel from '@/components/pdf/Outline/OutlinePanel.vue'

const route = useRoute()
const pdfStore = usePdfStore()

const activePanel = ref<'thumbnail' | 'outline'>('thumbnail')
const showRightPanel = ref(true)

const hasFile = computed(() => pdfStore.file !== null || pdfStore.filePath !== null)

onMounted(async () => {
  if (hasFile.value) {
    await initPdf()
  } else {
    const filePath = route.query.file as string
    if (filePath) {
      pdfStore.setFile(null, filePath)
      await initPdf()
    }
  }
})

watch(() => route.query.file, async (newFile) => {
  if (newFile && !pdfStore.file) {
    pdfStore.setFile(null, newFile as string)
    await initPdf()
  }
})

watch(hasFile, async (hasFile) => {
  if (hasFile && pdfStore.pages.length === 0) {
    await initPdf()
  }
})

async function initPdf() {
  if (pdfStore.file) {
    await loadPdfFromFile(pdfStore.file)
  } else if (pdfStore.filePath) {
    await loadPdfFromPath(pdfStore.filePath)
  }
}

async function loadPdfFromFile(file: File) {
  try {
    pdfStore.isLoading = true
    pdfStore.error = null
    
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
    
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
    
    const pages = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 1 })
      pages.push({
        number: i,
        width: viewport.width,
        height: viewport.height,
        rotation: viewport.rotation
      })
    }
    
    pdfStore.setPages(pages)
    pdfStore.setMetadata({
      title: file.name,
      pageCount: pdf.numPages,
      fileSize: file.size
    })
    
    pdfStore.isLoading = false
  } catch (error) {
    console.error('Failed to load PDF:', error)
    pdfStore.error = (error as Error).message
    pdfStore.isLoading = false
  }
}

async function loadPdfFromPath(filePath: string) {
  try {
    pdfStore.isLoading = true
    pdfStore.error = null
    console.log('Loading PDF from path:', filePath)
    pdfStore.isLoading = false
  } catch (error) {
    console.error('Failed to load PDF:', error)
    pdfStore.error = (error as Error).message
    pdfStore.isLoading = false
  }
}
</script>

<template>
  <div class="editor-page">
    <div class="left-panel" v-if="pdfStore.isLoaded">
      <div class="panel-tabs">
        <button
          class="panel-tab"
          :class="{ active: activePanel === 'thumbnail' }"
          @click="activePanel = 'thumbnail'"
        >
          缩略图
        </button>
        <button
          class="panel-tab"
          :class="{ active: activePanel === 'outline' }"
          @click="activePanel = 'outline'"
        >
          大纲
        </button>
      </div>
      <div class="panel-content">
        <ThumbnailPanel v-if="activePanel === 'thumbnail'" />
        <OutlinePanel v-else />
      </div>
    </div>
    
    <div class="main-content">
      <div v-if="pdfStore.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在加载PDF...</p>
      </div>
      <div v-else-if="pdfStore.error" class="error-state">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="error-text">加载失败</p>
        <p class="error-detail">{{ pdfStore.error }}</p>
      </div>
      <PdfViewer v-else-if="pdfStore.isLoaded" />
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <p class="empty-text">请打开一个PDF文件</p>
        <p class="empty-hint">点击左上角"打开文件"按钮或拖拽文件到此处</p>
      </div>
    </div>
    
    <div class="right-panel" v-if="showRightPanel && pdfStore.isLoaded">
      <div class="panel-header">
        <span>属性</span>
        <button class="btn-close" @click="showRightPanel = false">×</button>
      </div>
      <div class="panel-content">
        <div class="property-group">
          <h4>文档信息</h4>
          <div class="property-item">
            <span class="property-label">标题</span>
            <span class="property-value">{{ pdfStore.metadata?.title || '未设置' }}</span>
          </div>
          <div class="property-item">
            <span class="property-label">作者</span>
            <span class="property-value">{{ pdfStore.metadata?.author || '未知' }}</span>
          </div>
          <div class="property-item">
            <span class="property-label">页数</span>
            <span class="property-value">{{ pdfStore.pageCount }}</span>
          </div>
          <div class="property-item">
            <span class="property-label">文件大小</span>
            <span class="property-value">{{ Math.round((pdfStore.metadata?.fileSize || 0) / 1024) }} KB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  display: flex;
  height: 100%;
  background-color: var(--bg-secondary);
}

.left-panel {
  width: 200px;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.panel-tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.panel-tab:hover {
  color: var(--text-primary);
}

.panel-tab.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.panel-content {
  flex: 1;
  overflow: auto;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.right-panel {
  width: 280px;
  background-color: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

.btn-close {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  font-size: 18px;
  color: var(--text-tertiary);
  cursor: pointer;
}

.btn-close:hover {
  color: var(--text-primary);
}

.empty-state,
.loading-state,
.error-state {
  text-align: center;
  padding: 48px;
}

.empty-icon,
.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: var(--text-tertiary);
}

.empty-icon svg,
.error-icon svg {
  width: 100%;
  height: 100%;
}

.error-icon {
  color: var(--error-color);
}

.empty-text,
.loading-text,
.error-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.error-text {
  color: var(--error-color);
}

.empty-hint,
.error-detail {
  font-size: 14px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.property-group {
  padding: 16px;
}

.property-group h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.property-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.property-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.property-value {
  font-size: 13px;
  color: var(--text-primary);
}
</style>
