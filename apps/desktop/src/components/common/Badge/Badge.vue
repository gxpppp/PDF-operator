<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value?: number
  max?: number
  type?: 'primary' | 'success' | 'warning' | 'danger'
  dot?: boolean
}>()

const displayValue = computed(() => {
  if (props.dot) return ''
  if (props.max && props.value && props.value > props.max) {
    return `${props.max}+`
  }
  return props.value?.toString() || ''
})

const show = computed(() => {
  if (props.dot) return true
  return props.value !== undefined && props.value > 0
})
</script>

<template>
  <div class="badge">
    <slot />
    <span v-if="show" class="badge-content" :class="[type, { dot }]">
      {{ displayValue }}
    </span>
  </div>
</template>

<style scoped>
.badge {
  position: relative;
  display: inline-block;
}

.badge-content {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  border-radius: 10px;
  white-space: nowrap;
}

.badge-content.dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
}

.primary {
  background-color: var(--primary-color);
}

.success {
  background-color: var(--success-color);
}

.warning {
  background-color: var(--warning-color);
}

.danger {
  background-color: var(--danger-color);
}
</style>
