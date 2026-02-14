<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  maxlength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="textarea-wrapper">
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows || 3"
      :maxlength="maxlength"
      :style="{ resize }"
      class="textarea"
      :class="{ error }"
      @input="handleInput"
    ></textarea>
    <div v-if="maxlength" class="textarea-count">
      {{ (modelValue || '').length }}/{{ maxlength }}
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.textarea:disabled {
  background-color: var(--bg-tertiary);
  cursor: not-allowed;
}

.textarea.error {
  border-color: var(--danger-color);
}

.textarea-count {
  align-self: flex-end;
  font-size: 12px;
  color: var(--text-tertiary);
}

.error-message {
  font-size: 12px;
  color: var(--danger-color);
}
</style>
