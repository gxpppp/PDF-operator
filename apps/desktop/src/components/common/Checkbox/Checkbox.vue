<script setup lang="ts">
defineProps<{
  checked?: boolean
  disabled?: boolean
  label?: string
}>()

const emit = defineEmits<{
  'update:checked': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:checked', !props.checked)
  }
}

const props = defineProps<{
  checked?: boolean
  disabled?: boolean
  label?: string
}>()
</script>

<template>
  <label class="checkbox" :class="{ disabled }">
    <input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @change="toggle"
    />
    <span class="checkbox-box">
      <svg v-if="checked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<style scoped>
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox input {
  display: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-box svg {
  width: 12px;
  height: 12px;
  color: white;
}

.checkbox input:checked + .checkbox-box {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label {
  font-size: 14px;
  color: var(--text-primary);
}
</style>
