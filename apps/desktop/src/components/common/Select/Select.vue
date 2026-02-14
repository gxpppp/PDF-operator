<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  options: Array<{ value: string | number; label: string }>
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)

const selectedLabel = computed(() => {
  const option = props.options.find(o => o.value === props.modelValue)
  return option?.label || props.placeholder || '请选择'
})

function select(value: string | number) {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div class="select" :class="{ disabled, open: isOpen }">
    <div class="select-trigger" @click="!disabled && (isOpen = !isOpen)">
      <span class="select-value">{{ selectedLabel }}</span>
      <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div v-if="isOpen" class="select-dropdown">
      <div
        v-for="option in options"
        :key="option.value"
        class="select-option"
        :class="{ selected: option.value === modelValue }"
        @click="select(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.select {
  position: relative;
  width: 100%;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.select.disabled .select-trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-value {
  font-size: 14px;
  color: var(--text-primary);
}

.select-arrow {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  transition: transform 0.2s ease;
}

.select.open .select-arrow {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  max-height: 200px;
  overflow: auto;
}

.select-option {
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.select-option:hover {
  background-color: var(--bg-tertiary);
}

.select-option.selected {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}
</style>
