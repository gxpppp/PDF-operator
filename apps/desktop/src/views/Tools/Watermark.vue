<script setup lang="ts">
import { ref } from 'vue'
import { open, save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const inputPath = ref('')
const inputName = ref('')
const watermarkType = ref<'text' | 'image'>('text')
const watermarkText = ref('机密文件')
const watermarkImage = ref('')
const fontSize = ref(48)
const fontColor = ref('#CCCCCC')
const opacity = ref(0.3)
const rotation = ref(-45)
const position = ref('center')
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

async function selectImage() {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'Image', extensions: ['png', 'jpg', 'jpeg'] }],
  })
  
  if (selected) {
    watermarkImage.value = selected as string
  }
}

async function addWatermark() {
  if (!inputPath.value) {
    alert('请选择PDF文件')
    return
  }
  
  if (watermarkType.value === 'text' && !watermarkText.value) {
    alert('请输入水印文字')
    return
  }
  
  if (watermarkType.value === 'image' && !watermarkImage.value) {
    alert('请选择水印图片')
    return
  }
  
  const outputPath = await save({
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    defaultPath: inputName.value.replace('.pdf', '_watermarked.pdf'),
  })
  
  if (!outputPath) return
  
  isProcessing.value = true
  
  try {
    await invoke('add_watermark', {
      inputPath: inputPath.value,
      outputPath,
      watermarkType: watermarkType.value,
      watermarkText: watermarkText.value,
      watermarkImage: watermarkImage.value,
      fontSize: fontSize.value,
      fontColor: fontColor.value,
      opacity: opacity.value,
      rotation: rotation.value,
      position: position.value,
    })
    alert('添加水印成功！')
  } catch (error) {
    console.error('Watermark failed:', error)
    alert('添加水印失败：' + error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="watermark-tool">
    <div class="tool-header">
      <h1>添加水印</h1>
      <p>为PDF文件添加文字或图片水印</p>
    </div>
    
    <div class="tool-content">
      <div class="file-select">
        <button class="btn btn-primary" @click="selectFile">
          选择PDF文件
        </button>
        <span v-if="inputName" class="selected-file">{{ inputName }}</span>
      </div>
      
      <div class="type-section">
        <label class="type-option" :class="{ active: watermarkType === 'text' }">
          <input type="radio" v-model="watermarkType" value="text" />
          <span>文字水印</span>
        </label>
        <label class="type-option" :class="{ active: watermarkType === 'image' }">
          <input type="radio" v-model="watermarkType" value="image" />
          <span>图片水印</span>
        </label>
      </div>
      
      <div class="options-section">
        <div v-if="watermarkType === 'text'" class="option-group">
          <label>水印文字</label>
          <input type="text" v-model="watermarkText" class="input" placeholder="输入水印文字" />
        </div>
        
        <div v-else class="option-group">
          <label>水印图片</label>
          <div class="image-select">
            <button class="btn btn-secondary" @click="selectImage">
              选择图片
            </button>
            <span v-if="watermarkImage" class="selected-image">{{ watermarkImage.split(/[/\\]/).pop() }}</span>
          </div>
        </div>
        
        <div v-if="watermarkType === 'text'" class="option-row">
          <div class="option-group">
            <label>字体大小</label>
            <input type="number" v-model="fontSize" class="input" min="12" max="200" />
          </div>
          <div class="option-group">
            <label>字体颜色</label>
            <input type="color" v-model="fontColor" class="color-input" />
          </div>
        </div>
        
        <div class="option-row">
          <div class="option-group">
            <label>透明度</label>
            <input type="range" v-model="opacity" min="0" max="1" step="0.1" class="range-input" />
            <span class="range-value">{{ Math.round(opacity * 100) }}%</span>
          </div>
          <div class="option-group">
            <label>旋转角度</label>
            <input type="number" v-model="rotation" class="input" min="-180" max="180" />
          </div>
        </div>
        
        <div class="option-group">
          <label>位置</label>
          <select v-model="position" class="input">
            <option value="center">居中</option>
            <option value="tile">平铺</option>
            <option value="top-left">左上角</option>
            <option value="top-right">右上角</option>
            <option value="bottom-left">左下角</option>
            <option value="bottom-right">右下角</option>
          </select>
        </div>
      </div>
      
      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-box">
          <div
            class="watermark-preview"
            :style="{
              color: fontColor,
              fontSize: fontSize / 3 + 'px',
              opacity: opacity,
              transform: `rotate(${rotation}deg)`,
            }"
          >
            {{ watermarkText || '水印预览' }}
          </div>
        </div>
      </div>
      
      <div class="actions-section">
        <button
          class="btn btn-primary btn-lg"
          @click="addWatermark"
          :disabled="!inputPath || isProcessing"
        >
          {{ isProcessing ? '处理中...' : '添加水印' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watermark-tool {
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

.type-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.type-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
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

.option-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.color-input {
  width: 60px;
  height: 36px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.range-input {
  width: 100%;
}

.range-value {
  font-size: 12px;
  color: var(--text-tertiary);
}

.image-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-image {
  font-size: 13px;
  color: var(--text-secondary);
}

.preview-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.preview-section h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.preview-box {
  height: 150px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.watermark-preview {
  font-weight: 600;
  white-space: nowrap;
}

.actions-section {
  text-align: center;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
