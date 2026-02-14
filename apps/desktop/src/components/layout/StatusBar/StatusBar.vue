<script setup lang="ts">
import { usePdfStore } from '@/stores/pdf'
import { computed } from 'vue'

const pdfStore = usePdfStore()

const statusText = computed(() => {
  if (pdfStore.isLoaded) {
    return `已加载: ${pdfStore.metadata?.title || '未命名'} | ${pdfStore.pageCount} 页 | ${formatFileSize(pdfStore.metadata?.fileSize || 0)}`
  }
  return '就绪'
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <footer class="status-bar">
    <div class="status-left">
      <span class="status-text">{{ statusText }}</span>
    </div>
    <div class="status-right">
      <span v-if="pdfStore.isLoaded" class="status-item">
        缩放: {{ Math.round(pdfStore.zoom * 100) }}%
      </span>
      <span v-if="pdfStore.isLoaded" class="status-item">
        第 {{ pdfStore.currentPage }} 页 / 共 {{ pdfStore.pageCount }} 页
      </span>
    </div>
  </footer>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  padding: 0 12px;
  background-color: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-tertiary);
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
