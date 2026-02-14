<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const language = ref('chi_sim+eng')
const outputFormat = ref('text')
const isProcessing = ref(false)
const progress = ref(0)

const languages = [
  { value: 'chi_sim', label: '简体中文' },
  { value: 'chi_tra', label: '繁体中文' },
  { value: 'eng', label: '英文' },
  { value: 'jpn', label: '日文' },
  { value: 'kor', label: '韩文' },
  { value: 'chi_sim+eng', label: '中英混合' },
]

async function selectFile() {
  const selected = await open({
    multiple: false,
    filters: [
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'Image', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'tiff'] },
    ],
  })
  
  if (selected) {
    inputPath.value = selected as string
    inputName.value = inputPath.value.split(/[/\\]/).pop() || ''
  }
}

async function recognize() {
  if (!inputPath.value) {
    alert('请选择要识别的文件')
    return
  }
  
  const outputPath = await save({
    filters: [
      { name: 'Text', extensions: ['txt'] },
      { name: 'Word', extensions: ['docx'] },
    ],
  })
  
  if (!outputPath) return
  
  isProcessing.value = true
  progress.value = 0
  
  try {
    await invoke('ocr_pdf', {
      inputPath: inputPath.value,
      outputPath,
      language: language.value,
      outputFormat: outputFormat.value,
    })
    alert('识别成功！')
  } catch (error) {
    console.error('OCR failed:', error)
    alert('识别失败：' + error)
  } finally {
    isProcessing.value = false
    progress.value = 100
  }
}
</script>

<template>
  <div class="ocr-tool">
    <div class="tool-header">
      <h1>OCR识别</h1>
      <p>识别扫描PDF或图片中的文字</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="options-section">
        <div class="option-group">
          <label>识别语言</label>
          <select v-model="language" class="input">
            <option v-for="lang in languages" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
        
        <div class="option-group">
          <label>输出格式</label>
          <select v-model="outputFormat" class="input">
            <option value="text">纯文本</option>
            <option value="word">Word文档</option>
            <option value="pdf">可搜索PDF</option>
          </select>
        </div>
      </div>
      
      <div class="info-box">
        <h4>OCR说明</h4>
        <ul>
          <li>支持识别扫描版PDF和图片文件</li>
          <li>首次使用需要下载语言包</li>
          <li>识别效果取决于原文档清晰度</li>
          <li>建议使用300DPI以上的扫描件</li>
        </ul>
      </div>
      
      <div class="actions-section">
        <div class="progress-bar" v-if="isProcessing">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <button
          class="btn btn-primary btn-lg"
          @click="recognize"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '识别中...' : '开始识别' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ocr-tool {
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

.options-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.option-group {
  margin-bottom: 16px;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-group label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.info-box {
  background-color: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
}

.info-box h4 {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
}

.info-box li {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
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

.actions-section {
  text-align: center;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
