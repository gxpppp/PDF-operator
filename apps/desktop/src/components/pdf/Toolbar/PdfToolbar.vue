<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePdfStore } from '@/stores/pdf'

const pdfStore = usePdfStore()

const showGrid = ref(false)
const gridSpacing = ref(50)

const tools = [
  { id: 'select', label: '选择', icon: '↖️' },
  { id: 'hand', label: '手型', icon: '✋' },
  { id: 'zoom-in', label: '放大', icon: '🔍+' },
  { id: 'zoom-out', label: '缩小', icon: '🔍-' },
  { id: 'text', label: '文本', icon: 'T' },
  { id: 'highlight', label: '高亮', icon: '🖍️' },
  { id: 'underline', label: '下划线', icon: '‾' },
  { id: 'strikethrough', label: '删除线', icon: '̶' },
  { id: 'note', label: '注释', icon: '📝' },
  { id: 'stamp', label: '图章', icon: '🔖' },
  { id: 'signature', label: '签名', icon: '✍️' },
  { id: 'eraser', label: '橡皮擦', icon: '🧹' },
]

const activeTool = ref('select')

const zoomLevels = [25, 50, 75, 100, 125, 150, 200, 300, 400]

const currentZoom = computed(() => Math.round(pdfStore.zoom * 100))

function selectTool(toolId: string) {
  activeTool.value = toolId
}

function zoomIn() {
  pdfStore.setZoom(pdfStore.zoom + 0.25)
}

function zoomOut() {
  pdfStore.setZoom(pdfStore.zoom - 0.25)
}

function setZoom(level: number) {
  pdfStore.setZoom(level / 100)
}

function fitWidth() {
  pdfStore.setZoom(1)
}

function fitPage() {
  pdfStore.setZoom(0.8)
}

function rotateLeft() {
  pdfStore.setRotation(pdfStore.rotation - 90)
}

function rotateRight() {
  pdfStore.setRotation(pdfStore.rotation + 90)
}

function toggleGrid() {
  showGrid.value = !showGrid.value
}
</script>

<template>
  <div class="pdf-toolbar">
    <div class="toolbar-group">
      <button
        v-for="tool in tools.slice(0, 4)"
        :key="tool.id"
        class="tool-btn"
        :class="{ active: activeTool === tool.id }"
        :title="tool.label"
        @click="selectTool(tool.id)"
      >
        {{ tool.icon }}
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <div class="toolbar-group">
      <button
        v-for="tool in tools.slice(4)"
        :key="tool.id"
        class="tool-btn"
        :class="{ active: activeTool === tool.id }"
        :title="tool.label"
        @click="selectTool(tool.id)"
      >
        {{ tool.icon }}
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <div class="toolbar-group zoom-group">
      <button class="tool-btn" @click="zoomOut" title="缩小">
        ➖
      </button>
      <select class="zoom-select" :value="currentZoom" @change="setZoom(parseInt(($event.target as HTMLSelectElement).value))">
        <option v-for="level in zoomLevels" :key="level" :value="level">{{ level }}%</option>
      </select>
      <button class="tool-btn" @click="zoomIn" title="放大">
        ➕
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <div class="toolbar-group">
      <button class="tool-btn" @click="fitWidth" title="适应宽度">
        ↔️
      </button>
      <button class="tool-btn" @click="fitPage" title="适应页面">
        ⛶
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <div class="toolbar-group">
      <button class="tool-btn" @click="rotateLeft" title="逆时针旋转">
        ↺
      </button>
      <button class="tool-btn" @click="rotateRight" title="顺时针旋转">
        ↻
      </button>
    </div>
    
    <div class="toolbar-divider"></div>
    
    <div class="toolbar-group">
      <button
        class="tool-btn"
        :class="{ active: showGrid }"
        @click="toggleGrid"
        title="显示网格"
      >
        ▦
      </button>
    </div>
  </div>
</template>

<style scoped>
.pdf-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-color);
  margin: 0 8px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.tool-btn.active {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.zoom-group {
  gap: 4px;
}

.zoom-select {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  min-width: 70px;
}
</style>
