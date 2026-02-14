import { ref, computed } from 'vue'

interface HistoryState<T> {
  past: T[]
  present: T | null
  future: T[]
}

export function useHistory<T>(initialState?: T, maxHistory: number = 50) {
  const state = ref<HistoryState<T>>({
    past: [],
    present: initialState || null,
    future: []
  })
  
  const canUndo = computed(() => state.value.past.length > 0)
  const canRedo = computed(() => state.value.future.length > 0)
  
  function push(newPresent: T) {
    if (state.value.present !== null) {
      state.value.past.push(state.value.present)
      
      if (state.value.past.length > maxHistory) {
        state.value.past.shift()
      }
    }
    
    state.value.present = newPresent
    state.value.future = []
  }
  
  function undo(): T | null {
    if (!canUndo.value) return null
    
    const previous = state.value.past.pop()!
    
    if (state.value.present !== null) {
      state.value.future.unshift(state.value.present)
    }
    
    state.value.present = previous
    return previous
  }
  
  function redo(): T | null {
    if (!canRedo.value) return null
    
    const next = state.value.future.shift()!
    
    if (state.value.present !== null) {
      state.value.past.push(state.value.present)
    }
    
    state.value.present = next
    return next
  }
  
  function reset(newPresent?: T) {
    state.value = {
      past: [],
      present: newPresent || null,
      future: []
    }
  }
  
  function clear() {
    state.value.past = []
    state.value.future = []
  }
  
  return {
    state,
    present: computed(() => state.value.present),
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    reset,
    clear
  }
}
