import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage keys used by auth store
    try { localStorage.removeItem('campuslife-token') } catch {}
  })

  it('should initialize with no token when localStorage is empty', () => {
    const store = useAuthStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toBeNull()
  })

  it('should set token and mark as logged in', () => {
    const store = useAuthStore()
    store.setToken('test-token-123')
    expect(store.token).toBe('test-token-123')
    expect(store.isLoggedIn).toBe(true)
  })

  it('should set user info', () => {
    const store = useAuthStore()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@test.com',
      role: 'student',
      avatar: '',
      nickname: 'Test',
      school_id: 1,
      college_id: null,
      major_id: null,
      grade_id: null,
      class_id: null,
      enrollment_year: null,
      points: 100,
      level: 3,
      is_active: true,
      created_at: '2026-01-01',
    }
    store.setUser(mockUser as any)
    expect(store.user?.username).toBe('testuser')
    expect(store.user?.points).toBe(100)
  })

  it('should logout and clear state', () => {
    const store = useAuthStore()
    store.setToken('test-token')
    store.logout()
    expect(store.token).toBe('')
    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toBeNull()
  })
})
