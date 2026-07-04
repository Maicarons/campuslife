<template>
  <div class="lost-found-view">
    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-card stat-card--lost">
        <el-statistic title="丢失物品" :value="store.lostCount">
          <template #prefix>
            <el-icon style="color: var(--color-danger)"><WarningFilled /></el-icon>
          </template>
        </el-statistic>
      </div>
      <div class="stat-card stat-card--found">
        <el-statistic title="拾到物品" :value="store.foundCount">
          <template #prefix>
            <el-icon style="color: var(--color-success)"><SuccessFilled /></el-icon>
          </template>
        </el-statistic>
      </div>
      <div class="stat-card stat-card--claimed">
        <el-statistic title="已认领" :value="store.claimedCount">
          <template #prefix>
            <el-icon style="color: var(--color-info)"><CircleCheckFilled /></el-icon>
          </template>
        </el-statistic>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <el-select
        v-model="filters.status"
        placeholder="物品状态"
        clearable
        style="width: 140px"
      >
        <el-option label="丢失" value="lost" />
        <el-option label="拾到" value="found" />
      </el-select>

      <el-select
        v-model="filters.category"
        placeholder="物品分类"
        clearable
        style="width: 160px"
      >
        <el-option
          v-for="cat in categories"
          :key="cat"
          :label="cat"
          :value="cat"
        />
      </el-select>

      <el-input
        v-model="filters.keyword"
        placeholder="搜索标题或描述"
        clearable
        style="width: 260px"
        :prefix-icon="Search"
      />

      <el-button type="primary" @click="openPublishDialog">
        <el-icon><Plus /></el-icon>
        发布信息
      </el-button>
    </div>

    <!-- Waterfall Cards -->
    <div class="waterfall-container" v-loading="store.loading">
      <div v-if="filteredItems.length === 0" class="empty-state">
        <el-empty description="暂无相关失物招领信息" />
      </div>
      <div v-else class="waterfall">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="waterfall-card"
          @click="openDetail(item)"
        >
          <div class="card-header">
            <el-tag
              :type="statusTagType(item.status)"
              size="small"
              effect="dark"
            >
              {{ statusLabel(item.status) }}
            </el-tag>
            <el-tag size="small" effect="plain">{{ item.category }}</el-tag>
          </div>

          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.description }}</p>

          <div class="card-meta">
            <div class="meta-item">
              <el-icon><Location /></el-icon>
              <span>{{ item.location }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ formatRelativeTime(item.createdAt) }}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="contact-info">
              <el-icon><ChatDotRound /></el-icon>
              {{ item.contact }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="drawerVisible"
      :title="detailItem?.title"
      size="400px"
      direction="rtl"
    >
      <template v-if="detailItem">
        <div class="detail-section">
          <el-tag
            :type="statusTagType(detailItem.status)"
            size="large"
            effect="dark"
          >
            {{ statusLabel(detailItem.status) }}
          </el-tag>
          <el-tag size="large" effect="plain" style="margin-left: 8px">
            {{ detailItem.category }}
          </el-tag>
        </div>

        <el-divider />

        <el-descriptions :column="1" border>
          <el-descriptions-item label="标题">
            {{ detailItem.title }}
          </el-descriptions-item>
          <el-descriptions-item label="详细描述">
            {{ detailItem.description }}
          </el-descriptions-item>
          <el-descriptions-item label="丢失/拾到地点">
            <el-icon><Location /></el-icon>
            {{ detailItem.location }}
          </el-descriptions-item>
          <el-descriptions-item label="时间">
            <el-icon><Clock /></el-icon>
            {{ formatRelativeTime(detailItem.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="联系方式">
            <el-icon><ChatDotRound /></el-icon>
            {{ detailItem.contact }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-actions" v-if="detailItem.status !== 'claimed'">
          <el-button type="success" @click="handleClaim(detailItem)">
            标记为已认领
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- Publish Dialog -->
    <el-dialog
      v-model="publishDialogVisible"
      title="发布失物招领信息"
      width="520px"
      destroy-on-close
    >
      <el-form
        ref="publishFormRef"
        :model="publishForm"
        :rules="publishRules"
        label-width="90px"
      >
        <el-form-item label="物品状态" prop="status">
          <el-select v-model="publishForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="丢失" value="lost" />
            <el-option label="拾到" value="found" />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="publishForm.title" placeholder="简要描述物品" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="物品分类" prop="category">
          <el-select v-model="publishForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="丢失地点" prop="location">
          <el-input v-model="publishForm.location" placeholder="丢失或拾到的地点" />
        </el-form-item>

        <el-form-item label="详细描述" prop="description">
          <el-input
            v-model="publishForm.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述物品特征、丢失经过等"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="publishForm.contact" placeholder="手机号/微信/QQ等" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="publishDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="publishLoading" @click="handlePublish">
          发布
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  Search,
  Plus,
  Location,
  Clock,
  ChatDotRound,
  WarningFilled,
  SuccessFilled,
  CircleCheckFilled,
} from '@element-plus/icons-vue'
import { useLostFoundStore } from '@/stores/lostFound'
import { formatRelativeTime } from '@/utils/helpers'
import type { LostFoundItem as LFItem } from '@/types'

interface PublishForm {
  status: 'lost' | 'found' | ''
  title: string
  category: string
  location: string
  description: string
  contact: string
}

// Store
const store = useLostFoundStore()

// Constants
const categories = ['电子产品', '证件卡片', '衣物', '配饰', '书籍', '钥匙', '其他']

// Filter state
const filters = reactive({
  status: '' as string,
  category: '' as string,
  keyword: '',
})

// Computed filtered items
const filteredItems = computed(() => store.filteredItems)

// Detail drawer
const drawerVisible = ref(false)
const detailItem = ref<LFItem | null>(null)

function openDetail(item: LFItem) {
  detailItem.value = item
  drawerVisible.value = true
}

function handleClaim(item: LFItem) {
  store.claimItem(String(item.id))
  item.status = 'claimed'
  ElMessage.success('已标记为已认领')
  drawerVisible.value = false
}

// Status helpers
function statusTagType(status: string) {
  switch (status) {
    case 'lost':
      return 'danger'
    case 'found':
      return 'success'
    case 'claimed':
      return 'info'
    default:
      return 'info'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'lost':
      return '丢失'
    case 'found':
      return '拾到'
    case 'claimed':
      return '已认领'
    default:
      return status
  }
}

// Publish dialog
const publishDialogVisible = ref(false)
const publishLoading = ref(false)
const publishFormRef = ref<FormInstance>()

const defaultForm = (): PublishForm => ({
  status: '',
  title: '',
  category: '',
  location: '',
  description: '',
  contact: '',
})

const publishForm = reactive<PublishForm>(defaultForm())

const publishRules: FormRules = {
  status: [{ required: true, message: '请选择物品状态', trigger: 'change' }],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度为 2-50 个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择物品分类', trigger: 'change' }],
  location: [{ required: true, message: '请输入丢失/拾到地点', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度为 10-500 个字符', trigger: 'blur' },
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { min: 2, max: 50, message: '联系方式长度为 2-50 个字符', trigger: 'blur' },
  ],
}

function openPublishDialog() {
  Object.assign(publishForm, defaultForm())
  publishDialogVisible.value = true
}

async function handlePublish() {
  if (!publishFormRef.value) return

  await publishFormRef.value.validate(async (valid) => {
    if (!valid) return

    publishLoading.value = true
    try {
      store.addItem({
        ...publishForm,
        status: publishForm.status as 'lost' | 'found',
        images: [],
        userId: 'current',
        category: publishForm.category as any,
        contact: publishForm.contact || '',
      })
      ElMessage.success('发布成功')
      publishDialogVisible.value = false
    } catch {
      ElMessage.error('发布失败，请重试')
    } finally {
      publishLoading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.lost-found-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

// Stats Bar
.stats-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
  box-shadow: var(--el-box-shadow-lighter);
  border: 1px solid var(--el-border-color-lighter);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: var(--el-box-shadow-light);
  }

  &--lost {
    border-top: 3px solid var(--el-color-danger);
  }

  &--found {
    border-top: 3px solid var(--el-color-success);
  }

  &--claimed {
    border-top: 3px solid var(--el-color-info);
  }
}

// Filter Bar
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-lighter);
  border: 1px solid var(--el-border-color-lighter);
  flex-wrap: wrap;

  .el-button {
    margin-left: auto;
  }
}

// Waterfall Layout
.waterfall-container {
  min-height: 300px;
}

.waterfall {
  columns: 3;
  column-gap: 16px;
}

.waterfall-card {
  break-inside: avoid;
  margin-bottom: 16px;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
  box-shadow: var(--el-box-shadow-lighter);
  border: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s;

  &:hover {
    box-shadow: var(--el-box-shadow-light);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.card-desc {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);

  .el-icon {
    font-size: 14px;
    flex-shrink: 0;
  }
}

.card-footer {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 12px;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);

  .el-icon {
    font-size: 14px;
  }
}

// Empty State
.empty-state {
  padding: 80px 0;
}

// Detail Drawer
.detail-section {
  display: flex;
  align-items: center;
}

.detail-actions {
  margin-top: 24px;
  text-align: center;
}

// Responsive
@media (max-width: 992px) {
  .waterfall {
    columns: 2;
  }
}

@media (max-width: 600px) {
  .lost-found-view {
    padding: 16px;
  }

  .stats-bar {
    flex-direction: column;
    gap: 12px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;

    .el-select,
    .el-input {
      width: 100% !important;
    }

    .el-button {
      margin-left: 0;
    }
  }

  .waterfall {
    columns: 1;
  }
}
</style>
