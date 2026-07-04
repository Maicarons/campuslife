import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVolunteerStore } from '@/stores/volunteer'

describe('useVolunteerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock activities', () => {
    const store = useVolunteerStore()
    expect(store.activities.length).toBeGreaterThan(0)
  })

  it('should filter by status', () => {
    const store = useVolunteerStore()
    store.filterStatus = 'upcoming'
    expect(store.filteredActivities.every((a) => a.status === 'upcoming')).toBe(true)
  })

  it('should search activities', () => {
    const store = useVolunteerStore()
    store.searchQuery = '图书馆'
    expect(store.filteredActivities.some((a) => a.title.includes('图书馆'))).toBe(true)
  })

  it('should compute stats', () => {
    const store = useVolunteerStore()
    expect(store.stats.total).toBe(store.activities.length)
    expect(store.stats.upcoming).toBeGreaterThanOrEqual(0)
  })

  it('should register for activity', () => {
    const store = useVolunteerStore()
    const activityId = store.activities[0].id

    const result = store.registerForActivity(activityId, {
      userId: 'test',
      name: '测试用户',
      phone: '13800000000',
      studentId: '2024TEST',
    })

    expect(result).toBe(true)
    expect(store.isRegistered(activityId, '2024TEST')).toBe(true)
  })

  it('should not allow duplicate registration', () => {
    const store = useVolunteerStore()
    const activityId = store.activities[0].id

    store.registerForActivity(activityId, {
      userId: 'test',
      name: '测试用户',
      phone: '13800000000',
      studentId: '2024TEST',
    })

    const result = store.registerForActivity(activityId, {
      userId: 'test',
      name: '测试用户',
      phone: '13800000000',
      studentId: '2024TEST',
    })

    expect(result).toBe(false)
  })

  it('should increment participant count on registration', () => {
    const store = useVolunteerStore()
    const activityId = store.activities[0].id
    const before = store.activities[0].currentParticipants

    store.registerForActivity(activityId, {
      userId: 'test',
      name: '测试用户',
      phone: '13800000000',
      studentId: '2024TEST',
    })

    expect(store.activities[0].currentParticipants).toBe(before + 1)
  })
})
