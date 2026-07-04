import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LostFoundItem, ItemStatus, ItemCategory } from '@/types'
import { generateId } from '@/utils/helpers'
import { mockLostFoundItems } from '@/mock/data'

export const useLostFoundStore = defineStore('lostFound', () => {
  const items = ref<LostFoundItem[]>([...mockLostFoundItems])
  const filterStatus = ref<ItemStatus | ''>('')
  const filterCategory = ref<ItemCategory | ''>('')
  const searchQuery = ref('')
  const loading = ref(false)

  const filteredItems = computed(() => {
    let result = items.value
    if (filterStatus.value) {
      result = result.filter((item) => item.status === filterStatus.value)
    }
    if (filterCategory.value) {
      result = result.filter((item) => item.category === filterCategory.value)
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      )
    }
    return result.sort((a, b) => b.createdAt - a.createdAt)
  })

  const lostCount = computed(() => items.value.filter((i) => i.status === 'lost').length)
  const foundCount = computed(() => items.value.filter((i) => i.status === 'found').length)
  const claimedCount = computed(() => items.value.filter((i) => i.status === 'claimed').length)

  function addItem(item: Omit<LostFoundItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const newItem: LostFoundItem = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    items.value.unshift(newItem)
  }

  function updateItem(id: string, updates: Partial<LostFoundItem>) {
    const index = items.value.findIndex((i) => i.id === id)
    if (index > -1) {
      items.value[index] = { ...items.value[index], ...updates, updatedAt: Date.now() }
    }
  }

  function claimItem(id: string) {
    updateItem(id, { status: 'claimed' })
  }

  function deleteItem(id: string) {
    const index = items.value.findIndex((i) => i.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function setFilters(status: ItemStatus | '', category: ItemCategory | '', query: string) {
    filterStatus.value = status
    filterCategory.value = category
    searchQuery.value = query
  }

  return {
    items,
    filteredItems,
    filterStatus,
    filterCategory,
    searchQuery,
    loading,
    lostCount,
    foundCount,
    claimedCount,
    addItem,
    updateItem,
    claimItem,
    deleteItem,
    setFilters,
  }
})
