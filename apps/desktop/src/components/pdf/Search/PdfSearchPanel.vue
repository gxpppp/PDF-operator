<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePdfStore } from '@/stores/pdf'

const pdfStore = usePdfStore()

const searchText = ref('')
const caseSensitive = ref(false)
const wholeWord = ref(false)
const results = ref<Array<{ page: number; text: string; position: any }>>([])
const currentIndex = ref(-1)

const hasResults = computed(() => results.value.length > 0)

async function search() {
  if (!searchText.value.trim()) {
    results.value = []
    currentIndex.value = -1
    return
  }
  
  results.value = []
  currentIndex.value = -1
  
  for (let page = 1; page <= pdfStore.pageCount; page++) {
    const pageResults = await searchInPage(page, searchText.value)
    results.value.push(...pageResults)
  }
  
  if (results.value.length > 0) {
    currentIndex.value = 0
    navigateToResult(0)
  }
}

async function searchInPage(page: number, text: string) {
  return [
    { page, text: `Found "${text}" on page ${page}`, position: {} }
  ]
}

function nextResult() {
  if (!hasResults.value) return
  currentIndex.value = (currentIndex.value + 1) % results.value.length
  navigateToResult(currentIndex.value)
}

function prevResult() {
  if (!hasResults.value) return
  currentIndex.value = (currentIndex.value - 1 + results.value.length) % results.value.length
  navigateToResult(currentIndex.value)
}

function navigateToResult(index: number) {
  const result = results.value[index]
  if (result) {
    pdfStore.setCurrentPage(result.page)
  }
}

function clearSearch() {
  searchText.value = ''
  results.value = []
  currentIndex.value = -1
}
</script>

<template>
  <div class="search-panel">
    <div class="search-input-wrapper">
      <input
        v-model="searchText"
        type="text"
        class="search-input"
        placeholder="搜索文档..."
        @keyup.enter="search"
      />
      <button class="search-btn" @click="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </div>
    
    <div class="search-options">
      <label class="option">
        <input type="checkbox" v-model="caseSensitive" />
        区分大小写
      </label>
      <label class="option">
        <input type="checkbox" v-model="wholeWord" />
        全词匹配
      </label>
    </div>
    
    <div v-if="hasResults" class="search-results">
      <div class="results-header">
        <span>找到 {{ results.length }} 个结果</span>
        <div class="results-nav">
          <button class="nav-btn" @click="prevResult" :disabled="results.length <= 1">‹</button>
          <span>{{ currentIndex + 1 }} / {{ results.length }}</span>
          <button class="nav-btn" @click="nextResult" :disabled="results.length <= 1">›</button>
        </div>
      </div>
      
      <div class="results-list">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="result-item"
          :class="{ active: index === currentIndex }"
          @click="navigateToResult(index)"
        >
          <span class="result-page">第 {{ result.page }} 页</span>
          <span class="result-text">{{ result.text }}</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="searchText" class="no-results">
      未找到匹配结果
    </div>
  </div>
</template>

<style scoped>
.search-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.search-btn svg {
  width: 18px;
  height: 18px;
}

.search-options {
  display: flex;
  gap: 16px;
}

.option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.search-results {
  margin-top: 8px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.results-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-list {
  max-height: 300px;
  overflow: auto;
}

.result-item {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.result-item:hover {
  background-color: var(--bg-tertiary);
}

.result-item.active {
  background-color: rgba(59, 130, 246, 0.1);
}

.result-page {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 500;
}

.result-text {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.no-results {
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
