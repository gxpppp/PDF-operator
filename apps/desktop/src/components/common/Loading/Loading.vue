<script setup lang="ts">
defineProps<{
  loading?: boolean
  text?: string
  fullscreen?: boolean
}>()
</script>

<template>
  <div class="loading" :class="{ fullscreen }">
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <span v-if="text" class="loading-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
}

.loading.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.dark .loading.fullscreen {
  background-color: rgba(15, 23, 42, 0.9);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-tertiary);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
