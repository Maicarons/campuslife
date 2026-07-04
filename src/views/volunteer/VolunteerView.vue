<template>
  <div class="volunteer-view">
    <!-- Stats Section -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--total">
          <el-statistic title="全部活动" :value="store.stats.total">
            <template #prefix>
              <el-icon style="color: var(--el-color-primary)"><Collection /></el-icon>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--upcoming">
          <el-statistic title="即将开始" :value="store.stats.upcoming">
            <template #prefix>
              <el-icon style="color: var(--el-color-warning)"><Clock /></el-icon>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--participants">
          <el-statistic title="参与人次" :value="store.stats.totalParticipants">
            <template #prefix>
              <el-icon style="color: var(--el-color-success)"><User /></el-icon>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card stat-card--completed">
          <el-statistic title="已完成" :value="store.stats.completed">
            <template #prefix>
              <el-icon style="color: var(--el-color-info)"><CircleCheckFilled /></el-icon>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <el-select
        v-model="store.filterStatus"
        placeholder="活动状态"
        clearable
        style="width: 150px"
      >
        <el-option label="即将开始" value="upcoming" />
        <el-option label="进行中" value="ongoing" />
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
      </el-select>

      <el-input
        v-model="store.searchQuery"
        placeholder="搜索活动名称、描述或标签"
        clearable
        style="width: 300px"
        :prefix-icon="Search"
      />
    </div>

    <!-- Activity Cards Grid -->
    <div class="activity-grid" v-if="store.filteredActivities.length > 0">
      <el-row :gutter="16">
        <el-col
          v-for="activity in store.filteredActivities"
          :key="activity.id"
          :xs="24"
          :sm="12"
        >
          <div class="activity-card">
            <!-- Card Header -->
            <div class="card-header">
              <h3 class="card-title">{{ activity.title }}</h3>
              <el-tag
                :type="statusTagType(activity.status)"
                size="small"
                effect="dark"
              >
                {{ statusLabel(activity.status) }}
              </el-tag>
            </div>

            <!-- Description -->
            <p class="card-description">{{ activity.description }}</p>

            <!-- Info Rows -->
            <div class="card-info">
              <div class="info-item">
                <el-icon><Location /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>{{ formatDateTime(activity.startTime) }} - {{ formatDateTime(activity.endTime) }}</span>
              </div>
            </div>

            <!-- Participants Progress -->
            <div class="card-progress">
              <div class="progress-label">
                <span>报名人数</span>
                <span>{{ activity.currentParticipants }} / {{ activity.maxParticipants }}</span>
              </div>
              <el-progress
                :percentage="Math.round((activity.currentParticipants / activity.maxParticipants) * 100)"
                :status="activity.currentParticipants >= activity.maxParticipants ? 'success' : undefined"
                :stroke-width="8"
              />
            </div>

            <!-- Tags -->
            <div class="card-tags" v-if="activity.tags.length > 0">
              <el-tag
                v-for="tag in activity.tags"
                :key="tag"
                size="small"
                type="info"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>

            <!-- Footer: Contact + Register Button -->
            <div class="card-footer">
              <span class="contact-info">
                <el-icon><ChatDotRound /></el-icon>
                {{ activity.contact }}
              </span>
              <el-button
                type="primary"
                size="small"
                :disabled="isButtonDisabled(activity)"
                @click="openRegisterDialog(activity)"
              >
                {{ buttonText(activity) }}
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <el-empty description="暂无符合条件的志愿活动" />
    </div>

    <!-- Registration Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="志愿活动报名"
      width="480px"
      destroy-on-close
    >
      <div class="dialog-activity-info" v-if="selectedActivity">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="活动名称">
            {{ selectedActivity.title }}
          </el-descriptions-item>
          <el-descriptions-item label="活动时间">
            {{ formatDateTime(selectedActivity.startTime) }} - {{ formatDateTime(selectedActivity.endTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="活动地点">
            {{ selectedActivity.location }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        style="margin-top: 20px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入真实姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>

        <el-form-item label="学号" prop="studentId">
          <el-input v-model="registerForm.studentId" placeholder="请输入学号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleRegister">
          确认报名
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  Search,
  Location,
  Clock,
  ChatDotRound,
  Collection,
  User,
  CircleCheckFilled,
} from '@element-plus/icons-vue'
import { useVolunteerStore } from '@/stores/volunteer'
import { formatDateTime } from '@/utils/helpers'
import type { VolunteerActivity, ActivityStatus } from '@/types'

const store = useVolunteerStore()

// Status helpers
function statusTagType(status: ActivityStatus) {
  const map: Record<ActivityStatus, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'info',
    cancelled: 'danger',
  }
  return map[status] ?? 'info'
}

function statusLabel(status: ActivityStatus) {
  const map: Record<ActivityStatus, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] ?? status
}

// Button state
function isFull(activity: VolunteerActivity): boolean {
  return activity.currentParticipants >= activity.maxParticipants
}

function isRegistered(activity: VolunteerActivity): boolean {
  // Check with a placeholder studentId; in real app this comes from auth
  return store.isRegistered(activity.id, registerForm.studentId)
}

function isButtonDisabled(activity: VolunteerActivity): boolean {
  if (activity.status === 'completed' || activity.status === 'cancelled') return true
  if (isFull(activity)) return true
  return false
}

function buttonText(activity: VolunteerActivity): string {
  if (activity.status === 'completed') return '已结束'
  if (activity.status === 'cancelled') return '已取消'
  if (isFull(activity)) return '名额已满'
  return '报名'
}

// Registration dialog
const dialogVisible = ref(false)
const submitting = ref(false)
const registerFormRef = ref<FormInstance>()
const selectedActivity = ref<VolunteerActivity | null>(null)

const registerForm = reactive({
  name: '',
  phone: '',
  studentId: '',
})

const phoneValidator = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为 2-20 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, validator: phoneValidator, trigger: 'blur' },
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{6,12}$/, message: '学号为 6-12 位数字', trigger: 'blur' },
  ],
}

function openRegisterDialog(activity: VolunteerActivity) {
  selectedActivity.value = activity
  registerForm.name = ''
  registerForm.phone = ''
  registerForm.studentId = ''
  dialogVisible.value = true
}

async function handleRegister() {
  if (!registerFormRef.value || !selectedActivity.value) return

  await registerFormRef.value.validate((valid) => {
    if (!valid) return

    submitting.value = true
    const success = store.registerForActivity(selectedActivity.value!.id, {
      userId: registerForm.studentId,
      name: registerForm.name,
      phone: registerForm.phone,
      studentId: registerForm.studentId,
    })

    submitting.value = false

    if (success) {
      ElMessage.success('报名成功!')
      dialogVisible.value = false
    } else {
      ElMessage.warning('报名失败，可能名额已满或您已报名')
    }
  })
}
</script>

<style lang="scss" scoped>
.volunteer-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

// Stats
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
  box-shadow: var(--el-box-shadow-lighter);
  border: 1px solid var(--el-border-color-lighter);
  transition: box-shadow 0.3s;
  height: 100%;

  &:hover {
    box-shadow: var(--el-box-shadow-light);
  }

  &--total {
    border-top: 3px solid var(--el-color-primary);
  }

  &--upcoming {
    border-top: 3px solid var(--el-color-warning);
  }

  &--participants {
    border-top: 3px solid var(--el-color-success);
  }

  &--completed {
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
}

// Activity Cards
.activity-grid {
  min-height: 200px;
}

.activity-card {
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--el-box-shadow-lighter);
  border: 1px solid var(--el-border-color-lighter);
  transition: box-shadow 0.3s, transform 0.2s;

  &:hover {
    box-shadow: var(--el-box-shadow-light);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
  flex: 1;
}

.card-description {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
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

// Progress
.card-progress {
  margin-bottom: 16px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}

// Tags
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

// Footer
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 16px;
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

// Dialog
.dialog-activity-info {
  margin-bottom: 8px;
}

// Responsive
@media (max-width: 768px) {
  .volunteer-view {
    padding: 16px;
  }

  .stats-row {
    :deep(.el-col) {
      margin-bottom: 12px;
    }
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;

    .el-select,
    .el-input {
      width: 100% !important;
    }
  }
}
</style>
