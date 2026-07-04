import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductCondition } from '@/types'
import { generateId } from '@/utils/helpers'
import { mockProducts } from '@/mock/data'

export const useMarketplaceStore = defineStore('marketplace', () => {
  const products = ref<Product[]>([...mockProducts])
  const filterCategory = ref('')
  const filterCondition = ref<ProductCondition | ''>('')
  const searchQuery = ref('')
  const sortMode = ref<'latest' | 'price-asc' | 'price-desc'>('latest')
  const viewMode = ref<'grid' | 'list'>('grid')

  const filteredProducts = computed(() => {
    let result = products.value.filter((p) => p.status === 'available')
    if (filterCategory.value) {
      result = result.filter((p) => p.category === filterCategory.value)
    }
    if (filterCondition.value) {
      result = result.filter((p) => p.condition === filterCondition.value)
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }
    switch (sortMode.value) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        result.sort((a, b) => b.createdAt - a.createdAt)
    }
    return result
  })

  const categories = computed(() => {
    const cats = new Set(products.value.map((p) => p.category))
    return Array.from(cats)
  })

  function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    products.value.unshift(newProduct)
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    const index = products.value.findIndex((p) => p.id === id)
    if (index > -1) {
      products.value[index] = { ...products.value[index], ...updates, updatedAt: Date.now() }
    }
  }

  function deleteProduct(id: string) {
    const index = products.value.findIndex((p) => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  return {
    products,
    filteredProducts,
    filterCategory,
    filterCondition,
    searchQuery,
    sortMode,
    viewMode,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
  }
})
