<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  disabled?: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputType = computed(() => props.type || 'text')

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input-wrapper">
    <input
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input"
      :class="{ error: error }"
      @input="handleInput"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.input:disabled {
  background-color: var(--bg-tertiary);
  cursor: not-allowed;
}

.input.error {
  border-color: var(--danger-color);
}

.error-message {
  font-size: 12px;
  color: var(--danger-color);
}
</style>
