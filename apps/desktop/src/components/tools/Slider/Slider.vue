<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showInput?: boolean
  showMarks?: boolean
  marks?: Record<number, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const value = computed(() => props.modelValue || 0)
const minVal = computed(() => props.min ?? 0)
const maxVal = computed(() => props.max ?? 100)
const stepVal = computed(() => props.step ?? 1)

const percentage = computed(() => {
  return ((value.value - minVal.value) / (maxVal.value - minVal.value)) * 100
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', parseFloat(target.value))
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  let val = parseFloat(target.value)
  val = Math.max(minVal.value, Math.min(maxVal.value, val))
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="slider" :class="{ disabled }">
    <div class="slider-track">
      <div class="slider-fill" :style="{ width: `${percentage}%` }"></div>
      <input
        type="range"
        :value="value"
        :min="minVal"
        :max="maxVal"
        :step="stepVal"
        :disabled="disabled"
        class="slider-input"
        @input="handleInput"
      />
      <div class="slider-thumb" :style="{ left: `${percentage}%` }"></div>
    </div>
    
    <div v-if="showMarks && marks" class="slider-marks">
      <div
        v-for="(label, key) in marks"
        :key="key"
        class="slider-mark"
        :style="{ left: `${((Number(key) - minVal) / (maxVal - minVal)) * 100}%` }"
      >
        {{ label }}
      </div>
    </div>
    
    <input
      v-if="showInput"
      type="number"
      :value="value"
      :min="minVal"
      :max="maxVal"
      :step="stepVal"
      :disabled="disabled"
      class="slider-number"
      @change="handleInputChange"
    />
  </div>
</template>

<style scoped>
.slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.slider-track {
  position: relative;
  flex: 1;
  height: 4px;
  background-color: var(--bg-tertiary);
  border-radius: 2px;
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background-color: white;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: var(--shadow-sm);
}

.slider-marks {
  position: relative;
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.slider-mark {
  position: absolute;
  transform: translateX(-50%);
}

.slider-number {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 13px;
  text-align: center;
}

.slider-number::-webkit-inner-spin-button {
  opacity: 0;
}
</style>
