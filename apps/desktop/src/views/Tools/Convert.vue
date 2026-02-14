<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const outputFormat = ref('word')
const quality = ref('high')
const isProcessing = ref(false)

const formats = [
  { value: 'word', label: 'Word文档', ext: '.docx' },
  { value: 'excel', label: 'Excel表格', ext: '.xlsx' },
  { value: 'ppt', label: 'PowerPoint', ext: '.pptx' },
  { value: 'image', label: '图片', ext: '.png' },
  { value: 'html', label: 'HTML网页', ext: '.html' },
  { value: 'txt', label: '纯文本', ext: '.txt' },
]

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

async function convert() {
  if (!inputPath.value) {
    alert('请选择要转换的PDF文件')
    return
  }
  
  const format = formats.find(f => f.value === outputFormat.value)
  const outputPath = await save({
    filters: [{ name: format?.label || '', extensions: [format?.ext?.replace('.', '') || ''] }],
  })
  
  if (!outputPath) return
  
  isProcessing.value = true
  
  try {
    await invoke('convert_pdf', {
      inputPath: inputPath.value,
      outputPath,
      format: outputFormat.value,
      quality,
    })
    alert('转换成功！')
  } catch (error) {
    console.error('Convert failed:', error)
    alert('转换失败：' + error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="convert-tool">
    <div class="tool-header">
      <h1>格式转换</h1>
      <p>将PDF转换为其他格式，或将其他格式转换为PDF</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="format-section">
        <h3>输出格式</h3>
        <div class="format-grid">
          <label
            v-for="format in formats"
            :key="format.value"
            class="format-option"
            :class="{ active: outputFormat === format.value }"
          >
            <input type="radio" v-model="outputFormat" :value="format.value" />
            <span class="format-icon">{{ format.ext }}</span>
            <span class="format-label">{{ format.label }}</span>
          </label>
        </div>
      </div>
      
      <div class="quality-section">
        <h3>输出质量</h3>
        <div class="quality-options">
          <label class="quality-option">
            <input type="radio" v-model="quality" value="low" />
            <span>低（文件小）</span>
          </label>
          <label class="quality-option">
            <input type="radio" v-model="quality" value="medium" />
            <span>中等</span>
          </label>
          <label class="quality-option">
            <input type="radio" v-model="quality" value="high" />
            <span>高（质量好）</span>
          </label>
        </div>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary btn-lg"
          @click="convert"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '转换中...' : '开始转换' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.convert-tool {
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

.format-section,
.quality-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.format-section h3,
.quality-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.format-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-option:hover {
  border-color: var(--primary-color);
}

.format-option.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.format-option input {
  display: none;
}

.format-icon {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.format-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.quality-options {
  display: flex;
  gap: 24px;
}

.quality-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.quality-option span {
  font-size: 14px;
  color: var(--text-primary);
}

.actions-section {
  text-align: center;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
