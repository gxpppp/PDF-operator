export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

export function groupBy<T, K extends string | number>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function sortBy<T>(arr: T[], keyFn: (item: T) => number | string): T[] {
  return [...arr].sort((a, b) => {
    const keyA = keyFn(a)
    const keyB = keyFn(b)
    return keyA < keyB ? -1 : keyA > keyB ? 1 : 0
  })
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function flatten<T>(arr: T[][]): T[] {
  return arr.flat()
}

export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0)
}

export function average(arr: number[]): number {
  return arr.length === 0 ? 0 : sum(arr) / arr.length
}

export function min(arr: number[]): number {
  return Math.min(...arr)
}

export function max(arr: number[]): number {
  return Math.max(...arr)
}
