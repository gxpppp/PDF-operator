<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface MenuItem {
  label: string
  icon?: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
}

const props = defineProps<{
  items: MenuItem[]
}>()

const visible = ref(false)
const position = ref({ x: 0, y: 0 })

function show(x: number, y: number) {
  position.value = { x, y }
  visible.value = true
}

function hide() {
  visible.value = false
}

function handleAction(item: MenuItem) {
  if (item.disabled || item.divider) return
  if (item.action) {
    item.action()
  }
  hide()
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.context-menu')) {
    hide()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({ show, hide })
</script>

<template>
  <Teleport to="body">
    <Transition name="context-menu">
      <div
        v-if="visible"
        class="context-menu"
        :style="{ left: `${position.x}px`, top: `${position.y}px` }"
      >
        <template v-for="(item, index) in items" :key="index">
          <div v-if="item.divider" class="context-menu-divider"></div>
          <div
            v-else
            class="context-menu-item"
            :class="{ disabled: item.disabled }"
            @click="handleAction(item)"
          >
            <span v-if="item.icon" class="item-icon">{{ item.icon }}</span>
            <span class="item-label">{{ item.label }}</span>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  min-width: 160px;
  padding: 4px 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 9999;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
}

.context-menu-item:hover:not(.disabled) {
  background-color: var(--bg-tertiary);
}

.context-menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-icon {
  font-size: 14px;
}

.item-label {
  font-size: 13px;
  color: var(--text-primary);
}

.context-menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 4px 0;
}

.context-menu-enter-active,
.context-menu-leave-active {
  transition: all 0.15s ease;
}

.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
