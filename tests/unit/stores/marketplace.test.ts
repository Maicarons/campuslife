import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMarketplaceStore } from '@/stores/marketplace'

describe('useMarketplaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock products', () => {
    const store = useMarketplaceStore()
    expect(store.products.length).toBeGreaterThan(0)
  })

  it('should filter by category', () => {
    const store = useMarketplaceStore()
    store.filterCategory = '电子产品'
    expect(store.filteredProducts.every((p) => p.category === '电子产品')).toBe(true)
  })

  it('should filter by condition', () => {
    const store = useMarketplaceStore()
    store.filterCondition = 'like-new'
    expect(store.filteredProducts.every((p) => p.condition === 'like-new')).toBe(true)
  })

  it('should search products', () => {
    const store = useMarketplaceStore()
    store.searchQuery = 'iPad'
    expect(store.filteredProducts.some((p) => p.title.includes('iPad'))).toBe(true)
  })

  it('should sort by latest', () => {
    const store = useMarketplaceStore()
    store.sortMode = 'latest'
    const dates = store.filteredProducts.map((p) => p.createdAt)
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i])
    }
  })

  it('should sort by price ascending', () => {
    const store = useMarketplaceStore()
    store.sortMode = 'price-asc'
    const prices = store.filteredProducts.map((p) => p.price)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i - 1]).toBeLessThanOrEqual(prices[i])
    }
  })

  it('should sort by price descending', () => {
    const store = useMarketplaceStore()
    store.sortMode = 'price-desc'
    const prices = store.filteredProducts.map((p) => p.price)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i - 1]).toBeGreaterThanOrEqual(prices[i])
    }
  })

  it('should add product', () => {
    const store = useMarketplaceStore()
    const count = store.products.length

    store.addProduct({
      title: '测试商品',
      description: '测试描述',
      price: 100,
      category: '测试',
      condition: 'new',
      status: 'available',
      images: [],
      contact: 'test',
      userId: 'test',
    })

    expect(store.products).toHaveLength(count + 1)
  })

  it('should delete product', () => {
    const store = useMarketplaceStore()
    const id = store.products[0].id
    const count = store.products.length

    store.deleteProduct(id)
    expect(store.products).toHaveLength(count - 1)
  })

  it('should compute categories', () => {
    const store = useMarketplaceStore()
    expect(store.categories.length).toBeGreaterThan(0)
  })
})
