import { defineStore } from 'pinia'
import { ref } from 'vue'
import { healthApi } from '@/api'

export interface ExerciseLog {
  id: number
  type: string
  duration: number
  calories: number
  distance: number
  steps: number
  note: string
  date: string | null
  created_at: string
}

export interface SleepLog {
  id: number
  bed_time: string | null
  wake_time: string | null
  duration: number
  quality: number
  note: string
  date: string | null
  created_at: string
}

export interface MoodLog {
  id: number
  mood: number
  stress_level: number
  note: string
  tags: string[]
  date: string | null
  created_at: string
}

export const useHealthStore = defineStore('health', () => {
  const exerciseLogs = ref<ExerciseLog[]>([])
  const sleepLogs = ref<SleepLog[]>([])
  const moodLogs = ref<MoodLog[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const [exRes, slRes, moRes] = await Promise.allSettled([
        healthApi.getExerciseLogs(),
        healthApi.getSleepLogs(),
        healthApi.getMoodLogs(),
      ])
      if (exRes.status === 'fulfilled') exerciseLogs.value = exRes.value.data
      if (slRes.status === 'fulfilled') sleepLogs.value = slRes.value.data
      if (moRes.status === 'fulfilled') moodLogs.value = moRes.value.data
    } finally { loading.value = false }
  }

  async function addExercise(log: Partial<ExerciseLog>) {
    const { data } = await healthApi.createExerciseLog(log)
    exerciseLogs.value.unshift(data)
    return data
  }

  async function addSleep(log: Partial<SleepLog>) {
    const { data } = await healthApi.createSleepLog(log)
    sleepLogs.value.unshift(data)
    return data
  }

  async function addMood(log: Partial<MoodLog>) {
    const { data } = await healthApi.createMoodLog(log)
    moodLogs.value.unshift(data)
    return data
  }

  return {
    exerciseLogs, sleepLogs, moodLogs, loading,
    fetchAll, addExercise, addSleep, addMood,
  }
})
