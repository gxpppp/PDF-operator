import { onMounted, onUnmounted, type Ref } from 'vue'

type EventTargetLike = EventTarget | Ref<EventTarget | null>

export function useEventListener(
  target: EventTargetLike,
  event: string,
  callback: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void

export function useEventListener(
  target: EventTargetLike,
  events: Array<{ event: string; callback: EventListenerOrEventListenerObject; options?: AddEventListenerOptions }>
): () => void

export function useEventListener(
  target: EventTargetLike,
  eventOrEvents: string | Array<{ event: string; callback: EventListenerOrEventListenerObject; options?: AddEventListenerOptions }>,
  callback?: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void {
  const events = typeof eventOrEvents === 'string'
    ? [{ event: eventOrEvents, callback: callback!, options }]
    : eventOrEvents

  function getTarget(): EventTarget | null {
    if (target && typeof target === 'object' && 'value' in target) {
      return target.value
    }
    return target as EventTarget
  }

  function addListeners(): void {
    const targetEl = getTarget()
    if (!targetEl) return

    events.forEach(({ event, callback, options }) => {
      targetEl.addEventListener(event, callback, options)
    })
  }

  function removeListeners(): void {
    const targetEl = getTarget()
    if (!targetEl) return

    events.forEach(({ event, callback, options }) => {
      targetEl.removeEventListener(event, callback, options)
    })
  }

  onMounted(() => {
    addListeners()
  })

  onUnmounted(() => {
    removeListeners()
  })

  return () => {
    removeListeners()
  }
}

export function useWindowEvent(
  event: string,
  callback: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void {
  return useEventListener(window, event, callback, options)
}

export function useDocumentEvent(
  event: string,
  callback: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void {
  return useEventListener(document, event, callback, options)
}

export default useEventListener
