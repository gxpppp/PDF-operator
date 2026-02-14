<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  items: Array<{ key: string; title: string; icon?: string; disabled?: boolean }>
  activeKey?: string
  accordion?: boolean
}>()

const emit = defineEmits<{
  'update:activeKey': [value: string]
}>()

const activeKeys = ref<Set<string>>(new Set())

const isActive = computed(() => {
  return (key: string) => {
    if (props.activeKey !== undefined) {
      return props.activeKey === key
    }
    return activeKeys.value.has(key)
  }
})

function toggle(key: string) {
  if (props.activeKey !== undefined) {
    emit('update:activeKey', props.activeKey === key ? '' : key)
  } else {
    if (props.accordion) {
      activeKeys.value.clear()
    }
    if (activeKeys.value.has(key)) {
      activeKeys.value.delete(key)
    } else {
      activeKeys.value.add(key)
    }
  }
}
</script>

<template>
  <div class="collapse">
    <div
      v-for="item in items"
      :key="item.key"
      class="collapse-item"
      :class="{ active: isActive(item.key), disabled: item.disabled }"
    >
      <div
        class="collapse-header"
        @click="!item.disabled && toggle(item.key)"
      >
        <span v-if="item.icon" class="collapse-icon">{{ item.icon }}</span>
        <span class="collapse-title">{{ item.title }}</span>
        <svg class="collapse-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <Transition name="collapse">
        <div v-if="isActive(item.key)" class="collapse-content">
          <slot :name="item.key" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.collapse {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.collapse-item {
  border-bottom: 1px solid var(--border-color);
}

.collapse-item:last-child {
  border-bottom: none;
}

.collapse-item.disabled {
  opacity: 0.5;
}

.collapse-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  background-color: var(--bg-primary);
}

.collapse-header:hover {
  background-color: var(--bg-tertiary);
}

.collapse-icon {
  font-size: 16px;
}

.collapse-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.collapse-arrow {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  transition: transform 0.2s ease;
}

.collapse-item.active .collapse-arrow {
  transform: rotate(180deg);
}

.collapse-content {
  padding: 16px;
  background-color: var(--bg-secondary);
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  padding-top: 0;
  padding-bottom: 0;
  max-height: 0;
  opacity: 0;
}
</style>
