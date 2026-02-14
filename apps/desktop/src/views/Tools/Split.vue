<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const splitMode = ref<'all' | 'range' | 'pages' | 'size'>('all')
const pageRanges = ref('')
const pagesPerPage = ref(1)
const isProcessing = ref(false)

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

async function splitFile() {
  if (!inputPath.value) {
    alert('请选择要拆分的PDF文件')
    return
  }
  
  const outputDir = await save({
    directory: true,
  })
  
  if (!outputDir) return
  
  isProcessing.value = true
  
  try {
    await invoke('split_pdf', {
      inputPath: inputPath.value,
      outputDir,
      mode: splitMode.value,
      pageRanges: pageRanges.value,
      pagesPerPage: pagesPerPage.value,
    })
    alert('拆分成功！')
  } catch (error) {
    console.error('Split failed:', error)
    alert('拆分失败：' + error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="split-tool">
    <div class="tool-header">
      <h1>拆分PDF</h1>
      <p>将PDF文件拆分为多个文件</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择PDF文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="mode-section">
        <h3>拆分方式</h3>
        <div class="mode-options">
          <label class="mode-option">
            <input type="radio" v-model="splitMode" value="all" />
            <span class="mode-label">每页一个文件</span>
          </label>
          <label class="mode-option">
            <input type="radio" v-model="splitMode" value="range" />
            <span class="mode-label">按范围拆分</span>
          </label>
          <label class="mode-option">
            <input type="radio" v-model="splitMode" value="pages" />
            <span class="mode-label">按页数拆分</span>
          </label>
        </div>
        
        <div v-if="splitMode === 'range'" class="mode-config">
          <label>页码范围（如：1-3, 5, 7-10）</label>
          <input type="text" v-model="pageRanges" class="input" placeholder="1-3, 5, 7-10" />
        </div>
        
        <div v-if="splitMode === 'pages'" class="mode-config">
          <label>每个文件的页数</label>
          <input type="number" v-model="pagesPerPage" class="input" min="1" />
        </div>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary btn-lg"
          @click="splitFile"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '处理中...' : '开始拆分' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.split-tool {
  padding: 24px;
  max-width: 600px;
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

.mode-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 32px;
}

.mode-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.mode-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.mode-label {
  font-size: 14px;
  color: var(--text-primary);
}

.mode-config {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.mode-config label {
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
