<script setup lang="ts">
import { computed } from 'vue'
import { usePdfStore } from '@/stores/pdf'

const pdfStore = usePdfStore()

const properties = computed(() => {
  const meta = pdfStore.metadata
  if (!meta) return null
  
  return [
    { label: '文件名', value: pdfStore.filePath?.split(/[/\\]/).pop() || '-' },
    { label: '标题', value: meta.title || '-' },
    { label: '作者', value: meta.author || '-' },
    { label: '主题', value: meta.subject || '-' },
    { label: '关键词', value: meta.keywords || '-' },
    { label: '创建者', value: meta.creator || '-' },
    { label: '生成器', value: meta.producer || '-' },
    { label: '创建日期', value: formatDate(meta.creationDate) },
    { label: '修改日期', value: formatDate(meta.modificationDate) },
    { label: '页数', value: `${meta.pageCount} 页` },
    { label: '文件大小', value: formatSize(meta.fileSize) },
  ]
})

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('zh-CN')
  } catch {
    return dateStr
  }
}

function formatSize(bytes: number): string {
  if (!bytes) return '-'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="properties-panel">
    <h4>文档属性</h4>
    
    <div v-if="properties" class="properties-list">
      <div
        v-for="prop in properties"
        :key="prop.label"
        class="property-item"
      >
        <span class="property-label">{{ prop.label }}</span>
        <span class="property-value">{{ prop.value }}</span>
      </div>
    </div>
    
    <div v-else class="empty-state">
      请先打开PDF文件
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  padding: 16px;
}

.properties-panel h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.properties-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.property-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.property-value {
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
