<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const compressionLevel = ref('medium')
const isProcessing = ref(false)
const originalSize = ref(0)
const compressedSize = ref(0)

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

async function compress() {
  if (!inputPath.value) {
    alert('请选择要压缩的PDF文件')
    return
  }
  
  const outputPath = await save({
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    defaultPath: inputName.value.replace('.pdf', '_compressed.pdf'),
  })
  
  if (!outputPath) return
  
  isProcessing.value = true
  
  try {
    const result = await invoke('compress_pdf', {
      inputPath: inputPath.value,
      outputPath,
      level: compressionLevel.value,
    })
    alert('压缩成功！')
  } catch (error) {
    console.error('Compress failed:', error)
    alert('压缩失败：' + error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="compress-tool">
    <div class="tool-header">
      <h1>压缩PDF</h1>
      <p>减小PDF文件大小，便于分享和存储</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择PDF文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="compression-section">
        <h3>压缩级别</h3>
        <div class="level-options">
          <label class="level-option">
            <input type="radio" v-model="compressionLevel" value="low" />
            <div class="level-info">
              <span class="level-title">轻度压缩</span>
              <span class="level-desc">保持最佳质量，压缩约20%</span>
            </div>
          </label>
          <label class="level-option">
            <input type="radio" v-model="compressionLevel" value="medium" />
            <div class="level-info">
              <span class="level-title">中度压缩</span>
              <span class="level-desc">平衡质量与大小，压缩约50%</span>
            </div>
          </label>
          <label class="level-option">
            <input type="radio" v-model="compressionLevel" value="high" />
            <div class="level-info">
              <span class="level-title">高度压缩</span>
              <span class="level-desc">最小文件大小，压缩约70%</span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary btn-lg"
          @click="compress"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '压缩中...' : '开始压缩' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compress-tool {
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

.compression-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.compression-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.level-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.level-option:hover {
  border-color: var(--primary-color);
}

.level-option:has(input:checked) {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.level-option input {
  margin-top: 4px;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.level-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.level-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

.actions-section {
  text-align: center;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
