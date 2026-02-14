<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePdfStore } from '@/stores/pdf'

const pdfStore = usePdfStore()

interface Bookmark {
  id: string
  title: string
  page: number
  level: number
}

const bookmarks = ref<Bookmark[]>([])
const editingId = ref<string | null>(null)
const editingTitle = ref('')

const groupedBookmarks = computed(() => {
  return bookmarks.value
})

function addBookmark() {
  const newBookmark: Bookmark = {
    id: Date.now().toString(),
    title: `书签 ${bookmarks.value.length + 1}`,
    page: pdfStore.currentPage,
    level: 0
  }
  bookmarks.value.push(newBookmark)
  startEditing(newBookmark.id)
}

function deleteBookmark(id: string) {
  bookmarks.value = bookmarks.value.filter(b => b.id !== id)
}

function goToBookmark(bookmark: Bookmark) {
  pdfStore.setCurrentPage(bookmark.page)
}

function startEditing(id: string) {
  const bookmark = bookmarks.value.find(b => b.id === id)
  if (bookmark) {
    editingId.value = id
    editingTitle.value = bookmark.title
  }
}

function saveEdit() {
  if (editingId.value) {
    const bookmark = bookmarks.value.find(b => b.id === editingId.value)
    if (bookmark) {
      bookmark.title = editingTitle.value
    }
  }
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}
</script>

<template>
  <div class="bookmark-panel">
    <div class="panel-header">
      <h4>书签</h4>
      <button class="add-btn" @click="addBookmark" title="添加书签">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
    
    <div v-if="bookmarks.length === 0" class="empty-state">
      <p>暂无书签</p>
      <p class="hint">点击上方按钮添加当前页面的书签</p>
    </div>
    
    <div v-else class="bookmark-list">
      <div
        v-for="bookmark in groupedBookmarks"
        :key="bookmark.id"
        class="bookmark-item"
        :style="{ paddingLeft: `${bookmark.level * 16 + 12}px` }"
      >
        <div v-if="editingId === bookmark.id" class="edit-form">
          <input
            v-model="editingTitle"
            type="text"
            class="edit-input"
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
            autofocus
          />
          <button class="save-btn" @click="saveEdit">✓</button>
          <button class="cancel-btn" @click="cancelEdit">×</button>
        </div>
        <div v-else class="bookmark-content">
          <span class="bookmark-icon">🔖</span>
          <span class="bookmark-title" @click="goToBookmark(bookmark)">
            {{ bookmark.title }}
          </span>
          <span class="bookmark-page">第 {{ bookmark.page }} 页</span>
          <div class="bookmark-actions">
            <button class="action-btn" @click="startEditing(bookmark.id)" title="编辑">
              ✏️
            </button>
            <button class="action-btn" @click="deleteBookmark(bookmark.id)" title="删除">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmark-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.panel-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.add-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--primary-color);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.add-btn:hover {
  background-color: var(--bg-tertiary);
}

.add-btn svg {
  width: 18px;
  height: 18px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
}

.empty-state p {
  margin: 0;
}

.hint {
  font-size: 12px;
  margin-top: 8px !important;
}

.bookmark-list {
  flex: 1;
  overflow: auto;
}

.bookmark-item {
  border-bottom: 1px solid var(--border-color);
}

.bookmark-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
}

.bookmark-content:hover {
  background-color: var(--bg-tertiary);
}

.bookmark-icon {
  font-size: 14px;
}

.bookmark-title {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
}

.bookmark-page {
  font-size: 11px;
  color: var(--text-tertiary);
}

.bookmark-actions {
  display: none;
  gap: 4px;
}

.bookmark-item:hover .bookmark-actions {
  display: flex;
}

.action-btn {
  padding: 2px 4px;
  border: none;
  background: none;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.6;
}

.action-btn:hover {
  opacity: 1;
}

.edit-form {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--primary-color);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.save-btn,
.cancel-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.save-btn {
  background-color: var(--primary-color);
  color: white;
}

.cancel-btn {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}
</style>
