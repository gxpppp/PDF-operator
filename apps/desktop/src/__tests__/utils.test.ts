import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatFileSize, formatDate, formatDuration, formatNumber } from '@/utils/format'
import { getFileExtension, getFileName, isPdfFile, isImageFile } from '@/utils/file'
import { sleep, retry, withTimeout } from '@/utils/async'
import { unique, groupBy, sortBy } from '@/utils/array'

describe('Format Utils', () => {
  it('formats file size correctly', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('formats date correctly', () => {
    const date = new Date('2024-01-15T10:30:00')
    const formatted = formatDate(date, 'YYYY-MM-DD')
    expect(formatted).toContain('2024')
    expect(formatted).toContain('01')
    expect(formatted).toContain('15')
  })

  it('formats duration correctly', () => {
    expect(formatDuration(1000)).toBe('1s')
    expect(formatDuration(60000)).toBe('1m')
    expect(formatDuration(3600000)).toBe('1h')
  })

  it('formats numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1000000)).toBe('1,000,000')
  })
})

describe('File Utils', () => {
  it('gets file extension', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf')
    expect(getFileExtension('image.PNG')).toBe('png')
    expect(getFileExtension('noextension')).toBe('')
  })

  it('gets file name', () => {
    expect(getFileName('/path/to/document.pdf')).toBe('document.pdf')
    expect(getFileName('C:\\Users\\test\\file.txt')).toBe('file.txt')
  })

  it('checks if PDF file', () => {
    expect(isPdfFile('document.pdf')).toBe(true)
    expect(isPdfFile('document.PDF')).toBe(true)
    expect(isPdfFile('document.txt')).toBe(false)
  })

  it('checks if image file', () => {
    expect(isImageFile('image.png')).toBe(true)
    expect(isImageFile('image.jpg')).toBe(true)
    expect(isImageFile('image.jpeg')).toBe(true)
    expect(isImageFile('document.pdf')).toBe(false)
  })
})

describe('Async Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('sleeps for specified time', async () => {
    const promise = sleep(1000)
    vi.advanceTimersByTime(1000)
    await expect(promise).resolves.toBeUndefined()
  })

  it('retries failed operations', async () => {
    let attempts = 0
    const fn = vi.fn(() => {
      attempts++
      if (attempts < 3) throw new Error('Failed')
      return 'success'
    })

    const result = retry(fn, { maxAttempts: 3, delay: 100 })
    vi.advanceTimersByTime(300)
    
    await expect(result).resolves.toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('times out long operations', async () => {
    const slowFn = () => sleep(5000).then(() => 'result')
    
    const result = withTimeout(slowFn(), 1000)
    vi.advanceTimersByTime(1000)
    
    await expect(result).rejects.toThrow('timeout')
  })
})

describe('Array Utils', () => {
  it('removes duplicates', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b'])
  })

  it('groups by key', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ]
    
    const grouped = groupBy(items, 'type')
    
    expect(grouped['a']).toHaveLength(2)
    expect(grouped['b']).toHaveLength(1)
  })

  it('sorts by key', () => {
    const items = [
      { name: 'c', value: 3 },
      { name: 'a', value: 1 },
      { name: 'b', value: 2 },
    ]
    
    const sorted = sortBy(items, 'name')
    
    expect(sorted[0].name).toBe('a')
    expect(sorted[1].name).toBe('b')
    expect(sorted[2].name).toBe('c')
  })
})
