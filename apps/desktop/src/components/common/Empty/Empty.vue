<script setup lang="ts">
defineProps<{
  description?: string
  icon?: string
}>()
</script>

<template>
  <div class="empty">
    <div class="empty-icon">
      <span v-if="icon">{{ icon }}</span>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    </div>
    <p class="empty-description">{{ description || '暂无数据' }}</p>
    <div v-if="$slots.default" class="empty-action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: var(--text-tertiary);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-icon span {
  font-size: 48px;
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.empty-action {
  margin-top: 8px;
}
</style>
