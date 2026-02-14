<script setup lang="ts">
defineProps<{
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const props = defineProps<{
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <button
    class="switch"
    :class="[size, { active: modelValue, disabled }]"
    @click="toggle"
  >
    <span class="switch-thumb"></span>
  </button>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 24px;
  padding: 2px;
  background-color: var(--bg-tertiary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.switch.active {
  background-color: var(--primary-color);
}

.switch.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-thumb {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.switch.active .switch-thumb {
  transform: translateX(20px);
}

.sm {
  width: 32px;
  height: 18px;
}

.sm .switch-thumb {
  width: 14px;
  height: 14px;
}

.sm.active .switch-thumb {
  transform: translateX(14px);
}

.lg {
  width: 56px;
  height: 30px;
}

.lg .switch-thumb {
  width: 26px;
  height: 26px;
}

.lg.active .switch-thumb {
  transform: translateX(26px);
}
</style>
