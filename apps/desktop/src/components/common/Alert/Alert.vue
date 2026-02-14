<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  closable?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const iconMap = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  error: '✗'
}

const icon = computed(() => iconMap[props.type || 'info'])
</script>

<template>
  <div class="alert" :class="type">
    <span class="alert-icon">{{ icon }}</span>
    <div class="alert-content">
      <h4 v-if="title" class="alert-title">{{ title }}</h4>
      <p class="alert-message">
        <slot />
      </p>
    </div>
    <button v-if="closable" class="alert-close" @click="$emit('close')">×</button>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
}

.info {
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.warning {
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.alert-icon {
  font-size: 18px;
  line-height: 1;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.alert-message {
  font-size: 13px;
  color: var(--text-secondary);
}

.alert-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 18px;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.alert-close:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}
</style>
