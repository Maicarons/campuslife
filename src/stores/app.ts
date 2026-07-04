import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

function getStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored !== null ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function setStoredValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage not available
  }
}

export const useAppStore = defineStore('app', () => {
  const isDark = ref(getStoredValue('campuslife-dark', false))
  const sidebarCollapsed = ref(getStoredValue('campuslife-sidebar', false))
  const currentTheme = ref<'light' | 'dark'>(isDark.value ? 'dark' : 'light')

  watch(isDark, (val) => {
    currentTheme.value = val ? 'dark' : 'light'
    setStoredValue('campuslife-dark', val)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', val)
    }
  })

  watch(sidebarCollapsed, (val) => {
    setStoredValue('campuslife-sidebar', val)
  })

  function toggleDark() {
    isDark.value = !isDark.value
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    isDark,
    currentTheme,
    sidebarCollapsed,
    toggleDark,
    toggleSidebar,
  }
})
