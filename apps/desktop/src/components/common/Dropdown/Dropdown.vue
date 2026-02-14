<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  items: Array<{ label: string; icon?: string; action?: () => void; divider?: boolean }>
  trigger?: 'click' | 'hover'
}>()

const isOpen = ref(false)

function toggle() {
  if (props.trigger !== 'hover') {
    isOpen.value = !isOpen.value
  }
}

function show() {
  if (props.trigger === 'hover') {
    isOpen.value = true
  }
}

function hide() {
  if (props.trigger === 'hover') {
    isOpen.value = false
  }
}

function handleAction(item: any) {
  if (item.action) {
    item.action()
    isOpen.value = false
  }
}
</script>

<template>
  <div class="dropdown" @click="toggle" @mouseenter="show" @mouseleave="hide">
    <slot name="trigger">
      <button class="dropdown-trigger">
        <span>下拉菜单</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </slot>
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <template v-for="(item, index) in items" :key="index">
          <div v-if="item.divider" class="dropdown-divider"></div>
          <button v-else class="dropdown-item" @click="handleAction(item)">
            <span v-if="item.icon" class="dropdown-icon">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
}

.dropdown-trigger svg {
  width: 16px;
  height: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  margin-top: 4px;
  padding: 4px 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--bg-tertiary);
}

.dropdown-icon {
  font-size: 16px;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 4px 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
