<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string | number
  value: string | number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isChecked = computed(() => props.modelValue === props.value)

function select() {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label class="radio" :class="{ disabled, checked: isChecked }">
    <input
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      @change="select"
    />
    <span class="radio-indicator">
      <span v-if="isChecked" class="radio-dot"></span>
    </span>
    <span v-if="$slots.default" class="radio-label">
      <slot />
    </span>
  </label>
</template>

<style scoped>
.radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radio input {
  display: none;
}

.radio-indicator {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}

.radio.checked .radio-indicator {
  border-color: var(--primary-color);
}

.radio-dot {
  width: 10px;
  height: 10px;
  background-color: var(--primary-color);
  border-radius: 50%;
}

.radio-label {
  font-size: 14px;
  color: var(--text-primary);
}
</style>
