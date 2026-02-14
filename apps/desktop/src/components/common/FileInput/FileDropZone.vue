<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  accept?: string
  multiple?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [files: File[]]
}>()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    emit('select', props.multiple ? files : [files[0]])
  }
}

function handleClick() {
  inputRef.value?.click()
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    emit('select', props.multiple ? files : [files[0]])
  }
  target.value = ''
}
</script>

<template>
  <div
    class="drop-zone"
    :class="{ active: isDragging, disabled }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="handleClick"
  >
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="file-input"
      @change="handleChange"
    />
    <slot>
      <div class="default-content">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <p class="text">拖拽文件到此处或点击选择</p>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.drop-zone {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drop-zone:hover {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.02);
}

.drop-zone.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.drop-zone.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-input {
  display: none;
}

.default-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.icon {
  width: 48px;
  height: 48px;
  color: var(--primary-color);
}

.text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
