<script setup lang="ts">
import { usePdfStore } from '@/stores/pdf'
import { computed } from 'vue'

const pdfStore = usePdfStore()

const pages = computed(() => pdfStore.pages)
</script>

<template>
  <div class="thumbnail-panel">
    <div
      v-for="page in pages"
      :key="page.number"
      class="thumbnail-item"
      :class="{ active: page.number === pdfStore.currentPage }"
      @click="pdfStore.setCurrentPage(page.number)"
    >
      <div class="thumbnail-placeholder">
        <span>{{ page.number }}</span>
      </div>
      <span class="thumbnail-label">第 {{ page.number }} 页</span>
    </div>
  </div>
</template>

<style scoped>
.thumbnail-panel {
  padding: 8px;
}

.thumbnail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail-item:hover {
  background-color: var(--bg-tertiary);
}

.thumbnail-item.active {
  background-color: rgba(59, 130, 246, 0.1);
  outline: 2px solid var(--primary-color);
}

.thumbnail-placeholder {
  width: 100px;
  height: 140px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.thumbnail-label {
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
