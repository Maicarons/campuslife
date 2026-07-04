<template>
  <div class="campus-view">
    <!-- Header: search + tabs -->
    <div class="campus-header">
      <div class="header-top">
        <h2 class="page-title">校园资讯</h2>
        <el-input
          v-model="store.searchQuery"
          placeholder="搜索资讯..."
          clearable
          :prefix-icon="Search"
          class="search-input"
        />
      </div>
      <el-tabs v-model="activeTab" class="category-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="全部" name="" />
        <el-tab-pane
          v-for="cat in store.categories"
          :key="cat.key"
          :label="cat.label"
          :name="cat.key"
        />
      </el-tabs>
    </div>

    <!-- Info list -->
    <div class="info-list" v-if="store.filteredInfos.length > 0">
      <div
        v-for="info in store.filteredInfos"
        :key="info.id"
        class="info-card"
        :class="{ 'is-pinned': info.isPinned }"
        @click="toggleExpand(info.id)"
      >
        <div class="card-main">
          <!-- Category icon -->
          <div class="card-icon" :class="`cat-${info.category}`">
            <el-icon :size="20"><component :is="iconMap[info.category]" /></el-icon>
          </div>

          <div class="card-body">
            <!-- Title row -->
            <div class="card-title-row">
              <span class="card-title">{{ info.title }}</span>
              <span v-if="info.isPinned" class="pin-badge">📌</span>
            </div>

            <!-- Content preview / full -->
            <div
              class="card-content"
              :class="{ expanded: expandedIds.has(info.id) }"
            >
              <div
                class="content-text"
                :class="{ 'is-truncated': !expandedIds.has(info.id) && isLongContent(info.content) }"
              >
                <template v-if="expandedIds.has(info.id)">
                  <span v-for="(line, idx) in info.content.split('\n')" :key="idx">
                    {{ line }}<br v-if="idx < info.content.split('\n').length - 1" />
                  </span>
                </template>
                <template v-else>{{ info.content }}</template>
              </div>
            </div>

            <!-- Footer: tags + time -->
            <div class="card-footer">
              <div class="card-tags">
                <el-tag
                  v-for="tag in info.tags"
                  :key="tag"
                  size="small"
                  type="info"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <span class="card-time">{{ formatRelativeTime(info.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <el-empty v-else description="暂无相关资讯" class="empty-state" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import {
  Document,
  Dish,
  OfficeBuilding,
  Van,
  Flag,
  FirstAidKit,
} from '@element-plus/icons-vue'
import { useCampusStore } from '@/stores/campus'
import { formatRelativeTime } from '@/utils/helpers'
import type { InfoCategory } from '@/types'

const store = useCampusStore()

const activeTab = ref<InfoCategory | ''>(store.activeCategory)

const expandedIds = ref<Set<string>>(new Set())

const iconMap: Record<InfoCategory, typeof Document> = {
  academic: Document,
  dining: Dish,
  facilities: OfficeBuilding,
  transport: Van,
  events: Flag,
  emergency: FirstAidKit,
}

function isLongContent(content: string): boolean {
  const lines = content.split('\n')
  if (lines.length > 3) return true
  return content.length > 120
}

function toggleExpand(id: string) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  // Force reactivity since Set mutations are not auto-tracked
  expandedIds.value = new Set(expandedIds.value)
}

function handleTabChange(tab: string | number) {
  store.activeCategory = tab as InfoCategory | ''
}
</script>

<style lang="scss" scoped>
.campus-view {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-lg $spacing-md;
}

.campus-header {
  margin-bottom: $spacing-lg;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: $color-text-primary;
  flex-shrink: 0;
}

.search-input {
  max-width: 280px;
}

.category-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }

  :deep(.el-tabs__item) {
    font-size: 13px;
    height: 40px;
    line-height: 40px;
  }
}

// ---- Info list ----

.info-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-card {
  background: $color-bg-card;
  border: 1px solid $color-border-lighter;
  border-radius: $radius-lg;
  padding: $spacing-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: var(--el-color-primary-light-5, #a0cfff);
    box-shadow: $shadow-sm;
  }

  &.is-pinned {
    border-left: 3px solid var(--el-color-primary, #409eff);
    background: linear-gradient(to right, var(--el-color-primary-light-9, #ecf5ff), $color-bg-card 40%);
  }
}

.card-main {
  display: flex;
  gap: $spacing-md;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;

  &.cat-academic {
    background: linear-gradient(135deg, #409eff, #66b1ff);
  }
  &.cat-dining {
    background: linear-gradient(135deg, #e6a23c, #f0c78a);
  }
  &.cat-facilities {
    background: linear-gradient(135deg, #67c23a, #95d475);
  }
  &.cat-transport {
    background: linear-gradient(135deg, #909399, #b1b3b8);
  }
  &.cat-events {
    background: linear-gradient(135deg, #e040fb, #ea80fc);
  }
  &.cat-emergency {
    background: linear-gradient(135deg, #f56c6c, #f89898);
  }
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: $color-text-primary;
  line-height: 1.4;
}

.pin-badge {
  flex-shrink: 0;
  font-size: 14px;
}

// Content area

.card-content {
  margin-bottom: $spacing-sm;
}

.content-text {
  font-size: 13px;
  color: $color-text-regular;
  line-height: 1.7;
  word-break: break-word;
  white-space: pre-line;

  &.is-truncated {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// Footer

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .el-tag {
    --el-tag-font-size: 11px;
    height: 20px;
    line-height: 18px;
    padding: 0 6px;
  }
}

.card-time {
  flex-shrink: 0;
  font-size: 12px;
  color: $color-text-placeholder;
}

.empty-state {
  padding: $spacing-3xl 0;
}
</style>
