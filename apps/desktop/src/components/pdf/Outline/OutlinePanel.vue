<script setup lang="ts">
import { ref } from 'vue'

interface OutlineItem {
  title: string
  page: number
  children?: OutlineItem[]
}

const outline = ref<OutlineItem[]>([
  { title: '第一章 引言', page: 1 },
  { title: '第二章 背景', page: 3, children: [
    { title: '2.1 历史背景', page: 3 },
    { title: '2.2 技术背景', page: 5 },
  ]},
  { title: '第三章 方法', page: 8 },
  { title: '第四章 结果', page: 12 },
  { title: '第五章 结论', page: 15 },
])
</script>

<template>
  <div class="outline-panel">
    <div v-if="outline.length === 0" class="empty-outline">
      <p>此文档没有大纲</p>
    </div>
    <div v-else class="outline-list">
      <template v-for="item in outline" :key="item.title">
        <div class="outline-item" @click="$emit('navigate', item.page)">
          <span class="outline-title">{{ item.title }}</span>
          <span class="outline-page">{{ item.page }}</span>
        </div>
        <div v-if="item.children" class="outline-children">
          <div
            v-for="child in item.children"
            :key="child.title"
            class="outline-item outline-sub-item"
            @click="$emit('navigate', child.page)"
          >
            <span class="outline-title">{{ child.title }}</span>
            <span class="outline-page">{{ child.page }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.outline-panel {
  padding: 8px;
}

.empty-outline {
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
  font-size: 13px;
}

.outline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.outline-item:hover {
  background-color: var(--bg-tertiary);
}

.outline-title {
  font-size: 13px;
  color: var(--text-primary);
}

.outline-page {
  font-size: 12px;
  color: var(--text-tertiary);
}

.outline-children {
  padding-left: 16px;
}

.outline-sub-item .outline-title {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
