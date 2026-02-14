export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  let result: ReturnType<T>
  
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  } as T
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    function attempt() {
      attempts++
      fn()
        .then(resolve)
        .catch((error) => {
          if (attempts < maxAttempts) {
            setTimeout(attempt, delay)
          } else {
            reject(error)
          }
        })
    }
    
    attempt()
  })
}
