<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}>()

const visible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)

const placementClass = computed(() => `tooltip-${props.placement || 'top'}`)

function show() {
  if (!props.disabled) {
    visible.value = true
  }
}

function hide() {
  visible.value = false
}
</script>

<template>
  <div class="tooltip-wrapper" @mouseenter="show" @mouseleave="hide">
    <slot />
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="visible"
          class="tooltip"
          :class="placementClass"
        >
          {{ content }}
          <div class="tooltip-arrow"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
}

.tooltip {
  position: fixed;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 12px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  z-index: 9999;
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.85);
  transform: rotate(45deg);
}

.tooltip-top .tooltip-arrow {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.tooltip-bottom .tooltip-arrow {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.tooltip-left .tooltip-arrow {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}

.tooltip-right .tooltip-arrow {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
