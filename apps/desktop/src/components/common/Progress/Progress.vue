<script setup lang="ts">
defineProps<{
  percent: number
  showText?: boolean
}>()
</script>

<template>
  <div class="progress">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${percent}%` }"></div>
    </div>
    <span v-if="showText" class="progress-text">{{ percent }}%</span>
  </div>
</template>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 40px;
}
</style>
