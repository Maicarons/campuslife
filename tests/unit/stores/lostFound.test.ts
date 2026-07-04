import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLostFoundStore } from '@/stores/lostFound'

describe('useLostFoundStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock data', () => {
    const store = useLostFoundStore()
    expect(store.items.length).toBeGreaterThan(0)
  })

  it('should filter by status', () => {
    const store = useLostFoundStore()
    store.setFilters('lost', '', '')

    expect(store.filteredItems.every((i) => i.status === 'lost')).toBe(true)
  })

  it('should filter by category', () => {
    const store = useLostFoundStore()
    store.setFilters('', 'electronics', '')

    expect(store.filteredItems.every((i) => i.category === 'electronics')).toBe(true)
  })

  it('should filter by search query', () => {
    const store = useLostFoundStore()
    store.setFilters('', '', 'AirPods')

    expect(store.filteredItems.some((i) => i.title.includes('AirPods'))).toBe(true)
  })

  it('should add new item', () => {
    const store = useLostFoundStore()
    const count = store.items.length

    store.addItem({
      title: '测试物品',
      description: '测试描述',
      category: 'other',
      status: 'lost',
      location: '测试地点',
      contact: '测试联系方式',
      images: [],
      userId: 'test',
    })

    expect(store.items).toHaveLength(count + 1)
    expect(store.items[0].title).toBe('测试物品')
  })

  it('should update item', () => {
    const store = useLostFoundStore()
    const id = store.items[0].id

    store.updateItem(id, { title: '更新标题' })
    expect(store.items.find((i) => i.id === id)?.title).toBe('更新标题')
  })

  it('should delete item', () => {
    const store = useLostFoundStore()
    const id = store.items[0].id
    const count = store.items.length

    store.deleteItem(id)
    expect(store.items).toHaveLength(count - 1)
  })

  it('should compute lost and found counts', () => {
    const store = useLostFoundStore()
    expect(store.lostCount).toBeGreaterThan(0)
    expect(store.foundCount).toBeGreaterThan(0)
  })
})
