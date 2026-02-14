<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
  status?: 'process' | 'finish' | 'error'
  items?: Array<{ title: string; description?: string; icon?: string }>
}>()

const currentStep = computed(() => props.current)
</script>

<template>
  <div class="steps">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="step"
      :class="{
        active: index === currentStep,
        finished: index < currentStep,
        error: status === 'error' && index === currentStep
      }"
    >
      <div class="step-indicator">
        <div class="step-icon">
          <span v-if="item.icon">{{ item.icon }}</span>
          <span v-else-if="index < currentStep">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div v-if="index < items!.length - 1" class="step-line"></div>
      </div>
      <div class="step-content">
        <div class="step-title">{{ item.title }}</div>
        <div v-if="item.description" class="step-description">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.steps {
  display: flex;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.step-indicator {
  display: flex;
  align-items: center;
}

.step-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  font-size: 14px;
  color: var(--text-tertiary);
  background-color: var(--bg-primary);
}

.step.active .step-icon {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.step.finished .step-icon {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
}

.step.error .step-icon {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: var(--border-color);
  margin: 0 8px;
}

.step.finished .step-line {
  background-color: var(--primary-color);
}

.step-content {
  margin-top: 8px;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.step.active .step-title {
  color: var(--primary-color);
}

.step.error .step-title {
  color: var(--danger-color);
}

.step-description {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 4px;
}
</style>
