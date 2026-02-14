<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: string
  closable?: boolean
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
    <Transition name="drawer">
      <div v-if="modelValue" class="drawer-wrapper">
        <div class="drawer-mask" @click="close"></div>
        <div class="drawer" :class="[placement]" :style="{ width: size || '400px' }">
          <div class="drawer-header">
            <h3 class="drawer-title">{{ title }}</h3>
            <button v-if="closable !== false" class="drawer-close" @click="close">×</button>
          </div>
          <div class="drawer-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="drawer-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.drawer {
  position: absolute;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.left {
  top: 0;
  left: 0;
  bottom: 0;
  box-shadow: var(--shadow-lg);
}

.right {
  top: 0;
  right: 0;
  bottom: 0;
  box-shadow: var(--shadow-lg);
}

.top {
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  max-height: 80vh;
  box-shadow: var(--shadow-lg);
}

.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  max-height: 80vh;
  box-shadow: var(--shadow-lg);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.drawer-close {
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

.drawer-close:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.drawer-body {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .left,
.drawer-leave-to .left {
  transform: translateX(-100%);
}

.drawer-enter-from .right,
.drawer-leave-to .right {
  transform: translateX(100%);
}

.drawer-enter-from .top,
.drawer-leave-to .top {
  transform: translateY(-100%);
}

.drawer-enter-from .bottom,
.drawer-leave-to .bottom {
  transform: translateY(100%);
}
</style>
