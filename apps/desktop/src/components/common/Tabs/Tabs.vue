<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tabs: Array<{ id: string; label: string; icon?: string }>
  activeTab: string
}>()

const emit = defineEmits<{
  'update:activeTab': [value: string]
}>()

function selectTab(id: string) {
  emit('update:activeTab', id)
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab"
      :class="{ active: tab.id === activeTab }"
      @click="selectTab(tab.id)"
    >
      <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: none;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-icon {
  font-size: 16px;
}
</style>
