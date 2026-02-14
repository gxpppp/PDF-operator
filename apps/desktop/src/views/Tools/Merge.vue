<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

interface FileItem {
  id: string
  path: string
  name: string
  pageCount: number
}

const files = ref<FileItem[]>([])
const isProcessing = ref(false)
const progress = ref(0)

async function addFiles() {
  const selected = await open({
    multiple: true,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })
  
  if (selected) {
    const paths = Array.isArray(selected) ? selected : [selected]
    for (const path of paths) {
      const name = path.split(/[/\\]/).pop() || path
      files.value.push({
        id: Date.now().toString() + Math.random(),
        path,
        name,
        pageCount: 0,
      })
    }
  }
}

function removeFile(id: string) {
  files.value = files.value.filter(f => f.id !== id)
}

function moveUp(index: number) {
  if (index > 0) {
    const temp = files.value[index]
    files.value[index] = files.value[index - 1]
    files.value[index - 1] = temp
  }
}

function moveDown(index: number) {
  if (index < files.value.length - 1) {
    const temp = files.value[index]
    files.value[index] = files.value[index + 1]
    files.value[index + 1] = temp
  }
}

async function mergeFiles() {
  if (files.value.length < 2) {
    alert('请至少添加两个PDF文件')
    return
  }
  
  const outputPath = await save({
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    defaultPath: 'merged.pdf',
  })
  
  if (!outputPath) return
  
  isProcessing.value = true
  progress.value = 0
  
  try {
    await invoke('merge_pdfs', {
      inputPaths: files.value.map(f => f.path),
      outputPath,
    })
    alert('合并成功！')
  } catch (error) {
    console.error('Merge failed:', error)
    alert('合并失败：' + error)
  } finally {
    isProcessing.value = false
    progress.value = 100
  }
}
</script>

<template>
  <div class="merge-tool">
    <div class="tool-header">
      <h1>合并PDF</h1>
      <p>将多个PDF文件合并为一个文件</p>
    </div>
    
    <div class="tool-content">
      <div class="file-list-section">
        <div class="section-header">
          <h3>文件列表</h3>
          <button class="btn btn-primary" @click="addFiles">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加文件
          </button>
        </div>
        
        <div class="file-list" v-if="files.length > 0">
          <div
            v-for="(file, index) in files"
            :key="file.id"
            class="file-item"
          >
            <span class="file-index">{{ index + 1 }}</span>
            <span class="file-name">{{ file.name }}</span>
            <div class="file-actions">
              <button class="btn-icon" @click="moveUp(index)" :disabled="index === 0" title="上移">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </button>
              <button class="btn-icon" @click="moveDown(index)" :disabled="index === files.length - 1" title="下移">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <button class="btn-icon danger" @click="removeFile(file.id)" title="删除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="empty-list" v-else>
          <p>点击"添加文件"按钮选择要合并的PDF文件</p>
        </div>
      </div>
      
      <div class="options-section">
        <h3>选项</h3>
        <div class="option-item">
          <label>
            <input type="checkbox" checked />
            保留原始页面顺序
          </label>
        </div>
        <div class="option-item">
          <label>
            <input type="checkbox" />
            添加书签
          </label>
        </div>
      </div>
      
      <div class="actions-section">
        <div class="progress-bar" v-if="isProcessing">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <button
          class="btn btn-primary btn-lg"
          @click="mergeFiles"
          :disabled="files.length < 2 || isProcessing"
        >
          {{ isProcessing ? '处理中...' : '开始合并' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merge-tool {
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
  color: var(--text-primary);
}

.file-list {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
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

.file-actions {
  display: flex;
  gap: 4px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
}

.btn-icon:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-icon.danger:hover {
  color: var(--danger-color);
}

.btn-icon svg {
  width: 16px;
  height: 16px;
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
  margin-top: 24px;
  padding: 16px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.options-section h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.option-item {
  margin-bottom: 8px;
}

.option-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.actions-section {
  margin-top: 32px;
  text-align: center;
}

.progress-bar {
  height: 4px;
  background-color: var(--bg-tertiary);
  border-radius: 2px;
  margin-bottom: 16px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
