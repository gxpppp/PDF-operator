import { ref, onMounted, onUnmounted, computed } from 'vue'

export interface MediaQueryOptions {
  defaultMatches?: boolean
}

export function useMediaQuery(
  query: string,
  options: MediaQueryOptions = {}
) {
  const { defaultMatches = false } = options

  const matches = ref(defaultMatches)
  let mediaQueryList: MediaQueryList | null = null

  function updateMatches(): void {
    if (mediaQueryList) {
      matches.value = mediaQueryList.matches
    }
  }

  function setup(): void {
    if (typeof window === 'undefined') return

    mediaQueryList = window.matchMedia(query)
    matches.value = mediaQueryList.matches

    mediaQueryList.addEventListener('change', updateMatches)
  }

  function cleanup(): void {
    if (mediaQueryList) {
      mediaQueryList.removeEventListener('change', updateMatches)
    }
  }

  onMounted(setup)
  onUnmounted(cleanup)

  return matches
}

export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 639px)')
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)')
  const isWideScreen = useMediaQuery('(min-width: 1536px)')

  const current = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isDesktop.value) return 'desktop'
    if (isLargeDesktop.value) return 'largeDesktop'
    if (isWideScreen.value) return 'wideScreen'
    return 'unknown'
  })

  const isXs = useMediaQuery('(max-width: 479px)')
  const isSm = useMediaQuery('(min-width: 480px) and (max-width: 639px)')
  const isMd = useMediaQuery('(min-width: 640px) and (max-width: 767px)')
  const isLg = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isXl = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)')
  const is2xl = useMediaQuery('(min-width: 1280px)')

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isWideScreen,
    current,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl
  }
}

export function useDarkMode() {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isLight = computed(() => !isDark.value)

  return {
    isDark,
    isLight
  }
}

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useColorScheme() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)')
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)')

  const scheme = computed(() => {
    if (prefersDark.value) return 'dark'
    if (prefersLight.value) return 'light'
    return 'no-preference'
  })

  return {
    prefersDark,
    prefersLight,
    prefersHighContrast,
    scheme
  }
}

export default useMediaQuery
