<template>
  <div class="health-view">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 运动记录 -->
      <el-tab-pane label="运动记录" name="exercise">
        <div class="section-header">
          <h3>运动记录</h3>
          <el-button type="primary" @click="showExerciseDialog = true">记录运动</el-button>
        </div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-card shadow="hover">
              <el-statistic title="本周步数" :value="weekSteps" />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <el-statistic title="本周运动(分钟)" :value="weekDuration" />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <el-statistic title="消耗卡路里" :value="weekCalories" :precision="0" suffix="kcal" />
            </el-card>
          </el-col>
        </el-row>
        <el-table :data="healthStore.exerciseLogs" stripe style="margin-top:16px">
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="duration" label="时长(分钟)" width="110" />
          <el-table-column prop="distance" label="距离(km)" width="100" />
          <el-table-column prop="steps" label="步数" width="100" />
          <el-table-column prop="calories" label="卡路里" width="100" />
          <el-table-column prop="note" label="备注" />
          <el-table-column label="日期" width="120">
            <template #default="{ row }">{{ formatDate(row.date || row.created_at) }}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 作息管理 -->
      <el-tab-pane label="作息管理" name="sleep">
        <div class="section-header">
          <h3>睡眠记录</h3>
          <el-button type="primary" @click="showSleepDialog = true">记录睡眠</el-button>
        </div>
        <el-row :gutter="16" style="margin-bottom:16px">
          <el-col :span="8">
            <el-card shadow="hover">
              <el-statistic title="平均睡眠(小时)" :value="avgSleep" :precision="1" />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <el-statistic title="平均质量" :value="avgQuality" :precision="1" suffix="/5" />
            </el-card>
          </el-col>
        </el-row>
        <el-table :data="healthStore.sleepLogs" stripe>
          <el-table-column label="入睡时间" width="160">
            <template #default="{ row }">{{ formatDateTime(row.bed_time) }}</template>
          </el-table-column>
          <el-table-column label="起床时间" width="160">
            <template #default="{ row }">{{ formatDateTime(row.wake_time) }}</template>
          </el-table-column>
          <el-table-column prop="duration" label="时长(h)" width="100" />
          <el-table-column label="质量" width="120">
            <template #default="{ row }"><el-rate v-model="row.quality" disabled /></template>
          </el-table-column>
          <el-table-column prop="note" label="备注" />
        </el-table>
      </el-tab-pane>

      <!-- 心理健康 -->
      <el-tab-pane label="心情日记" name="mood">
        <div class="section-header">
          <h3>心情日记</h3>
          <el-button type="primary" @click="showMoodDialog = true">记录心情</el-button>
        </div>
        <div class="mood-list">
          <el-card v-for="m in healthStore.moodLogs" :key="m.id" shadow="hover" class="mood-card">
            <div class="mood-header">
              <span class="mood-emoji">{{ moodEmoji(m.mood) }}</span>
              <span class="mood-date">{{ formatDate(m.date || m.created_at) }}</span>
            </div>
            <p v-if="m.note" class="mood-note">{{ m.note }}</p>
            <div class="mood-meta">
              <span>压力: {{ stressLabel(m.stress_level) }}</span>
              <div class="mood-tags"><el-tag v-for="t in m.tags" :key="t" size="small">{{ t }}</el-tag></div>
            </div>
          </el-card>
          <el-empty v-if="!healthStore.moodLogs.length" description="暂无心情记录" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Add Exercise Dialog -->
    <el-dialog v-model="showExerciseDialog" title="记录运动" width="400">
      <el-form :model="exerciseForm" label-width="70px">
        <el-form-item label="类型">
          <el-select v-model="exerciseForm.type" style="width:100%">
            <el-option v-for="t in exerciseTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="时长(分)"><el-input-number v-model="exerciseForm.duration" :min="1" style="width:100%" /></el-form-item>
        <el-form-item label="距离(km)"><el-input-number v-model="exerciseForm.distance" :min="0" :precision="2" style="width:100%" /></el-form-item>
        <el-form-item label="步数"><el-input-number v-model="exerciseForm.steps" :min="0" style="width:100%" /></el-form-item>
        <el-form-item label="卡路里"><el-input-number v-model="exerciseForm.calories" :min="0" style="width:100%" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="exerciseForm.note" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExerciseDialog = false">取消</el-button>
        <el-button type="primary" @click="addExercise">确定</el-button>
      </template>
    </el-dialog>

    <!-- Add Sleep Dialog -->
    <el-dialog v-model="showSleepDialog" title="记录睡眠" width="400">
      <el-form :model="sleepForm" label-width="70px">
        <el-form-item label="入睡时间"><el-date-picker v-model="sleepForm.bed_time" type="datetime" style="width:100%" /></el-form-item>
        <el-form-item label="起床时间"><el-date-picker v-model="sleepForm.wake_time" type="datetime" style="width:100%" /></el-form-item>
        <el-form-item label="时长(h)"><el-input-number v-model="sleepForm.duration" :min="0" :precision="1" style="width:100%" /></el-form-item>
        <el-form-item label="质量"><el-rate v-model="sleepForm.quality" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="sleepForm.note" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSleepDialog = false">取消</el-button>
        <el-button type="primary" @click="addSleep">确定</el-button>
      </template>
    </el-dialog>

    <!-- Add Mood Dialog -->
    <el-dialog v-model="showMoodDialog" title="记录心情" width="400">
      <el-form :model="moodForm" label-width="70px">
        <el-form-item label="心情">
          <el-rate v-model="moodForm.mood" :texts="['很差', '较差', '一般', '不错', '很好']" show-text />
        </el-form-item>
        <el-form-item label="压力">
          <el-rate v-model="moodForm.stress_level" :max="5" :texts="['无', '低', '中', '高', '极高']" show-text />
        </el-form-item>
        <el-form-item label="日记"><el-input v-model="moodForm.note" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="moodTagsStr" placeholder="用逗号分隔" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showMoodDialog = false">取消</el-button>
        <el-button type="primary" @click="addMood">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useHealthStore } from '@/stores/health'

const healthStore = useHealthStore()
const activeTab = ref('exercise')
const showExerciseDialog = ref(false)
const showSleepDialog = ref(false)
const showMoodDialog = ref(false)
const moodTagsStr = ref('')
const exerciseTypes = ['跑步', '走路', '骑行', '健身', '游泳', '篮球', '羽毛球', '瑜伽', '其他']

const exerciseForm = reactive({ type: '跑步', duration: 30, distance: 0, steps: 0, calories: 0, note: '' })
const sleepForm = reactive({ bed_time: null as any, wake_time: null as any, duration: 8, quality: 3, note: '' })
const moodForm = reactive({ mood: 3, stress_level: 3, note: '' })

onMounted(() => { healthStore.fetchAll() })

const weekSteps = computed(() => healthStore.exerciseLogs.reduce((s, l) => s + l.steps, 0))
const weekDuration = computed(() => healthStore.exerciseLogs.reduce((s, l) => s + l.duration, 0))
const weekCalories = computed(() => healthStore.exerciseLogs.reduce((s, l) => s + l.calories, 0))
const avgSleep = computed(() => { const l = healthStore.sleepLogs; return l.length ? l.reduce((s, r) => s + r.duration, 0) / l.length : 0 })
const avgQuality = computed(() => { const l = healthStore.sleepLogs; return l.length ? l.reduce((s, r) => s + r.quality, 0) / l.length : 0 })

function formatDate(d: string) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }
function formatDateTime(d: string) { return d ? new Date(d).toLocaleString('zh-CN') : '' }
function moodEmoji(m: number) { return ['😞', '😟', '😐', '🙂', '😊'][m - 1] || '😐' }
function stressLabel(s: number) { return ['无', '低', '中', '高', '极高'][s - 1] || '中' }

async function addExercise() {
  await healthStore.addExercise({ ...exerciseForm })
  showExerciseDialog.value = false
}
async function addSleep() {
  await healthStore.addSleep({ ...sleepForm })
  showSleepDialog.value = false
}
async function addMood() {
  await healthStore.addMood({ ...moodForm, tags: moodTagsStr.value.split(',').map(s => s.trim()).filter(Boolean) })
  showMoodDialog.value = false
}
</script>

<style lang="scss" scoped>
.health-view {
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
    h3 { margin: 0; }
  }
  .el-row { margin-bottom: 16px; }
  .mood-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .mood-card {
    .mood-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .mood-emoji { font-size: 32px; }
    .mood-date { font-size: 12px; color: var(--el-text-color-secondary); }
    .mood-note { color: var(--el-text-color-regular); margin: 0 0 8px; }
    .mood-meta { font-size: 12px; color: var(--el-text-color-secondary);
      .mood-tags { display: flex; gap: 4px; margin-top: 4px; }
    }
  }
}
</style>
