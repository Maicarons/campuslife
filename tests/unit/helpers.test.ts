import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateId,
  formatRelativeTime,
  formatDate,
  formatDateTime,
  formatPrice,
  truncateText,
  debounce,
  throttle,
  deepClone,
} from '@/utils/helpers'

describe('helpers', () => {
  describe('generateId', () => {
    it('should generate a string', () => {
      expect(typeof generateId()).toBe('string')
    })

    it('should generate unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()))
      expect(ids.size).toBe(100)
    })
  })

  describe('formatRelativeTime', () => {
    it('should return "刚刚" for recent timestamps', () => {
      const now = Date.now()
      expect(formatRelativeTime(now - 1000)).toBe('刚刚')
    })

    it('should return minutes ago', () => {
      const now = Date.now()
      expect(formatRelativeTime(now - 5 * 60 * 1000)).toBe('5分钟前')
    })

    it('should return hours ago', () => {
      const now = Date.now()
      expect(formatRelativeTime(now - 3 * 60 * 60 * 1000)).toBe('3小时前')
    })

    it('should return days ago', () => {
      const now = Date.now()
      expect(formatRelativeTime(now - 2 * 24 * 60 * 60 * 1000)).toBe('2天前')
    })
  })

  describe('formatDate', () => {
    it('should format a timestamp to date string', () => {
      const ts = new Date(2025, 0, 15).getTime()
      const result = formatDate(ts)
      expect(result).toContain('2025')
      expect(result).toContain('01')
      expect(result).toContain('15')
    })
  })

  describe('formatDateTime', () => {
    it('should format a timestamp to datetime string', () => {
      const ts = new Date(2025, 5, 15, 14, 30).getTime()
      const result = formatDateTime(ts)
      expect(result).toContain('2025')
      expect(result).toContain('14')
      expect(result).toContain('30')
    })
  })

  describe('formatPrice', () => {
    it('should format price with currency symbol', () => {
      expect(formatPrice(10)).toBe('¥10.00')
      expect(formatPrice(0)).toBe('¥0.00')
      expect(formatPrice(99.9)).toBe('¥99.90')
    })
  })

  describe('truncateText', () => {
    it('should return original text if shorter than max', () => {
      expect(truncateText('hello', 10)).toBe('hello')
    })

    it('should truncate text with ellipsis', () => {
      expect(truncateText('hello world', 5)).toBe('hello...')
    })

    it('should handle exact length', () => {
      expect(truncateText('hello', 5)).toBe('hello')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should throttle function calls', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('deepClone', () => {
    it('should deep clone an object', () => {
      const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] }
      const cloned = deepClone(obj)

      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
      expect(cloned.d).not.toBe(obj.d)
    })

    it('should handle primitives', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('hello')).toBe('hello')
    })
  })
})
