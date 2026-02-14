import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useIntersectionObserver(elementRef: Ref<HTMLElement | null>, options: IntersectionObserverInit = {}) {
  const isIntersecting = ref(false)
  const intersectionRatio = ref(0)
  let observer: IntersectionObserver | null = null

  function createObserver(): void {
    if (observer) observer.disconnect()
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        isIntersecting.value = entry.isIntersecting
        intersectionRatio.value = entry.intersectionRatio
      }
    }, { threshold: 0.1, ...options })

    if (elementRef.value) observer.observe(elementRef.value)
  }

  function disconnect(): void {
    if (observer) observer.disconnect()
  }

  onMounted(createObserver)
  onUnmounted(disconnect)

  return { isIntersecting, intersectionRatio, disconnect, reconnect: createObserver }
}

export default useIntersectionObserver
