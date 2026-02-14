<script setup lang="ts">
import { ref } from 'vue'
import { open } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

interface TaskItem {
  id: string
  path: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
}

const files = ref<TaskItem[]>([])
const operation = ref('convert')
const outputFormat = ref('pdf')
const isProcessing = ref(false)
const currentTaskIndex = ref(-1)

const operations = [
  { value: 'convert', label: '格式转换' },
  { value: 'compress', label: '压缩' },
  { value: 'watermark', label: '添加水印' },
  { value: 'encrypt', label: '加密' },
  { value: 'ocr', label: 'OCR识别' },
]

async function addFiles() {
  const selected = await open({
    multiple: true,
    filters: [
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'Image', extensions: ['png', 'jpg', 'jpeg'] },
      { name: 'Word', extensions: ['docx', 'doc'] },
    ],
  })
  
  if (selected) {
    const paths = Array.isArray(selected) ? selected : [selected]
    for (const path of paths) {
      const name = path.split(/[/\\]/).pop() || path
      files.value.push({
        id: Date.now().toString() + Math.random(),
        path,
        name,
        status: 'pending',
        progress: 0,
      })
    }
  }
}

function removeFile(id: string) {
  files.value = files.value.filter(f => f.id !== id)
}

function clearAll() {
  files.value = []
}

async function startBatch() {
  if (files.value.length === 0) {
    alert('请添加要处理的文件')
    return
  }
  
  isProcessing.value = true
  
  for (let i = 0; i < files.value.length; i++) {
    currentTaskIndex.value = i
    const file = files.value[i]
    file.status = 'processing'
    file.progress = 0
    
    try {
      await invoke('batch_process', {
        inputPath: file.path,
        operation: operation.value,
        outputFormat: outputFormat.value,
        onProgress: (progress: number) => {
          file.progress = progress
        },
      })
      file.status = 'completed'
      file.progress = 100
    } catch (error) {
      file.status = 'error'
      console.error('Batch task failed:', error)
    }
  }
  
  isProcessing.value = false
  currentTaskIndex.value = -1
  alert('批量处理完成！')
}
</script>

<template>
  <div class="batch-tool">
    <div class="tool-header">
      <h1>批量处理</h1>
      <p>一次性处理多个文件</p>
    </div>
    
    <div class="tool-content">
      <div class="file-section">
        <div class="section-header">
          <h3>文件列表 ({{ files.length }} 个文件)</h3>
          <div class="section-actions">
            <button class="btn btn-primary" @click="addFiles">添加文件</button>
            <button class="btn btn-secondary" @click="clearAll" :disabled="files.length === 0">清空</button>
          </div>
        </div>
        
        <div class="file-list" v-if="files.length > 0">
          <div
            v-for="(file, index) in files"
            :key="file.id"
            class="file-item"
            :class="{ processing: file.status === 'processing' }"
          >
            <span class="file-index">{{ index + 1 }}</span>
            <span class="file-name">{{ file.name }}</span>
            <div class="file-status">
              <span v-if="file.status === 'pending'" class="status-pending">等待中</span>
              <span v-else-if="file.status === 'processing'" class="status-processing">
                <span class="spinner"></span>
                处理中 {{ file.progress }}%
              </span>
              <span v-else-if="file.status === 'completed'" class="status-completed">✓ 完成</span>
              <span v-else class="status-error">✗ 失败</span>
            </div>
            <button
              class="btn-icon"
              @click="removeFile(file.id)"
              :disabled="isProcessing"
            >
              ×
            </button>
          </div>
        </div>
        
        <div class="empty-list" v-else>
          <p>点击"添加文件"按钮选择要处理的文件</p>
        </div>
      </div>
      
      <div class="options-section">
        <h3>处理选项</h3>
        <div class="option-row">
          <div class="option-group">
            <label>操作类型</label>
            <select v-model="operation" class="input">
              <option v-for="op in operations" :key="op.value" :value="op.value">
                {{ op.label }}
              </option>
            </select>
          </div>
          <div class="option-group">
            <label>输出格式</label>
            <select v-model="outputFormat" class="input">
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
              <option value="image">图片</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary btn-lg"
          @click="startBatch"
          :disabled="files.length === 0 || isProcessing"
        >
          {{ isProcessing ? `处理中 (${currentTaskIndex + 1}/${files.length})` : '开始批量处理' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.batch-tool {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 32px;
}

.tool-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.tool-header p {
  color: var(--text-secondary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 500;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.file-list {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  max-height: 400px;
  overflow: auto;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.file-item:last-child {
  border-bottom: none;
}

.file-item.processing {
  background-color: rgba(59, 130, 246, 0.05);
}

.file-index {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-right: 12px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.file-status {
  margin-right: 12px;
  font-size: 13px;
}

.status-pending {
  color: var(--text-tertiary);
}

.status-processing {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-completed {
  color: var(--success-color);
}

.status-error {
  color: var(--danger-color);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--primary-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 18px;
  color: var(--text-tertiary);
  cursor: pointer;
}

.btn-icon:hover {
  color: var(--danger-color);
}

.empty-list {
  padding: 48px;
  text-align: center;
  background-color: var(--bg-primary);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-tertiary);
}

.options-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin: 24px 0;
}

.options-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.option-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.option-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.actions-section {
  text-align: center;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
