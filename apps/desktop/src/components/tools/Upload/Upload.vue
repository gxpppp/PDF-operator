<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  accept?: string
  multiple?: boolean
  limit?: number
  disabled?: boolean
  listType?: 'text' | 'picture'
  fileList?: Array<{ id: string; name: string; size: number; status: string }>
}>()

const emit = defineEmits<{
  change: [files: File[]]
  remove: [file: any]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const localFiles = ref<Array<{ id: string; name: string; size: number; file: File }>>([])

function handleClick() {
  if (!props.disabled) {
    inputRef.value?.click()
  }
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
  target.value = ''
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  addFiles(files)
}

function addFiles(files: File[]) {
  for (const file of files) {
    if (props.limit && localFiles.value.length >= props.limit) break
    
    localFiles.value.push({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      file
    })
  }
  
  emit('change', localFiles.value.map(f => f.file))
}

function removeFile(id: string) {
  const index = localFiles.value.findIndex(f => f.id === id)
  if (index > -1) {
    const removed = localFiles.value.splice(index, 1)[0]
    emit('remove', removed)
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="upload">
    <div
      class="upload-trigger"
      :class="{ disabled, 'drag-over': dragOver }"
      @click="handleClick"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop="handleDrop"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="upload-input"
        @change="handleChange"
      />
      <slot>
        <div class="default-trigger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <span>点击或拖拽上传</span>
        </div>
      </slot>
    </div>
    
    <div v-if="localFiles.length > 0" class="upload-list">
      <div
        v-for="file in localFiles"
        :key="file.id"
        class="upload-item"
      >
        <div class="file-info">
          <span class="file-icon">📄</span>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
        </div>
        <button class="remove-btn" @click="removeFile(file.id)">×</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload {
  display: inline-block;
}

.upload-trigger {
  display: inline-block;
  padding: 16px;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-trigger:hover {
  border-color: var(--primary-color);
}

.upload-trigger.drag-over {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.upload-trigger.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-input {
  display: none;
}

.default-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.default-trigger svg {
  width: 32px;
  height: 32px;
  color: var(--primary-color);
}

.upload-list {
  margin-top: 12px;
}

.upload-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-size: 16px;
}

.file-name {
  font-size: 13px;
  color: var(--text-primary);
}

.file-size {
  font-size: 12px;
  color: var(--text-tertiary);
}

.remove-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 16px;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 50%;
}

.remove-btn:hover {
  background-color: var(--bg-primary);
  color: var(--danger-color);
}
</style>
