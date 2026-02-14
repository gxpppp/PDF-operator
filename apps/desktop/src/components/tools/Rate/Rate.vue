<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: number
  count?: number
  allowHalf?: boolean
  disabled?: boolean
  icon?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverValue = ref<number | null>(null)

const starCount = computed(() => props.count || 5)
const currentValue = computed(() => hoverValue.value ?? props.modelValue ?? 0)

function getStarType(index: number): 'full' | 'half' | 'empty' {
  const value = currentValue.value
  if (value >= index) return 'full'
  if (props.allowHalf && value >= index - 0.5) return 'half'
  return 'empty'
}

function selectStar(index: number) {
  if (props.disabled) return
  emit('update:modelValue', index)
}

function selectHalfStar(index: number) {
  if (props.disabled || !props.allowHalf) return
  emit('update:modelValue', index - 0.5)
}

function handleMouseEnter(index: number) {
  if (props.disabled) return
  hoverValue.value = index
}

function handleMouseLeave() {
  hoverValue.value = null
}
</script>

<template>
  <div class="rate" :class="{ disabled }">
    <span
      v-for="i in starCount"
      :key="i"
      class="star"
      :class="getStarType(i)"
      @click="selectStar(i)"
      @mouseenter="handleMouseEnter(i)"
      @mouseleave="handleMouseLeave"
    >
      <span
        v-if="allowHalf"
        class="star-half"
        @click.stop="selectHalfStar(i)"
      ></span>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </span>
    <span v-if="modelValue !== undefined" class="rate-value">{{ modelValue }}</span>
  </div>
</template>

<style scoped>
.rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.rate.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.star {
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: var(--bg-tertiary);
  transition: color 0.2s ease;
}

.star svg {
  width: 100%;
  height: 100%;
}

.star.full {
  color: #fbbf24;
}

.star.half {
  color: #fbbf24;
}

.star.half svg {
  clip-path: inset(0 50% 0 0);
}

.star:hover {
  transform: scale(1.1);
}

.star-half {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  cursor: pointer;
}

.rate-value {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 8px;
}
</style>
