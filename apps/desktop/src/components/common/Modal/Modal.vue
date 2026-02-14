<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal" :class="size">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="close">×</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.sm { width: 400px; }
.md { width: 600px; }
.lg { width: 800px; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 20px;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.modal-close:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
  overflow: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
