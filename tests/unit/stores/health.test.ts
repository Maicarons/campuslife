import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHealthStore } from '@/stores/health'

vi.mock('@/api', () => ({
  healthApi: {
    getExerciseLogs: vi.fn().mockResolvedValue({ data: [] }),
    getSleepLogs: vi.fn().mockResolvedValue({ data: [] }),
    getMoodLogs: vi.fn().mockResolvedValue({ data: [] }),
    createExerciseLog: vi.fn().mockResolvedValue({
      data: { id: 1, type: '跑步', duration: 30, calories: 200, distance: 5, steps: 6000, note: '', date: null, created_at: '2026-01-01' },
    }),
    createSleepLog: vi.fn().mockResolvedValue({
      data: { id: 1, bed_time: null, wake_time: null, duration: 8, quality: 4, note: '', date: null, created_at: '2026-01-01' },
    }),
    createMoodLog: vi.fn().mockResolvedValue({
      data: { id: 1, mood: 4, stress_level: 2, note: '心情不错', tags: ['开心'], date: null, created_at: '2026-01-01' },
    }),
  },
}))

describe('Health Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty logs', () => {
    const store = useHealthStore()
    expect(store.exerciseLogs).toEqual([])
    expect(store.sleepLogs).toEqual([])
    expect(store.moodLogs).toEqual([])
  })

  it('should fetch all health data', async () => {
    const store = useHealthStore()
    await store.fetchAll()
    expect(store.exerciseLogs).toEqual([])
    expect(store.sleepLogs).toEqual([])
    expect(store.moodLogs).toEqual([])
  })

  it('should add an exercise log', async () => {
    const store = useHealthStore()
    await store.addExercise({ type: '跑步', duration: 30, calories: 200 })
    expect(store.exerciseLogs).toHaveLength(1)
    expect(store.exerciseLogs[0].type).toBe('跑步')
    expect(store.exerciseLogs[0].duration).toBe(30)
  })

  it('should add a sleep log', async () => {
    const store = useHealthStore()
    await store.addSleep({ duration: 8, quality: 4 })
    expect(store.sleepLogs).toHaveLength(1)
    expect(store.sleepLogs[0].duration).toBe(8)
    expect(store.sleepLogs[0].quality).toBe(4)
  })

  it('should add a mood log', async () => {
    const store = useHealthStore()
    await store.addMood({ mood: 4, stress_level: 2, note: '心情不错', tags: ['开心'] })
    expect(store.moodLogs).toHaveLength(1)
    expect(store.moodLogs[0].mood).toBe(4)
    expect(store.moodLogs[0].note).toBe('心情不错')
  })
})
