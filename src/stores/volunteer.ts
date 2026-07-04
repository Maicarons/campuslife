import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { VolunteerActivity, VolunteerRegistration } from '@/types'
import { generateId } from '@/utils/helpers'
import { mockVolunteerActivities } from '@/mock/data'

export const useVolunteerStore = defineStore('volunteer', () => {
  const activities = ref<VolunteerActivity[]>([...mockVolunteerActivities])
  const registrations = ref<VolunteerRegistration[]>([])
  const filterStatus = ref<string>('')
  const searchQuery = ref('')

  const filteredActivities = computed(() => {
    let result = activities.value
    if (filterStatus.value) {
      result = result.filter((a) => a.status === filterStatus.value)
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some((t) => t.includes(query))
      )
    }
    return result.sort((a, b) => a.startTime - b.startTime)
  })

  const stats = computed(() => ({
    total: activities.value.length,
    upcoming: activities.value.filter((a) => a.status === 'upcoming').length,
    ongoing: activities.value.filter((a) => a.status === 'ongoing').length,
    completed: activities.value.filter((a) => a.status === 'completed').length,
    totalParticipants: activities.value.reduce((sum, a) => sum + a.currentParticipants, 0),
  }))

  function registerForActivity(
    activityId: string,
    registration: Omit<VolunteerRegistration, 'id' | 'activityId' | 'registeredAt'>
  ) {
    const activity = activities.value.find((a) => a.id === activityId)
    if (!activity) return false
    if (activity.currentParticipants >= activity.maxParticipants) return false

    const existing = registrations.value.find(
      (r) => r.activityId === activityId && r.studentId === registration.studentId
    )
    if (existing) return false

    const newRegistration: VolunteerRegistration = {
      ...registration,
      id: generateId(),
      activityId,
      registeredAt: Date.now(),
    }
    registrations.value.push(newRegistration)
    activity.currentParticipants++
    return true
  }

  function isRegistered(activityId: string, studentId: string) {
    return registrations.value.some(
      (r) => r.activityId === activityId && r.studentId === studentId
    )
  }

  return {
    activities,
    filteredActivities,
    registrations,
    filterStatus,
    searchQuery,
    stats,
    registerForActivity,
    isRegistered,
  }
})
