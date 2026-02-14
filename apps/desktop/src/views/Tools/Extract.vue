<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const extractType = ref<'text' | 'images' | 'tables'>('text')
const isProcessing = ref(false)
const extractedContent = ref('')

async function selectFile() {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })
  
  if (selected) {
    inputPath.value = selected as string
    inputName.value = inputPath.value.split(/[/\\]/).pop() || ''
  }
}

async function extract() {
  if (!inputPath.value) {
    alert('请选择PDF文件')
    return
  }
  
  isProcessing.value = true
  
  try {
    const result = await invoke('extract_content', {
      inputPath: inputPath.value,
      extractType: extractType.value,
    })
    extractedContent.value = result as string
  } catch (error) {
    console.error('Extract failed:', error)
    alert('提取失败：' + error)
  } finally {
    isProcessing.value = false
  }
}

async function saveResult() {
  const outputPath = await save({
    filters: [
      { name: 'Text', extensions: ['txt'] },
      { name: 'JSON', extensions: ['json'] },
    ],
  })
  
  if (outputPath) {
    await invoke('write_file', { path: outputPath, content: extractedContent.value })
    alert('保存成功！')
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(extractedContent.value)
  alert('已复制到剪贴板')
}
</script>

<template>
  <div class="extract-tool">
    <div class="tool-header">
      <h1>内容提取</h1>
      <p>从PDF中提取文本、图片或表格</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择PDF文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="type-section">
        <label class="type-option" :class="{ active: extractType === 'text' }">
          <input type="radio" v-model="extractType" value="text" />
          <div class="type-icon">T</div>
          <span>提取文本</span>
        </label>
        <label class="type-option" :class="{ active: extractType === 'images' }">
          <input type="radio" v-model="extractType" value="images" />
          <div class="type-icon">🖼</div>
          <span>提取图片</span>
        </label>
        <label class="type-option" :class="{ active: extractType === 'tables' }">
          <input type="radio" v-model="extractType" value="tables" />
          <div class="type-icon">📊</div>
          <span>提取表格</span>
        </label>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary"
          @click="extract"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '提取中...' : '开始提取' }}
        </button>
      </div>
      
      <div v-if="extractedContent" class="result-section">
        <div class="result-header">
          <h3>提取结果</h3>
          <div class="result-actions">
            <button class="btn btn-secondary" @click="copyToClipboard">复制</button>
            <button class="btn btn-secondary" @click="saveResult">保存</button>
          </div>
        </div>
        <div class="result-content">
          <pre>{{ extractedContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.extract-tool {
  padding: 24px;
  max-width: 700px;
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

.file-select {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.selected-file {
  padding: 8px 16px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-primary);
}

.type-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-option:hover {
  border-color: var(--primary-color);
}

.type-option.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.type-option input {
  display: none;
}

.type-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.type-option span {
  font-size: 14px;
  color: var(--text-primary);
}

.actions-section {
  text-align: center;
  margin-bottom: 24px;
}

.result-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.result-header h3 {
  font-size: 14px;
  font-weight: 500;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.result-content {
  padding: 16px;
  max-height: 400px;
  overflow: auto;
}

.result-content pre {
  margin: 0;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
