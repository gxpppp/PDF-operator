<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  width?: string
  height?: string
  circle?: boolean
  rows?: number
  animated?: boolean
}>()

const style = computed(() => ({
  width: props.width || '100%',
  height: props.height || '16px',
  borderRadius: props.circle ? '50%' : 'var(--radius-sm)'
}))
</script>

<template>
  <div class="skeleton" :class="{ animated }">
    <div v-if="!rows || rows === 1" class="skeleton-item" :style="style"></div>
    <div v-else class="skeleton-rows">
      <div
        v-for="i in rows"
        :key="i"
        class="skeleton-item"
        :style="{
          width: i === rows ? '70%' : '100%',
          height: height || '16px'
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  display: inline-block;
}

.skeleton-item {
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.skeleton.animated .skeleton-item {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
