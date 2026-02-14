<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { usePdfStore } from '@/stores/pdf'
import { open } from '@tauri-apps/plugin-dialog'
import { ref } from 'vue'

const appStore = useAppStore()
const pdfStore = usePdfStore()

const isDropdownOpen = ref(false)

async function openFile() {
  try {
    const selected = await open({
      multiple: false,
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })
    if (selected) {
      appStore.setCurrentFile(selected as string)
    }
  } catch (error) {
    console.error('Failed to open file:', error)
  }
}

function toggleTheme() {
  const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
  const currentIndex = themes.indexOf(appStore.theme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  appStore.setTheme(nextTheme)
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <button class="btn btn-primary" @click="openFile">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        打开文件
      </button>
      
      <div v-if="pdfStore.isLoaded" class="file-info">
        <span class="file-name">{{ pdfStore.filePath?.split('/').pop() || pdfStore.filePath?.split('\\').pop() }}</span>
        <span class="file-pages">{{ pdfStore.pageCount }} 页</span>
      </div>
    </div>
    
    <div class="header-center">
      <div v-if="pdfStore.isLoaded" class="page-control">
        <button class="btn-icon" @click="pdfStore.setCurrentPage(pdfStore.currentPage - 1)" :disabled="pdfStore.currentPage <= 1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <input
          type="number"
          :value="pdfStore.currentPage"
          @change="pdfStore.setCurrentPage(parseInt(($event.target as HTMLInputElement).value))"
          min="1"
          :max="pdfStore.pageCount"
          class="page-input"
        />
        <span>/ {{ pdfStore.pageCount }}</span>
        <button class="btn-icon" @click="pdfStore.setCurrentPage(pdfStore.currentPage + 1)" :disabled="pdfStore.currentPage >= pdfStore.pageCount">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="header-right">
      <div class="zoom-control" v-if="pdfStore.isLoaded">
        <button class="btn-icon" @click="pdfStore.setZoom(pdfStore.zoom - 0.1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <span class="zoom-value">{{ Math.round(pdfStore.zoom * 100) }}%</span>
        <button class="btn-icon" @click="pdfStore.setZoom(pdfStore.zoom + 0.1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>
      
      <button class="btn-icon theme-toggle" @click="toggleTheme" :title="appStore.theme">
        <svg v-if="appStore.isDarkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
}

.file-pages {
  color: var(--text-tertiary);
  font-size: 12px;
}

.page-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-input {
  width: 48px;
  text-align: center;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.zoom-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoom-value {
  min-width: 48px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
