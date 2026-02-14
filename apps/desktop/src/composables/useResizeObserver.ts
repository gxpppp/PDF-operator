import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface ResizeObserverEntry {
  target: HTMLElement
  contentRect: DOMRectReadOnly
  borderBoxSize: ResizeObserverSize
  contentBoxSize: ResizeObserverSize
}

export function useResizeObserver(
  elementRef: Ref<HTMLElement | null>,
  callback?: (entry: ResizeObserverEntry) => void
) {
  const width = ref(0)
  const height = ref(0)
  const entry = ref<ResizeObserverEntry | null>(null)
  
  let observer: ResizeObserver | null = null

  function createObserver(): void {
    if (observer) {
      observer.disconnect()
    }

    observer = new ResizeObserver((entries) => {
      const currentEntry = entries[0]
      if (currentEntry) {
        width.value = currentEntry.contentRect.width
        height.value = currentEntry.contentRect.height
        
        const resizeEntry: ResizeObserverEntry = {
          target: currentEntry.target as HTMLElement,
          contentRect: currentEntry.contentRect,
          borderBoxSize: currentEntry.borderBoxSize[0],
          contentBoxSize: currentEntry.contentBoxSize[0]
        }
        
        entry.value = resizeEntry
        callback?.(resizeEntry)
      }
    })

    if (elementRef.value) {
      observer.observe(elementRef.value)
    }
  }

  function disconnect(): void {
    if (observer) {
      observer.disconnect()
    }
  }

  function reconnect(): void {
    disconnect()
    createObserver()
  }

  onMounted(() => {
    createObserver()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    width,
    height,
    entry,
    disconnect,
    reconnect
  }
}

export function useElementSize(elementRef: Ref<HTMLElement | null>) {
  const { width, height } = useResizeObserver(elementRef)

  const aspectRatio = computed(() => {
    if (height.value === 0) return 0
    return width.value / height.value
  })

  const isLandscape = computed(() => width.value > height.value)
  const isPortrait = computed(() => height.value > width.value)
  const isSquare = computed(() => width.value === height.value)

  return {
    width,
    height,
    aspectRatio,
    isLandscape,
    isPortrait,
    isSquare
  }
}

import { computed } from 'vue'

export default useResizeObserver
