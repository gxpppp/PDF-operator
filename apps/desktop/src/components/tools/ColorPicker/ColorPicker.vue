<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  presetColors?: string[]
  showAlpha?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const hue = ref(0)
const saturation = ref(100)
const brightness = ref(100)
const alpha = ref(100)

const defaultPresets = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#8B00FF',
  '#FF1493', '#00CED1', '#32CD32', '#FFD700', '#FF6347', '#4169E1', '#9400D3',
  '#FFFFFF', '#C0C0C0', '#808080', '#404040', '#000000'
]

const presets = computed(() => props.presetColors || defaultPresets)

const currentColor = computed(() => {
  return `hsla(${hue.value}, ${saturation.value}%, ${brightness.value}%, ${alpha.value / 100})`
})

function selectPreset(color: string) {
  emit('update:modelValue', color)
  isOpen.value = false
}

function handleColorPickerChange(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="color-picker">
    <div
      class="color-trigger"
      :style="{ backgroundColor: modelValue || '#000000' }"
      @click="isOpen = !isOpen"
    ></div>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="color-panel">
        <div class="color-input-wrapper">
          <input
            type="color"
            :value="modelValue || '#000000'"
            class="native-picker"
            @input="handleColorPickerChange"
          />
          <input
            type="text"
            :value="modelValue || '#000000'"
            class="color-text"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          />
        </div>
        
        <div class="preset-colors">
          <div
            v-for="color in presets"
            :key="color"
            class="preset-color"
            :class="{ active: modelValue === color }"
            :style="{ backgroundColor: color }"
            @click="selectPreset(color)"
          ></div>
        </div>
        
        <div v-if="showAlpha" class="alpha-slider">
          <label>透明度</label>
          <input
            type="range"
            v-model="alpha"
            min="0"
            max="100"
          />
          <span>{{ alpha }}%</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.color-picker {
  position: relative;
  display: inline-block;
}

.color-trigger {
  width: 36px;
  height: 36px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.color-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 12px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  min-width: 220px;
}

.color-input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.native-picker {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.color-text {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: monospace;
}

.preset-colors {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.preset-color {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 2px solid transparent;
}

.preset-color:hover {
  transform: scale(1.1);
}

.preset-color.active {
  border-color: var(--primary-color);
}

.alpha-slider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.alpha-slider label {
  font-size: 12px;
  color: var(--text-secondary);
}

.alpha-slider input {
  flex: 1;
}

.alpha-slider span {
  font-size: 12px;
  color: var(--text-tertiary);
  min-width: 36px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
