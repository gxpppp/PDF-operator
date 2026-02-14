<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}>()

const initial = computed(() => {
  return props.name?.charAt(0).toUpperCase() || '?'
})

const sizeClass = computed(() => `avatar-${props.size || 'md'}`)

const backgroundColor = computed(() => {
  if (props.color) return props.color
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  const index = (props.name?.charCodeAt(0) || 0) % colors.length
  return colors[index]
})
</script>

<template>
  <div class="avatar" :class="sizeClass">
    <img v-if="src" :src="src" :alt="name" class="avatar-image" />
    <div
      v-else
      class="avatar-fallback"
      :style="{ backgroundColor }"
    >
      {{ initial }}
    </div>
  </div>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--bg-tertiary);
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.avatar-md {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.avatar-lg {
  width: 56px;
  height: 56px;
  font-size: 18px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}
</style>
