<template>
  <el-container class="main-layout">
    <AppSidebar />
    <el-container>
      <AppHeader />
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.main-content {
  padding: $spacing-lg;
  overflow-y: auto;
  background-color: var(--el-bg-color-page, #f8f9fa);
}
</style>
