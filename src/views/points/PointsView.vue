<template>
  <div class="points-view">
    <!-- Points Summary -->
    <el-card class="points-summary" shadow="hover">
      <div class="summary-content">
        <div class="points-main">
          <div class="points-value">{{ pointsData.total }}</div>
          <div class="points-label">当前积分</div>
        </div>
        <div class="level-info">
          <el-progress type="circle" :percentage="levelProgress" :width="80" :stroke-width="8">
            <template #default>
              <span class="level-text">Lv.{{ pointsData.level }}</span>
            </template>
          </el-progress>
          <div class="level-name">{{ pointsData.levelName }}</div>
          <div class="level-next">距离下一级还需 {{ pointsData.nextLevelPoints - pointsData.total }} 积分</div>
        </div>
      </div>
    </el-card>

    <!-- Points Rules -->
    <el-card class="points-rules" shadow="hover">
      <template #header>
        <h3>积分规则</h3>
      </template>
      <el-table :data="pointsRules" stripe>
        <el-table-column prop="action" label="行为" />
        <el-table-column prop="points" label="积分" width="80">
          <template #default="{ row }">
            <span class="points-add">+{{ row.points }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" />
      </el-table>
    </el-card>

    <!-- Points History -->
    <el-card class="points-history" shadow="hover">
      <template #header>
        <h3>积分记录</h3>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="record in pointsData.records"
          :key="record.id"
          :timestamp="formatDate(record.createdAt)"
          placement="top"
        >
          <div class="record-item">
            <div class="record-info">
              <span class="record-action">{{ record.action }}</span>
              <span class="record-desc">{{ record.description }}</span>
            </div>
            <span class="record-points">+{{ record.points }}</span>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="!pointsData.records.length" description="暂无积分记录" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockUserPoints } from '@/mock/data'

const pointsData = mockUserPoints

const levelProgress = computed(() => {
  const current = pointsData.total
  const next = pointsData.nextLevelPoints
  return Math.min(100, Math.round((current / next) * 100))
})

const pointsRules = [
  { action: '每日签到', points: 1, description: '每日签到奖励' },
  { action: '上传课程信息', points: 10, description: '审核通过后发放' },
  { action: '上传食堂菜单', points: 5, description: '审核通过后发放' },
  { action: '上传考试信息', points: 10, description: '审核通过后发放' },
  { action: '上传失物招领', points: 5, description: '审核通过后发放' },
  { action: '上传校园活动', points: 8, description: '审核通过后发放' },
  { action: '上传空闲教室', points: 3, description: '审核通过后发放' },
  { action: '发表餐饮评价', points: 2, description: '每个餐饮点首次评价' },
  { action: '提交纠错', points: 15, description: '管理员审核通过' },
  { action: '完善个人资料', points: 20, description: '一次性' },
]

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('zh-CN')
}
</script>

<style lang="scss" scoped>
.points-view {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .points-summary {
    .summary-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20px 0;
    }
    .points-main {
      text-align: center;
      .points-value {
        font-size: 48px;
        font-weight: 700;
        color: var(--el-color-primary);
        line-height: 1;
      }
      .points-label {
        font-size: 14px;
        color: var(--el-text-color-secondary);
        margin-top: 8px;
      }
    }
    .level-info {
      text-align: center;
      .level-text {
        font-size: 16px;
        font-weight: 600;
      }
      .level-name {
        font-size: 16px;
        font-weight: 500;
        margin-top: 8px;
      }
      .level-next {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }
    }
  }

  .points-rules {
    h3 { margin: 0; }
    .points-add { color: var(--el-color-success); font-weight: 600; }
  }

  .points-history {
    h3 { margin: 0; }
    .record-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .record-info {
      display: flex;
      flex-direction: column;
      .record-action { font-weight: 500; }
      .record-desc { font-size: 12px; color: var(--el-text-color-secondary); margin-top: 2px; }
    }
    .record-points {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-color-success);
    }
  }
}
</style>
