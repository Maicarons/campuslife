import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/app'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with defaults', () => {
    const store = useAppStore()
    expect(store.sidebarCollapsed).toBe(false)
    expect(store.currentTheme).toBeDefined()
  })

  it('should toggle dark mode', () => {
    const store = useAppStore()
    const initial = store.isDark

    store.toggleDark()
    expect(store.isDark).toBe(!initial)
  })

  it('should toggle sidebar', () => {
    const store = useAppStore()
    const initial = store.sidebarCollapsed

    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(!initial)
  })
})
