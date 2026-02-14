<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFilePicker } from '@/composables/useFilePicker'
import { usePdfStore } from '@/stores/pdf'

const router = useRouter()
const { pickFile } = useFilePicker()
const pdfStore = usePdfStore()
const isDragging = ref(false)

const quickActions = [
  { title: '合并PDF', description: '将多个PDF文件合并为一个', icon: 'merge', path: '/tools/merge' },
  { title: '拆分PDF', description: '将PDF拆分为多个文件', icon: 'split', path: '/tools/split' },
  { title: '格式转换', description: 'PDF与Word、图片等格式互转', icon: 'convert', path: '/tools/convert' },
  { title: '压缩PDF', description: '减小PDF文件大小', icon: 'compress', path: '/tools/compress' },
  { title: 'OCR识别', description: '识别扫描PDF中的文字', icon: 'ocr', path: '/tools/ocr' },
  { title: '添加水印', description: '为PDF添加文字或图片水印', icon: 'watermark', path: '/tools/watermark' },
]

async function openFile() {
  try {
    const result = await pickFile({
      multiple: false,
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })
    if (result) {
      if (result.file) {
        pdfStore.setFile(result.file, result.name)
        router.push({ path: '/editor', query: { mode: 'web' } })
      } else {
        pdfStore.setFile(null, result.path)
        router.push({ path: '/editor', query: { file: result.path } })
      }
    }
  } catch (error) {
    console.error('Failed to open file:', error)
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.name.endsWith('.pdf')) {
      pdfStore.setFile(file, file.name)
      router.push({ path: '/editor', query: { mode: 'web' } })
    }
  }
}
</script>

<template>
  <div class="home-page">
    <div class="welcome-section">
      <h1 class="title">欢迎使用 PDF Master</h1>
      <p class="subtitle">企业级PDF处理软件，功能强大，操作简便</p>
    </div>
    
    <div
      class="drop-zone"
      :class="{ active: isDragging }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="openFile"
    >
      <div class="drop-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>
      <p class="drop-text">拖拽PDF文件到此处，或点击选择文件</p>
      <p class="drop-hint">支持 PDF、图片、Word、Excel 等格式</p>
    </div>
    
    <div class="quick-actions">
      <h2 class="section-title">快速操作</h2>
      <div class="action-grid">
        <div
          v-for="action in quickActions"
          :key="action.path"
          class="action-card"
          @click="router.push(action.path)"
        >
          <div class="action-icon">{{ action.icon }}</div>
          <div class="action-content">
            <h3 class="action-title">{{ action.title }}</h3>
            <p class="action-desc">{{ action.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  background-color: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 48px;
}

.drop-zone:hover,
.drop-zone.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.drop-icon {
  width: 64px;
  height: 64px;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.drop-icon svg {
  width: 100%;
  height: 100%;
}

.drop-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.drop-hint {
  font-size: 13px;
  color: var(--text-tertiary);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.action-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: var(--radius-md);
  color: var(--primary-color);
  font-size: 18px;
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.action-desc {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
