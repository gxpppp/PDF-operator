<script setup lang="ts">
defineProps<{
  items: Array<{
    color?: string
    icon?: string
    title: string
    description?: string
    time?: string
  }>
}>()
</script>

<template>
  <div class="timeline">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="timeline-item"
    >
      <div class="timeline-tail"></div>
      <div
        class="timeline-dot"
        :style="{ backgroundColor: item.color || 'var(--primary-color)' }"
      >
        <span v-if="item.icon">{{ item.icon }}</span>
      </div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-title">{{ item.title }}</span>
          <span v-if="item.time" class="timeline-time">{{ item.time }}</span>
        </div>
        <p v-if="item.description" class="timeline-description">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  padding: 16px 0;
}

.timeline-item {
  position: relative;
  padding: 0 0 24px 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-tail {
  position: absolute;
  left: 6px;
  top: 16px;
  bottom: 0;
  width: 2px;
  background-color: var(--border-color);
}

.timeline-item:last-child .timeline-tail {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
}

.timeline-content {
  padding: 4px 0 0 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.timeline-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.timeline-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
