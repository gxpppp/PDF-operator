<script setup lang="ts">
import { ref } from 'vue'
import { usePdfStore } from '@/stores/pdf'

const pdfStore = usePdfStore()

interface Annotation {
  id: string
  type: 'highlight' | 'note' | 'underline' | 'strikethrough'
  page: number
  content: string
  color: string
  position: { x: number; y: number; width: number; height: number }
  createdAt: Date
}

const annotations = ref<Annotation[]>([])
const selectedType = ref<'highlight' | 'note' | 'underline' | 'strikethrough'>('highlight')
const selectedColor = ref('#FFFF00')

const annotationTypes = [
  { type: 'highlight', label: '高亮', icon: '🖍️' },
  { type: 'note', label: '注释', icon: '📝' },
  { type: 'underline', label: '下划线', icon: '‾' },
  { type: 'strikethrough', label: '删除线', icon: '̶' },
]

const colors = ['#FFFF00', '#00FF00', '#FF0000', '#0000FF', '#FF00FF']

function addAnnotation() {
  const newAnnotation: Annotation = {
    id: Date.now().toString(),
    type: selectedType.value,
    page: pdfStore.currentPage,
    content: '',
    color: selectedColor.value,
    position: { x: 0, y: 0, width: 100, height: 20 },
    createdAt: new Date()
  }
  annotations.value.push(newAnnotation)
}

function deleteAnnotation(id: string) {
  annotations.value = annotations.value.filter(a => a.id !== id)
}

function editAnnotation(annotation: Annotation) {
}
</script>

<template>
  <div class="annotation-panel">
    <div class="annotation-tools">
      <h4>添加注释</h4>
      <div class="type-selector">
        <button
          v-for="t in annotationTypes"
          :key="t.type"
          class="type-btn"
          :class="{ active: selectedType === t.type }"
          @click="selectedType = t.type as any"
          :title="t.label"
        >
          {{ t.icon }}
        </button>
      </div>
      
      <div v-if="selectedType !== 'note'" class="color-selector">
        <span>颜色：</span>
        <button
          v-for="color in colors"
          :key="color"
          class="color-btn"
          :class="{ active: selectedColor === color }"
          :style="{ backgroundColor: color }"
          @click="selectedColor = color"
        ></button>
      </div>
      
      <button class="btn btn-primary btn-sm" @click="addAnnotation">
        添加注释
      </button>
    </div>
    
    <div class="annotation-list">
      <h4>注释列表</h4>
      <div v-if="annotations.length === 0" class="empty-state">
        暂无注释
      </div>
      <div v-else class="annotations">
        <div
          v-for="annotation in annotations"
          :key="annotation.id"
          class="annotation-item"
        >
          <div class="annotation-header">
            <span class="annotation-type">{{ annotationTypes.find(t => t.type === annotation.type)?.label }}</span>
            <span class="annotation-page">第 {{ annotation.page }} 页</span>
          </div>
          <div class="annotation-content">
            {{ annotation.content || '无内容' }}
          </div>
          <div class="annotation-actions">
            <button class="action-btn" @click="editAnnotation(annotation)">编辑</button>
            <button class="action-btn danger" @click="deleteAnnotation(annotation.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotation-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.annotation-tools h4,
.annotation-list h4 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.type-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.type-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 16px;
}

.type-btn.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.1);
}

.color-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.color-btn {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
}

.color-btn.active {
  border-color: var(--text-primary);
}

.btn-sm {
  width: 100%;
}

.annotation-list {
  flex: 1;
  overflow: auto;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.annotations {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.annotation-item {
  padding: 12px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.annotation-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.annotation-type {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary-color);
}

.annotation-page {
  font-size: 11px;
  color: var(--text-tertiary);
}

.annotation-content {
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.annotation-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  background: none;
  font-size: 12px;
  color: var(--primary-color);
  cursor: pointer;
}

.action-btn.danger {
  color: var(--danger-color);
}
</style>
