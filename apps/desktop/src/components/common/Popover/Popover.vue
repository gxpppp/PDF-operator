<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'click' | 'hover'
}>()

const visible = ref(false)

function toggle() {
  if (props.trigger !== 'hover') {
    visible.value = !visible.value
  }
}

function show() {
  if (props.trigger === 'hover') {
    visible.value = true
  }
}

function hide() {
  if (props.trigger === 'hover') {
    visible.value = false
  }
}
</script>

<template>
  <div class="popover" @click="toggle" @mouseenter="show" @mouseleave="hide">
    <slot name="trigger" />
    <Transition name="popover">
      <div v-if="visible" class="popover-content" :class="placement">
        <div v-if="title" class="popover-header">{{ title }}</div>
        <div class="popover-body">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.popover {
  position: relative;
  display: inline-block;
}

.popover-content {
  position: absolute;
  min-width: 200px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.popover-header {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.popover-body {
  padding: 12px 16px;
}

.popover-enter-active,
.popover-leave-active {
  transition: all 0.15s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
}
</style>
