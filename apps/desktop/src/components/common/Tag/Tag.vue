<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <span class="tag" :class="[type, size]">
    <slot />
    <button v-if="closable" class="tag-close" @click="$emit('close')">×</button>
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid;
}

.default {
  background-color: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.primary {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: var(--primary-color);
}

.success {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: var(--success-color);
}

.warning {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--warning-color);
}

.danger {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--danger-color);
}

.sm {
  padding: 1px 6px;
  font-size: 11px;
}

.lg {
  padding: 4px 12px;
  font-size: 13px;
}

.tag-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  border: none;
  background: none;
  font-size: 14px;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  border-radius: 50%;
}

.tag-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
