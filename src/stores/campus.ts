import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CampusInfo, InfoCategory } from '@/types'
import { mockCampusInfo } from '@/mock/data'

export const useCampusStore = defineStore('campus', () => {
  const infos = ref<CampusInfo[]>([...mockCampusInfo])
  const activeCategory = ref<InfoCategory | ''>('')
  const searchQuery = ref('')

  const filteredInfos = computed(() => {
    let result = infos.value
    if (activeCategory.value) {
      result = result.filter((i) => i.category === activeCategory.value)
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.content.toLowerCase().includes(query) ||
          i.tags.some((t) => t.includes(query))
      )
    }
    // Pinned items first, then by date
    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.createdAt - a.createdAt
    })
  })

  const categories = computed(() => {
    const cats: { key: InfoCategory; label: string; icon: string }[] = [
      { key: 'academic', label: '教务通知', icon: 'Document' },
      { key: 'dining', label: '餐饮服务', icon: 'Dish' },
      { key: 'facilities', label: '设施服务', icon: 'OfficeBuilding' },
      { key: 'transport', label: '交通出行', icon: 'Bus' },
      { key: 'events', label: '校园活动', icon: 'Flag' },
      { key: 'emergency', label: '应急信息', icon: 'FirstAidKit' },
    ]
    return cats
  })

  return {
    infos,
    filteredInfos,
    activeCategory,
    searchQuery,
    categories,
  }
})
