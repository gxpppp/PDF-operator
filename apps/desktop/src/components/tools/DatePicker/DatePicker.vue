<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | Date
  format?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref<Date | null>(null)

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return formatDate(selectedDate.value)
})

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const days: (number | null)[] = []
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null)
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(i)
  }
  
  return days
})

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDay(day: number) {
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day)
  emit('update:modelValue', formatDate(selectedDate.value))
  isOpen.value = false
}

function isSelected(day: number): boolean {
  if (!selectedDate.value) return false
  return (
    selectedDate.value.getDate() === day &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getFullYear() === currentYear.value
  )
}

function isToday(day: number): boolean {
  const today = new Date()
  return (
    today.getDate() === day &&
    today.getMonth() === currentMonth.value &&
    today.getFullYear() === currentYear.value
  )
}
</script>

<template>
  <div class="date-picker">
    <input
      type="text"
      :value="displayValue"
      :placeholder="placeholder || '选择日期'"
      :disabled="disabled"
      class="date-input"
      readonly
      @click="isOpen = !isOpen"
    />
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="date-panel">
        <div class="date-header">
          <button class="nav-btn" @click="prevMonth">‹</button>
          <span class="month-year">{{ currentYear }}年 {{ monthNames[currentMonth] }}</span>
          <button class="nav-btn" @click="nextMonth">›</button>
        </div>
        
        <div class="weekdays">
          <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
        </div>
        
        <div class="days">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="day"
            :class="{
              empty: day === null,
              selected: day !== null && isSelected(day),
              today: day !== null && isToday(day)
            }"
            @click="day !== null && selectDay(day)"
          >
            {{ day }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.date-picker {
  position: relative;
  display: inline-block;
}

.date-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.date-panel {
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
  width: 280px;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.month-year {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.nav-btn:hover {
  background-color: var(--bg-tertiary);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary);
  padding: 4px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.day:hover:not(.empty) {
  background-color: var(--bg-tertiary);
}

.day.empty {
  cursor: default;
}

.day.selected {
  background-color: var(--primary-color);
  color: white;
}

.day.today {
  border: 1px solid var(--primary-color);
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
