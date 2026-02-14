<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  icon?: string
  hoverable?: boolean
}>()
</script>

<template>
  <div class="card" :class="{ hoverable }">
    <div v-if="title || $slots.header" class="card-header">
      <div class="card-header-content">
        <span v-if="icon" class="card-icon">{{ icon }}</span>
        <div>
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card.hoverable {
  transition: all 0.2s ease;
}

.card.hoverable:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.card-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}
</style>
