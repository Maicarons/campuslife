import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('AppSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the sidebar', async () => {
    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          'el-aside': { template: '<aside><slot /></aside>' },
          'el-menu': { template: '<nav><slot /></nav>' },
          'el-menu-item': { template: '<div class="menu-item"><slot /></div>' },
          'el-icon': { template: '<span><slot /></span>' },
          'el-button': { template: '<button><slot /></button>' },
        },
      },
    })
    expect(wrapper.find('.app-sidebar').exists()).toBe(true)
    expect(wrapper.find('.logo').exists()).toBe(true)
  })

  it('should render all menu items', async () => {
    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          'el-aside': { template: '<aside><slot /></aside>' },
          'el-menu': { template: '<nav><slot /></nav>' },
          'el-menu-item': { template: '<div class="menu-item"><slot /></div>' },
          'el-icon': { template: '<span><slot /></span>' },
          'el-button': { template: '<button><slot /></button>' },
        },
      },
    })
    const menuItems = wrapper.findAll('.menu-item')
    expect(menuItems.length).toBe(10) // 10 menu items in the updated sidebar
  })

  it('should have sidebar footer with collapse button', async () => {
    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          'el-aside': { template: '<aside><slot /></aside>' },
          'el-menu': { template: '<nav><slot /></nav>' },
          'el-menu-item': { template: '<div class="menu-item"><slot /></div>' },
          'el-icon': { template: '<span><slot /></span>' },
          'el-button': { template: '<button class="collapse-btn"><slot /></button>' },
        },
      },
    })
    expect(wrapper.find('.sidebar-footer').exists()).toBe(true)
    expect(wrapper.find('.collapse-btn').exists()).toBe(true)
  })
})
