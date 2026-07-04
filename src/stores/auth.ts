import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  id: number
  username: string
  email: string
  role: string
  avatar: string
  nickname: string
  school_id: number | null
  college_id: number | null
  major_id: number | null
  grade_id: number | null
  class_id: number | null
  enrollment_year: number | null
  points: number
  level: number
  is_active: boolean
  created_at: string
}

function getStorage(key: string): string {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStorage('campuslife-token'))
  const user = ref<UserInfo | null>(null)
  const isLoggedIn = ref(!!token.value)

  function setToken(t: string) {
    token.value = t
    isLoggedIn.value = true
    try { localStorage.setItem('campuslife-token', t) } catch {}
  }

  function setUser(u: UserInfo) {
    user.value = u
  }

  function logout() {
    token.value = ''
    user.value = null
    isLoggedIn.value = false
    try { localStorage.removeItem('campuslife-token') } catch {}
  }

  return { token, user, isLoggedIn, setToken, setUser, logout }
})
