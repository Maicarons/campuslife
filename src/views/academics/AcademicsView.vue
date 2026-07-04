<template>
  <div class="academics-view">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 课程表 -->
      <el-tab-pane label="课程表" name="schedule">
        <div class="schedule-header">
          <h3>我的课程表</h3>
          <el-button type="primary" @click="showCourseDialog = true">
            <el-icon><Plus /></el-icon> 添加课程
          </el-button>
        </div>
        <div class="schedule-grid">
          <div class="time-col">
            <div class="header-cell">时间</div>
            <div v-for="i in 12" :key="i" class="time-cell">第{{ i }}节</div>
          </div>
          <div v-for="day in 7" :key="day" class="day-col">
            <div class="header-cell">{{ dayNames[day - 1] }}</div>
            <div v-for="period in 12" :key="period" class="period-cell">
              <div
                v-for="c in getCoursesAt(day, period)"
                :key="c.id"
                class="course-block"
                :style="{ backgroundColor: c.color + '22', borderLeft: `3px solid ${c.color}` }"
              >
                <div class="course-name">{{ c.name }}</div>
                <div class="course-info">{{ c.teacher }} · {{ c.classroom }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 成绩 -->
      <el-tab-pane label="成绩追踪" name="grades">
        <el-table :data="academicsStore.grades" stripe>
          <el-table-column prop="course_name" label="课程" />
          <el-table-column prop="score" label="分数" width="80" />
          <el-table-column prop="grade_point" label="绩点" width="80" />
          <el-table-column prop="credits" label="学分" width="80" />
          <el-table-column prop="semester" label="学期" width="120" />
          <el-table-column prop="exam_type" label="考试类型" width="100" />
        </el-table>
        <div v-if="academicsStore.grades.length" class="gpa-summary">
          <el-statistic title="平均绩点" :value="avgGPA" :precision="2" />
          <el-statistic title="总学分" :value="totalCredits" :precision="1" />
          <el-statistic title="平均分" :value="avgScore" :precision="1" />
        </div>
      </el-tab-pane>

      <!-- 作业 -->
      <el-tab-pane label="作业管理" name="assignments">
        <div class="section-header">
          <h3>作业管理</h3>
          <el-button type="primary" @click="showAssignmentDialog = true">添加作业</el-button>
        </div>
        <div class="assignment-list">
          <el-card v-for="a in academicsStore.assignments" :key="a.id" class="assignment-card" shadow="hover">
            <div class="assignment-header">
              <el-tag :type="priorityType(a.priority)" size="small">{{ priorityLabel(a.priority) }}</el-tag>
              <el-tag :type="statusType(a.status)" size="small">{{ statusLabel(a.status) }}</el-tag>
            </div>
            <h4>{{ a.title }}</h4>
            <p class="course-label">{{ a.course_name }}</p>
            <p v-if="a.deadline" class="deadline">
              <el-icon><Clock /></el-icon> 截止: {{ formatDate(a.deadline) }}
            </p>
            <div class="assignment-actions">
              <el-button size="small" @click="toggleAssignmentStatus(a)">
                {{ a.status === 'done' ? '重新打开' : '标记完成' }}
              </el-button>
            </div>
          </el-card>
          <el-empty v-if="!academicsStore.assignments.length" description="暂无作业" />
        </div>
      </el-tab-pane>

      <!-- 考试 -->
      <el-tab-pane label="考试安排" name="exams">
        <el-timeline>
          <el-timeline-item
            v-for="e in sortedExams"
            :key="e.id"
            :timestamp="e.exam_time ? formatDate(e.exam_time) : '待定'"
            placement="top"
          >
            <el-card shadow="hover">
              <h4>{{ e.course_name }}</h4>
              <p>类型: {{ e.exam_type }} | 地点: {{ e.location || '待定' }}</p>
              <p v-if="e.seat_number">座位号: {{ e.seat_number }}</p>
              <p v-if="e.notes" class="exam-notes">{{ e.notes }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-if="!academicsStore.exams.length" description="暂无考试安排" />
      </el-tab-pane>

      <!-- 笔记 -->
      <el-tab-pane label="笔记" name="notes">
        <div class="section-header">
          <h3>我的笔记</h3>
          <el-button type="primary" @click="showNoteDialog = true">新建笔记</el-button>
        </div>
        <el-row :gutter="16">
          <el-col v-for="n in academicsStore.notes" :key="n.id" :span="8">
            <el-card shadow="hover" class="note-card">
              <h4>{{ n.title }}</h4>
              <p class="note-preview">{{ n.content.slice(0, 100) }}...</p>
              <div class="note-footer">
                <div class="note-tags">
                  <el-tag v-for="t in n.tags" :key="t" size="small" type="info">{{ t }}</el-tag>
                </div>
                <el-button size="small" type="danger" text @click="academicsStore.removeNote(n.id)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-empty v-if="!academicsStore.notes.length" description="暂无笔记" />
      </el-tab-pane>

      <!-- 空闲教室 -->
      <el-tab-pane label="空闲教室" name="classrooms">
        <div class="section-header">
          <h3>空闲教室查询</h3>
          <div class="classroom-filters">
            <el-select v-model="selectedBuilding" placeholder="选择教学楼" clearable style="width: 140px">
              <el-option v-for="b in buildings" :key="b" :label="b" :value="b" />
            </el-select>
            <el-select v-model="selectedPeriod" placeholder="选择时段" clearable style="width: 140px">
              <el-option v-for="p in periods" :key="p" :label="p" :value="p" />
            </el-select>
          </div>
        </div>
        <div class="classroom-list">
          <el-card v-for="room in filteredClassrooms" :key="room.id" shadow="hover" class="classroom-card">
            <div class="classroom-header">
              <h4>{{ room.building }} {{ room.roomNumber }}</h4>
              <el-tag size="small">容量 {{ room.capacity }}人</el-tag>
            </div>
            <div class="classroom-features">
              <el-tag v-if="room.hasProjector" size="small" type="success">投影仪</el-tag>
              <el-tag v-if="room.hasAC" size="small" type="success">空调</el-tag>
            </div>
            <div class="classroom-slots">
              <div class="slots-label">可用时段：</div>
              <div class="slots-list">
                <el-tag v-for="slot in room.availableSlots" :key="slot.period" size="small" type="info" class="slot-tag">
                  {{ slot.period }} ({{ slot.start }}-{{ slot.end }})
                </el-tag>
              </div>
            </div>
          </el-card>
          <el-empty v-if="filteredClassrooms.length === 0" description="暂无符合条件的空闲教室" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Add Course Dialog -->
    <el-dialog v-model="showCourseDialog" title="添加课程" width="500">
      <el-form :model="courseForm" label-width="80px">
        <el-form-item label="课程名"><el-input v-model="courseForm.name" /></el-form-item>
        <el-form-item label="教师"><el-input v-model="courseForm.teacher" /></el-form-item>
        <el-form-item label="教室"><el-input v-model="courseForm.classroom" /></el-form-item>
        <el-form-item label="学分"><el-input-number v-model="courseForm.credits" :min="0" :max="10" :step="0.5" /></el-form-item>
        <el-form-item label="星期">
          <el-select v-model="courseForm.day_of_week">
            <el-option v-for="d in 7" :key="d" :label="dayNames[d-1]" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始节"><el-input-number v-model="courseForm.start_period" :min="1" :max="12" /></el-form-item>
        <el-form-item label="结束节"><el-input-number v-model="courseForm.end_period" :min="1" :max="12" /></el-form-item>
        <el-form-item label="学期"><el-input v-model="courseForm.semester" placeholder="2026春季" /></el-form-item>
        <el-form-item label="周次"><el-input v-model="courseForm.week_range" placeholder="1-16" /></el-form-item>
        <el-form-item label="颜色"><el-color-picker v-model="courseForm.color" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCourseDialog = false">取消</el-button>
        <el-button type="primary" @click="addCourse">确定</el-button>
      </template>
    </el-dialog>

    <!-- Add Assignment Dialog -->
    <el-dialog v-model="showAssignmentDialog" title="添加作业" width="500">
      <el-form :model="assignmentForm" label-width="80px">
        <el-form-item label="标题"><el-input v-model="assignmentForm.title" /></el-form-item>
        <el-form-item label="课程"><el-input v-model="assignmentForm.course_name" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="assignmentForm.description" type="textarea" /></el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="assignmentForm.priority">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期"><el-date-picker v-model="assignmentForm.deadline" type="datetime" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAssignmentDialog = false">取消</el-button>
        <el-button type="primary" @click="addAssignment">确定</el-button>
      </template>
    </el-dialog>

    <!-- Add Note Dialog -->
    <el-dialog v-model="showNoteDialog" title="新建笔记" width="500">
      <el-form :model="noteForm" label-width="80px">
        <el-form-item label="标题"><el-input v-model="noteForm.title" /></el-form-item>
        <el-form-item label="课程"><el-input v-model="noteForm.course_name" /></el-form-item>
        <el-form-item label="内容"><el-input v-model="noteForm.content" type="textarea" :rows="5" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="noteTagsStr" placeholder="用逗号分隔" /></el-form-item>
        <el-form-item label="公开"><el-switch v-model="noteForm.is_public" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="addNote">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Plus, Clock } from '@element-plus/icons-vue'
import { useAcademicsStore } from '@/stores/academics'
import { mockClassrooms } from '@/mock/data'
import type { Course, Assignment } from '@/types/academics'

const academicsStore = useAcademicsStore()
const activeTab = ref('schedule')
const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const showCourseDialog = ref(false)
const showAssignmentDialog = ref(false)
const showNoteDialog = ref(false)
const noteTagsStr = ref('')

// Classroom
const classrooms = ref(mockClassrooms)
const selectedBuilding = ref('')
const selectedPeriod = ref('')
const buildings = computed(() => [...new Set(classrooms.value.map(c => c.building))])
const periods = computed(() => [...new Set(classrooms.value.flatMap(c => c.availableSlots.map(s => s.period)))])
const filteredClassrooms = computed(() => {
  let list = classrooms.value
  if (selectedBuilding.value) list = list.filter(c => c.building === selectedBuilding.value)
  if (selectedPeriod.value) list = list.filter(c => c.availableSlots.some(s => s.period === selectedPeriod.value))
  return list
})

const courseForm = reactive<Partial<Course>>({
  name: '', teacher: '', classroom: '', credits: 0,
  day_of_week: 1, start_period: 1, end_period: 2,
  semester: '', week_range: '', color: '#409EFF',
})
const assignmentForm = reactive({ title: '', course_name: '', description: '', priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent', deadline: null as any })
const noteForm = reactive({ title: '', content: '', course_name: '', is_public: false })

onMounted(() => {
  academicsStore.fetchCourses()
  academicsStore.fetchGrades()
  academicsStore.fetchAssignments()
  academicsStore.fetchExams()
  academicsStore.fetchNotes()
})

function getCoursesAt(day: number, period: number) {
  return academicsStore.courses.filter(c => c.day_of_week === day && c.start_period <= period && c.end_period >= period)
}

const avgGPA = computed(() => {
  const g = academicsStore.grades
  if (!g.length) return 0
  return g.reduce((s, r) => s + r.grade_point * r.credits, 0) / g.reduce((s, r) => s + r.credits, 0) || 0
})
const totalCredits = computed(() => academicsStore.grades.reduce((s, r) => s + r.credits, 0))
const avgScore = computed(() => {
  const g = academicsStore.grades
  return g.length ? g.reduce((s, r) => s + r.score, 0) / g.length : 0
})
const sortedExams = computed(() =>
  [...academicsStore.exams].sort((a, b) => (a.exam_time || '').localeCompare(b.exam_time || ''))
)

function priorityType(p: string) { return ({ low: 'info', medium: '', high: 'warning', urgent: 'danger' } as any)[p] || '' }
function priorityLabel(p: string) { return ({ low: '低', medium: '中', high: '高', urgent: '紧急' } as any)[p] || p }
function statusType(s: string) { return ({ pending: 'info', in_progress: 'warning', done: 'success' } as any)[s] || '' }
function statusLabel(s: string) { return ({ pending: '待完成', in_progress: '进行中', done: '已完成' } as any)[s] || s }
function formatDate(d: string) { return d ? new Date(d).toLocaleString('zh-CN') : '' }
function toggleAssignmentStatus(a: Assignment) {
  academicsStore.updateAssignmentStatus(a.id, a.status === 'done' ? 'pending' : 'done')
}

async function addCourse() {
  await academicsStore.addCourse({ ...courseForm })
  showCourseDialog.value = false
  Object.assign(courseForm, { name: '', teacher: '', classroom: '', credits: 0, day_of_week: 1, start_period: 1, end_period: 2 })
}
async function addAssignment() {
  await academicsStore.addAssignment({ ...assignmentForm })
  showAssignmentDialog.value = false
}
async function addNote() {
  await academicsStore.addNote({ ...noteForm, tags: noteTagsStr.value.split(',').map(s => s.trim()).filter(Boolean) })
  showNoteDialog.value = false
}
</script>

<style lang="scss" scoped>
.academics-view {
  .schedule-header, .section-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
    h3 { margin: 0; }
  }
  .schedule-grid {
    display: flex; gap: 2px; overflow-x: auto;
    .time-col, .day-col { min-width: 80px; }
    .header-cell { padding: 8px; font-weight: 600; text-align: center; background: var(--el-fill-color-light); }
    .time-cell { height: 60px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--el-text-color-secondary); border-bottom: 1px solid var(--el-border-color-lighter); }
    .period-cell { height: 60px; position: relative; border-bottom: 1px solid var(--el-border-color-lighter); }
    .course-block { position: absolute; inset: 1px; padding: 4px; border-radius: 4px; overflow: hidden; cursor: pointer;
      .course-name { font-size: 12px; font-weight: 600; line-height: 1.2; }
      .course-info { font-size: 10px; color: var(--el-text-color-secondary); margin-top: 2px; }
    }
    .day-col:not(.time-col) { min-width: 120px; }
  }
  .gpa-summary { display: flex; gap: 32px; margin-top: 24px; padding: 16px; background: var(--el-fill-color-light); border-radius: 8px; }
  .assignment-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .assignment-card {
    .assignment-header { display: flex; gap: 8px; margin-bottom: 8px; }
    h4 { margin: 0 0 4px; }
    .course-label { color: var(--el-text-color-secondary); font-size: 13px; margin: 0 0 8px; }
    .deadline { color: var(--el-color-warning); font-size: 13px; display: flex; align-items: center; gap: 4px; }
    .assignment-actions { margin-top: 8px; }
  }
  .note-card {
    margin-bottom: 16px;
    h4 { margin: 0 0 8px; }
    .note-preview { color: var(--el-text-color-secondary); font-size: 13px; min-height: 40px; }
    .note-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
    .note-tags { display: flex; gap: 4px; flex-wrap: wrap; }
  }
  .exam-notes { color: var(--el-text-color-secondary); font-size: 13px; }
  .classroom-filters { display: flex; gap: 8px; }
  .classroom-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .classroom-card {
    .classroom-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
      h4 { margin: 0; }
    }
    .classroom-features { display: flex; gap: 4px; margin-bottom: 12px; }
    .classroom-slots {
      .slots-label { font-size: 13px; color: var(--el-text-color-secondary); margin-bottom: 4px; }
      .slots-list { display: flex; flex-wrap: wrap; gap: 4px; }
    }
  }
}
</style>
