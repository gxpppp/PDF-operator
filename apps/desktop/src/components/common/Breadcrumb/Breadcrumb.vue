<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  items: Array<{ label: string; path?: string; icon?: string }>
  separator?: string
}>()
</script>

<template>
  <nav class="breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span
        class="breadcrumb-item"
        :class="{ clickable: item.path }"
        @click="item.path && $router.push(item.path)"
      >
        <span v-if="item.icon" class="breadcrumb-icon">{{ item.icon }}</span>
        {{ item.label }}
      </span>
      <span v-if="index < items.length - 1" class="breadcrumb-separator">
        {{ separator || '/' }}
      </span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
}

.breadcrumb-item.clickable {
  cursor: pointer;
}

.breadcrumb-item.clickable:hover {
  color: var(--primary-color);
}

.breadcrumb-item:last-child {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 16px;
}

.breadcrumb-separator {
  color: var(--text-tertiary);
}
</style>
