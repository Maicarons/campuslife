import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCampusStore } from '@/stores/campus'

describe('useCampusStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock infos', () => {
    const store = useCampusStore()
    expect(store.infos.length).toBeGreaterThan(0)
  })

  it('should filter by category', () => {
    const store = useCampusStore()
    store.activeCategory = 'academic'
    expect(store.filteredInfos.every((i) => i.category === 'academic')).toBe(true)
  })

  it('should search infos', () => {
    const store = useCampusStore()
    store.searchQuery = '图书馆'
    expect(store.filteredInfos.some((i) => i.title.includes('图书馆'))).toBe(true)
  })

  it('should sort pinned items first', () => {
    const store = useCampusStore()
    const pinned = store.filteredInfos.filter((i) => i.isPinned)
    if (pinned.length > 0) {
      expect(store.filteredInfos[0].isPinned).toBe(true)
    }
  })

  it('should have categories', () => {
    const store = useCampusStore()
    expect(store.categories.length).toBe(6)
  })
})
