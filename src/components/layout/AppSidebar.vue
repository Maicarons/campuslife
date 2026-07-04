<template>
  <el-aside :width="isCollapsed ? '64px' : '220px'" class="app-sidebar">
    <div class="logo" @click="$router.push('/')">
      <span v-if="!isCollapsed">🎓 CampusLife</span>
      <span v-else>🎓</span>
    </div>
    <el-menu
      :default-active="currentRoute"
      :collapse="isCollapsed"
      router
      class="sidebar-menu"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
    <div class="sidebar-footer">
      <el-button :icon="isCollapsed ? 'Expand' : 'Fold'" text @click="appStore.toggleSidebar()" />
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  ChatDotRound, Reading, OfficeBuilding, Money, Search,
  ShoppingCart, ChatLineSquare, User, FirstAidKit, Opportunity,
  Medal, UserFilled,
} from '@element-plus/icons-vue'

const route = useRoute()
const appStore = useAppStore()
const isCollapsed = computed(() => appStore.sidebarCollapsed)
const currentRoute = computed(() => route.path)

const menuItems = [
  { path: '/assistant', title: 'AI 助手', icon: ChatDotRound },
  { path: '/academics', title: '学业管理', icon: Reading },
  { path: '/campus', title: '校园信息', icon: OfficeBuilding },
  { path: '/finance', title: '财务管理', icon: Money },
  { path: '/lost-found', title: '失物招领', icon: Search },
  { path: '/marketplace', title: '二手市场', icon: ShoppingCart },
  { path: '/qa', title: '问答广场', icon: ChatLineSquare },
  { path: '/social', title: '社交通讯', icon: User },
  { path: '/health', title: '健康管理', icon: FirstAidKit },
  { path: '/volunteer', title: '志愿公益', icon: Opportunity },
  { path: '/points', title: '积分中心', icon: Medal },
  { path: '/profile', title: '个人资料', icon: UserFilled },
]
</script>

<style lang="scss" scoped>
.app-sidebar {
  background: #fff;
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid var(--el-border-color-lighter);
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 8px;
  text-align: center;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
