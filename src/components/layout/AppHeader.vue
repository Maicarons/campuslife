<template>
  <el-header class="app-header" height="56px">
    <div class="header-left">
      <h2 class="page-title">{{ currentTitle }}</h2>
    </div>

    <div class="header-right">
      <el-input
        v-model="globalSearch"
        placeholder="搜索..."
        prefix-icon="Search"
        clearable
        class="global-search"
        size="default"
      />

      <el-tooltip content="切换主题" placement="bottom">
        <el-button :icon="appStore.isDark ? 'Sunny' : 'Moon'" circle @click="appStore.toggleDark" />
      </el-tooltip>

      <el-dropdown trigger="click">
        <div class="user-avatar">
          <el-avatar :size="32" src="">
            <el-icon><User /></el-icon>
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()
const globalSearch = ref('')

const currentTitle = computed(() => (route.meta.title as string) || 'CampusLife')
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-lg;
  background: var(--el-bg-card, #fff);
  border-bottom: 1px solid var(--el-border-color-lighter, #e8e8e8);
  z-index: $z-header;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.global-search {
  width: 240px;

  :deep(.el-input__wrapper) {
    border-radius: $radius-full;
    background: var(--el-fill-color-light, #f5f5f5);
    box-shadow: none !important;
  }
}

.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
