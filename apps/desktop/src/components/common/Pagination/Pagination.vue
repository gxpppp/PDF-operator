<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  pageSize?: number
  current?: number
  showTotal?: boolean
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
}>()

const emit = defineEmits<{
  'update:current': [value: number]
  'update:pageSize': [value: number]
}>()

const pageSize = computed(() => props.pageSize || 10)
const current = computed(() => props.current || 1)

const totalPages = computed(() => Math.ceil(props.total / pageSize.value))

const pages = computed(() => {
  const result: (number | string)[] = []
  const total = totalPages.value
  const curr = current.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push(i)
    }
  } else {
    result.push(1)
    
    if (curr > 3) {
      result.push('...')
    }
    
    const start = Math.max(2, curr - 1)
    const end = Math.min(total - 1, curr + 1)
    
    for (let i = start; i <= end; i++) {
      result.push(i)
    }
    
    if (curr < total - 2) {
      result.push('...')
    }
    
    result.push(total)
  }
  
  return result
})

function goTo(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== current.value) {
    emit('update:current', page)
  }
}

function prev() {
  goTo(current.value - 1)
}

function next() {
  goTo(current.value + 1)
}
</script>

<template>
  <div class="pagination">
    <span v-if="showTotal" class="pagination-total">
      共 {{ total }} 条
    </span>
    
    <button
      class="pagination-btn"
      :disabled="current <= 1"
      @click="prev"
    >
      ‹
    </button>
    
    <button
      v-for="page in pages"
      :key="page"
      class="pagination-btn"
      :class="{ active: page === current, ellipsis: page === '...' }"
      :disabled="page === '...'"
      @click="typeof page === 'number' && goTo(page)"
    >
      {{ page }}
    </button>
    
    <button
      class="pagination-btn"
      :disabled="current >= totalPages"
      @click="next"
    >
      ›
    </button>
    
    <select
      v-if="showSizeChanger"
      class="pagination-size"
      :value="pageSize"
      @change="emit('update:pageSize', parseInt(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="size in (pageSizeOptions || [10, 20, 50, 100])" :key="size" :value="size">
        {{ size }} 条/页
      </option>
    </select>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-total {
  font-size: 14px;
  color: var(--text-secondary);
  margin-right: 8px;
}

.pagination-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled):not(.ellipsis) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pagination-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.ellipsis {
  border: none;
  background: none;
}

.pagination-size {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
}
</style>
