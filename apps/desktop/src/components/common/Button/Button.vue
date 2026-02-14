<script setup lang="ts">
defineProps<{
  type?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="btn"
    :class="[type, size]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background-color: var(--primary-color);
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.secondary:hover:not(:disabled) {
  background-color: var(--border-color);
}

.danger {
  background-color: var(--danger-color);
  color: white;
}

.danger:hover:not(:disabled) {
  opacity: 0.9;
}

.ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.ghost:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
}

.sm {
  padding: 4px 12px;
  font-size: 12px;
}

.lg {
  padding: 12px 24px;
  font-size: 16px;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
